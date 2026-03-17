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
        <ion-title>Новая категория</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" :disabled="isSubmitting" @click="onSubmit">
            {{ isSubmitting ? 'Создание...' : 'Создать' }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form class="category-form" @submit.prevent="onSubmit">
        <!-- Тип категории -->
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

        <!-- Название -->
        <div class="field">
          <ion-input
            v-model="name"
            v-bind="nameProps"
            fill="solid"
            label="Название"
            label-placement="floating"
            type="text"
            placeholder="Например: Продукты"
            :class="{ 'ion-invalid ion-touched': errors.name }"
          >
            <ion-icon :icon="pricetagOutline" slot="start" />
          </ion-input>
          <p class="field-error" :class="{ visible: errors.name }">{{ errors.name || '&nbsp;' }}</p>
        </div>

        <!-- Иконка и Цвет в одном ряду -->
        <div class="field-row">
          <!-- Иконка -->
          <div class="field field-half">
            <ion-select
              v-model="icon"
              fill="solid"
              label="Иконка"
              label-placement="floating"
              interface="action-sheet"
              :class="{ 'ion-invalid ion-touched': errors.icon }"
            >
              <ion-select-option v-for="opt in iconOptions" :key="opt.value" :value="opt.value">
                {{ opt.emoji }} {{ opt.label }}
              </ion-select-option>
            </ion-select>
            <p class="field-error" :class="{ visible: errors.icon }">{{ errors.icon || '&nbsp;' }}</p>
          </div>

          <!-- Цвет -->
          <div class="field field-half">
            <p class="color-label">Цвет</p>
            <div class="color-picker-wrapper">
              <div class="color-picker">
                <button
                  v-for="c in colorOptions"
                  :key="c"
                  type="button"
                  class="color-option"
                  :class="{ selected: color === c }"
                  :style="{ backgroundColor: c }"
                  @click="color = c"
                  :aria-label="`Выбрать цвет ${c}`"
                />
              </div>
            </div>
            <p class="field-error" :class="{ visible: errors.color }">{{ errors.color || '&nbsp;' }}</p>
          </div>
        </div>

        <!-- Превью -->
        <div v-if="name || icon" class="preview-section">
          <p class="preview-label">Превью</p>
          <div class="preview-card">
            <div class="preview-icon" :style="{ backgroundColor: color || '#4287f5' }">
              {{ icon || '📁' }}
            </div>
            <div class="preview-text">
              <h4>{{ name || 'Название категории' }}</h4>
              <p class="type-badge" :class="`type-${type}`">{{ type === 'income' ? 'Доход' : 'Расход' }}</p>
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
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { add, pricetagOutline } from 'ionicons/icons'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { z } from 'zod'
import { getErrorMessage } from '@/libs/ky'
import { CategoryType, useCreateCategory } from '@/modules/categories/composables/useCategory'

const props = defineProps<{
  walletId: number
}>()

const { mutateAsync: createCategory } = useCreateCategory()

const isModalOpen = ref(false)

const iconOptions = [
  { value: '🛒', emoji: '🛒', label: 'Продукты' },
  { value: '🚗', emoji: '🚗', label: 'Транспорт' },
  { value: '🏠', emoji: '🏠', label: 'Дом' },
  { value: '💊', emoji: '💊', label: 'Здоровье' },
  { value: '🎬', emoji: '🎬', label: 'Развлечения' },
  { value: '📚', emoji: '📚', label: 'Образование' },
  { value: '👕', emoji: '👕', label: 'Одежда' },
  { value: '⚽', emoji: '⚽', label: 'Спорт' },
  { value: '🍽️', emoji: '🍽️', label: 'Рестораны' },
  { value: '✈️', emoji: '✈️', label: 'Путешествия' },
  { value: '📱', emoji: '📱', label: 'Техника' },
  { value: '🎁', emoji: '🎁', label: 'Подарки' },
  { value: '💼', emoji: '💼', label: 'Зарплата' },
  { value: '📈', emoji: '📈', label: 'Инвестиции' },
  { value: '💰', emoji: '💰', label: 'Доход' },
  { value: '🏪', emoji: '🏪', label: 'Покупки' },
]

const colorOptions = ['#4287f5', '#42b883', '#f5a442', '#f54242', '#a142f5', '#42d4f5', '#f542b3', '#8b8b8b']

const schema = toTypedSchema(
  z.object({
    type: z.enum([CategoryType.Income, CategoryType.Expense], { required_error: 'Выберите тип' }),
    name: z.string({ required_error: 'Введите название' }).min(1, 'Введите название').max(50, 'Максимум 50 символов'),
    icon: z.string({ required_error: 'Выберите иконку' }).min(1, 'Выберите иконку'),
    color: z.string({ required_error: 'Выберите цвет' }).min(1, 'Выберите цвет'),
  }),
)

const { defineField, handleSubmit, errors, isSubmitting, setErrors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    type: CategoryType.Expense,
    name: '',
    icon: '',
    color: '#4287f5',
  },
})

const [type] = defineField('type')
const [name, nameProps] = defineField('name')
const [icon] = defineField('icon')
const [color] = defineField('color')

const emit = defineEmits<{
  created: []
}>()

const openModal = () => {
  isModalOpen.value = true
}

const cancel = () => {
  isModalOpen.value = false
  resetForm()
}

const handleDismiss = () => {
  isModalOpen.value = false
  resetForm()
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await createCategory({ ...values, walletId: props.walletId })
    isModalOpen.value = false
    resetForm()
    emit('created')
  } catch (error) {
    console.error('Ошибка создания категории:', error)
    setErrors({
      name: getErrorMessage(error),
    })
  }
})
</script>

<style scoped>
.category-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 16px;
}

.category-form ion-input,
.category-form ion-select {
  --border-radius: 8px;
  --padding-start: 12px;
  --padding-end: 12px;
}

.category-form ion-segment {
  --background: var(--ion-color-step-100);
  border-radius: 8px;
  padding: 4px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field-row {
  display: flex;
  gap: 12px;
}

.field-half {
  flex: 1;
  min-width: 0;
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

.color-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--ion-color-medium);
  margin: 0 0 8px 12px;
}

.color-picker-wrapper {
  background: var(--ion-color-step-50);
  border-radius: 8px;
  padding: 12px;
}

.color-picker {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.color-option {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-option:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.color-option.selected {
  border-color: var(--ion-color-primary);
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(var(--ion-color-primary-rgb), 0.4);
}

.color-option:active {
  transform: scale(1.05);
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

.preview-text {
  flex: 1;
  min-width: 0;
}

.preview-text h4 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-badge.type-income {
  background: rgba(var(--ion-color-success-rgb), 0.15);
  color: var(--ion-color-success);
}

.type-badge.type-expense {
  background: rgba(var(--ion-color-danger-rgb), 0.15);
  color: var(--ion-color-danger);
}
</style>
