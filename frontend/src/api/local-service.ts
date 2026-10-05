import { MODULE_BY_KEY } from '@/data/modules'
import { allRows, listRows, resetRows, saveRows } from '@/data/local-store'
import {
  allowedSources,
  applyDerivations,
  deriveAbnormal,
  derivePending,
  moduleMetaOf,
  nowMoment,
  parseMoment,
  today,
  toNumber,
} from '@/data/rules'
import type {
  ActionResult,
  EntryRow,
  FleetSnapshot,
  ModuleMeta,
  OverviewResult,
  PageResult,
  StatItem,
} from '@/data/types'

export function moduleMeta(key: string): ModuleMeta {
  return moduleMetaOf(key)
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

function rowLabel(meta: ModuleMeta, row: EntryRow): string {
  const code = row[meta.fields[0]]
  return code ? `${meta.entity} ${code}` : `${meta.entity} #${row.id}`
}

/**
 * 状态推进的唯一入口。规则：
 * 1. 目标状态与当前相同 → 幂等放行，不重复记账（不多出台数、不多扣数量、不重复建缺陷）；
 * 2. 当前状态不在动作允许的来源里 → 退回，并指出停在哪一步、能从哪几步走；
 * 3. 命中流转 → 先过前置校验（如检修开工资格），再改状态，再落联动副作用。
 */
export function runAction(key: string, id: number, action: string): ActionResult {
  const meta = moduleMetaOf(key)
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
  const current = String(row.status)
  const label = rowLabel(meta, row)
  if (current === target) {
    return { ok: true, message: `${label}已是「${target}」，本次不重复变更` }
  }
  const sources = allowedSources(meta, action)
  if (!sources.includes(current)) {
    return {
      ok: false,
      message: `${label}当前停在「${current}」，「${action}」只能从「${sources.join('」「')}」推进，已退回`,
    }
  }
  const blocked = preCheck(key, row, action)
  if (blocked) {
    return { ok: false, message: blocked }
  }
  const updated: EntryRow = { ...row, status: target }
  const notes: string[] = []
  applyTransitionEffects(meta, updated, action, current, notes)
  const next = [...rows]
  next[index] = applyDerivations(meta, updated)
  saveRows(key, next)
  return { ok: true, message: `${label}已${action}，当前状态「${target}」${notes.join('')}` }
}

/** 动作前置校验：返回 null 放行，返回字符串则退回并说明原因。 */
function preCheck(key: string, row: EntryRow, action: string): string | null {
  if (key === 'overhaul' && action === '开工检修') {
    const code = String(row['检修机组'] ?? '')
    const unit = listRows('unit').find((item) => String(item['机组编号']) === code)
    // 历史票据没关联上机组编号的，无法核对机组口径，按既有单据流程放行（见 README 兼容说明）。
    if (!unit) {
      return null
    }
    const status = String(unit.status)
    if (status !== '停机备用' && status !== '故障停机') {
      return `检修开工被退回：机组 ${code} 当前停在「${status}」，需先停机（停机备用或故障停机）才具备开工资格`
    }
  }
  if (key === 'spare' && action === '领用备件') {
    if (toNumber(row['现有数量']) <= 0) {
      return `备件 ${row['备件编号'] ?? row.id} 现有数量已为 0，不能再领用，请先提交补充`
    }
  }
  return null
}

/** 命中流转后的联动副作用：只在这一处写，页面不各自实现。 */
function applyTransitionEffects(
  meta: ModuleMeta,
  updated: EntryRow,
  action: string,
  current: string,
  notes: string[],
): void {
  if (meta.key === 'unit') {
    applyUnitEffects(updated, action, current, notes)
  }
  if (meta.key === 'overhaul') {
    applyOverhaulEffects(updated, action, notes)
  }
  if (meta.key === 'spare' && action === '领用备件') {
    updated['现有数量'] = Math.max(0, toNumber(updated['现有数量']) - 1)
    notes.push(`，现有数量扣减至 ${updated['现有数量']}`)
  }
}

/** 机组联动：并网记时刻、停机累小时、故障落缺陷清单。 */
function applyUnitEffects(unit: EntryRow, action: string, current: string, notes: string[]): void {
  if (action === '开机并网') {
    unit['最近并网时刻'] = nowMoment()
    unit['数据来源'] = '实时登记'
    notes.push(`，并网时刻 ${unit['最近并网时刻']}`)
  }
  if (action === '停机转备' || (action === '登记故障' && current === '运行中')) {
    const gained = accrueRuntime(unit)
    unit['最近停机时刻'] = nowMoment()
    notes.push(`，本次运行 ${gained} 小时，累计 ${unit['累计运行小时']} 小时`)
  }
  if (action === '登记故障') {
    notes.push(registerFaultDefect(unit))
    notes.push(ensureFaultTicket(unit))
  }
}

/** 累计运行小时按并网时刻累加；停机之后不再跳数（没有后台计时，只有流转时结算）。 */
function accrueRuntime(unit: EntryRow): number {
  const start = parseMoment(unit['最近并网时刻'])
  if (!start) {
    return 0
  }
  const gained = Math.round(Math.max(0, (Date.now() - start.getTime()) / 3600000) * 10) / 10
  unit['累计运行小时'] = Math.round((toNumber(unit['累计运行小时']) + gained) * 10) / 10
  return gained
}

/** 登记故障 → 自动落到设备缺陷清单；同一机组已有未闭环故障缺陷时，先入库的那份保留。 */
function registerFaultDefect(unit: EntryRow): string {
  const code = String(unit['机组编号'])
  const defects = listRows('defect')
  const existing = defects.find(
    (item) =>
      String(item['设备名称']) === code &&
      String(item['来源']) === '机组运行-登记故障' &&
      (item.status === '待处理' || item.status === '处理中'),
  )
  if (existing) {
    return `，缺陷 ${existing['缺陷编号']} 已在处置清单中，重复登记以先入库的为准`
  }
  const defectMeta = moduleMetaOf('defect')
  const id = Math.max(0, ...defects.map((item) => Number(item.id) || 0)) + 1
  const code_ = nextDefectCode(defects)
  const discovered = today()
  const row = applyDerivations(defectMeta, {
    id,
    status: '待处理',
    pending: true,
    abnormal: false,
    '缺陷编号': code_,
    '设备名称': code,
    '缺陷描述': `机组 ${code} 故障停机登记，待检修闭环`,
    '缺陷等级': '重大',
    '发现日期': discovered,
    '处理期限': addDays(discovered, 7),
    '处理人员': '待指派',
    '来源': '机组运行-登记故障',
  })
  saveRows('defect', [...defects, row])
  return `，已登记缺陷 ${code_}（待处理）`
}

function nextDefectCode(defects: EntryRow[]): string {
  const max = defects.reduce((acc, item) => {
    const match = /^DEFE-(\d+)$/.exec(String(item['缺陷编号'] ?? ''))
    return match ? Math.max(acc, Number(match[1])) : acc
  }, 0)
  return `DEFE-${String(max + 1).padStart(4, '0')}`
}

/** 登记故障 → 同时开立待审批的检修工作票，故障机组才有检修闭环可走；已有未结票不重复开。 */
function ensureFaultTicket(unit: EntryRow): string {
  const code = String(unit['机组编号'])
  const tickets = listRows('overhaul')
  const open = tickets.find(
    (item) =>
      String(item['检修机组']) === code &&
      (item.status === '待审批' || item.status === '已批准' || item.status === '检修中'),
  )
  if (open) {
    return `，检修工作票 ${open['工作票号']}（${open.status}）已在流程中`
  }
  const overhaulMeta = moduleMetaOf('overhaul')
  const id = Math.max(0, ...tickets.map((item) => Number(item.id) || 0)) + 1
  const ticketNo = nextTicketCode(tickets)
  const row = applyDerivations(overhaulMeta, {
    id,
    status: '待审批',
    pending: true,
    abnormal: false,
    '工作票号': ticketNo,
    '检修机组': code,
    '检修级别': '故障检修',
    '计划工期': '待定',
    '实际工期': '',
    '工作负责人': '待指派',
    '验收人员': '',
  })
  saveRows('overhaul', [...tickets, row])
  return `，已开立工作票 ${ticketNo}（待审批）`
}

function nextTicketCode(tickets: EntryRow[]): string {
  const year = new Date().getFullYear()
  const max = tickets.reduce((acc, item) => {
    const match = new RegExp(`^OH-${year}-(\\d+)$`).exec(String(item['工作票号'] ?? ''))
    return match ? Math.max(acc, Number(match[1])) : acc
  }, 0)
  return `OH-${year}-${String(max + 1).padStart(3, '0')}`
}

function addDays(date: string, days: number): string {
  const base = new Date(`${date}T00:00:00`)
  base.setDate(base.getDate() + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}`
}

/** 检修联动：开工把关联故障缺陷推到处理中；完工让故障机组闭环转备、缺陷消除归档。 */
function applyOverhaulEffects(ticket: EntryRow, action: string, notes: string[]): void {
  const code = String(ticket['检修机组'] ?? '')
  if (action === '开工检修') {
    const moved = moveFaultDefects(code, '处理中', String(ticket['工作负责人'] ?? ''), ['待处理'])
    if (moved > 0) {
      notes.push(`，关联缺陷 ${moved} 条转「处理中」`)
    }
  }
  if (action === '办理完工') {
    notes.push(closeUnitFaultLoop(ticket, code))
    const moved = moveFaultDefects(code, '已消除', String(ticket['验收人员'] || '检修闭环'), [
      '待处理',
      '处理中',
    ])
    if (moved > 0) {
      notes.push(`，关联缺陷 ${moved} 条消除归档`)
    }
  }
}

/** 故障机组回到停机备用的唯一通道：检修工作票办理完工（检修闭环）。 */
function closeUnitFaultLoop(ticket: EntryRow, code: string): string {
  const units = listRows('unit')
  const index = units.findIndex((item) => String(item['机组编号']) === code)
  if (index < 0 || String(units[index].status) !== '故障停机') {
    return ''
  }
  const busy = listRows('overhaul').some(
    (item) =>
      Number(item.id) !== Number(ticket.id) &&
      String(item['检修机组']) === code &&
      item.status === '检修中',
  )
  if (busy) {
    return `，机组 ${code} 尚有其他检修中工作票，暂不转备`
  }
  const unitMeta = moduleMetaOf('unit')
  const next = [...units]
  next[index] = applyDerivations(unitMeta, {
    ...units[index],
    status: '停机备用',
    '数据来源': '检修闭环转备',
  })
  saveRows('unit', next)
  return `，机组 ${code} 检修闭环，转「停机备用」`
}

/** 把某机组故障来源的缺陷批量推进到目标状态，返回移动条数。 */
function moveFaultDefects(code: string, target: string, handler: string, from: string[]): number {
  const defectMeta = moduleMetaOf('defect')
  const defects = listRows('defect')
  let moved = 0
  const next = defects.map((item) => {
    const isFaultDefect =
      String(item['设备名称']) === code && String(item['来源']) === '机组运行-登记故障'
    if (!isFaultDefect || !from.includes(String(item.status))) {
      return item
    }
    moved += 1
    return applyDerivations(defectMeta, {
      ...item,
      status: target,
      '处理人员': handler || String(item['处理人员'] ?? ''),
    })
  })
  if (moved > 0) {
    saveRows('defect', next)
  }
  return moved
}

/** 机组舰队口径：机组运行页、发电计划页、检修开工校验都读这一份。 */
export function fleetSnapshot(): FleetSnapshot {
  const units = listRows('unit')
  const byStatus = (status: string) => units.filter((row) => row.status === status)
  const outputOf = (rows: EntryRow[]) => rows.reduce((sum, row) => sum + toNumber(row['有功出力']), 0)
  const running = byStatus('运行中')
  const standby = byStatus('停机备用')
  return {
    runningCount: running.length,
    standbyCount: standby.length,
    faultCount: byStatus('故障停机').length,
    pendingCount: byStatus('待启动').length,
    standbyCapacity: outputOf(standby),
    // 可调出力 = 运行中 + 停机备用的有功合计；故障停机、待启动一律不计入。
    adjustableOutput: outputOf(running) + outputOf(standby),
  }
}

/** 机组编号 → 当前状态，检修页用来对照展示，和机组运行页是同一份数据。 */
export function unitStatusByCode(): Record<string, string> {
  const map: Record<string, string> = {}
  for (const unit of listRows('unit')) {
    map[String(unit['机组编号'])] = String(unit.status)
  }
  return map
}

/** 模块统计卡：全部从同一份行数据现算，不再是各自写死的数。 */
export function computeStats(key: string): StatItem[] {
  const meta = moduleMetaOf(key)
  const rows = listRows(key)
  if (key === 'unit') {
    const fleet = fleetSnapshot()
    const values: Record<string, number> = {
      '运行中机组': fleet.runningCount,
      '备用机组': fleet.standbyCount,
      '备用容量': fleet.standbyCapacity,
      '故障机组': fleet.faultCount,
    }
    return meta.metrics.map((label) => ({ label, value: values[label] ?? 0 }))
  }
  if (key === 'generation') {
    const planned = rows.reduce((sum, row) => sum + toNumber(row['计划出力']), 0)
    const actual = rows.reduce((sum, row) => sum + toNumber(row['实际出力']), 0)
    const values: Record<string, number | string> = {
      '可调出力': fleetSnapshot().adjustableOutput,
      '计划发电量': planned,
      '实际发电量': actual,
      '计划完成率': planned > 0 ? `${Math.round((actual / planned) * 100)}%` : '—',
    }
    return meta.metrics.map((label) => ({ label, value: values[label] ?? 0 }))
  }
  return meta.metrics.map((label) => ({ label, value: countByStatusLabel(rows, meta, label) }))
}

/** 通用统计：指标名里包含哪个状态名，就数哪个状态的行数（取最长匹配）。 */
function countByStatusLabel(rows: EntryRow[], meta: ModuleMeta, label: string): number {
  const matched = meta.statuses
    .filter((status) => label.includes(status))
    .sort((a, b) => b.length - a.length)[0]
  return matched ? rows.filter((row) => row.status === matched).length : 0
}

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
  return { filename: `${meta.name}-清单.csv`, content: '\uFEFF' + lines.join('\n') }
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
      pending: entries.filter((row) => derivePending(meta, row)).length,
      abnormal: entries.filter((row) => deriveAbnormal(row)).length,
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
