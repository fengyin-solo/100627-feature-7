import { MODULES } from './modules'
import { applyDerivations, moduleMetaOf, nowMoment, toNumber } from './rules'
import type { EntryRow, ModuleMeta } from './types'

// 旧数据兼容：结构有变化就抬 STORAGE_VERSION，首次读取时原地迁移一次并写回，不清空历史。
// 迁移只补不抢：状态文本、缺陷等级等既有取值一律保留，缺的时刻/数值按规则补记并写明来源。
export const STORAGE_VERSION = 2

export function migrateAll(rows: Record<string, EntryRow[]>): Record<string, EntryRow[]> {
  const moment = nowMoment()
  const next: Record<string, EntryRow[]> = {}
  for (const meta of MODULES) {
    next[meta.key] = normalizeModule(meta.key, rows[meta.key] ?? [], moment)
  }
  return next
}

export function normalizeModule(key: string, rows: EntryRow[], moment = nowMoment()): EntryRow[] {
  const meta = moduleMetaOf(key)
  return rows.map((row) => normalizeRow(meta, row, moment))
}

function normalizeRow(meta: ModuleMeta, row: EntryRow, moment: string): EntryRow {
  let next = { ...row }
  if (meta.key === 'unit') {
    next = normalizeUnit(next, moment)
  }
  if (meta.key === 'defect' && !next['来源']) {
    next['来源'] = '历史台账'
  }
  if (meta.key === 'spare') {
    next['现有数量'] = toNumber(next['现有数量'])
  }
  if (meta.key === 'generation') {
    next['计划出力'] = toNumber(next['计划出力'])
    next['实际出力'] = toNumber(next['实际出力'])
  }
  return applyDerivations(meta, next)
}

/**
 * 机组历史数据裁决规则：
 * - 累计运行小时缺项或无法识别 → 按 0 起算，来源里写清；
 * - 运行中但无并网时刻 → 按迁移时间补记并网时刻（只能这么做：早期没留底，停机时会从该时刻起累加）；
 * - 停机备用/故障停机但无停机时刻 → 按迁移时间补记停机时刻；
 * - 待启动机组本就无起停记录，不补时刻，只标注来源。
 */
function normalizeUnit(row: EntryRow, moment: string): EntryRow {
  const next = { ...row }
  const notes: string[] = []
  const rawHours = next['累计运行小时']
  if (rawHours === undefined || rawHours === '') {
    next['累计运行小时'] = 0
    notes.push('累计运行小时缺项，按0起算')
  } else if (!Number.isFinite(Number(rawHours))) {
    next['累计运行小时'] = 0
    notes.push('累计运行小时原值无法识别，按0起算')
  } else {
    next['累计运行小时'] = Number(rawHours)
  }
  const status = String(next.status)
  if (status === '运行中' && !next['最近并网时刻']) {
    next['最近并网时刻'] = moment
    notes.push('早期仅登记运行状态，并网时刻按迁移时间补记')
  }
  if ((status === '停机备用' || status === '故障停机') && !next['最近停机时刻']) {
    next['最近停机时刻'] = moment
    notes.push('早期仅登记运行状态，停机时刻按迁移时间补记')
  }
  if (!next['最近并网时刻']) {
    next['最近并网时刻'] = ''
  }
  if (!next['最近停机时刻']) {
    next['最近停机时刻'] = ''
  }
  if (notes.length > 0) {
    const backfill = `迁移回填：${notes.join('；')}`
    next['数据来源'] = next['数据来源'] ? `${next['数据来源']}；${backfill}` : backfill
  } else if (!next['数据来源']) {
    next['数据来源'] = '历史台账：早期仅登记状态，无起停记录'
  }
  return next
}
