/**
 * 业务规则验证脚本：不依赖浏览器，直接跑在本地数据层上。
 * 用法：npm run verify:logic
 * 覆盖：机组状态链、幂等、累计运行小时、检修闭环、缺陷清单联动、
 *       备件扣减、可调出力口径、概览与列表一致性、旧数据迁移。
 */
import {
  computeStats,
  fleetSnapshot,
  listEntries,
  loadOverview,
  runAction,
} from '@/api/local-service'
import { listRows, saveRows } from '@/data/local-store'
import { migrateAll, normalizeModule } from '@/data/migrate'
import { MODULES } from '@/data/modules'
import { allowedSources as allowedSourcesFor, formatMoment } from '@/data/rules'
import type { EntryRow } from '@/data/types'

let passed = 0
let failed = 0

function check(name: string, cond: boolean, detail = ''): void {
  if (cond) {
    passed += 1
    console.log(`  ✓ ${name}`)
  } else {
    failed += 1
    console.error(`  ✗ ${name} ${detail}`)
  }
}

function unit(code: string): EntryRow {
  const found = listRows('unit').find((row) => row['机组编号'] === code)
  if (!found) throw new Error(`机组 ${code} 不存在`)
  return found
}

function faultDefects(code: string): EntryRow[] {
  return listRows('defect').filter(
    (row) => row['设备名称'] === code && row['来源'] === '机组运行-登记故障',
  )
}

function hoursAgo(hours: number): string {
  return formatMoment(new Date(Date.now() - hours * 3600 * 1000))
}

function backdateGridMoment(code: string, hours: number): void {
  const rows = listRows('unit').map((row) =>
    row['机组编号'] === code ? { ...row, 最近并网时刻: hoursAgo(hours) } : row,
  )
  saveRows('unit', rows)
}

console.log('A. 机组状态链：跳步一律退回并指出停在哪一步')
{
  let r = runAction('unit', 3, '开机并网') // 停机备用 → 运行中：不许跳
  check('停机备用不能直接开机并网', !r.ok && r.message.includes('停在「停机备用」') && r.message.includes('「待启动」'), r.message)
  r = runAction('unit', 1, '停机转备') // 待启动 → 停机备用：不许跳
  check('待启动不能停机转备', !r.ok && r.message.includes('停在「待启动」') && r.message.includes('「运行中」'), r.message)
  r = runAction('unit', 4, '停机转备') // 故障停机 → 停机备用：必须走检修闭环
  check('故障停机不能直接转备（须检修闭环）', !r.ok && r.message.includes('停在「故障停机」'), r.message)
  r = runAction('unit', 4, '开机并网') // 故障停机 → 运行中：不许跳
  check('故障停机不能开机并网', !r.ok, r.message)
}

console.log('B. 幂等：连续两次开机并网只生效一次')
{
  const before = fleetSnapshot().runningCount
  const r1 = runAction('unit', 2, '开机并网') // 已是运行中 → 幂等
  check('运行中机组重复开机并网不报错也不多算', r1.ok && fleetSnapshot().runningCount === before, r1.message)
  const r2 = runAction('unit', 1, '开机并网') // 待启动 → 运行中
  check('待启动开机并网生效', r2.ok && unit('UNIT-0001').status === '运行中', r2.message)
  check('并网时刻已记录', String(unit('UNIT-0001')['最近并网时刻']).length > 0)
  const r3 = runAction('unit', 1, '开机并网') // 重复登记
  check('重复开机并网幂等，运行台数不多出', r3.ok && fleetSnapshot().runningCount === before + 1, r3.message)
}

console.log('C. 备用机组循环：停机备用 → 转待启动 → 开机并网')
{
  check('转待启动', runAction('unit', 3, '转待启动').ok && unit('UNIT-0003').status === '待启动')
  check('转待启动后可开机并网', runAction('unit', 3, '开机并网').ok && unit('UNIT-0003').status === '运行中')
  check('运行中可停机转备', runAction('unit', 3, '停机转备').ok && unit('UNIT-0003').status === '停机备用')
}

console.log('D. 累计运行小时：按并网时刻累加，停机后不再跳数')
{
  backdateGridMoment('UNIT-0001', 2) // 模拟已并网运行 2 小时
  const r = runAction('unit', 1, '停机转备')
  check('停机转备生效', r.ok && unit('UNIT-0001').status === '停机备用', r.message)
  const hours = Number(unit('UNIT-0001')['累计运行小时'])
  check('累计运行小时按并网时刻累加 2 小时', Math.abs(hours - 2) < 0.2, `实际 ${hours}`)
  const again = runAction('unit', 1, '停机转备') // 已是停机备用 → 幂等
  check('重复停机转备幂等，小时数不再跳', again.ok && Number(unit('UNIT-0001')['累计运行小时']) === hours, again.message)
}

console.log('E. 登记故障：落缺陷清单 + 开工作票，重复登记只认第一次')
{
  const adjustableBefore = fleetSnapshot().adjustableOutput
  const r = runAction('unit', 2, '登记故障') // 运行中 → 故障停机
  check('登记故障生效', r.ok && unit('UNIT-0002').status === '故障停机', r.message)
  check('故障缺陷落到设备缺陷清单', faultDefects('UNIT-0002').length === 1 && faultDefects('UNIT-0002')[0].status === '待处理')
  check('故障机组自动开立待审批工作票', listRows('overhaul').some((t) => t['检修机组'] === 'UNIT-0002' && t.status === '待审批'))
  check('故障停机不计入可调出力', fleetSnapshot().adjustableOutput === adjustableBefore - 160, `${adjustableBefore} → ${fleetSnapshot().adjustableOutput}`)
  const defectCount = listRows('defect').length
  const ticketCount = listRows('overhaul').length
  const again = runAction('unit', 2, '登记故障') // 已是故障停机 → 幂等
  check('重复登记故障幂等', again.ok, again.message)
  check('重复登记不多建缺陷、不多开票', listRows('defect').length === defectCount && listRows('overhaul').length === ticketCount)
}

console.log('F. 检修闭环：开工资格与机组口径一致，完工后故障机组回停机备用')
{
  const ticket = listRows('overhaul').find((t) => t['检修机组'] === 'UNIT-0002' && t.status === '待审批')
  check('故障机组的工作票已开立', Boolean(ticket))
  const id = Number(ticket!.id)
  check('待审批不能开工检修', !runAction('overhaul', id, '开工检修').ok)
  check('提交审批', runAction('overhaul', id, '提交审批').ok)
  check('故障停机机组具备开工资格', runAction('overhaul', id, '开工检修').ok)
  check('开工后关联缺陷转处理中', faultDefects('UNIT-0002')[0].status === '处理中')
  const finish = runAction('overhaul', id, '办理完工')
  check('办理完工', finish.ok, finish.message)
  check('检修闭环后故障机组回停机备用', unit('UNIT-0002').status === '停机备用')
  check('关联缺陷消除归档', faultDefects('UNIT-0002')[0].status === '已消除')
  check('闭环后机组重新计入可调出力', fleetSnapshot().adjustableOutput === 150 + 160 + 150, String(fleetSnapshot().adjustableOutput))
  // 运行中的机组不具备开工资格
  runAction('unit', 3, '转待启动')
  runAction('unit', 3, '开机并网') // UNIT-0003 → 运行中
  const tickets = listRows('overhaul')
  saveRows('overhaul', [...tickets, {
    id: 900, status: '已批准', pending: true, abnormal: false,
    '工作票号': 'OH-2026-900', '检修机组': 'UNIT-0003', '检修级别': 'C级',
    '计划工期': '3天', '实际工期': '', '工作负责人': '王工', '验收人员': '', '检修状态': '已批准',
  }])
  const blocked = runAction('overhaul', 900, '开工检修')
  check('运行中机组不具备开工资格', !blocked.ok && blocked.message.includes('UNIT-0003') && blocked.message.includes('运行中'), blocked.message)
  check('停机转备后具备开工资格', runAction('unit', 3, '停机转备').ok && runAction('overhaul', 900, '开工检修').ok)
}

console.log('G. 缺陷处置：待处理 → 处理中 → 已消除 单向流转，完成即归档')
{
  const r1 = runAction('defect', 1, '确认消除') // 待处理 → 已消除：跳步
  check('待处理不能直接确认消除', !r1.ok && r1.message.includes('停在「待处理」'), r1.message)
  check('派发处理', runAction('defect', 1, '派发处理').ok)
  check('确认消除', runAction('defect', 1, '确认消除').ok)
  const row = listRows('defect').find((d) => Number(d.id) === 1)!
  check('已消除即归档（不再待处理）', row.status === '已消除' && row.pending === false)
  const r2 = runAction('defect', 1, '登记挂账') // 已消除是终点
  check('已消除不能再挂账（单向流转）', !r2.ok, r2.message)
  const r3 = runAction('defect', 3, '派发处理') // 历史已消除缺陷
  check('归档缺陷不能再派发', !r3.ok, r3.message)
}

console.log('H. 备品备件：重复提交只扣一次数量')
{
  const before = Number(listRows('spare').find((s) => Number(s.id) === 2)!['现有数量'])
  check('待验收不能领用', !runAction('spare', 1, '领用备件').ok)
  const r1 = runAction('spare', 2, '领用备件')
  const after1 = Number(listRows('spare').find((s) => Number(s.id) === 2)!['现有数量'])
  check('领用备件扣减一次', r1.ok && after1 === before - 1, `${before} → ${after1}`)
  const r2 = runAction('spare', 2, '领用备件') // 已是已领用 → 幂等
  const after2 = Number(listRows('spare').find((s) => Number(s.id) === 2)!['现有数量'])
  check('反复触发不会多扣', r2.ok && after2 === after1, r2.message)
  // 库存为 0 不许再领
  const spares = listRows('spare').map((s) => (Number(s.id) === 1 ? { ...s, status: '已登记', 现有数量: 0 } : s))
  saveRows('spare', spares)
  const r3 = runAction('spare', 1, '领用备件')
  check('库存为 0 不能领用', !r3.ok, r3.message)
}

console.log('I. 口径一致：概览与列表条数对得上，统计卡现算')
{
  const overview = loadOverview()
  let consistent = true
  for (const mod of overview.modules) {
    const key = MODULES.find((item) => item.name === mod.name)?.key
    if (!key || mod.created !== listEntries(key).total) consistent = false
  }
  check('概览各模块登记总量与列表条数一致', consistent)
  const unitOverview = overview.modules.find((m) => m.name === '机组运行')!
  const expectPending = listRows('unit').filter((u) => u.status === '待启动' || u.status === '故障停机').length
  check('概览待处理与机组状态口径一致', unitOverview.pending === expectPending, `${unitOverview.pending} vs ${expectPending}`)
  const stats = computeStats('unit')
  const fleet = fleetSnapshot()
  check('机组统计卡与舰队口径一致',
    stats.find((s) => s.label === '运行中机组')?.value === fleet.runningCount &&
    stats.find((s) => s.label === '备用容量')?.value === fleet.standbyCapacity)
  const genStats = computeStats('generation')
  check('发电计划可调出力与机组页同一份', genStats.find((s) => s.label === '可调出力')?.value === fleet.adjustableOutput)
}

console.log('J. 旧数据迁移：状态不改写，缺项按规则补记并写明来源')
{
  const legacy: EntryRow[] = [
    { id: 1, status: '运行中', pending: true, abnormal: true, 机组编号: 'UNIT-9001', 累计运行小时: '机组运行样例1', 运行状态: '机组运行样例1' },
    { id: 2, status: '待启动', pending: true, abnormal: false, 机组编号: 'UNIT-9002', 累计运行小时: 0, 运行状态: '机组运行样例2' },
    { id: 3, status: '故障停机', pending: false, abnormal: false, 机组编号: 'UNIT-9003', 累计运行小时: 720, 运行状态: '机组运行样例3' },
  ]
  const migrated = normalizeModule('unit', legacy)
  const running = migrated[0]
  check('运行中老机组补记并网时刻并写明来源', String(running['最近并网时刻']).length > 0 && String(running['数据来源']).includes('迁移回填'))
  check('无法识别的累计运行小时按 0 起算', running['累计运行小时'] === 0)
  check('状态列与 status 同步成一份', running['运行状态'] === '运行中')
  check('异常标记按状态重算（运行中不异常）', running.abnormal === false)
  const standby = migrated[1]
  check('待启动机组不补起停时刻，只标注来源', standby['最近并网时刻'] === '' && String(standby['数据来源']).includes('历史台账'))
  const faulted = migrated[2]
  check('故障停机老机组补记停机时刻', String(faulted['最近停机时刻']).length > 0)
  check('数值型累计运行小时保留', faulted['累计运行小时'] === 720)
  check('故障停机重算为待处理+异常', faulted.pending === true && faulted.abnormal === true)
  const twice = normalizeModule('unit', migrated)
  check('迁移幂等，再跑一次结果不变', JSON.stringify(twice) === JSON.stringify(migrated))

  const legacyDefects: EntryRow[] = [
    { id: 1, status: '处理中', pending: true, abnormal: false, 缺陷编号: 'DEFE-9001', 缺陷等级: '缺陷处置样例1', 缺陷状态: 'junk' },
  ]
  const migratedDefects = normalizeModule('defect', legacyDefects)
  check('老缺陷补来源', migratedDefects[0]['来源'] === '历史台账')
  check('既有缺陷等级不改写', migratedDefects[0]['缺陷等级'] === '缺陷处置样例1')
  check('老缺陷状态列同步', migratedDefects[0]['缺陷状态'] === '处理中')

  const all = migrateAll({ unit: legacy, defect: legacyDefects })
  check('整库迁移覆盖全部模块', Object.keys(all).length === 19)
}

console.log('K. 模块元数据自洽：动作有目标、目标在状态表、来源可到达')
{
  let metaOk = true
  for (const meta of MODULES) {
    for (const action of meta.actions) {
      const target = meta.actionTargets[action]
      if (!target || !meta.statuses.includes(target)) metaOk = false
      if (allowedSourcesFor(meta, action).length === 0) metaOk = false
    }
    for (const settled of meta.settledStatuses) {
      if (!meta.statuses.includes(settled)) metaOk = false
    }
  }
  check('全部模块的动作/目标/来源/办结状态自洽', metaOk)
}

console.log(`\n结果：${passed} 通过，${failed} 失败`)
if (failed > 0) {
  process.exit(1)
}
