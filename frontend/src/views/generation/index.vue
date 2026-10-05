<template>
  <section class="page" data-module="generation">
    <header class="page-head">
      <div>
        <h2>发电计划管理</h2>
        <p class="page-desc">
          待编制→已下达→执行中→已完成，按序推进。可调出力实时读取机组运行页同一份口径：故障停机机组不计入，机组状态一变这里立刻跟着变。
        </p>
      </div>
      <div class="page-actions">
        <button class="btn" type="button" @click="exportRows">导出发电计划清单</button>
      </div>
    </header>

    <div class="stat-row">
      <article class="stat-card">
        <span class="stat-label">可调出力（MW，取自机组运行页）</span>
        <strong class="stat-value">{{ capacity.totalMw }}</strong>
        <span class="stat-note">
          运行 {{ capacity.runningCount }} 台 · 备用 {{ capacity.standbyCount }} 台 ·
          待启动 {{ capacity.readyCount }} 台 · 故障剔除 {{ capacity.faultCount }} 台
        </span>
      </article>
      <article class="stat-card">
        <span class="stat-label">计划出力合计（MW）</span>
        <strong class="stat-value" :class="{ 'stat-warn': planTotal > capacity.totalMw }">{{ planTotal }}</strong>
        <span v-if="planTotal > capacity.totalMw" class="stat-note warn-text">计划已超当前可调出力</span>
      </article>
      <article class="stat-card">
        <span class="stat-label">执行中计划（条）</span>
        <strong class="stat-value">{{ executingCount }}</strong>
      </article>
    </div>

    <ul v-if="capacity.excluded.length" class="exclude-list">
      <li v-for="item in capacity.excluded" :key="item.code" class="warn-text">
        {{ item.code }}：{{ item.reason }}
      </li>
    </ul>

    <p class="status-legend">
      <span v-for="item in statusSummary" :key="item.status" class="legend-item">
        {{ item.status }}：{{ item.count }}
      </span>
    </p>

    <form class="filter-bar" @submit.prevent="reload">
      <label class="filter-item">
        <span>计划编号</span>
        <input v-model="keyword" placeholder="按计划编号检索" />
      </label>
      <button class="btn" type="submit">查询</button>
      <button class="btn ghost" type="button" @click="keyword = ''; reload()">重置条件</button>
    </form>

    <table class="data-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column">{{ column }}</th>
          <th>当前状态</th>
          <th>可执行动作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="String(row.id)">
          <td v-for="column in columns" :key="column">{{ row[column] ?? '—' }}</td>
          <td><span :class="['status-tag', generationStatusClass(row.status)]">{{ row.status }}</span></td>
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
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td :colspan="columns.length + 2" class="empty-state">暂无发电计划数据</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条发电计划记录，与列表条数一致</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
      <span v-else-if="okMessage" class="ok-text">{{ okMessage }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import {
  downloadEntries,
  listEntries,
  loadAdjustableCapacity,
  moduleMeta,
  runAction as applyAction,
} from '@/api/local-service'
import type { EntryRow } from '@/data/types'
import { toNumber } from '@/domain/clock'

const meta = moduleMeta('generation')
const columns = ['计划编号', '计划日期', '计划出力', '实际出力', '日发电量', '上网电量', '完成比率', '计划状态']
const actions = ['提交编制', '下达计划', '确认完成']

const rows = ref<EntryRow[]>([])
const total = ref(0)
const errorMessage = ref('')
const okMessage = ref('')
const keyword = ref('')

const capacity = computed(() => loadAdjustableCapacity())
const planTotal = computed(() =>
  listEntries(meta.key).items.reduce((sum, row) => sum + toNumber(row['计划出力']), 0),
)
const executingCount = computed(
  () => listEntries(meta.key).items.filter((row) => row.status === '执行中').length,
)

const statusSummary = computed(() =>
  ['待编制', '已下达', '执行中', '已完成'].map((status: string) => ({
    status,
    count: rows.value.filter((row) => String(row.status) === status).length,
  })),
)

function generationStatusClass(status: string): string {
  if (status === '执行中') return 'tag-running'
  if (status === '已完成') return 'tag-archived'
  if (status === '已下达') return 'tag-standby'
  return 'tag-ready'
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
  reload()
}

function exportRows() {
  downloadEntries(meta.key)
}

function reload() {
  const all = listEntries(meta.key).items
  const word = keyword.value.trim()
  rows.value = word ? all.filter((row) => String(row['计划编号'] ?? '').includes(word)) : all
  total.value = listEntries(meta.key).total
}

onMounted(reload)
</script>
