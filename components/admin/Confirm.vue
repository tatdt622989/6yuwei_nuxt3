<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      id="confirmModal"
      :class="['modal', { open: isOpen }]"
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
            <div class="title">Are you sure you want to delete it?</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn cancel">Cancel</button>
            <button type="button" class="btn btn-primary">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close-modal"]);

const isOpen = ref(props.isOpen);
</script>

<style lang="scss" scoped>
#confirmModal {
  &.modal-fade-enter-active,
  &.modal-fade-leave-active {
    transition: all 0.5s ease-out !important;
  }

  &.modal-fade-enter-from,
  &.modal-fade-leave-to {
    opacity: 0 !important;
  }
}
</style>