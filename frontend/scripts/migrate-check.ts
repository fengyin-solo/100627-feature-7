// 旧版 v1 数据迁移校验：前置 banner 注入旧结构 localStorage，再加载新版业务代码。
import { allRows } from '../src/data/local-store'
import { loadAdjustableCapacity, runAction } from '../src/api/local-service'

let failures = 0
function check(name: string, cond: boolean, extra = '') {
  console.log(cond ? `PASS ${name}` : `FAIL ${name} ${extra}`)
  if (!cond) failures += 1
}

const rows = allRows()
const u1 = rows.unit.find((r) => r['机组编号'] === 'UNIT-0001')!
const u9 = rows.unit.find((r) => r['机组编号'] === 'UNIT-0009')!

check('脏文本数值归零', Number(u1['累计运行小时']) === 0 && Number(u1['有功出力']) === 0)
check('运行中旧机回填并网时刻', typeof u1['并网时刻'] === 'string' && u1['并网时刻']!.startsWith('2026-10-05'))
check('回填台账标注迁移来源', (u1['台账'] as any[]).some((e) => e.source === '迁移补录'))
check('故障旧机回填故障事件', (u9['台账'] as any[]).some((e) => e.to === '故障停机'))
check('故障旧机自动补检修票', rows.overhaul.some((t) => t['关联机组'] === 'UNIT-0009' && t.status === '待审批'))

const d1 = rows.defect.find((r) => r['缺陷编号'] === 'D1')!
const d2 = rows.defect.find((r) => r['缺陷编号'] === 'D2')!
check('已消除映射为已完成', d1.status === '已完成')
check('已挂账映射为处理中', d2.status === '处理中')
check('自定义等级保留不改写', d1['缺陷等级'] === '特急(自定义)')
check('缺陷补录带来源', String(d1['来源']).includes('迁移补录'))
check('挂账缺陷仍可继续流转', runAction('defect', Number(d2.id), '确认消除').ok)

const w2 = rows.overhaul.find((r) => r['工作票号'] === 'W2')!
check('旧检修字段非编号不强行关联', w2['关联机组'] === '')
const w1 = rows.overhaul.find((r) => r['工作票号'] === 'W1')!
check('旧检修字段是编号则升级关联', w1['关联机组'] === 'UNIT-0009')
check('未关联机组不能开工', !runAction('overhaul', Number(w2.id), '开工检修').ok)

const s1 = rows.spare.find((r) => r['备件编号'] === 'S1')!
check('备件累计领用补保守值', Number(s1['累计领用']) === 1)
check('旧备件状态字段已清理', s1['备件状态'] === undefined)

// 故障机闭环路径在迁移数据上同样成立
const cap = loadAdjustableCapacity()
check('旧故障机不计入可调出力', !cap.excluded.every((e) => e.code !== 'UNIT-0009') && cap.faultCount === 1)

// 存储已升级为 v2 结构
const persisted = JSON.parse((globalThis as any).window.localStorage.getItem('hydropower-plant-om:entries'))
check('存储结构带版本号 v2', persisted.version === 2 && !!persisted.rows)

console.log(failures === 0 ? '\n迁移校验全部通过' : `\n${failures} 项失败`)
process.exit(failures === 0 ? 0 : 1)
