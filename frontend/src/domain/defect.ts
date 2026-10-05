import type { EntryRow } from '@/data/types'

export const DEFECT_STATUS = {
  PENDING: '待处理',
  PROCESSING: '处理中',
  DONE: '已完成',
  ARCHIVED: '已归档',
} as const

export const DEFECT_ACTION = {
  DISPATCH: '派发处理',
  RESOLVE: '确认消除',
  ARCHIVE: '归档',
} as const

/** 标准缺陷等级口径。旧数据里的等级原样保留、不改写，仅用于新登记下拉。 */
export const DEFECT_LEVELS = ['一般', '重大', '紧急'] as const

export type DefectDraft = {
  设备名称: string
  缺陷描述: string
  缺陷等级: string
  发现日期: string
  处理期限: string
  处理人员: string
  缺陷编号?: string
  来源: string
}

/** 重复登记判定：缺陷编号相同；或同一设备同一天同描述。命中即视为重复，只认第一次入库那份。 */
export function findDuplicateDefect(rows: EntryRow[], draft: DefectDraft): EntryRow | undefined {
  const code = draft.缺陷编号?.trim()
  if (code) {
    const byCode = rows.find((row) => String(row['缺陷编号'] ?? '').trim() === code)
    if (byCode) {
      return byCode
    }
  }
  return rows.find(
    (row) =>
      String(row['设备名称'] ?? '').trim() === draft.设备名称.trim() &&
      String(row['缺陷描述'] ?? '').trim() === draft.缺陷描述.trim() &&
      String(row['发现日期'] ?? '').trim() === draft.发现日期.trim(),
  )
}

/** 缺陷清单口径：机组页的「关联缺陷」与缺陷处置页读到的是同一份记录。 */
export function defectsOfUnit(rows: EntryRow[], unitCode: string): EntryRow[] {
  return rows.filter((row) => String(row['设备名称'] ?? '').includes(unitCode))
}

export type DefectMetrics = {
  pending: number
  processing: number
  done: number
  archived: number
}

export function defectMetrics(rows: EntryRow[]): DefectMetrics {
  const count = (status: string) => rows.filter((row) => row.status === status).length
  return {
    pending: count(DEFECT_STATUS.PENDING),
    processing: count(DEFECT_STATUS.PROCESSING),
    done: count(DEFECT_STATUS.DONE),
    archived: count(DEFECT_STATUS.ARCHIVED),
  }
}
