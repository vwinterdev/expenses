<template>
  <BlankLayout>
    <form class="register-wrapper" @submit="onSubmit">
      <div class="register-header">
        <ion-icon :icon="personAddOutline" class="register-logo"></ion-icon>
        <ion-text>
          <h1>Регистрация</h1>
        </ion-text>
        <ion-text>
          <p>Создайте новый аккаунт</p>
        </ion-text>
      </div>

      <div class="register-form">
  
          <ion-input
            v-model="name"
            v-bind="nameProps"
            type="text"
            fill="outline"
            label="Имя"
            label-placement="stacked"
            placeholder="Ваше имя"
            :class="{ 'ion-invalid ion-touched': errors.name }"
            :errorText="errors.name"
          >
            <ion-icon :icon="personOutline" slot="start"></ion-icon>
          </ion-input>
       

      
          <ion-input
            v-model="email"
            v-bind="emailProps"
            type="email"
            fill="outline"
            label="Email"
            label-placement="stacked"
            placeholder="example@mail.com"
            :class="{ 'ion-invalid ion-touched': errors.email }"
            :errorText="errors.email"
          >
            <ion-icon :icon="mailOutline" slot="start"></ion-icon>
          </ion-input>
   
        
          <ion-input
            v-model="password"
            v-bind="passwordProps"
            type="password"
            fill="outline"
            label="Пароль"
            label-placement="stacked"
            placeholder="Придумайте пароль"
            :class="{ 'ion-invalid ion-touched': errors.password }"
            :errorText="errors.password"
          >
            <ion-icon :icon="lockClosedOutline" slot="start"></ion-icon>
            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
          </ion-input>
        

    
          <ion-input
            v-model="confirmPassword"
            v-bind="confirmPasswordProps"
            type="password"
            fill="outline"
            label="Повторите пароль"
            label-placement="stacked"
            placeholder="Повторите пароль"
            :class="{ 'ion-invalid ion-touched': errors.confirmPassword }"
            :errorText="errors.confirmPassword"
          >
            <ion-icon :icon="shieldCheckmarkOutline" slot="start"></ion-icon>
            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
          </ion-input>
        

        <ion-button
          expand="block"
          shape="round"
          class="register-btn"
          type="submit"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Создание...' : 'Создать аккаунт' }}
        </ion-button>
      </div>

      <div class="register-footer">
        <p>Уже есть аккаунт?
          <ion-text color="primary">
            <router-link to="/login" class="login-link">Войти</router-link>
          </ion-text>
        </p>
      </div>
    </form>
  </BlankLayout>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, IonInput, IonInputPasswordToggle, IonText } from '@ionic/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { lockClosedOutline, mailOutline, personAddOutline, personOutline, shieldCheckmarkOutline } from 'ionicons/icons'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { getErrorMessage } from '@/libs/ky'
import { useRegister } from '@/modules/auth/composables/useAuth'
import BlankLayout from '../layouts/BlankLayout.vue'

const router = useRouter()
const { mutateAsync: register } = useRegister()

const schema = toTypedSchema(
  z
    .object({
      name: z.string({ required_error: 'Введите имя' }).min(2, 'Минимум 2 символа'),
      email: z.string({ required_error: 'Введите email' }).min(1, 'Введите email').email('Некорректный email'),
      password: z.string({ required_error: 'Введите пароль' }).min(6, 'Минимум 6 символов'),
      confirmPassword: z.string({ required_error: 'Повторите пароль' }).min(1, 'Повторите пароль'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Пароли не совпадают',
      path: ['confirmPassword'],
    }),
)

const { defineField, handleSubmit, errors, isSubmitting, setErrors } = useForm({
  validationSchema: schema,
})

const [name, nameProps] = defineField('name')
const [email, emailProps] = defineField('email')
const [password, passwordProps] = defineField('password')
const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword')

const onSubmit = handleSubmit(async (values) => {
  try {
    // Отправляем только нужные поля на сервер
    await register({
      name: values.name,
      email: values.email,
      password: values.password,
    })
    // Успешная регистрация - редирект на главную
    router.push('/')
  } catch (error) {
    console.error('Ошибка регистрации:', error)
    // Показываем ошибку пользователю
    setErrors({
      email: getErrorMessage(error),
    })
  }
})
</script>

<style scoped>
.register-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 24px 16px;
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-logo {
  font-size: 56px;
  color: var(--ion-color-primary);
  margin-bottom: 8px;
}

.register-header h1 {
  margin: 8px 0 4px;
  font-size: 28px;
  font-weight: 700;
  color: var(--ion-text-color);
}

.register-header p {
  margin: 0;
  font-size: 15px;
  color: var(--ion-color-medium);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.register-form ion-input {
  --border-radius: 12px;
}


.register-btn {
  margin-top: 8px;
  --border-radius: 12px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.register-footer {
  text-align: center;
  margin-top: 32px;
}

.register-footer p {
  font-size: 14px;
  color: var(--ion-color-medium);
}

.login-link {
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}
</style>
