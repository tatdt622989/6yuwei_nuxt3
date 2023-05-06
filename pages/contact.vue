<template>
  <div class="inner-page">
    <div class="main">
      <div class="wrap">
        <Breadcrumb :breadcrumb="breadcrumb" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const breadcrumb = ref([
  { name: "Home", link: "/" },
  { name: "Contact", link: "/contact" },
]);
</script>

<style lang="scss" scoped>
.main {
  padding: 60px 0;
}
.wrap {
  margin: 0 auto;
  max-width: 1600px;
}
</style>
