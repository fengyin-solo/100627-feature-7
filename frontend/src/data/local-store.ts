import { SEED_ROWS } from './seed'
import type { EntryRow, LedgerEvent } from './types'
import { nowIso } from '@/domain/clock'
import { appendLedger } from '@/domain/ledger'

// 本地持久化：数据放在 localStorage 里，刷新、关掉再打开都还在。
const STORAGE_KEY = 'hydropower-plant-om:entries'
// 数据结构版本：旧版（v1，无版本号纯对象）打开时一次性迁移，之后随版本继续演进。
const STORE_VERSION = 2

type StoreShape = {
  version: number
  rows: Record<string, EntryRow[]>
}

const MIGRATION_BASE = '2026-10-05T00:00:00'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function freshStore(): StoreShape {
  return { version: STORE_VERSION, rows: clone(SEED_ROWS) }
}

/** 把文本占位数值（如「机组运行样例1」）收敛为 0，保证各页统计口径可求和。 */
function numericOrZero(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value.trim()))) {
    return Number(value.trim())
  }
  return 0
}

const UNIT_NUMERIC_FIELDS = ['额定转速', '有功出力', '无功出力', '累计运行小时', '振动数值']

/** 机组旧数据回填规则（对早期只记了运行状态、没有时刻的机组）：
 * 1. 运行中：按迁移基准时刻并网，累计运行小时保留原值并从此刻继续累加，台账补「待启动→运行中」；
 * 2. 停机备用：按基准时刻停机，补「运行中→停机备用」，再补「→待启动」不做（停机备用本身是稳态）；
 * 3. 待启动：补「停机备用→待启动」；
 * 4. 故障停机：按基准时刻跳闸，补「运行中→故障停机」，不开检修票（故障票必须故障联动生成，
 *    旧故障机直接从「机组检修」登记一张待审批票，来源标注为迁移补录，闭环规则不变）。
 * 所有补录事件 source 统一写「迁移补录」，note 写清缺项来源，历史台账缺项不再静默。
 */
function migrateUnitRow(row: EntryRow, at: string): void {
  for (const field of UNIT_NUMERIC_FIELDS) {
    row[field] = numericOrZero(row[field])
  }
  if (!Array.isArray(row['台账'])) {
    row['台账'] = []
  }
  const ledger = row['台账'] as LedgerEvent[]
  if (ledger.length === 0) {
    const backfill = (event: LedgerEvent) => appendLedger(row, event, at)
    if (row.status === '运行中') {
      row['并网时刻'] = row['并网时刻'] || MIGRATION_BASE
      row['停机时刻'] = ''
      backfill({
        from: '待启动',
        to: '运行中',
        action: '开机并网',
        at: MIGRATION_BASE,
        source: '迁移补录',
        note: '早期数据只记录运行状态，并网时刻按迁移基准日 2026-10-05 00:00 回填，累计运行小时保留原登记值',
      })
    } else if (row.status === '停机备用') {
      row['并网时刻'] = ''
      row['停机时刻'] = row['停机时刻'] || MIGRATION_BASE
      backfill({
        from: '运行中',
        to: '停机备用',
        action: '停机转备',
        at: MIGRATION_BASE,
        source: '迁移补录',
        note: '起停时刻缺项，按迁移基准日回填为停机时刻',
      })
    } else if (row.status === '待启动') {
      row['并网时刻'] = ''
      row['停机时刻'] = row['停机时刻'] || MIGRATION_BASE
      backfill({
        from: '停机备用',
        to: '待启动',
        action: '恢复待启动',
        at: MIGRATION_BASE,
        source: '迁移补录',
        note: '起停时刻缺项，按迁移基准日回填',
      })
    } else if (row.status === '故障停机') {
      row['并网时刻'] = ''
      row['停机时刻'] = row['停机时刻'] || MIGRATION_BASE
      backfill({
        from: '运行中',
        to: '故障停机',
        action: '登记故障',
        at: MIGRATION_BASE,
        source: '迁移补录',
        note: '故障时刻缺项，按迁移基准日回填；回停机备用前必须先完成检修闭环',
      })
    }
  }
}

/** 缺陷旧口径兼容：已消除→已完成，已挂账→处理中（挂账不是终态，仍要走完成/归档）；
 * 缺陷等级一律保留原文本不改写，仅在页面提示其是否为标准等级。
 */
function migrateDefectRow(row: EntryRow, at: string): void {
  let legacyStatus = ''
  if (row.status === '已消除') {
    legacyStatus = row.status
    row.status = '已完成'
  } else if (row.status === '已挂账') {
    legacyStatus = row.status
    row.status = '处理中'
  }
  if (row['来源'] === undefined) {
    row['来源'] = legacyStatus ? `迁移补录（原状态：${legacyStatus}）` : '迁移补录'
  }
  if (!Array.isArray(row['台账'])) {
    const note = legacyStatus
      ? `历史台账缺项，原登记状态为「${legacyStatus}」，按兼容规则映射为「${row.status}」；缺陷等级保留原值不改写`
      : '历史台账缺项，按发现日期回填登记事件'
    appendLedger(
      row,
      {
        from: '—',
        to: row.status,
        action: '迁移补录',
        at: `${String(row['发现日期'] ?? '').slice(0, 10) || MIGRATION_BASE.slice(0, 10)}T00:00:00`,
        source: '迁移补录',
        note,
      },
      at,
    )
  }
}

/** 检修票旧字段「检修机组」若是 UNIT 编号则升级为「关联机组」，否则置空（没有关联机组不得开工）。 */
function migrateOverhaulRow(row: EntryRow, at: string): void {
  if (row['关联机组'] === undefined) {
    const oldRef = String(row['检修机组'] ?? '')
    row['关联机组'] = /^UNIT-\d{4}$/.test(oldRef) ? oldRef : ''
    delete row['检修机组']
  }
  if (!Array.isArray(row['台账'])) {
    appendLedger(
      row,
      {
        from: '—',
        to: row.status,
        action: '迁移补录',
        at: MIGRATION_BASE,
        source: '迁移补录',
        note: '检修票历史流程缺项，按当前状态回填，关联机组为空时需先补关联才可开工',
      },
      at,
    )
  }
}

function migrateSpareRow(row: EntryRow): void {
  row['现有数量'] = numericOrZero(row['现有数量'])
  if (row['累计领用'] === undefined) {
    // 已领用的旧数据累计领用缺项：按 1 件保守补，note 无法挂载，沿用字段初值。
    row['累计领用'] = row.status === '已领用' ? 1 : 0
  } else {
    row['累计领用'] = numericOrZero(row['累计领用'])
  }
  delete row['备件状态']
}

function migrateGenerationRow(row: EntryRow): void {
  for (const field of ['计划出力', '实际出力', '日发电量', '上网电量']) {
    row[field] = numericOrZero(row[field])
  }
}

function toStore(raw: unknown): StoreShape {
  // v1：纯 Record<string, EntryRow[]>，没有版本号。
  if (raw && typeof raw === 'object' && !Array.isArray(raw) && !('version' in raw)) {
    const rows = clone(raw as Record<string, EntryRow[]>)
    migrateV1(rows)
    return { version: STORE_VERSION, rows }
  }
  const parsed = raw as Partial<StoreShape> | null
  if (parsed && typeof parsed === 'object' && parsed.rows && typeof parsed.rows === 'object') {
    return { version: STORE_VERSION, rows: clone(parsed.rows as Record<string, EntryRow[]>) }
  }
  return freshStore()
}

function migrateV1(rows: Record<string, EntryRow[]>): void {
  const at = nowIso()
  // 为历史上每一台故障停机但没有关联检修票的机组补一张待审批票，保证闭环有路可走。
  const overhaulRows = rows['overhaul'] ?? []
  let ticketId = overhaulRows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0)
  for (const unit of rows['unit'] ?? []) {
    migrateUnitRow(unit, at)
    if (unit.status === '故障停机') {
      const code = String(unit['机组编号'] ?? '')
      const linked = overhaulRows.some((row) => String(row['关联机组'] ?? '') === code)
      if (!linked) {
        ticketId += 1
        const ticket: EntryRow = {
          id: ticketId,
          status: '待审批',
          pending: true,
          abnormal: false,
          工作票号: `WO-MIG-${String(ticketId).padStart(4, '0')}`,
          关联机组: code,
          检修级别: '未分级',
          计划工期: '',
          实际工期: '',
          工作负责人: '',
          验收人员: '',
          检修状态: '待审批',
          台账: [
            {
              from: '—',
              to: '待审批',
              action: '迁移补录',
              at: MIGRATION_BASE,
              source: '迁移补录',
              note: '该机组历史已处于故障停机且无检修票，补开待审批票，走完审批-开工-完工闭环后方可回停机备用',
            },
          ],
        }
        overhaulRows.push(ticket)
      }
    }
  }
  if (overhaulRows.length) {
    rows['overhaul'] = overhaulRows
  }
  ;(rows['defect'] ?? []).forEach((row) => migrateDefectRow(row, at))
  ;(rows['overhaul'] ?? []).forEach((row) => migrateOverhaulRow(row, at))
  ;(rows['spare'] ?? []).forEach(migrateSpareRow)
  ;(rows['generation'] ?? []).forEach(migrateGenerationRow)
}

function readStorage(): StoreShape {
  if (typeof window === 'undefined' || !window.localStorage) {
    return freshStore()
  }
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const store = freshStore()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    return store
  }
  try {
    const store = toStore(JSON.parse(raw))
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    return store
  } catch {
    const store = freshStore()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    return store
  }
}

let cache: StoreShape | null = null

function store(): StoreShape {
  if (cache === null) {
    cache = readStorage()
  }
  return cache
}

export function allRows(): Record<string, EntryRow[]> {
  return store().rows
}

export function listRows(key: string): EntryRow[] {
  return store().rows[key] ?? []
}

export function saveRows(key: string, rows: EntryRow[]): void {
  const next: StoreShape = {
    version: STORE_VERSION,
    rows: { ...store().rows, [key]: rows },
  }
  cache = next
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }
}

/** 跨模块事务：一次动作可能同时改写机组、检修票、缺陷三处，保证它们要么一起落库要么都不动。 */
export function saveMany(patch: Record<string, EntryRow[]>): void {
  const next: StoreShape = { version: STORE_VERSION, rows: { ...store().rows, ...patch } }
  cache = next
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }
}

export function resetRows(key: string): EntryRow[] {
  const rows = clone(SEED_ROWS[key] ?? [])
  saveRows(key, rows)
  return rows
}

export function storageKey(): string {
  return STORAGE_KEY
}
