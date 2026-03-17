<template>
  <div class="desktop-not-supported">
    <div class="container">
      <div class="icon">
        <ion-icon :icon="phonePortraitOutline" />
      </div>
      <h1>Мобильная версия</h1>
      <p>Это приложение оптимизировано для мобильных устройств</p>
      <p class="hint">Откройте сайт на телефоне или уменьшите размер окна браузера</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { phonePortraitOutline } from 'ionicons/icons'
</script>

<style scoped>
.desktop-not-supported {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--ion-background-color);
  padding: 20px;
}

.container {
  text-align: center;
  max-width: 500px;
}

.icon {
  margin: 0 auto 32px;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-secondary) 100%);
  border-radius: 50%;
  box-shadow: 0 8px 32px rgba(var(--ion-color-primary-rgb), 0.3);
}

.icon ion-icon {
  font-size: 64px;
  color: white;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px;
  color: var(--ion-text-color);
}

p {
  font-size: 18px;
  line-height: 1.6;
  color: var(--ion-color-medium);
  margin: 0 0 12px;
}

.hint {
  font-size: 14px;
  color: var(--ion-color-medium-shade);
  margin-top: 32px;
  padding: 16px;
  background: var(--ion-color-step-50);
  border-radius: 12px;
}

@media (max-width: 768px) {
  .desktop-not-supported {
    display: none;
  }
}
</style>
