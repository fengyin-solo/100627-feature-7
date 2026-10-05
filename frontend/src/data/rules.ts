import { MODULE_BY_KEY } from './modules'
import type { EntryRow, ModuleMeta } from './types'

// 全平台共用的一套口径：待处理/异常/状态列同步都从这里出，概览页、列表页、迁移结果不会各算各的。

/** 状态名里带这些字样的，一律视为异常态。 */
const ABNORMAL_PATTERN = /故障|异常|报警|超限|告警|损坏|停工|偏高/

export function moduleMetaOf(key: string): ModuleMeta {
  const meta = MODULE_BY_KEY.get(key)
  if (!meta) {
    throw new Error(`没有登记名为 ${key} 的业务模块`)
  }
  return meta
}

/** 待处理 = 还没办结（不在 settledStatuses 里）。 */
export function derivePending(meta: ModuleMeta, row: EntryRow): boolean {
  return !meta.settledStatuses.includes(String(row.status))
}

/** 异常 = 状态名命中异常字样。 */
export function deriveAbnormal(row: EntryRow): boolean {
  return ABNORMAL_PATTERN.test(String(row.status))
}

/** 每个模块字段表的最后一列是状态列（××状态），写数据时与 status 保持同一份。 */
export function statusFieldOf(meta: ModuleMeta): string | null {
  const last = meta.fields[meta.fields.length - 1]
  return last && last.endsWith('状态') ? last : null
}

/** 按统一口径刷新一行的 pending / abnormal / 状态列，返回新行。 */
export function applyDerivations(meta: ModuleMeta, row: EntryRow): EntryRow {
  const next: EntryRow = {
    ...row,
    pending: derivePending(meta, row),
    abnormal: deriveAbnormal(row),
  }
  const statusField = statusFieldOf(meta)
  if (statusField) {
    next[statusField] = String(row.status)
  }
  return next
}

/** 动作允许的来源状态：显式声明优先，缺省按状态表顺序取目标的前一格（顺序流转）。 */
export function allowedSources(meta: ModuleMeta, action: string): string[] {
  const declared = meta.actionSources?.[action]
  if (declared) {
    return declared
  }
  const target = meta.actionTargets[action]
  const index = meta.statuses.indexOf(target)
  return index > 0 ? [meta.statuses[index - 1]] : []
}

/** 数值字段容错：能转成数字就用数字，转不了按 0 算（历史脏数据不炸页面）。 */
export function toNumber(value: unknown): number {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

/** 起停时刻统一存「YYYY-MM-DD HH:mm」本地时间，页面直接可读。 */
export function formatMoment(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function nowMoment(): string {
  return formatMoment(new Date())
}

export function today(): string {
  return nowMoment().slice(0, 10)
}

export function parseMoment(value: unknown): Date | null {
  if (typeof value !== 'string' || value.trim() === '') {
    return null
  }
  const parsed = new Date(value.trim().replace(' ', 'T'))
  return Number.isNaN(parsed.getTime()) ? null : parsed
}
