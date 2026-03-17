<template>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button @click="openModal">
      <ion-icon :icon="add" />
    </ion-fab-button>
  </ion-fab>

  <ion-modal :is-open="isModalOpen" @didDismiss="handleDismiss">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel">Отмена</ion-button>
        </ion-buttons>
        <ion-title>Новая транзакция</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" :disabled="isSubmitting" @click="onSubmit">
            {{ isSubmitting ? 'Создание...' : 'Создать' }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form class="check-form" @submit.prevent="onSubmit">
        <!-- Тип транзакции -->
        <div class="field">
          <ion-segment v-model="type" :value="type">
            <ion-segment-button value="income">
              <ion-label>Доход</ion-label>
            </ion-segment-button>
            <ion-segment-button value="expense">
              <ion-label>Расход</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>

        <!-- Сумма -->
        <div class="field">
     
          <ion-input
            v-model.number="amount"
            v-bind="amountProps"
            fill="solid"
            label="Сумма"
            label-placement="floating"
            type="number"
            step="1"
            placeholder="0"
            :class="{ 'ion-invalid ion-touched': errors.amount }"
          >
            <ion-icon :icon="cashOutline" slot="start" />
            <span slot="end" class="currency">₽</span>
          </ion-input>
          <p class="field-error" :class="{ visible: errors.amount }">{{ errors.amount || '&nbsp;' }}</p>
        </div>

        <!-- Категория -->
        <div class="field">
          <ion-select
            v-model="categoryId"
            fill="solid"
            label="Категория"
            label-placement="floating"
            interface="action-sheet"
            :class="{ 'ion-invalid ion-touched': errors.categoryId }"
          >
            <ion-select-option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
              {{ cat.icon }} {{ cat.name }}
            </ion-select-option>
          </ion-select>
          <p class="field-error" :class="{ visible: errors.categoryId }">{{ errors.categoryId || '&nbsp;' }}</p>
        </div>

        <!-- Описание -->
        <div class="field">
          <ion-textarea
            v-model="description"
            v-bind="descriptionProps"
            fill="solid"
            label="Описание (опционально)"
            label-placement="floating"
            placeholder="Комментарий к транзакции"
            :auto-grow="true"
            :rows="2"
            :class="{ 'ion-invalid ion-touched': errors.description }"
          />
          <ion-button
            type="button"
            size="small"
            fill="outline"
            class="voice-btn"
            :disabled="!isSpeechSupported"
            @click="toggleListening"
          >
            <ion-icon slot="start" :icon="isListening ? stopCircleOutline : micOutline" />
            {{ isListening ? 'Остановить запись' : 'Голосовой ввод' }}
          </ion-button>
          <p v-if="!isSpeechSupported" class="voice-hint">Голосовой ввод не поддерживается на этом устройстве</p>
          <p class="field-error" :class="{ visible: errors.description }">{{ errors.description || '&nbsp;' }}</p>
        </div>

        <!-- Превью -->
        <div v-if="amount && categoryId" class="preview-section">
          <p class="preview-label">Превью</p>
          <div class="preview-card">
            <div class="preview-icon" :class="`type-${type}`">
              {{ selectedCategory?.icon || '💰' }}
            </div>
            <div class="preview-text">
              <h4>{{ selectedCategory?.name || 'Категория' }}</h4>
              <p v-if="description">{{ description }}</p>
            </div>
            <div class="preview-amount" :class="`type-${type}`">
              {{ type === 'income' ? '+' : '-' }}{{ formatAmount(amount) }}
            </div>
          </div>
        </div>
      </form>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonLabel,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { add, cashOutline, micOutline, stopCircleOutline } from 'ionicons/icons'
import { useSpeechRecognition } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { z } from 'zod'
import { getErrorMessage } from '@/libs/ky'
import { useCategories } from '@/modules/categories/composables/useCategory'
import type Category from '@/modules/categories/models/Category'
import { useCreateCheck } from '@/modules/checks/composables/useCheck'

interface Props {
  walletId: number
}

const props = defineProps<Props>()

const { mutateAsync: createCheck } = useCreateCheck()
const { data: allCategories } = useCategories(computed(() => props.walletId))

const isModalOpen = ref(false)

const schema = toTypedSchema(
  z.object({
    type: z.enum(['income', 'expense'], { required_error: 'Выберите тип' }),
    amount: z
      .number({ required_error: 'Введите сумму', invalid_type_error: 'Введите корректную сумму' })
      .positive('Сумма должна быть положительной')
      .max(999999999.99, 'Максимальная сумма: 999,999,999.99'),
    categoryId: z.number({ required_error: 'Выберите категорию' }),
    description: z.string().max(500, 'Максимум 500 символов').optional().default(''),
  }),
)

const { defineField, handleSubmit, errors, isSubmitting, setErrors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    type: 'expense' as 'income' | 'expense',
    amount: undefined as any,
    categoryId: undefined as any,
    description: '',
  },
})

const [type] = defineField('type')
const [amount, amountProps] = defineField('amount', {
  validateOnModelUpdate: false,
})
const [categoryId] = defineField('categoryId')
const [description, descriptionProps] = defineField('description')

const {
  isSupported: isSpeechSupported,
  isListening,
  result,
  start: startListening,
  stop: stopListening,
} = useSpeechRecognition({
  lang: 'ru-RU',
  interimResults: true,
  continuous: true,
})

const filteredCategories = computed(() => {
  if (!allCategories.value) return []
  return allCategories.value.filter((cat: Category) => cat.type === type.value)
})

const selectedCategory = computed(() => {
  return allCategories.value?.find((cat: Category) => cat.id === categoryId.value)
})

const emit = defineEmits<{
  created: []
}>()

const openModal = () => {
  isModalOpen.value = true
}

const cancel = () => {
  if (isListening.value) stopListening()
  isModalOpen.value = false
  resetForm()
}

const handleDismiss = () => {
  if (isListening.value) stopListening()
  isModalOpen.value = false
  resetForm()
}

const onSubmit = handleSubmit(async (values) => {
  try {
    if (isListening.value) stopListening()
    await createCheck({
      ...values,
      walletId: props.walletId,
    })
    isModalOpen.value = false
    resetForm()
    emit('created')
  } catch (error) {
    console.error('Ошибка создания транзакции:', error)
    setErrors({
      amount: getErrorMessage(error),
    })
  }
})

watch(result, (value) => {
  if (!value) return
  description.value = value
})

const toggleListening = () => {
  if (!isSpeechSupported.value) return
  if (isListening.value) {
    stopListening()
    return
  }
  startListening()
}

const formatAmount = (val: any) => {
  const num = Number(val)
  if (Number.isNaN(num)) return '0.00'
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}
</script>

<style scoped>
.check-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 16px;
}

.check-form ion-input,
.check-form ion-textarea,
.check-form ion-select {
  --border-radius: 8px;
  --padding-start: 12px;
  --padding-end: 12px;
}

.check-form ion-segment {
  --background: var(--ion-color-step-100);
  border-radius: 8px;
  padding: 4px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field-error {
  margin: 4px 12px 0;
  font-size: 12px;
  color: var(--ion-color-danger);
  visibility: hidden;
  min-height: 18px;
}

.field-error.visible {
  visibility: visible;
}

.currency {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-medium);
  padding-right: 8px;
}

.voice-btn {
  margin: 8px 12px 0;
}

.voice-hint {
  margin: 6px 12px 0;
  font-size: 12px;
  color: var(--ion-color-medium);
}

.preview-section {
  margin-top: 8px;
  padding: 16px;
  background: var(--ion-color-step-50);
  border-radius: 12px;
}

.preview-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--ion-color-medium);
  margin: 0 0 12px;
}

.preview-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--ion-background-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.preview-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.preview-icon.type-income {
  background-color: rgba(var(--ion-color-success-rgb), 0.1);
}

.preview-icon.type-expense {
  background-color: rgba(var(--ion-color-danger-rgb), 0.1);
}

.preview-text {
  flex: 1;
  min-width: 0;
}

.preview-text h4 {
  margin: 0 0 2px;
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-text p {
  margin: 0;
  font-size: 13px;
  color: var(--ion-color-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-amount {
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.preview-amount.type-income {
  color: var(--ion-color-success);
}

.preview-amount.type-expense {
  color: var(--ion-color-danger);
}
</style>
