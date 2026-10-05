import { MODULE_BY_KEY } from '@/data/modules'
import { allRows, listRows, resetRows, saveMany, saveRows } from '@/data/local-store'
import type { ActionResult, EntryRow, ModuleMeta, OverviewResult, PageResult } from '@/data/types'
import { formatDate, nowIso, toNumber } from '@/domain/clock'
import { appendLedger } from '@/domain/ledger'
import {
  UNIT_ACTION,
  UNIT_ACTION_GUARD,
  UNIT_STATUS,
  blockedMessage,
  runningHours,
  unitMetrics,
} from '@/domain/unit'
import { OVERHAUL_ACTION, OVERHAUL_STATUS } from '@/domain/overhaul'
import {
  DEFECT_ACTION,
  DEFECT_LEVELS,
  DEFECT_STATUS,
  defectsOfUnit,
  defectMetrics,
  findDuplicateDefect,
  type DefectDraft,
} from '@/domain/defect'
import { ISSUE_QTY, SPARE_ACTION, issueSpare, spareMetrics } from '@/domain/spare'
// 通用异常词：模块未单列 abnormalStatuses 时，命中这些词的状态计入异常量。
const ABNORMAL_WORDS = ['异常', '告警', '报警', '预警', '超限', '故障', '损坏', '待补充', '停工', '停运']

export function moduleMeta(key: string): ModuleMeta {
  const meta = MODULE_BY_KEY.get(key)
  if (!meta) {
    throw new Error(`没有登记名为 ${key} 的业务模块`)
  }
  return meta
}

export function filterRows(rows: EntryRow[], filters: Record<string, string>): EntryRow[] {
  const pairs = Object.entries(filters).filter(([, value]) => value.trim() !== '')
  if (pairs.length === 0) {
    return rows
  }
  return rows.filter((row) =>
    pairs.every(([field, value]) => String(row[field] ?? '').includes(value.trim())),
  )
}

export function listEntries(key: string, filters: Record<string, string> = {}): PageResult {
  const matched = filterRows(listRows(key), filters)
  return { items: matched, total: matched.length, page: 1, size: matched.length }
}

export function isPendingStatus(meta: ModuleMeta, status: string): boolean {
  const terminals = meta.terminalStatuses ?? [meta.statuses[meta.statuses.length - 1]]
  return !terminals.includes(status)
}

export function isAbnormalStatus(meta: ModuleMeta, status: string): boolean {
  if (meta.abnormalStatuses) {
    return meta.abnormalStatuses.includes(status)
  }
  return ABNORMAL_WORDS.some((word) => status.includes(word))
}

/** 通用顺序校验：动作只能沿 statuses 往后推一格，跳步/回头一律退回并指出卡点。 */
function guardOrderedStep(meta: ModuleMeta, row: EntryRow, action: string, target: string): ActionResult | null {
  const currentIndex = meta.statuses.indexOf(row.status)
  const targetIndex = meta.statuses.indexOf(target)
  if (currentIndex < 0) {
    return { ok: false, message: `当前状态「${row.status}」不在${meta.name}状态链上，无法执行「${action}」` }
  }
  if (targetIndex < 0) {
    return { ok: false, message: `${meta.entity}没有登记「${action}」这个动作` }
  }
  if (targetIndex <= currentIndex) {
    return {
      ok: false,
      message: `状态只能向前流转，「${row.status}」不能回到「${target}」，该动作已退回`,
    }
  }
  if (targetIndex !== currentIndex + 1) {
    return {
      ok: false,
      message: `不能从「${row.status}」直接跳到「${target}」，当前停在第 ${currentIndex + 1} 步「${row.status}」，请先走「${meta.statuses[currentIndex + 1]}」`,
    }
  }
  return null
}

function stampStatus(meta: ModuleMeta, row: EntryRow, target: string): void {
  row.status = target
  row.pending = isPendingStatus(meta, target)
  row.abnormal = isAbnormalStatus(meta, target)
}

// ── 机组：领域状态链 + 故障联动开检修票/缺陷 ─────────────────────────────

function runUnitAction(row: EntryRow, action: string, target: string, at: string): ActionResult {
  const required = UNIT_ACTION_GUARD[action]
  if (row.status !== required) {
    return { ok: false, message: blockedMessage(row.status, required, action) }
  }

  const patch: Record<string, EntryRow[]> = {}
  let messageExtra = ''

  if (action === UNIT_ACTION.START) {
    // 同一台机组连续两次开机并网只生效一次：重复点击时状态已不是待启动，上面的守卫直接退回。
    row['并网时刻'] = at
    row['停机时刻'] = ''
  } else if (action === UNIT_ACTION.STOP || action === UNIT_ACTION.FAULT) {
    // 累计运行小时按并网时刻累加，在停机瞬间结算；停机后页面读到的是结算值，不再跳数。
    row['累计运行小时'] = runningHours(row, at)
    row['停机时刻'] = at
    row['并网时刻'] = ''
    row['振动数值'] = action === UNIT_ACTION.STOP ? 0 : row['振动数值']
  }

  if (action === UNIT_ACTION.FAULT) {
    // 登记故障 = 故障支路入口：同步开一张待审批检修票 + 登记一条缺陷。
    // 检修那边看到的可开工资格与机组页同源（故障机必须走完闭环才能回停机备用）。
    const code = String(row['机组编号'] ?? '')
    const overhaulRows = [...listRows('overhaul')]
    const ticketId = overhaulRows.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
    const ticket: EntryRow = {
      id: ticketId,
      status: OVERHAUL_STATUS.PENDING_APPROVAL,
      pending: true,
      abnormal: false,
      工作票号: `WO-${formatDate(at).split('-').join('')}-${String(ticketId).padStart(3, '0')}`,
      关联机组: code,
      检修级别: '未分级',
      计划工期: '',
      实际工期: '',
      工作负责人: '',
      验收人员: '',
      检修状态: OVERHAUL_STATUS.PENDING_APPROVAL,
      台账: [],
    }
    appendLedger(
      ticket,
      {
        from: '—',
        to: OVERHAUL_STATUS.PENDING_APPROVAL,
        action: '登记故障联动',
        source: '故障联动',
        note: `${code} 登记故障联动开票，机组检修闭环前不得回停机备用`,
      },
      at,
    )
    overhaulRows.push(ticket)
    patch['overhaul'] = overhaulRows

    const defectRows = [...listRows('defect')]
    const draft: DefectDraft = {
      设备名称: `${code} 水轮发电机组`,
      缺陷描述: '机组登记故障，待检查确认',
      缺陷等级: '重大',
      发现日期: formatDate(at),
      处理期限: '',
      处理人员: '',
      来源: '故障联动',
    }
    // 同一时刻连点两次登记故障会被状态守卫挡住（第二次已不在运行中），缺陷天然只登记一次。
    if (!findDuplicateDefect(defectRows, draft)) {
      const defectId = defectRows.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
      const number = `DEFE-${formatDate(at).split('-').join('')}-${String(defectId).padStart(4, '0')}`
      const defect: EntryRow = {
        id: defectId,
        status: DEFECT_STATUS.PENDING,
        pending: true,
        abnormal: false,
        缺陷编号: number,
        ...draft,
        台账: [],
      }
      appendLedger(
        defect,
        { from: '—', to: DEFECT_STATUS.PENDING, action: '登记故障联动', source: '故障联动' },
        at,
      )
      defectRows.push(defect)
      patch['defect'] = defectRows
    }
    messageExtra = `；已联动开检修票 ${ticket.工作票号}（待审批）并登记缺陷，机组需走完检修闭环才能回停机备用`
  }

  const meta = moduleMeta('unit')
  appendLedger(row, { from: row.status, to: target, action, source: '机组操作' }, at)
  stampStatus(meta, row, target)
  patch['unit'] = updateRowIn(listRows('unit'), row)
  saveMany(patch)
  return { ok: true, message: `${meta.entity}已${action}，当前状态「${target}」${messageExtra}` }
}

// ── 检修票：开工资格与机组状态同源，完工是故障机唯一的闭环出口 ───────────

function runOverhaulAction(row: EntryRow, action: string, target: string, at: string): ActionResult {
  const meta = moduleMeta('overhaul')
  const blocked = guardOrderedStep(meta, row, action, target)
  if (blocked) {
    return blocked
  }

  const unitRows = listRows('unit')
  const unitCode = String(row['关联机组'] ?? '')
  const unit = unitRows.find((item) => String(item['机组编号'] ?? '') === unitCode)

  if (action === OVERHAUL_ACTION.START) {
    if (!unitCode || !unit) {
      return { ok: false, message: `检修票 ${row['工作票号']} 没有关联到在册机组，不具备开工资格，请先补关联机组` }
    }
    if (unit.status !== UNIT_STATUS.STANDBY && unit.status !== UNIT_STATUS.FAULT) {
      return {
        ok: false,
        message: `关联机组 ${unitCode} 当前停在「${unit.status}」，只有停机备用/故障停机的机组可以开工，${row['工作票号']} 暂不能开工`,
      }
    }
    // 同一机组同一时刻只允许一张检修中的工作票，避免两张票各算各的口径。
    const busy = listRows('overhaul').some(
      (item) =>
        Number(item.id) !== Number(row.id) &&
        String(item['关联机组'] ?? '') === unitCode &&
        item.status === OVERHAUL_STATUS.REPAIRING,
    )
    if (busy) {
      return {
        ok: false,
        message: `机组 ${unitCode} 已有检修中的工作票，必须先办理完工闭环，${row['工作票号']} 不能重复开工`,
      }
    }
  }

  const patch: Record<string, EntryRow[]> = {}
  let closedUnit = false
  if (action === OVERHAUL_ACTION.FINISH && unit && unit.status === UNIT_STATUS.FAULT) {
    // 检修闭环：故障停机机组随完工验收回到停机备用，这是唯一出口，机组页与检修页同一份状态。
    appendLedger(
      unit,
      {
        from: UNIT_STATUS.FAULT,
        to: UNIT_STATUS.STANDBY,
        action: '检修闭环',
        source: '检修闭环',
        note: `检修票 ${row['工作票号']} 办理完工，验收合格回停机备用`,
      },
      at,
    )
    stampStatus(metaOf('unit'), unit, UNIT_STATUS.STANDBY)
    unit['停机时刻'] = at
    patch['unit'] = updateRowIn(unitRows, unit)
    closedUnit = true
  }

  appendLedger(row, { from: row.status, to: target, action, source: '检修操作' }, at)
  stampStatus(meta, row, target)
  patch['overhaul'] = updateRowIn(listRows('overhaul'), row)
  saveMany(patch)
  const closed = closedUnit ? `；关联机组 ${unitCode} 已闭环回停机备用` : ''
  return { ok: true, message: `检修工作票已${action}，当前状态「${target}」${closed}` }
}

// ── 缺陷：单向流转、人工登记去重只认第一次 ─────────────────────────────

export function createDefect(draftInput: Omit<DefectDraft, '来源'>): ActionResult {
  const at = nowIso()
  const draft: DefectDraft = { ...draftInput, 来源: '人工登记' }
  const rows = [...listRows('defect')]
  const duplicate = findDuplicateDefect(rows, draft)
  if (duplicate) {
    return {
      ok: false,
      message: `该缺陷已登记过（编号 ${duplicate['缺陷编号']}，当前「${duplicate.status}」），重复登记只认第一次入库的取值，本条未保存`,
    }
  }
  const id = rows.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
  const number = draft.缺陷编号?.trim() || `DEFE-${draft.发现日期.split('-').join('')}-${String(id).padStart(4, '0')}`
  const row: EntryRow = {
    id,
    status: DEFECT_STATUS.PENDING,
    pending: true,
    abnormal: false,
    缺陷编号: number,
    设备名称: draft.设备名称,
    缺陷描述: draft.缺陷描述,
    缺陷等级: draft.缺陷等级,
    发现日期: draft.发现日期,
    处理期限: draft.处理期限,
    处理人员: draft.处理人员,
    来源: '人工登记',
    台账: [],
  }
  appendLedger(
    row,
    {
      from: '—',
      to: DEFECT_STATUS.PENDING,
      action: '人工登记',
      source: '人工登记',
      note: `等级口径：${DEFECT_LEVELS.includes(draft.缺陷等级 as (typeof DEFECT_LEVELS)[number]) ? draft.缺陷等级 : `${draft.缺陷等级}（非标准等级，按原值保留不改写）`}`,
    },
    at,
  )
  rows.push(row)
  saveRows('defect', rows)
  return { ok: true, message: `设备缺陷 ${number} 已登记，当前状态「待处理」` }
}

function runDefectAction(row: EntryRow, action: string, target: string, at: string): ActionResult {
  const meta = moduleMeta('defect')
  const blocked = guardOrderedStep(meta, row, action, target)
  if (blocked) {
    return blocked
  }
  appendLedger(row, { from: row.status, to: target, action, source: '缺陷处置' }, at)
  stampStatus(meta, row, target)
  saveRows('defect', updateRowIn(listRows('defect'), row))
  if (action === DEFECT_ACTION.ARCHIVE) {
    return { ok: true, message: `缺陷 ${row['缺陷编号']} 已归档，清单中仍可查到该记录` }
  }
  return { ok: true, message: `设备缺陷已${action}，当前状态「${target}」` }
}

// ── 备件：领用扣数量，重复提交只扣一次 ────────────────────────────────

function runSpareAction(row: EntryRow, action: string, target: string, at: string): ActionResult {
  const meta = moduleMeta('spare')
  const blocked = guardOrderedStep(meta, row, action, target)
  if (blocked) {
    return blocked
  }
  if (action === SPARE_ACTION.ISSUE) {
    const result = issueSpare(row)
    if (!result.ok) {
      return result
    }
  } else if (action === SPARE_ACTION.REORDER) {
    // 低于最低储备量才允许进入待补充；只是一个业务提示，不阻断。
    const stock = toNumber(row['现有数量'])
    const floor = toNumber(row['最低储备量'])
    if (floor > 0 && stock >= floor) {
      return { ok: false, message: `现有数量 ${stock} 不低于最低储备量 ${floor}，无需提交补充` }
    }
  }
  appendLedger(
    row,
    {
      from: row.status,
      to: target,
      action,
      source: '备件操作',
      ...(action === SPARE_ACTION.ISSUE ? { note: `本次领用 ${ISSUE_QTY} 件` } : {}),
    },
    at,
  )
  stampStatus(meta, row, target)
  saveRows('spare', updateRowIn(listRows('spare'), row))
  const qty = action === SPARE_ACTION.ISSUE ? `，本次扣减 ${ISSUE_QTY} 件，库存剩 ${row['现有数量']} 件` : ''
  return { ok: true, message: `备品备件已${action}，当前状态「${target}」${qty}` }
}

// ── 行集合小工具 ────────────────────────────────────────────────────

function updateRowIn(rows: EntryRow[], row: EntryRow): EntryRow[] {
  const index = rows.findIndex((item) => Number(item.id) === Number(row.id))
  if (index < 0) {
    return [...rows, row]
  }
  const next = [...rows]
  next[index] = row
  return next
}

function metaOf(key: string): ModuleMeta {
  return MODULE_BY_KEY.get(key) as ModuleMeta
}

export function runAction(key: string, id: number, action: string): ActionResult {
  const meta = moduleMeta(key)
  const target = meta.actionTargets[action]
  if (!target) {
    return { ok: false, message: `${meta.entity}没有登记「${action}」这个动作` }
  }
  const rows = listRows(key)
  const index = rows.findIndex((row) => Number(row.id) === id)
  if (index < 0) {
    return { ok: false, message: `没有找到编号为 ${id} 的${meta.entity}` }
  }
  const row = rows[index]
  if (row.status === target) {
    return { ok: false, message: `${meta.entity}已经是「${target}」，不用重复操作` }
  }
  const at = nowIso()

  if (key === 'unit') {
    return runUnitAction(row, action, target, at)
  }
  if (key === 'overhaul') {
    return runOverhaulAction(row, action, target, at)
  }
  if (key === 'defect') {
    return runDefectAction(row, action, target, at)
  }
  if (key === 'spare') {
    return runSpareAction(row, action, target, at)
  }

  const blocked = guardOrderedStep(meta, row, action, target)
  if (blocked) {
    return blocked
  }
  appendLedger(row, { from: row.status, to: target, action, source: '业务操作' }, at)
  stampStatus(meta, row, target)
  saveRows(key, updateRowIn(rows, row))
  return { ok: true, message: `${meta.entity}已${action}，当前状态「${target}」` }
}

// ── 跨模块只读口径：发电计划页与机组页同一份可调出力 ──────────────────

export type AdjustableCapacity = {
  totalMw: number
  runningCount: number
  standbyCount: number
  faultCount: number
  readyCount: number
  excluded: { code: string; reason: string }[]
}

export function loadAdjustableCapacity(at: string = nowIso()): AdjustableCapacity {
  const rows = listRows('unit')
  const metrics = unitMetrics(rows, at)
  return {
    totalMw: metrics.adjustableMw,
    runningCount: metrics.runningCount,
    standbyCount: rows.filter((row) => row.status === UNIT_STATUS.STANDBY).length,
    faultCount: metrics.faultCount,
    readyCount: rows.filter((row) => row.status === UNIT_STATUS.READY).length,
    excluded: rows
      .filter(isFaultRow)
      .map((row) => ({
        code: String(row['机组编号'] ?? ''),
        reason: '故障停机：未走完检修闭环，不计入可调出力',
      })),
  }
}

function isFaultRow(row: EntryRow): boolean {
  return row.status === UNIT_STATUS.FAULT
}

/** 机组页联动信息：检修票与缺陷都从各自模块实时读取，保证三个页面同一份口径。 */
export function loadUnitLinks(unitCode: string): {
  ticket?: EntryRow
  defects: EntryRow[]
  openDefects: number
} {
  const ticket = [...listRows('overhaul')]
    .filter((row) => String(row['关联机组'] ?? '') === unitCode)
    .sort((a, b) => Number(b.id) - Number(a.id))[0]
  const defects = defectsOfUnit(listRows('defect'), unitCode)
  return {
    ticket,
    defects,
    openDefects: defects.filter((row) => row.status !== DEFECT_STATUS.ARCHIVED).length,
  }
}

export function loadDefectMetrics() {
  return defectMetrics(listRows('defect'))
}

export function loadSpareMetrics() {
  return spareMetrics(listRows('spare'))
}

export function loadUnitMetrics(at: string = nowIso()) {
  return unitMetrics(listRows('unit'), at)
}

export { runningHours }

export function resetModule(key: string): PageResult {
  resetRows(key)
  return listEntries(key)
}

export function exportEntries(key: string): { filename: string; content: string } {
  const meta = moduleMeta(key)
  const header = ['编号', ...meta.fields, '当前状态']
  const lines = [header.join(',')]
  for (const row of listRows(key)) {
    lines.push([row.id, ...meta.fields.map((field) => row[field] ?? ''), row.status].join(','))
  }
  return { filename: `${meta.name}-清单.csv`, content: `﻿${lines.join('\n')}` }
}

export function downloadEntries(key: string): void {
  const { filename, content } = exportEntries(key)
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export function loadOverview(): OverviewResult {
  const rows = allRows()
  const modules = [...MODULE_BY_KEY.values()].map((meta) => {
    const entries = rows[meta.key] ?? []
    return {
      name: meta.name,
      created: entries.length,
      pending: entries.filter((row) => isPendingStatus(meta, row.status)).length,
      abnormal: entries.filter((row) => isAbnormalStatus(meta, row.status)).length,
    }
  })
  const cards = [
    { label: '业务模块', value: modules.length },
    { label: '登记总量', value: modules.reduce((sum, item) => sum + item.created, 0) },
    { label: '待处理', value: modules.reduce((sum, item) => sum + item.pending, 0) },
    { label: '异常量', value: modules.reduce((sum, item) => sum + item.abnormal, 0) },
  ]
  return { cards, modules }
}
