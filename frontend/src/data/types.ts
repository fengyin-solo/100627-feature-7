/** 纯前端数据层的公共类型：与全栈版后端返回的结构保持一致，换回后端时页面不用改。 */

export type EntryRow = {
  id: number
  status: string
  pending: boolean
  abnormal: boolean
  [field: string]: string | number | boolean
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
  /** 每个动作允许的来源状态；缺省按 statuses 顺序取目标的前一格（顺序流转）。 */
  actionSources?: Record<string, string[]>
  /** 处于这些状态视为已办结（不再计入待处理）；其余状态都算待跟进。 */
  settledStatuses: string[]
  metrics: string[]
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

export type StatItem = {
  label: string
  value: number | string
}

export type OverviewResult = {
  cards: { label: string; value: number }[]
  modules: { name: string; created: number; pending: number; abnormal: number }[]
}

/** 机组舰队口径：发电计划的可调出力、机组运行页统计都从这里读同一份。 */
export type FleetSnapshot = {
  runningCount: number
  standbyCount: number
  faultCount: number
  pendingCount: number
  standbyCapacity: number
  adjustableOutput: number
}
