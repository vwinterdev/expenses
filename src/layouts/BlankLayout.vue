<template>
  <ion-page >
    <ion-content :fullscreen="true" class="ion-padding">
      <slot />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue'
</script>
