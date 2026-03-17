<template>
  <BlankLayout>
    <form class="login-wrapper" @submit="onSubmit">
      <div class="login-header">
        <ion-icon :icon="walletOutline" class="login-logo"></ion-icon>
        <h1>My Spend</h1>
        <p>Войдите в свой аккаунт</p>
      </div>

      <div class="login-form">
        <div class="field">
          <ion-input
            v-model="email"
            v-bind="emailProps"
            type="email"
            fill="outline"
            label="Email"
            label-placement="stacked"
            placeholder="example@mail.com"
            :class="{ 'ion-invalid ion-touched': errors.email }"
          >
            <ion-icon :icon="mailOutline" slot="start"></ion-icon>
          </ion-input>
          <p class="field-error" :class="{ visible: errors.email }">{{ errors.email || '&nbsp;' }}</p>
        </div>

        <div class="field">
          <ion-input
            v-model="password"
            v-bind="passwordProps"
            type="password"
            fill="outline"
            label="Пароль"
            label-placement="stacked"
            placeholder="Введите пароль"
            :class="{ 'ion-invalid ion-touched': errors.password }"
          >
            <ion-icon :icon="lockClosedOutline" slot="start"></ion-icon>
            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
          </ion-input>
          <p class="field-error" :class="{ visible: errors.password }">{{ errors.password || '&nbsp;' }}</p>
        </div>

        <ion-button
          expand="block"
          shape="round"
          class="login-btn"
          type="submit"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Вход...' : 'Войти' }}
        </ion-button>

        <ion-button expand="block" fill="clear" size="small" class="forgot-btn">
          Забыли пароль?
        </ion-button>
      </div>

      <div class="login-footer">
        <p>Нет аккаунта?
          <ion-text color="primary">
            <router-link to="/register" class="register-link">Зарегистрироваться</router-link>
          </ion-text>
        </p>
      </div>
    </form>
  </BlankLayout>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, IonInput, IonInputPasswordToggle, IonText } from '@ionic/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { lockClosedOutline, mailOutline, walletOutline } from 'ionicons/icons'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { getErrorMessage } from '@/libs/ky'
import { useLogin } from '@/modules/auth/composables/useAuth'
import BlankLayout from '../layouts/BlankLayout.vue'

const router = useRouter()
const { mutateAsync: login } = useLogin()

const schema = toTypedSchema(
  z.object({
    email: z.string({ required_error: 'Введите email' }).min(1, 'Введите email').email('Некорректный email'),
    password: z.string({ required_error: 'Введите пароль' }).min(6, 'Минимум 6 символов'),
  }),
)

const { defineField, handleSubmit, errors, isSubmitting, setErrors } = useForm({
  validationSchema: schema,
})

const [email, emailProps] = defineField('email')
const [password, passwordProps] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    await login(values)
    // Успешный логин - редирект на главную
    router.push('/')
  } catch (error) {
    console.error('Ошибка входа:', error)
    // Показываем ошибку пользователю
    setErrors({
      email: getErrorMessage(error),
    })
  }
})
</script>

<style scoped>
.login-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 24px 16px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-logo {
  font-size: 64px;
  color: var(--ion-color-primary);
  margin-bottom: 8px;
}

.login-header h1 {
  margin: 8px 0 4px;
  font-size: 28px;
  font-weight: 700;
  color: var(--ion-text-color);
}

.login-header p {
  margin: 0;
  font-size: 15px;
  color: var(--ion-color-medium);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-form ion-input {
  --border-radius: 12px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field-error {
  margin: 4px 16px 0;
  font-size: 12px;
  color: var(--ion-color-danger);
  visibility: hidden;
}

.field-error.visible {
  visibility: visible;
}

.login-btn {
  margin-top: 8px;
  --border-radius: 12px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.forgot-btn {
  --color: var(--ion-color-medium);
  font-size: 14px;
}

.login-footer {
  text-align: center;
  margin-top: 32px;
}

.login-footer p {
  font-size: 14px;
  color: var(--ion-color-medium);
}

.register-link {
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}
</style>
