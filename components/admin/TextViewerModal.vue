<template>
  <transition name="modal-fade">
    <div
      v-if="props.isOpen"
      id="textViewerModal"
      :class="['modal', { open: props.isOpen }]"
      tabindex="-1"
      aria-labelledby="textViewerModalLabel"
      aria-hidden="true"
      @click="emit('close-modal')"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" @click="(e) => e.stopPropagation()">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Message</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="emit('close-modal')"
            />
          </div>
          <div class="modal-body container">
            {{ props.message }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["close-modal"]);
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

#textViewerModal {
  @extend %ts;
  display: block;
  backdrop-filter: blur(5px);
  background-color: rgba($mainColor, 0.1);
  &.open {
    opacity: 1;
    .modal-dialog {
      opacity: 1;
    }
  }
  &.modal-fade-enter-active,
  &.modal-fade-leave-active {
    transition: all 0.5s ease-out !important;
  }

  &.modal-fade-enter-from,
  &.modal-fade-leave-to {
    opacity: 0 !important;
  }

  .modal-header {
    .modal-title {
      font-weight: bold;
      color: $secColor;
    }
  }

  .modal-content {
    border-radius: 12px;
    box-shadow: 0 0 10px rgba($terColor, 0.5);
    background: #fff;
    border: 0;
  }

  .modal-body {
    padding: 28px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon {
      font-size: 70px;
      color: $mainColor;
    }
    .title {
      font-weight: bold;
      font-size: 24px;
      color: $secColor;
      text-align: center;
    }
  }
}
</style>
