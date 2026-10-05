// 旧版 v1 数据迁移校验的前置桩：构造无版本号的旧结构 localStorage。
const mem = new Map()
mem.set(
  'hydropower-plant-om:entries',
  JSON.stringify({
    unit: [
      { id: 1, status: '运行中', pending: true, abnormal: true, '机组编号': 'UNIT-0001', '累计运行小时': '机组运行样例1', '振动数值': '坏数据', '有功出力': '机组运行样例1' },
      { id: 2, status: '故障停机', pending: false, abnormal: true, '机组编号': 'UNIT-0009', '累计运行小时': 3, '有功出力': 60 },
    ],
    defect: [
      { id: 1, status: '已消除', pending: false, abnormal: false, '缺陷编号': 'D1', '设备名称': 'X', '缺陷描述': 'Y', '缺陷等级': '特急(自定义)', '发现日期': '2026-09-01' },
      { id: 2, status: '已挂账', pending: false, abnormal: false, '缺陷编号': 'D2', '设备名称': 'Z', '缺陷描述': 'Q', '缺陷等级': '一般', '发现日期': '2026-09-02' },
    ],
    overhaul: [
      { id: 1, status: '检修中', pending: false, abnormal: false, '工作票号': 'W1', '检修机组': 'UNIT-0009' },
      { id: 2, status: '已批准', pending: true, abnormal: false, '工作票号': 'W2', '检修机组': '不是编号的文本' },
    ],
    spare: [{ id: 1, status: '已领用', pending: false, abnormal: false, '备件编号': 'S1', '现有数量': 8, '备件状态': '已领用' }],
  }),
)
globalThis.window = {
  localStorage: {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, v),
    removeItem: (k) => mem.delete(k),
  },
}
