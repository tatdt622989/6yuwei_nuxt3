<template>
  <div>
    <ClientOnly>
      <div class="main">
        <AdminSideMenu />
        <div class="layout">
          <AdminHeader />
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";

const store = useStore();
const keyword = ref('');
provide('keyword', keyword);

store.isUserChecked = true;
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  min-height: 100vh;
  background-color: lighten($terColor, 5%);

  @include media(1200) {
    flex-direction: column;
  }
}

.layout {
  flex-grow: 1;
  flex-direction: column;
  align-items: stretch;
  display: flex;

  @include media(1200) {
    padding-top: 65px;
  }

  .content {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    flex-grow: 1;
    background-color: lighten($terColor, 5%);
    padding: 0 36px 0;
    flex-direction: column;
    padding-bottom: 36px;

    @include media(1400) {
      padding: 0 20px;
      padding-bottom: 20px;
    }

    :deep(h2.title) {
      font-weight: 800;
      font-size: 32px;
      margin: 0;
      line-height: 52px;
      padding-left: 6px;
      letter-spacing: 0.8px;
      color: $secColor;

      @include media(768) {
        font-size: 28px;
      }
    }
  }
}
</style>
