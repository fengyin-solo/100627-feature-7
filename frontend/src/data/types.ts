/** 纯前端数据层的公共类型：与全栈版后端返回的结构保持一致，换回后端时页面不用改。 */

/** 状态台账事件：状态机每次流转追加一条，历史缺项回填时也要带来源说明。 */
export type LedgerEvent = {
  from: string
  to: string
  action: string
  /** ISO 时刻，所有按时间排序、小时累加都以此为准。 */
  at: string
  /** 操作来源：动作名/迁移补录/故障联动等。 */
  source: string
  note?: string
}

export type FieldValue = string | number | boolean | LedgerEvent[]

export type EntryRow = {
  id: number
  status: string
  pending: boolean
  abnormal: boolean
  [field: string]: FieldValue
}

export type ModuleMeta = {
  key: string
  name: string
  entity: string
  desc: string
  fields: string[]
  statuses: string[]
  actions: string[]
  actionTargets: Record<string, string>
  metrics: string[]
  /** 终态：处于终态的记录不再算待处理；缺省以状态序列最后一个为准。 */
  terminalStatuses?: string[]
  /** 命中这些状态算异常（概览异常量口径）；缺省按通用异常词匹配。 */
  abnormalStatuses?: string[]
}

export type PageResult = {
  items: EntryRow[]
  total: number
  page: number
  size: number
}

export type ActionResult = {
  ok: boolean
  message: string
}

export type OverviewResult = {
  cards: { label: string; value: number }[]
  modules: { name: string; created: number; pending: number; abnormal: number }[]
}
