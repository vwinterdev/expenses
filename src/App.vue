<script setup lang="ts">
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, isPlatform } from '@ionic/vue'
import { personOutline, statsChartOutline, walletOutline } from 'ionicons/icons'
import { computed } from 'vue'
import DesktopNotSupported from '@/modules/app/components/desktop-not-supported.vue'
import GlobalLoader from '@/modules/app/components/global-loader.vue'
import { useUser } from '@/modules/auth/composables/useAuth'

const { data: user, isLoading: isUserLoading } = useUser()

const isMobile = computed(() => {
  return isPlatform('mobile') || isPlatform('mobileweb') || window.innerWidth <= 768
})
</script>
<template>
  <ion-app>
    <template v-if="isMobile">
      <global-loader v-if="isUserLoading" />

      <ion-tabs v-else-if="user">
        <ion-router-outlet />
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="wallet" href="/">
            <ion-icon :icon="walletOutline" />
            <ion-label>Кошелёк</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="statistics" href="/statistics">
            <ion-icon :icon="statsChartOutline" />
            <ion-label>Статистика</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="profile" href="/profile">
            <ion-icon :icon="personOutline" />
            <ion-label>Профиль</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>

      <ion-router-outlet v-else />
    </template>

    <desktop-not-supported v-else />
  </ion-app>
</template>
