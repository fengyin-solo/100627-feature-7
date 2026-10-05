import { migrateAll, normalizeModule, STORAGE_VERSION } from './migrate'
import { SEED_ROWS } from './seed'
import type { EntryRow } from './types'

// 本地持久化：数据放在 localStorage 里，刷新、关掉再打开都还在。
// 结构升级靠 STORAGE_VERSION：旧版本数据首次读取时原地迁移一次并写回，历史记录不清空。
const STORAGE_KEY = 'hydropower-plant-om:entries'
const VERSION_KEY = 'hydropower-plant-om:version'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function seededRows(): Record<string, EntryRow[]> {
  return migrateAll(clone(SEED_ROWS))
}

function hasWindow(): boolean {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function persist(rows: Record<string, EntryRow[]>): void {
  if (!hasWindow()) {
    return
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
  window.localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION))
}

function readStorage(): Record<string, EntryRow[]> {
  const fallback = seededRows()
  if (!hasWindow()) {
    return fallback
  }
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    persist(fallback)
    return fallback
  }
  try {
    const parsed = JSON.parse(raw) as Record<string, EntryRow[]>
    const version = Number(window.localStorage.getItem(VERSION_KEY) ?? '1')
    let merged = { ...fallback, ...parsed }
    if (version < STORAGE_VERSION) {
      merged = migrateAll(merged)
      persist(merged)
    }
    return merged
  } catch {
    persist(fallback)
    return fallback
  }
}

let cache: Record<string, EntryRow[]> | null = null

export function allRows(): Record<string, EntryRow[]> {
  if (cache === null) {
    cache = readStorage()
  }
  return cache
}

export function listRows(key: string): EntryRow[] {
  return allRows()[key] ?? []
}

export function saveRows(key: string, rows: EntryRow[]): void {
  const next = { ...allRows(), [key]: rows }
  cache = next
  persist(next)
}

export function resetRows(key: string): EntryRow[] {
  const rows = normalizeModule(key, clone(SEED_ROWS[key] ?? []))
  saveRows(key, rows)
  return rows
}

export function storageKey(): string {
  return STORAGE_KEY
}
