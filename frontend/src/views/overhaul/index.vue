<template>
  <section class="page" data-module="overhaul">
    <header class="page-head">
      <div>
        <h2>机组检修管理</h2>
        <p class="page-desc">
          待审批→已批准→检修中→已完工，按序推进。开工资格与机组运行页同源：只有停机备用/故障停机的机组可开工；故障机完工验收后自动闭环回停机备用。
        </p>
      </div>
      <div class="page-actions">
        <button class="btn" type="button" @click="exportRows">导出机组检修清单</button>
      </div>
    </header>

    <div class="stat-row">
      <article class="stat-card">
        <span class="stat-label">待审批工作票</span>
        <strong class="stat-value">{{ summary['待审批'] }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">已批准（含待开工资格）</span>
        <strong class="stat-value">{{ summary['已批准'] }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">检修中</span>
        <strong class="stat-value">{{ summary['检修中'] }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">已完工</span>
        <strong class="stat-value">{{ summary['已完工'] }}</strong>
      </article>
    </div>

    <form class="filter-bar" @submit.prevent="reload">
      <label class="filter-item">
        <span>工作票号/机组编号</span>
        <input v-model="keyword" placeholder="按票号或机组编号检索" />
      </label>
      <button class="btn" type="submit">查询</button>
      <button class="btn ghost" type="button" @click="keyword = ''; reload()">重置条件</button>
    </form>

    <table class="data-table">
      <thead>
        <tr>
          <th>工作票号</th>
          <th>关联机组</th>
          <th>机组当前状态</th>
          <th>检修级别</th>
          <th>计划工期</th>
          <th>实际工期</th>
          <th>工作负责人</th>
          <th>验收人员</th>
          <th>当前状态</th>
          <th>开工资格</th>
          <th>可执行动作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="String(row.id)">
          <td>{{ row['工作票号'] }}</td>
          <td>{{ row['关联机组'] || '未关联' }}</td>
          <td>{{ unitStatus(row) }}</td>
          <td>{{ row['检修级别'] }}</td>
          <td>{{ row['计划工期'] || '—' }}</td>
          <td>{{ row['实际工期'] || '—' }}</td>
          <td>{{ row['工作负责人'] || '—' }}</td>
          <td>{{ row['验收人员'] || '—' }}</td>
          <td><span :class="['status-tag', overhaulStatusClass(row.status)]">{{ row.status }}</span></td>
          <td>{{ eligibility(row) }}</td>
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
          <td colspan="11" class="empty-state">暂无机组检修数据</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 张检修工作票，与列表条数一致</span>
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
  moduleMeta,
  runAction as applyAction,
} from '@/api/local-service'
import type { EntryRow } from '@/data/types'

const meta = moduleMeta('overhaul')
const actions = ['提交审批', '开工检修', '办理完工']

const rows = ref<EntryRow[]>([])
const total = ref(0)
const errorMessage = ref('')
const okMessage = ref('')
const keyword = ref('')

const unitMap = computed(() => {
  const map = new Map<string, EntryRow>()
  for (const unit of listEntries('unit').items) {
    map.set(String(unit['机组编号'] ?? ''), unit)
  }
  return map
})

const summary = computed<Record<string, number>>(() => {
  const result: Record<string, number> = { 待审批: 0, 已批准: 0, 检修中: 0, 已完工: 0 }
  for (const row of listEntries(meta.key).items) {
    result[row.status] = (result[row.status] ?? 0) + 1
  }
  return result
})

function unitStatus(row: EntryRow): string {
  const code = String(row['关联机组'] ?? '')
  if (!code) {
    return '未关联机组'
  }
  return unitMap.value.get(code)?.status ?? '机组不存在'
}

function eligibility(row: EntryRow): string {
  if (row.status !== '已批准') {
    return '—（未到开工环节）'
  }
  const code = String(row['关联机组'] ?? '')
  if (!code) {
    return '无：未关联机组'
  }
  const unit = unitMap.value.get(code)
  if (!unit) {
    return '无：关联机组不在册'
  }
  if (unit.status === '停机备用' || unit.status === '故障停机') {
    return '具备（机组已停运）'
  }
  return `无：机组停在「${unit.status}」`
}

function overhaulStatusClass(status: string): string {
  if (status === '检修中') return 'tag-running'
  if (status === '已完工') return 'tag-archived'
  if (status === '已批准') return 'tag-standby'
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
          String(row['工作票号'] ?? '').includes(word) ||
          String(row['关联机组'] ?? '').includes(word),
      )
    : all
  total.value = listEntries(meta.key).total
}

onMounted(reload)
</script>
