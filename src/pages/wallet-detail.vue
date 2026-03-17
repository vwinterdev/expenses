<template>
  <DefaultLayout :title="wallet?.name || 'Кошелёк'">
    <template #header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button router-link="/wallet" router-direction="back">
            <ion-icon slot="icon-only" :icon="swapHorizontalOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ wallet?.name || 'Кошелёк' }}</ion-title>
        <ion-buttons slot="end">
          <settings-menu v-if="wallet" :walletId="wallet.id" />
        </ion-buttons>
      </ion-toolbar>
    </template>
    <div class="ion-padding">
      <!-- Скелетон при загрузке -->
      <template v-if="isLoading">
        <ion-card>
          <ion-card-header>
            <ion-skeleton-text :animated="true" style="width: 40%; height: 24px" />
            <ion-skeleton-text :animated="true" style="width: 60%; height: 16px; margin-top: 8px" />
          </ion-card-header>
          <ion-card-content>
            <ion-skeleton-text :animated="true" style="width: 100%; height: 16px" />
            <ion-skeleton-text :animated="true" style="width: 80%; height: 16px; margin-top: 8px" />
          </ion-card-content>
        </ion-card>
      </template>

      <!-- Ошибка или нет кошелька -->
      <div v-else-if="!wallet || isError" class="empty-state">
        <ion-icon :icon="walletOutline" class="empty-icon" />
        <h3>Кошелёк не найден</h3>
        <p>Выберите существующий кошелёк или создайте новый</p>
        <ion-button expand="block" router-link="/wallet" router-direction="back" class="select-wallet-btn">
          Выбрать кошелёк
        </ion-button>
      </div>

      <!-- Данные кошелька -->
      <template v-else>
        <ion-card>
          <ion-card-header>
            <div class="wallet-header">
              <div class="wallet-icon" :style="{ backgroundColor: wallet.color }">
                {{ wallet.icon }}
              </div>
              <div>
                <ion-card-title>{{ wallet.balance }}</ion-card-title>
                <ion-card-subtitle v-if="wallet.name">{{ wallet.name }}</ion-card-subtitle>
              </div>
            </div>
          </ion-card-header>
          <ion-card-content>
            <p>{{ wallet.description }}</p>
          </ion-card-content>
        </ion-card>

        <!-- Категории с балансом -->
        <div class="categories-section">
          <h2 class="section-title">Категории</h2>

          <!-- Empty state -->
          <div v-if="!categories || categories.length === 0" class="categories-empty">
            <ion-icon :icon="pricetagsOutline" />
            <p>Нет категорий</p>
            <ion-button size="small" @click="openCategoriesSettings">
              Создать категорию
            </ion-button>
          </div>

          <!-- Список категорий -->
          <div v-else class="categories-list">
            <ion-card v-for="category in categories" :key="category.id" class="category-card">
              <ion-card-content class="category-item">
                <div class="category-icon" :style="{ backgroundColor: category.color }">
                  {{ category.icon }}
                </div>
                <div class="category-info">
                  <div class="category-name">{{ category.name }}</div>
                  <div class="category-type" :class="`type-${category.type}`">
                    {{ category.type === 'income' ? 'Доход' : 'Расход' }}
                  </div>
                </div>
                <div class="category-balance" :class="{ negative: category.balance < 0 }">
                  {{ formatAmount(category.balance) }}
                </div>
              </ion-card-content>
            </ion-card>
          </div>
        </div>
      </template>
    </div>
    <template #fixed>
        <CreateChecks v-if="wallet" :walletId="wallet.id" />
    </template>
  </DefaultLayout>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { useLocalStorage } from '@vueuse/core'
import { pricetagsOutline, swapHorizontalOutline, walletOutline } from 'ionicons/icons'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SettingsMenu from '@/modules/app/components/settings-menu.vue'
import CreateChecks from '@/modules/checks/components/create-checks.vue'
import { useWallet } from '@/modules/Wallet/composables/useWallet'

const router = useRouter()
const defaultWalletId = useLocalStorage('defaultWalletId', '')

const { data: wallet, isLoading, isError } = useWallet(defaultWalletId)

const categories = computed(() => wallet.value?.categories || [])



const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

const openCategoriesSettings = () => {
  if (wallet.value) {
    router.push(`/categories/${wallet.value.id}`)
  }
}
</script>

<style scoped>
.wallet-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.wallet-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  min-height: 50vh;
}

.empty-icon {
  font-size: 72px;
  color: var(--ion-color-medium);
  opacity: 0.4;
  margin-bottom: 24px;
}

.empty-state h3 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--ion-text-color);
}

.empty-state p {
  margin: 0 0 24px;
  font-size: 15px;
  color: var(--ion-color-medium);
}

.select-wallet-btn {
  max-width: 280px;
  --border-radius: 12px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

/* Категории */
.categories-section {
  margin-top: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px;
  color: var(--ion-text-color);
}

.categories-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
}

.categories-empty ion-icon {
  font-size: 48px;
  color: var(--ion-color-medium);
  margin-bottom: 12px;
  opacity: 0.5;
}

.categories-empty p {
  margin: 0 0 16px;
  color: var(--ion-color-medium);
  font-size: 15px;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-card {
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.category-card:active {
  transform: scale(0.98);
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-text-color);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-type {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-type.type-income {
  color: var(--ion-color-success);
}

.category-type.type-expense {
  color: var(--ion-color-danger);
}

.category-balance {
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-color-success);
  white-space: nowrap;
}

.category-balance.negative {
  color: var(--ion-color-danger);
}
</style>
