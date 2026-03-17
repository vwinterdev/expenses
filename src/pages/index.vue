<template>
  <DefaultLayout title="Главная">
    <ion-card>
      <ion-card-header>
        <ion-card-title>$542</ion-card-title>
        <ion-card-subtitle>Баланс </ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
        Описание кошелька
      </ion-card-content>
    </ion-card>

    <ion-button expand="block" router-link="/login" class="ion-margin">
      Перейти на логин
    </ion-button>

    <ion-segment-view>
      <ion-segment-content id="first">First</ion-segment-content>
      <ion-segment-content id="second">Second</ion-segment-content>
      <ion-segment-content id="third">Third</ion-segment-content>
    </ion-segment-view>
  </DefaultLayout>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSegmentContent,
  IonSegmentView,
} from '@ionic/vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
</script>
