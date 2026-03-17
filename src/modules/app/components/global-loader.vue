<script setup lang="ts">
import { IonContent, IonHeader, IonIcon, IonPage, IonProgressBar } from '@ionic/vue'
import { walletOutline } from 'ionicons/icons'
</script>

<template>
    <ion-page>
        <ion-header>
            <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </ion-header>
        <ion-content >
            <div class="loading-wrapper">
                <ion-icon class="login-logo" :icon="walletOutline" />
            </div>
        </ion-content>
    </ion-page>
</template>

<style scoped>
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 24px 16px;
}

.login-logo {
  font-size: 100px;
  color: var(--ion-color-primary);
}
</style>