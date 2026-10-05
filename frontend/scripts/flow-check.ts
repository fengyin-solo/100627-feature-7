// 端到端逻辑校验：内存 localStorage 桩 + 真实业务代码，不依赖浏览器。
const mem = new Map<string, string>()
// @ts-ignore 测试桩
globalThis.window = {
  localStorage: {
    getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
    setItem: (k: string, v: string) => void mem.set(k, v),
    removeItem: (k: string) => void mem.delete(k),
  },
}

import {
  createDefect,
  listEntries,
  loadAdjustableCapacity,
  loadOverview,
  resetModule,
  runAction,
} from '../src/api/local-service'
import { allRows } from '../src/data/local-store'

let failures = 0
function check(name: string, cond: boolean, extra = '') {
  if (cond) {
    console.log(`PASS ${name}`)
  } else {
    failures += 1
    console.error(`FAIL ${name} ${extra}`)
  }
}
function row(key: string, id: number) {
  return allRows()[key].find((r) => Number(r.id) === id)!
}

// 初始种子：UNIT-0001 运行中(50MW)、0002 停机备用(40)、0003 待启动(75)、0004 故障(60)
const cap0 = loadAdjustableCapacity()
check('可调出力剔除故障机组', cap0.totalMw === 165, `got ${cap0.totalMw}`)
check('故障台数=1', cap0.faultCount === 1)
check('运行台数=1', cap0.runningCount === 1)

// 跳步：待启动机组直接停机转备 → 退回并指出卡点
const jump = runAction('unit', 3, '停机转备')
check('跳步退回', !jump.ok && jump.message.includes('只能从') && jump.message.includes('停机转备'), jump.message)
check('跳步不改状态', row('unit', 3).status === '待启动')

// 连续两次开机并网只生效一次
const start1 = runAction('unit', 3, '开机并网')
const start2 = runAction('unit', 3, '开机并网')
check('首次开机成功', start1.ok, start1.message)
check('重复开机退回不多台数', !start2.ok && row('unit', 3).status === '运行中', start2.message)
check('开机后运行台数=2', loadAdjustableCapacity().runningCount === 2)

// 运行小时：刚并网接近 0；停机时结算，停机后不跳数
const hoursRunning = Number(row('unit', 3)['累计运行小时'])
const ledger = row('unit', 3)['台账'] as any[]
check('并网写台账', Array.isArray(ledger) && ledger.some((e) => e.action === '开机并网'))

// 登记故障 → 联动检修票+缺陷，且从可调出力剔除
const fault = runAction('unit', 3, '登记故障')
check('登记故障成功并联动', fault.ok && fault.message.includes('联动开检修票'), fault.message)
check('故障后剔除可调', loadAdjustableCapacity().totalMw === 90, `got ${loadAdjustableCapacity().totalMw}`)
check('故障后不计运行台数', loadAdjustableCapacity().runningCount === 1)
const newTicket = allRows()['overhaul'].find((t) => String(t['关联机组']) === 'UNIT-0003' && t.status === '待审批')
check('联动检修票待审批', !!newTicket)
const newDefect = allRows()['defect'].find((d) => String(d['设备名称'] ?? '').includes('UNIT-0003'))
check('联动缺陷登记', !!newDefect && newDefect!.status === '待处理')

// 故障机不能直接恢复（唯一出路是检修闭环）
const resumeFault = runAction('unit', 3, '恢复待启动')
check('故障机不能直接恢复待启动', !resumeFault.ok, resumeFault.message)
const stopFault = runAction('unit', 3, '停机转备')
check('故障机不能直接停机转备', !stopFault.ok, stopFault.message)

// 检修闭环：待审批→已批准→（运行中机组的票不能开工，但故障机可以）→检修中→已完工→机组回停机备用
const submit = runAction('overhaul', Number(newTicket!.id), '提交审批')
check('检修票提交审批', submit.ok, submit.message)
// UNIT-0003 现在是故障停机，可开工
const startRepair = runAction('overhaul', Number(newTicket!.id), '开工检修')
check('故障机组检修票可开工', startRepair.ok, startRepair.message)
// 检修中机组的票不能再开工别的（同一机组检修互斥）— 用 id=2（已批准、关联 UNIT-0003）此时机组在检修中
const blockedStart = runAction('overhaul', 2, '开工检修')
check('同机组已有检修中票不能重复开工', !blockedStart.ok && blockedStart.message.includes('已有检修中的工作票'), blockedStart.message)
const finish = runAction('overhaul', Number(newTicket!.id), '办理完工')
check('检修完工闭环', finish.ok && finish.message.includes('闭环回停机备用'), finish.message)
check('机组闭环回停机备用', row('unit', 3).status === '停机备用', row('unit', 3).status)
// 0001 运行中 50 + 0002 备用 40 + 0003 备用 75 = 165，0004 故障剔除
check('闭环后恢复可调', loadAdjustableCapacity().totalMw === 165, `got ${loadAdjustableCapacity().totalMw}`)

// 停机备用→恢复待启动→再开机（循环链）
check('停机备用可恢复待启动', runAction('unit', 3, '恢复待启动').ok)
check('再开机成功', runAction('unit', 3, '开机并网').ok)

// 缺陷重复登记只认第一次
const dup = createDefect({
  缺陷编号: 'DUP-1',
  设备名称: 'TEST-DEV',
  缺陷描述: '同一毛病',
  缺陷等级: '紧急',
  发现日期: '2026-10-05',
  处理期限: '',
  处理人员: '',
})
const dup2 = createDefect({
  缺陷编号: 'DUP-2',
  设备名称: 'TEST-DEV',
  缺陷描述: '同一毛病',
  缺陷等级: '一般',
  发现日期: '2026-10-05',
  处理期限: '',
  处理人员: '',
})
check('首次缺陷登记成功', dup.ok, dup.message)
check('重复缺陷退回且保留首份等级', !dup2.ok && dup2.message.includes('只认第一次'), dup2.message)
const firstDef = allRows()['defect'].find((d) => d['缺陷编号'] === 'DUP-1')!
check('首份缺陷等级未被覆盖', firstDef['缺陷等级'] === '紧急')

// 缺陷单向链 + 归档后仍在清单
const beforeCount = listEntries('defect').total
check('待处理不能直接确认消除（跳步）', !runAction('defect', Number(firstDef.id), '确认消除').ok)
check('派发处理', runAction('defect', Number(firstDef.id), '派发处理').ok)
check('确认消除→已完成', runAction('defect', Number(firstDef.id), '确认消除').ok)
check('完成不能回头派发', !runAction('defect', Number(firstDef.id), '派发处理').ok)
check('归档', runAction('defect', Number(firstDef.id), '归档').ok)
check('归档后仍在清单', listEntries('defect').total === beforeCount)
check('归档为终态无待处理', firstDef.pending === false)

// 备件：领用只扣一次
resetModule('spare')
const beforeStock = Number(row('spare', 1)['现有数量'])
check('待验收不能直接领用（跳步）', !runAction('spare', 1, '领用备件').ok)
check('办理验收', runAction('spare', 1, '办理验收').ok)
const issue1 = runAction('spare', 1, '领用备件')
const issue2 = runAction('spare', 1, '领用备件')
check('领用成功扣一件', issue1.ok && Number(row('spare', 1)['现有数量']) === beforeStock - 1, issue1.message)
check('重复领用退回不多扣', !issue2.ok && Number(row('spare', 1)['现有数量']) === beforeStock - 1, issue2.message)
check('累计领用=1', Number(row('spare', 1)['累计领用']) === 1)

// 概览条数 = 列表条数
const overview = loadOverview()
const stationOverview = overview.modules.find((m) => m.name === '电站台账')!
check('概览条数与列表一致', stationOverview.created === listEntries('station').total)
const defectOverview = overview.modules.find((m) => m.name === '缺陷处置')!
check('概览缺陷条数含归档', defectOverview.created === listEntries('defect').total)
check(
  '概览总量=各列表之和',
  overview.cards[1].value === overview.modules.reduce((s, m) => s + m.created, 0),
)

console.log(failures === 0 ? '\n全部通过' : `\n${failures} 项失败`)
process.exit(failures === 0 ? 0 : 1)
