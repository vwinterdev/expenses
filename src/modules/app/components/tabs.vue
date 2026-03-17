<script setup lang="ts">
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue'
import { homeOutline, personOutline, statsChartOutline, walletOutline } from 'ionicons/icons'
</script>

<template>
  <ion-tabs>
    <ion-router-outlet />
    
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="home" href="/">
        <ion-icon :icon="homeOutline" />
        <ion-label>Главная</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="wallet" href="/wallet">
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
</template>