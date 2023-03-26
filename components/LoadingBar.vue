<template>
  <div>
    <transition name="bar" v-if="isLoading">
      <div class="bar">
        <div class="bar-inner"></div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
const store = useStore();
const isLoading = computed(() => store.isLoading);
</script>

<style lang="scss" scoped>
.bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  z-index: 9998;
  background-color: #fff;
  opacity: 1;
  transition: opacity 0.5s ease;
  &.bar-enter-active,
  &.bar-leave-active {
    transition: opacity 0.5s ease;
  }
  &.bar-enter-from,
  &.bar-leave-to {
    opacity: 0;
  }
  .bar-inner {
    @keyframes loading {
      from {
        width: 20%;
        left: -20%;
      }
      50% {
        width: 70%;
      }
      to {
        width: 20%;
        left: 100%;
      }
    }
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: $mainColor;
    // transition: width 0.5s ease;
    animation: loading 1.5s linear infinite;
  }
}
</style>
