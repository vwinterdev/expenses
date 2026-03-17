<template>
  <DefaultLayout>
    <template #header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>Кошельки</ion-title>
      </ion-toolbar>
    </template>


    <!-- Скелетон при загрузке -->
    <ion-list v-if="isLoading" class="wallet-list">
      <ion-item v-for="i in 4" :key="i">
        <ion-skeleton-text :animated="true" class="wallet-icon-skeleton" slot="start" />
        <ion-label>
          <h3><ion-skeleton-text :animated="true" style="width: 50%" /></h3>
          <p><ion-skeleton-text :animated="true" style="width: 70%" /></p>
        </ion-label>
      </ion-item>
    </ion-list>

    <!-- Пустое состояние -->
    <div v-else-if="!wallets?.length" class="empty-state">
      <ion-icon :icon="walletOutline" class="empty-icon" />
      <h3>Нет кошельков</h3>
      <p>Нажмите «+» чтобы создать первый кошелёк</p>
    </div>

    <!-- Список кошельков -->
    <ion-list v-else class="wallet-list">
      <ion-item-sliding v-for="wallet in wallets" :key="wallet.id">
        <ion-item @click="openAndSetDefaultWallet(wallet.id)" button :detail="true" router-direction="forward">
          <div class="wallet-icon" :style="{ backgroundColor: wallet.color }" slot="start">
            {{ wallet.icon }}
          </div>
          <ion-label>
            <h3>{{ wallet.name }}</h3>
            <p v-if="wallet.description">{{ wallet.description }}</p>
          </ion-label>
        </ion-item>
      </ion-item-sliding>
    </ion-list>

    <template #fixed>
      <CreateWallet @created="refetch" />
    </template>
  </DefaultLayout>
</template>

<script setup lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonItemSliding,
  IonLabel,
  IonList,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/vue'
import { useLocalStorage } from '@vueuse/core'
import { walletOutline } from 'ionicons/icons'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CreateWallet from '@/modules/Wallet/components/create-wallet.vue'
import { useWallets } from '@/modules/Wallet/composables/useWallet'

const { data: wallets, isLoading, refetch } = useWallets()
const defaultWalletId = useLocalStorage('defaultWalletId', '')
const ionRouter = useIonRouter()

const openAndSetDefaultWallet = (id: number) => {
  defaultWalletId.value = id.toString()
  ionRouter.push(`/`)
}
</script>

<style scoped>
.wallet-list ion-item {
  --padding-start: 16px;
  --inner-padding-end: 16px;
}

.wallet-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-inline-end: 12px;
}

.wallet-icon-skeleton {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  margin-inline-end: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  color: var(--ion-color-medium);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.4;
}

.empty-state h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-text-color);
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
</style>
