<template>
  <ion-button fill="clear" @click="openActionSheet">
    <ion-icon slot="icon-only" :icon="settingsOutline" />
  </ion-button>

  <ion-action-sheet
    :is-open="isOpen"
    header="Настройки"
    :buttons="actionButtons"
    @didDismiss="isOpen = false"
  />
</template>

<script setup lang="ts">
import { IonActionSheet, IonButton, IonIcon } from '@ionic/vue'
import { pricetagsOutline, settingsOutline, shareOutline } from 'ionicons/icons'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)

const props = defineProps<{
  walletId: number
}>()

const openActionSheet = () => {
  isOpen.value = true
}

const navigateToCategories = () => {
  router.push(`/categories/${props.walletId}`)
}

const shareWallet = () => {
  // TODO: Implement wallet sharing
  console.log('Share wallet')
}

const actionButtons = [
  {
    text: 'Настроить категории',
    icon: pricetagsOutline,
    handler: navigateToCategories,
  },
  {
    text: 'Поделиться кошельком',
    icon: shareOutline,
    handler: shareWallet,
  },
  {
    text: 'Отмена',
    role: 'cancel',
  },
]
</script>
