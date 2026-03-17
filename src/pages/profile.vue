<template>
  <DefaultLayout title="Профиль">
    <div class="profile-container">
      <!-- Карточка профиля -->
      <ion-card class="profile-card">
        <ion-card-content>
          <div class="profile-header">
            <div class="avatar-wrapper">
              <ion-avatar class="profile-avatar">
                <img :src="user.avatar" :alt="user.name" />
              </ion-avatar>
              <ion-badge class="status-badge" color="success">
                <ion-icon :icon="checkmarkCircle"></ion-icon>
              </ion-badge>
            </div>
            
            <div class="profile-info">
              <h2 class="profile-name">{{ user.name }}</h2>
              <p class="profile-email">{{ user.email }}</p>
            </div>
          </div>

          <ion-list class="profile-stats" lines="none">
            <ion-item>
              <ion-icon :icon="walletOutline" slot="start" color="primary"></ion-icon>
              <ion-label>
                <h3>Баланс</h3>
                <p class="stat-value">{{ formatCurrency(user.balance) }}</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon :icon="trendingUpOutline" slot="start" color="success"></ion-icon>
              <ion-label>
                <h3>Доходы за месяц</h3>
                <p class="stat-value">{{ formatCurrency(user.monthlyIncome) }}</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon :icon="trendingDownOutline" slot="start" color="danger"></ion-icon>
              <ion-label>
                <h3>Расходы за месяц</h3>
                <p class="stat-value">{{ formatCurrency(user.monthlyExpenses) }}</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon :icon="calendarOutline" slot="start" color="medium"></ion-icon>
              <ion-label>
                <h3>Дата регистрации</h3>
                <p class="stat-value">{{ formatDate(user.registeredAt) }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Кнопка выхода -->
      <ion-button 
        expand="block" 
        color="danger" 
        class="logout-btn"
        @click="handleLogout"
      >
        <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
        Выйти из аккаунта
      </ion-button>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/vue'
import {
  calendarOutline,
  checkmarkCircle,
  logOutOutline,
  trendingDownOutline,
  trendingUpOutline,
  walletOutline,
} from 'ionicons/icons'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useLogout } from '@/modules/auth/composables/useAuth'

const router = useRouter()
const { mutateAsync: logout } = useLogout()

// Замоканные данные пользователя
const user = ref({
  name: 'Иван Иванов',
  email: 'ivan@example.com',
  avatar: 'https://i.pravatar.cc/300?img=12',
  balance: 125000,
  monthlyIncome: 85000,
  monthlyExpenses: 42500,
  registeredAt: '2024-01-15',
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

const handleLogout = async () => {
  try {
    await logout()
    // Редирект на страницу логина после выхода
    router.push('/login')
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  }
}
</script>

<style scoped>
.profile-container {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.profile-card {
  margin-bottom: 16px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 0;
  gap: 16px;
}

.avatar-wrapper {
  position: relative;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border: 4px solid var(--ion-color-primary);
}

.status-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--ion-background-color);
}

.status-badge ion-icon {
  font-size: 18px;
}

.profile-info {
  width: 100%;
}

.profile-name {
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 700;
  color: var(--ion-text-color);
}

.profile-email {
  margin: 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

.profile-stats {
  margin-top: 16px;
  background: transparent;
}

.profile-stats ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}

.profile-stats h3 {
  font-size: 13px;
  font-weight: 500;
  color: var(--ion-color-medium);
  margin: 0 0 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-text-color);
  margin: 0;
}

.logout-btn {
  margin-top: 24px;
  margin-bottom: 32px;
  height: 48px;
  font-weight: 600;
}
</style>
