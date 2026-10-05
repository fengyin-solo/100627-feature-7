import type { EntryRow } from '@/data/types'
import { hoursBetween, toNumber } from './clock'

/** 机组状态推进一条链（故障是支路，不是独立链外状态）：
 * 待启动 ──开机并网──▶ 运行中 ──停机转备──▶ 停机备用 ──恢复待启动──▶ 待启动
 *                     运行中 ──登记故障──▶ 故障停机 ──检修闭环(办理完工)──▶ 停机备用
 */
export const UNIT_STATUS = {
  READY: '待启动',
  RUNNING: '运行中',
  STANDBY: '停机备用',
  FAULT: '故障停机',
} as const

export const UNIT_ACTION = {
  START: '开机并网',
  STOP: '停机转备',
  FAULT: '登记故障',
  RESUME: '恢复待启动',
} as const

/** 每个动作允许的唯一前置状态。跳着点一律退回，并指出现在停在哪一步。 */
export const UNIT_ACTION_GUARD: Record<string, string> = {
  [UNIT_ACTION.START]: UNIT_STATUS.READY,
  [UNIT_ACTION.STOP]: UNIT_STATUS.RUNNING,
  [UNIT_ACTION.FAULT]: UNIT_STATUS.RUNNING,
  [UNIT_ACTION.RESUME]: UNIT_STATUS.STANDBY,
}

/** 故障停机机组唯一的出路：检修票办理完工（检修闭环），没有任何快捷跳转。 */
export function blockedMessage(current: string, required: string, action: string): string {
  return `「${action}」只能从「${required}」发起，机组当前停在「${current}」，请先推进到「${required}」`
}

/** 当前累计运行小时：停机/故障时读结算值（不跳数），运行中按并网时刻实时累加。 */
export function runningHours(row: EntryRow, at: string): number {
  const settled = toNumber(row['累计运行小时'])
  if (row.status !== UNIT_STATUS.RUNNING) {
    return settled
  }
  return Math.round((settled + hoursBetween(String(row['并网时刻'] ?? ''), at)) * 100) / 100
}

export function isFault(row: EntryRow): boolean {
  return row.status === UNIT_STATUS.FAULT
}

export function isAvailable(row: EntryRow): boolean {
  // 可调出力口径：还在故障停机的机组不算可调；待启动/运行中/停机备用都可调。
  return row.status !== UNIT_STATUS.FAULT
}

export type UnitMetrics = {
  runningCount: number
  adjustableMw: number
  standbyMw: number
  faultCount: number
  maxVibration: number
}

/** 机组页、发电计划页、概览共用这一份口径，任何页面不得另算。 */
export function unitMetrics(rows: EntryRow[], at: string): UnitMetrics {
  const metrics: UnitMetrics = {
    runningCount: 0,
    adjustableMw: 0,
    standbyMw: 0,
    faultCount: 0,
    maxVibration: 0,
  }
  for (const row of rows) {
    const output = toNumber(row['有功出力'])
    if (row.status === UNIT_STATUS.RUNNING) {
      metrics.runningCount += 1
      metrics.adjustableMw += output
      metrics.maxVibration = Math.max(metrics.maxVibration, toNumber(row['振动数值']))
    } else if (row.status === UNIT_STATUS.STANDBY) {
      metrics.adjustableMw += output
      metrics.standbyMw += output
    } else if (row.status === UNIT_STATUS.READY) {
      metrics.adjustableMw += output
    } else if (row.status === UNIT_STATUS.FAULT) {
      metrics.faultCount += 1
    }
  }
  metrics.adjustableMw = Math.round(metrics.adjustableMw * 100) / 100
  metrics.standbyMw = Math.round(metrics.standbyMw * 100) / 100
  metrics.maxVibration = Math.round(metrics.maxVibration * 1000) / 1000
  return metrics
}
