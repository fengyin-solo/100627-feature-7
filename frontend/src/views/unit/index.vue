<template>
  <section class="page" data-module="unit">
    <header class="page-head">
      <div>
        <h2>机组运行管理</h2>
        <p class="page-desc">
          状态推进一条链：待启动→运行中→停机备用；运行中登记故障后须走完检修闭环才能回停机备用。所有口径（台数、可调出力、备用容量、振动）同源同算。
        </p>
      </div>
      <div class="page-actions">
        <button class="btn" type="button" @click="exportRows">导出机组运行清单</button>
      </div>
    </header>

    <div class="stat-row">
      <article class="stat-card">
        <span class="stat-label">运行中机组（台）</span>
        <strong class="stat-value">{{ metrics.runningCount }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">可调出力（MW）</span>
        <strong class="stat-value">{{ metrics.adjustableMw }}</strong>
        <span class="stat-note">故障停机不计入，与发电计划页同源</span>
      </article>
      <article class="stat-card">
        <span class="stat-label">备用容量（MW）</span>
        <strong class="stat-value">{{ metrics.standbyMw }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">故障机组（台）</span>
        <strong class="stat-value" :class="{ 'stat-warn': metrics.faultCount > 0 }">{{ metrics.faultCount }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">运行机组最大振动（mm）</span>
        <strong class="stat-value" :class="{ 'stat-warn': metrics.maxVibration >= 0.12 }">{{ metrics.maxVibration }}</strong>
        <span class="stat-note">只统计运行中机组，停机不读数</span>
      </article>
    </div>

    <p class="status-legend">
      <span v-for="item in statusSummary" :key="item.status" class="legend-item">
        {{ item.status }}：{{ item.count }}
      </span>
    </p>

    <form class="filter-bar" @submit.prevent="reload">
      <label class="filter-item">
        <span>机组编号</span>
        <input v-model="keyword" placeholder="按机组编号检索" />
      </label>
      <button class="btn" type="submit">查询</button>
      <button class="btn ghost" type="button" @click="keyword = ''; reload()">重置条件</button>
    </form>

    <table class="data-table">
      <thead>
        <tr>
          <th>机组编号</th>
          <th>机组型号</th>
          <th>额定转速(r/min)</th>
          <th>有功出力(MW)</th>
          <th>累计运行小时(h)</th>
          <th>振动(mm)</th>
          <th>并网时刻</th>
          <th>停机时刻</th>
          <th>检修票/缺陷</th>
          <th>当前状态</th>
          <th>可执行动作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="String(row.id)">
          <td>{{ row['机组编号'] }}</td>
          <td>{{ row['机组型号'] }}</td>
          <td>{{ row['额定转速'] }}</td>
          <td>{{ row['有功出力'] }}</td>
          <td>{{ liveHours(row) }}</td>
          <td>{{ row.status === '运行中' ? row['振动数值'] : '0（停机不读数）' }}</td>
          <td>{{ formatDateTime(String(row['并网时刻'] ?? '')) }}</td>
          <td>{{ formatDateTime(String(row['停机时刻'] ?? '')) }}</td>
          <td>
            <button class="link" type="button" @click="openLinks(row)">
              票{{ linksOf(row).ticket ? 1 : 0 }} · 缺陷{{ linksOf(row).defects.length }}
            </button>
          </td>
          <td>
            <span :class="['status-tag', statusClass(row.status)]">{{ row.status }}</span>
          </td>
          <td class="row-actions">
            <button
              v-for="action in actions"
              :key="action"
              class="link"
              type="button"
              @click="runAction(action, row)"
            >
              {{ action }}
            </button>
            <button class="link" type="button" @click="openLedger(row)">台账</button>
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td colspan="11" class="empty-state">暂无机组运行数据</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 台机组，与列表条数一致</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
      <span v-else-if="okMessage" class="ok-text">{{ okMessage }}</span>
    </footer>

    <div v-if="ledgerTarget" class="modal-mask" @click.self="ledgerTarget = null">
      <div class="modal">
        <h3>{{ ledgerTarget['机组编号'] }} 状态台账</h3>
        <p class="page-desc">历史状态按并网时间回填；迁移补录的事件会注明缺项来源。</p>
        <table class="data-table">
          <thead>
            <tr><th>时间</th><th>动作</th><th>流转</th><th>来源</th><th>备注</th></tr>
          </thead>
          <tbody>
            <tr v-for="(event, idx) in ledgerEvents(ledgerTarget)" :key="idx">
              <td>{{ formatDateTime(event.at) }}</td>
              <td>{{ event.action }}</td>
              <td>{{ event.from }} → {{ event.to }}</td>
              <td>{{ event.source }}</td>
              <td>{{ event.note ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="modal-foot">
          <button class="btn" type="button" @click="ledgerTarget = null">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="linksTarget" class="modal-mask" @click.self="linksTarget = null">
      <div class="modal">
        <h3>{{ linksTarget['机组编号'] }} 检修票与缺陷</h3>
        <p class="page-desc">从机组检修、缺陷处置模块实时读取，三个页面是同一份数据。</p>
        <h4>最新检修票</h4>
        <table v-if="linksOf(linksTarget).ticket" class="data-table">
          <tbody>
            <tr><th>工作票号</th><td>{{ linksOf(linksTarget).ticket!['工作票号'] }}</td></tr>
            <tr><th>检修级别</th><td>{{ linksOf(linksTarget).ticket!['检修级别'] }}</td></tr>
            <tr><th>状态</th><td>{{ linksOf(linksTarget).ticket!.status }}</td></tr>
            <tr>
              <th>开工资格</th>
              <td>{{ overhaulEligibility(linksTarget) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="page-desc">暂无检修票。</p>
        <h4>关联缺陷（{{ linksOf(linksTarget).defects.length }} 条，与缺陷处置页同一份）</h4>
        <table class="data-table">
          <thead>
            <tr><th>缺陷编号</th><th>描述</th><th>等级</th><th>状态</th><th>来源</th></tr>
          </thead>
          <tbody>
            <tr v-for="defect in linksOf(linksTarget).defects" :key="String(defect.id)">
              <td>{{ defect['缺陷编号'] }}</td>
              <td>{{ defect['缺陷描述'] }}</td>
              <td>{{ defect['缺陷等级'] }}</td>
              <td>{{ defect.status }}</td>
              <td>{{ defect['来源'] }}</td>
            </tr>
            <tr v-if="!linksOf(linksTarget).defects.length">
              <td colspan="5" class="empty-state">暂无关联缺陷</td>
            </tr>
          </tbody>
        </table>
        <div class="modal-foot">
          <button class="btn" type="button" @click="linksTarget = null">关闭</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import {
  downloadEntries,
  listEntries,
  loadUnitLinks,
  loadUnitMetrics,
  moduleMeta,
  runAction as applyAction,
  runningHours,
} from '@/api/local-service'
import type { EntryRow, LedgerEvent } from '@/data/types'
import { ledgerOf } from '@/domain/ledger'
import { formatDateTime, nowIso } from '@/domain/clock'

const meta = moduleMeta('unit')
const actions = ['开机并网', '停机转备', '登记故障', '恢复待启动']
const statuses = ['待启动', '运行中', '停机备用', '故障停机']

const rows = ref<EntryRow[]>([])
const total = ref(0)
const errorMessage = ref('')
const okMessage = ref('')
const keyword = ref('')
const tickAt = ref(nowIso())
const ledgerTarget = ref<EntryRow | null>(null)
const linksTarget = ref<EntryRow | null>(null)
let timer: number | undefined

const metrics = computed(() => loadUnitMetrics(tickAt.value))

const statusSummary = computed(() =>
  statuses.map((status: string) => ({
    status,
    count: rows.value.filter((row) => String(row.status) === status).length,
  })),
)

function liveHours(row: EntryRow): number {
  return runningHours(row, tickAt.value)
}

function ledgerEvents(row: EntryRow): LedgerEvent[] {
  return ledgerOf(row)
}

const linkCache = new Map<number, ReturnType<typeof loadUnitLinks>>()
function linksOf(row: EntryRow) {
  const cached = linkCache.get(Number(row.id))
  if (cached) {
    return cached
  }
  const loaded = loadUnitLinks(String(row['机组编号'] ?? ''))
  linkCache.set(Number(row.id), loaded)
  return loaded
}

function overhaulEligibility(row: EntryRow): string {
  const links = linksOf(row)
  if (!links.ticket) {
    return '无检修票'
  }
  if (links.ticket.status !== '已批准') {
    return `票处于「${links.ticket.status}」，尚未批准，不能开工`
  }
  if (row.status === '故障停机' || row.status === '停机备用') {
    return '已批准，机组已停运，具备开工资格'
  }
  return `已批准，但机组停在「${row.status}」，不具备开工资格`
}

function statusClass(status: string): string {
  if (status === '运行中') return 'tag-running'
  if (status === '故障停机') return 'tag-fault'
  if (status === '停机备用') return 'tag-standby'
  return 'tag-ready'
}

function exportRows() {
  downloadEntries(meta.key)
}

function runAction(action: string, row: EntryRow) {
  errorMessage.value = ''
  okMessage.value = ''
  const result = applyAction(meta.key, Number(row.id), action)
  if (!result.ok) {
    errorMessage.value = result.message
    return
  }
  okMessage.value = result.message
  linkCache.clear()
  reload()
}

function openLedger(row: EntryRow) {
  ledgerTarget.value = row
}

function openLinks(row: EntryRow) {
  linksTarget.value = row
}

function reload() {
  const payload = listEntries(
    meta.key,
    keyword.value.trim() ? { 机组编号: keyword.value.trim() } : {},
  )
  rows.value = payload.items
  total.value = payload.total
  linkCache.clear()
}

onMounted(() => {
  reload()
  // 运行小时按并网时刻实时累加，10 秒刷新一次读数；停机的机组读结算值，数字不动。
  timer = window.setInterval(() => {
    tickAt.value = nowIso()
  }, 10_000)
})

onBeforeUnmount(() => {
  if (timer) {
    window.clearInterval(timer)
  }
})
</script>
