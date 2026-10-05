import type { EntryRow, LedgerEvent } from '@/data/types'

/** 读取某条记录的状态台账；历史数据没有台账时返回空数组（迁移时会补）。 */
export function ledgerOf(row: EntryRow): LedgerEvent[] {
  const events = row['台账']
  return Array.isArray(events) ? (events as LedgerEvent[]) : []
}

/** 追加一条状态事件，台账始终按发生时间升序存放。 */
export function appendLedger(
  row: EntryRow,
  event: Omit<LedgerEvent, 'at'> & { at?: string },
  at: string,
): void {
  const events = ledgerOf(row)
  events.push({
    from: event.from,
    to: event.to,
    action: event.action,
    source: event.source,
    note: event.note,
    at: event.at ?? at,
  })
  events.sort((a, b) => a.at.localeCompare(b.at))
  row['台账'] = events
}

/** 最近一条事件（用于迁移时判断最后停在哪一步）。 */
export function lastLedgerEvent(row: EntryRow): LedgerEvent | undefined {
  const events = ledgerOf(row)
  return events.length ? events[events.length - 1] : undefined
}
