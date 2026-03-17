<template>
  <ion-page>
    <ion-header :translucent="true">
      <slot name="header">
        <ion-toolbar>
          <ion-title>{{ title }}</ion-title>
        </ion-toolbar>
      </slot>
    </ion-header>

    <ion-content :fullscreen="true">
      <slot />
      <slot name="fixed" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue'

withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: 'Мой заголовок',
  },
)
</script>
