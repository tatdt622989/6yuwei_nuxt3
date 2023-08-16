<template>
  <div>
    <LoadingBar />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toast/>
  </div>
</template>

<script setup lang="ts">
const layout = ref('default');
const route = useRoute();
const router = useRouter();

onMounted(async () => {
})
</script>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
