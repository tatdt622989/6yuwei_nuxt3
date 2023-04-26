<template>
  <transition name="modal-fade">
    <div
      v-if="props.isOpen"
      id="confirmModal"
      :class="['modal', { open: props.isOpen }]"
      tabindex="-1"
      aria-labelledby="confirmModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" @click="(e) => e.stopPropagation()">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Confirm</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="emit('close-modal')"
            />
          </div>
          <div class="modal-body container">
            <i class="bi bi-exclamation-triangle-fill icon"></i>
            <div class="title">Are you sure you want to delete it?</div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn cancel"
              @click="emit('close-modal')"
            >
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="confirm">Apply</button>
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
  isConfirm: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["close-modal", "on-confirm"]);

const confirm = () => {
  emit("on-confirm");
  emit("close-modal");
};
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

#confirmModal {
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

  .modal-footer {
    border-top: 1px solid $terColor;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    margin: 0 -10px;
    .btn {
      padding: 10px 20px;
      border-radius: 12px;
      border: 0;
      background-color: $mainColor;
      color: $secColor;
      font-weight: bold;
      width: calc(50% - 20px);
      margin: 0 10px;
      &.cancel {
        background-color: $terColor;
      }
      &.delete {
        background-color: $dangerColor;
      }
      &:hover {
        color: $mainColor;
        background-color: $secColor;
      }
    }
  }
}
</style>
