<template>
  <div aria-live="polite" aria-atomic="true" class="position-relative">
    <div class="toast-container position-fixed end-0 p-3">
      <transition-group name="toasts">
        <div
          v-for="item in notifications"
          :key="item.id"
          :class="[
            'toast',
            'align-items-center',
            'text-white',
            'border-0',
            'show',
            { 'bg-danger': item.type === 'error' },
            { 'bg-primary': item.type === 'success' },
          ]"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div class="d-flex">
            <div class="toast-body">{{ item.message }}</div>
            <button
              @click="removeNotification(item.id || 0)"
              type="button"
              class="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
    </transition-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
const store = useStore();
const notifications = computed(() => store.notifications);

const removeNotification = (id: number) => {
  store.removeNotification(id);
};
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

.toast-container {
  top: 10px;
  z-index: 9999;
  .toast {
    box-shadow: 0 0 15px rgba($mainColor, 0.5);
    &.bg-danger {
      box-shadow: 0 0 15px rgba($red, 0.5);
      .toast-body {
        color: #fff;
      }
    }
    &.bg-success {
      background-color: $mainColor;
    }
    .toast-body {
      color: $secColor;
      font-weight: bold;
    }
  }
}

.toasts-enter-active,
.toasts-leave-active {
  transition: all 0.5s ease !important;
}
.toasts-enter-from,
.toasts-leave-to {
  opacity: 0 !important;
  transform: translateX(30px) !important;
}
</style>
