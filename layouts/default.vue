<template>
  <div>
    <Header />
    <slot></slot>
    <Footer />
  </div>
</template>

<script setup lang="ts">
const getUserData = useGetUserData();

onMounted(async () => {
  getUserData();
});
</script>

<style lang="scss" scoped></style>