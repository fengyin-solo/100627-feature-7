/** 统一时钟：所有状态时刻、运行小时都从这里取，测试/回填时可改。 */

export function nowIso(): string {
  // 截取到秒，避免台账里出现毫秒噪声。
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/** ISO/任意可解析时间 -> 'YYYY-MM-DD HH:mm:ss'（本地时区展示）。 */
export function formatDateTime(iso: string): string {
  if (!iso) {
    return '—'
  }
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  )
}

export function formatDate(iso: string): string {
  return formatDateTime(iso).slice(0, 10)
}

/** 两个 ISO 时刻之间的小时数（from <= to 才有意义，否则 0）。 */
export function hoursBetween(fromIso: string, toIso: string): number {
  if (!fromIso || !toIso) {
    return 0
  }
  const from = new Date(fromIso).getTime()
  const to = new Date(toIso).getTime()
  if (Number.isNaN(from) || Number.isNaN(to) || to <= from) {
    return 0
  }
  return Math.round(((to - from) / 3_600_000) * 100) / 100
}

/** 数值口径：页面上所有求和/取最大都走这里，历史脏文本一律按 0 参与统计。 */
export function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}
