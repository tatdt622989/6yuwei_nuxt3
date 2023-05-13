<template>
  <div class="toolbar">
    <button class="add btn" @click="emit('open-editor-modal', 'add')">
      <span class="material-symbols-outlined icon"> add </span>
      <span class="title">New Post</span>
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
  min-width: 0;
  width: auto;
  padding: 0 16px;
  margin: 0 8px;
  letter-spacing: 0.8px;
  font-size: 20px;
  .title {
    font-weight: bold;
    font-size: 20px;
    @include media(480) {
      display: none;
    }
  }
  span {
    margin-right: 6px;
    @include media(480) {
      margin-right: 0;
    }
  }
  .icon {
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
