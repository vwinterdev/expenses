<template>
  <default-layout title="Категории">
    <template #header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="backUrl" />
        </ion-buttons>
        <ion-title>Категории</ion-title>
      </ion-toolbar>
    </template>

    <div class="categories-container">
      <ion-list>
        <ion-list-header>
          <ion-label>Мои категории</ion-label>
        </ion-list-header>

        <div v-if="isPending" class="skeleton-list">
          <ion-item v-for="i in 5" :key="i">
            <ion-avatar slot="start">
              <ion-skeleton-text :animated="true" />
            </ion-avatar>
            <ion-label>
              <h3>
                <ion-skeleton-text :animated="true" style="width: 60%" />
              </h3>
              <p>
                <ion-skeleton-text :animated="true" style="width: 40%" />
              </p>
            </ion-label>
          </ion-item>
        </div>

        <div v-else-if="isError || !categories || categories.length === 0" class="empty-state">
          <ion-icon :icon="pricetagsOutline" />
          <p>Категории не найдены</p>
          <ion-text color="medium">
            <p>Создайте свою первую категорию</p>
          </ion-text>
        </div>

        <ion-item-sliding v-for="category in categories" v-else :key="category.id">
          <ion-item>
            <div class="category-icon" :style="{ backgroundColor: category.color }" slot="start">
              {{ category.icon }}
            </div>
            <ion-label>
              <h3>{{ category.name }}</h3>
              <p>
                <ion-badge :color="category.type === 'income' ? 'success' : 'danger'">
                  {{ category.type === 'income' ? 'Доход' : 'Расход' }}
                </ion-badge>
              </p>
            </ion-label>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteCategory(category.id)">
              <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </div>

    <template #fixed>
      <create-category @created="refetch" :walletId="walletId" />
    </template>
  </default-layout>
</template>

<script setup lang="ts">
import {
  IonAvatar,
  IonBackButton,
  IonBadge,
  IonButtons,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonSkeletonText,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { pricetagsOutline, trashOutline } from 'ionicons/icons'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CreateCategory from '@/modules/categories/components/create-category.vue'
import { useCategories } from '@/modules/categories/composables/useCategory'

const route = useRoute()
const walletId = computed(() => Number(route.params.id) as number)

// Определяем URL для кнопки "Назад"
const backUrl = computed(() => (walletId.value ? '/' : '/wallet'))

const { data: categories, isPending, isError, refetch } = useCategories(walletId)

const deleteCategory = async (id: number) => {
  // TODO: Implement delete
  console.log('Delete category', id)
}
</script>

<style scoped>
.categories-container {
  padding: 16px;
}

.skeleton-list ion-item {
  margin-bottom: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
}

.empty-state ion-icon {
  font-size: 64px;
  color: var(--ion-color-medium);
  margin-bottom: 16px;
}

.empty-state p {
  margin: 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

ion-badge {
  font-size: 10px;
  padding: 2px 8px;
}
</style>
