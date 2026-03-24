<template>
  <div class="statistics-section">
    <!-- Навигация по месяцам -->
    <div class="month-nav">
      <ion-button fill="clear" size="small" @click="prevMonth">
        <ion-icon slot="icon-only" :icon="chevronBackOutline" />
      </ion-button>
      <span class="month-label">{{ monthLabel }}</span>
      <ion-button fill="clear" size="small" :disabled="isCurrentMonth" @click="nextMonth">
        <ion-icon slot="icon-only" :icon="chevronForwardOutline" />
      </ion-button>
    </div>

    <!-- Загрузка -->
    <template v-if="isPending">
      <ion-card v-for="i in 3" :key="i" class="stat-card">
        <ion-card-content class="stat-item">
          <ion-skeleton-text :animated="true" style="width: 48px; height: 48px; border-radius: 12px" />
          <div style="flex: 1">
            <ion-skeleton-text :animated="true" style="width: 60%; height: 14px" />
            <ion-skeleton-text :animated="true" style="width: 40%; height: 12px; margin-top: 6px" />
          </div>
          <ion-skeleton-text :animated="true" style="width: 80px; height: 18px" />
        </ion-card-content>
      </ion-card>
    </template>

    <!-- Нет данных -->
    <div v-else-if="!data || data.listCategories.length === 0" class="stat-empty">
      <ion-icon :icon="statsChartOutline" />
      <p>Нет транзакций за этот период</p>
    </div>

    <!-- Список -->
    <template v-else>
      <div class="stat-totals">
        <div class="stat-total income">
          <span class="stat-total-label">Доходы</span>
          <span class="stat-total-value">+{{ formatAmount(Number(data.summary.totalIncome)) }}</span>
        </div>
        <div class="stat-total expense">
          <span class="stat-total-label">Расходы</span>
          <span class="stat-total-value">-{{ formatAmount(Number(data.summary.totalExpense)) }}</span>
        </div>
      </div>

      <div class="stat-list">
        <ion-card v-for="row in data.listCategories" :key="row.categoryId" class="stat-card">
          <ion-card-content class="stat-item">
            <div class="stat-icon" :style="{ backgroundColor: row.categoryColor }">
              {{ row.categoryIcon }}
            </div>
            <div class="stat-info">
              <div class="stat-name">{{ row.categoryName }}</div>
              <div class="stat-type" :class="`type-${row.categoryType}`">
                {{ typeLabel(row.categoryType) }}
              </div>
            </div>
            <div class="stat-amount" :class="Number(row.total) >= 0 ? 'type-income' : 'type-expense'">
              {{ Number(row.total) >= 0 ? '+' : '' }}{{ formatAmount(Number(row.total)) }}
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonSkeletonText,
} from '@ionic/vue'
import { chevronBackOutline, chevronForwardOutline, statsChartOutline } from 'ionicons/icons'
import { computed, ref } from 'vue'
import { useWalletStatistics } from '@/modules/statistics/composables/useStatistics'

interface Props {
  walletId: number
}

const props = defineProps<Props>()

const currentDate = ref(new Date())
const walletIdRef = computed(() => props.walletId)

const { data, isPending } = useWalletStatistics(walletIdRef, currentDate)

const monthLabel = computed(() => {
  return currentDate.value.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
})

const isCurrentMonth = computed(() => {
  const now = new Date()
  return (
    currentDate.value.getFullYear() === now.getFullYear() &&
    currentDate.value.getMonth() === now.getMonth()
  )
})

const prevMonth = () => {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() - 1)
  currentDate.value = d
}

const nextMonth = () => {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  currentDate.value = d
}

const typeLabel = (type: string) => {
  if (type === 'income') return 'Доход'
  if (type === 'expense') return 'Расход'
  return 'Смешанный'
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))
}
</script>

<style scoped>
.statistics-section {
  margin-top: 24px;
}

.month-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.month-label {
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-text-color);
  text-transform: capitalize;
}

.stat-totals {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-total {
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-total.income {
  background: rgba(var(--ion-color-success-rgb), 0.1);
}

.stat-total.expense {
  background: rgba(var(--ion-color-danger-rgb), 0.1);
}

.stat-total-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--ion-color-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-total-value {
  font-size: 16px;
  font-weight: 700;
}

.stat-total.income .stat-total-value {
  color: var(--ion-color-success);
}

.stat-total.expense .stat-total-value {
  color: var(--ion-color-danger);
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-card {
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-text-color);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stat-type {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-type.type-income {
  color: var(--ion-color-success);
}

.stat-type.type-expense {
  color: var(--ion-color-danger);
}

.stat-type.type-mixed {
  color: var(--ion-color-warning);
}

.stat-amount {
  font-size: 17px;
  font-weight: 700;
  white-space: nowrap;
}

.stat-amount.type-income {
  color: var(--ion-color-success);
}

.stat-amount.type-expense {
  color: var(--ion-color-danger);
}

.stat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
}

.stat-empty ion-icon {
  font-size: 48px;
  color: var(--ion-color-medium);
  margin-bottom: 12px;
  opacity: 0.5;
}

.stat-empty p {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 15px;
}
</style>
