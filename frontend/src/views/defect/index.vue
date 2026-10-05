<template>
  <section class="page" data-module="defect">
    <header class="page-head">
      <div>
        <h2>缺陷处置管理</h2>
        <p class="page-desc">
          待处理→处理中→已完成→已归档，单向流转不回头。机组登记故障自动登记的缺陷与人工登记同一张清单；重复登记只认第一次入库的取值。
        </p>
      </div>
      <div class="page-actions">
        <button class="btn primary" type="button" @click="openCreate">登记设备缺陷</button>
        <button class="btn" type="button" @click="exportRows">导出缺陷处置清单</button>
      </div>
    </header>

    <div class="stat-row">
      <article v-for="item in statCards" :key="item.label" class="stat-card">
        <span class="stat-label">{{ item.label }}</span>
        <strong class="stat-value">{{ item.value }}</strong>
      </article>
    </div>

    <p class="status-legend">
      <span v-for="item in statusSummary" :key="item.status" class="legend-item">
        {{ item.status }}：{{ item.count }}
      </span>
      <span class="legend-item">合计：{{ total }}</span>
    </p>

    <form class="filter-bar" @submit.prevent="reload">
      <label class="filter-item">
        <span>设备名称/编号</span>
        <input v-model="keyword" placeholder="按设备名称或缺陷编号检索" />
      </label>
      <button class="btn" type="submit">查询</button>
      <button class="btn ghost" type="button" @click="keyword = ''; reload()">重置条件</button>
    </form>

    <table class="data-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column">{{ column }}</th>
          <th>当前状态</th>
          <th>台账</th>
          <th>可执行动作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="String(row.id)">
          <td v-for="column in columns" :key="column">{{ row[column] ?? '—' }}</td>
          <td><span :class="['status-tag', defectStatusClass(row.status)]">{{ row.status }}</span></td>
          <td><button class="link" type="button" @click="openLedger(row)">查看</button></td>
          <td class="row-actions">
            <button
              v-for="action in availableActions(row.status)"
              :key="action"
              class="link"
              type="button"
              @click="runAction(action, row)"
            >
              {{ action }}
            </button>
            <span v-if="!availableActions(row.status).length" class="muted-text">已归档（终态）</span>
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td :colspan="columns.length + 3" class="empty-state">暂无缺陷处置数据，可先登记设备缺陷</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条缺陷记录（含已归档），与概览页条数一致</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
      <span v-else-if="okMessage" class="ok-text">{{ okMessage }}</span>
    </footer>

    <div v-if="showCreate" class="modal-mask" @click.self="showCreate = false">
      <div class="modal">
        <h3>登记设备缺陷</h3>
        <form class="form-grid" @submit.prevent="submitCreate">
          <label>
            <span>缺陷编号（可空，自动生成）</span>
            <input v-model="form.缺陷编号" placeholder="如 DEFE-20261005-0005" />
          </label>
          <label>
            <span>设备名称 *</span>
            <input v-model="form.设备名称" list="unit-code-list" placeholder="如 UNIT-0004 水轮发电机组" required />
            <datalist id="unit-code-list">
              <option v-for="code in unitCodes" :key="code" :value="`${code} 水轮发电机组`"></option>
            </datalist>
          </label>
          <label class="span-2">
            <span>缺陷描述 *</span>
            <input v-model="form.缺陷描述" required placeholder="同一设备同一天相同描述视为重复登记" />
          </label>
          <label>
            <span>缺陷等级 *</span>
            <select v-model="form.缺陷等级" required>
              <option v-for="level in defectLevels" :key="level" :value="level">{{ level }}</option>
            </select>
          </label>
          <label>
            <span>发现日期 *</span>
            <input v-model="form.发现日期" type="date" required />
          </label>
          <label>
            <span>处理期限</span>
            <input v-model="form.处理期限" type="date" />
          </label>
          <label>
            <span>处理人员</span>
            <input v-model="form.处理人员" />
          </label>
          <p v-if="formError" class="error-text span-2">{{ formError }}</p>
          <div class="modal-foot span-2">
            <button class="btn" type="button" @click="showCreate = false">取消</button>
            <button class="btn primary" type="submit">提交登记</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="ledgerTarget" class="modal-mask" @click.self="ledgerTarget = null">
      <div class="modal">
        <h3>{{ ledgerTarget['缺陷编号'] }} 处理台账</h3>
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
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import {
  createDefect,
  downloadEntries,
  listEntries,
  loadDefectMetrics,
  moduleMeta,
  runAction as applyAction,
} from '@/api/local-service'
import type { EntryRow, LedgerEvent } from '@/data/types'
import { ledgerOf } from '@/domain/ledger'
import { formatDateTime } from '@/domain/clock'
import { DEFECT_LEVELS, DEFECT_STATUS } from '@/domain/defect'

const meta = moduleMeta('defect')
const columns = ['缺陷编号', '设备名称', '缺陷描述', '缺陷等级', '发现日期', '处理期限', '处理人员', '来源']
const defectLevels = [...DEFECT_LEVELS]

const rows = ref<EntryRow[]>([])
const total = ref(0)
const errorMessage = ref('')
const okMessage = ref('')
const keyword = ref('')
const showCreate = ref(false)
const formError = ref('')
const ledgerTarget = ref<EntryRow | null>(null)

const emptyForm = () => ({
  缺陷编号: '',
  设备名称: '',
  缺陷描述: '',
  缺陷等级: '一般',
  发现日期: new Date().toISOString().slice(0, 10),
  处理期限: '',
  处理人员: '',
})
const form = ref(emptyForm())

const metrics = computed(() => loadDefectMetrics())
const statCards = computed(() => [
  { label: '待处理', value: metrics.value.pending },
  { label: '处理中', value: metrics.value.processing },
  { label: '已完成待归档', value: metrics.value.done },
  { label: '已归档', value: metrics.value.archived },
])

const statusSummary = computed(() =>
  ['待处理', '处理中', '已完成', '已归档'].map((status: string) => ({
    status,
    count: rows.value.filter((row) => String(row.status) === status).length,
  })),
)

const unitCodes = computed(() =>
  (listEntries('unit').items as EntryRow[]).map((row) => String(row['机组编号'] ?? '')),
)

function availableActions(status: string): string[] {
  if (status === DEFECT_STATUS.PENDING) return ['派发处理']
  if (status === DEFECT_STATUS.PROCESSING) return ['确认消除']
  if (status === DEFECT_STATUS.DONE) return ['归档']
  return []
}

function defectStatusClass(status: string): string {
  if (status === DEFECT_STATUS.PENDING) return 'tag-ready'
  if (status === DEFECT_STATUS.PROCESSING) return 'tag-running'
  if (status === DEFECT_STATUS.DONE) return 'tag-standby'
  return 'tag-archived'
}

function ledgerEvents(row: EntryRow): LedgerEvent[] {
  return ledgerOf(row)
}

function openLedger(row: EntryRow) {
  ledgerTarget.value = row
}

function openCreate() {
  form.value = emptyForm()
  formError.value = ''
  showCreate.value = true
}

function exportRows() {
  downloadEntries(meta.key)
}

function submitCreate() {
  formError.value = ''
  const result = createDefect({ ...form.value })
  if (!result.ok) {
    formError.value = result.message
    return
  }
  showCreate.value = false
  okMessage.value = result.message
  reload()
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

function reload() {
  const all = listEntries(meta.key).items
  const word = keyword.value.trim()
  rows.value = word
    ? all.filter(
        (row) =>
          String(row['设备名称'] ?? '').includes(word) || String(row['缺陷编号'] ?? '').includes(word),
      )
    : all
  total.value = listEntries(meta.key).total
}

onMounted(reload)
</script>
