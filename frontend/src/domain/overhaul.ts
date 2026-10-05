import type { EntryRow } from '@/data/types'

export const OVERHAUL_STATUS = {
  PENDING_APPROVAL: '待审批',
  APPROVED: '已批准',
  REPAIRING: '检修中',
  DONE: '已完工',
} as const

export const OVERHAUL_ACTION = {
  SUBMIT: '提交审批',
  START: '开工检修',
  FINISH: '办理完工',
} as const

/** 工作票与机组靠「机组编号」关联（如 UNIT-0004），关联不上就是没有开工资格。 */
export function findOverhaulByUnit(rows: EntryRow[], unitCode: string): EntryRow | undefined {
  return rows.find((row) => String(row['关联机组'] ?? '') === unitCode)
}

export function openOverhaulTickets(rows: EntryRow[]): EntryRow[] {
  // 可开工：已批准且机组具备开工资格（停机备用/故障停机）。资格校验放在动作执行处。
  return rows.filter((row) => row.status === OVERHAUL_STATUS.APPROVED)
}
