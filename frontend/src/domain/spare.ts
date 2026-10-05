import type { EntryRow } from '@/data/types'
import { toNumber } from './clock'

export const SPARE_STATUS = {
  TO_CHECK: '待验收',
  IN_STOCK: '已登记',
  ISSUED: '已领用',
  REORDER: '待补充',
} as const

export const SPARE_ACTION = {
  ACCEPT: '办理验收',
  ISSUE: '领用备件',
  REORDER: '提交补充',
} as const

/** 一次领用固定扣一件；同一行重复提交不会走到这里（状态已是「已领用」会被状态链拦下）。 */
export const ISSUE_QTY = 1

export function issueSpare(row: EntryRow): { ok: boolean; message: string } {
  const stock = toNumber(row['现有数量'])
  if (stock < ISSUE_QTY) {
    return { ok: false, message: `备件库存为 ${stock}，不足一件，不能领用` }
  }
  row['现有数量'] = stock - ISSUE_QTY
  row['累计领用'] = toNumber(row['累计领用']) + ISSUE_QTY
  return { ok: true, message: '' }
}

export type SpareMetrics = {
  inStockKinds: number
  totalStock: number
  issuedKinds: number
  reorderKinds: number
}

export function spareMetrics(rows: EntryRow[]): SpareMetrics {
  const metrics: SpareMetrics = { inStockKinds: 0, totalStock: 0, issuedKinds: 0, reorderKinds: 0 }
  for (const row of rows) {
    if (row.status === SPARE_STATUS.IN_STOCK) {
      metrics.inStockKinds += 1
      metrics.totalStock += toNumber(row['现有数量'])
    } else if (row.status === SPARE_STATUS.ISSUED) {
      metrics.issuedKinds += 1
    } else if (row.status === SPARE_STATUS.REORDER) {
      metrics.reorderKinds += 1
    }
  }
  return metrics
}
