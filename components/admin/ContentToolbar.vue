<template>
  <div class="toolbar">
    <button class="add btn" @click="emit('open-editor-modal', 'add')">
      <span class="material-symbols-outlined"> add </span>
      New Post
    </button>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["open-editor-modal"]);
</script>

<style lang="scss" scoped>
.toolbar {
  align-items: center;
  display: flex;
  margin: 0 -8px;
}

.btn {
  border: 0;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  font-size: 20px;
  min-width: 0;
  width: auto;
  padding: 0 16px;
  margin: 0 8px;
  letter-spacing: 0.8px;
  span {
    margin-right: 6px;
  }
  &.delete {
    background-color: transparent;
    color: $mainColor;
    border: 2px solid $mainColor;
    &:hover {
      background-color: $mainColor;
      color: $terColor;
    }
  }
}
</style>
