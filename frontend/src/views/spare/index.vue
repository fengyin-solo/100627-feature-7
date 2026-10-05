<template>
  <section class="page" data-module="spare">
    <header class="page-head">
      <div>
        <h2>备品备件管理</h2>
        <p class="page-desc">
          待验收→已登记→已领用→（库存不足时）待补充。领用一次固定扣一件并计入累计领用，重复提交因状态已推进被退回，不会多扣。
        </p>
      </div>
      <div class="page-actions">
        <button class="btn" type="button" @click="exportRows">导出备品备件清单</button>
      </div>
    </header>

    <div class="stat-row">
      <article class="stat-card">
        <span class="stat-label">在库备件种类</span>
        <strong class="stat-value">{{ metrics.inStockKinds }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">库存总量（件）</span>
        <strong class="stat-value">{{ metrics.totalStock }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">已领用（种）</span>
        <strong class="stat-value">{{ metrics.issuedKinds }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">待补充（种）</span>
        <strong class="stat-value" :class="{ 'stat-warn': metrics.reorderKinds > 0 }">{{ metrics.reorderKinds }}</strong>
      </article>
    </div>

    <p class="status-legend">
      <span v-for="item in statusSummary" :key="item.status" class="legend-item">
        {{ item.status }}：{{ item.count }}
      </span>
    </p>

    <form class="filter-bar" @submit.prevent="reload">
      <label class="filter-item">
        <span>备件编号/名称</span>
        <input v-model="keyword" placeholder="按备件编号或名称检索" />
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
          <td><span :class="['status-tag', spareStatusClass(row.status)]">{{ row.status }}</span></td>
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
          <td :colspan="columns.length + 2" class="empty-state">暂无备品备件数据</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条备件记录，与列表条数一致</span>
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
  loadSpareMetrics,
  moduleMeta,
  runAction as applyAction,
} from '@/api/local-service'
import type { EntryRow } from '@/data/types'

const meta = moduleMeta('spare')
const columns = ['备件编号', '备件名称', '规格型号', '适用设备', '存放位置', '现有数量', '最低储备量', '累计领用']
const actions = ['办理验收', '领用备件', '提交补充']

const rows = ref<EntryRow[]>([])
const total = ref(0)
const errorMessage = ref('')
const okMessage = ref('')
const keyword = ref('')

const metrics = computed(() => loadSpareMetrics())

const statusSummary = computed(() =>
  ['待验收', '已登记', '已领用', '待补充'].map((status: string) => ({
    status,
    count: rows.value.filter((row) => String(row.status) === status).length,
  })),
)

function spareStatusClass(status: string): string {
  if (status === '已登记') return 'tag-standby'
  if (status === '已领用') return 'tag-running'
  if (status === '待补充') return 'tag-fault'
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
  rows.value = word
    ? all.filter(
        (row) =>
          String(row['备件编号'] ?? '').includes(word) || String(row['备件名称'] ?? '').includes(word),
      )
    : all
  total.value = listEntries(meta.key).total
}

onMounted(reload)
</script>
