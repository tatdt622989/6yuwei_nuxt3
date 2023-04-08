<template>
  <div class="main">
    <AdminSideMenu />
    <div class="layout">
      <AdminHeader />
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss">
.main {
  display: flex;
  min-height: 100vh;
  background-color: lighten($terColor, 5%);
}
.layout {
  flex-grow: 1;
  flex-direction: column;
  align-items: stretch;
  display: flex;
  .content {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    flex-grow: 1;
    background-color: lighten($terColor, 5%);
    padding: 0 36px 0;
    flex-direction: column;
    h2.title {
      font-weight: 800;
      font-size: 32px;
      margin: 0;
      line-height: 52px;
      padding-left: 6px;
      letter-spacing: 0.8px;
    }
  }
}
</style>
