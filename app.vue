<template>
  <div>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const layout = ref('default');
const route = useRoute()
const router = useRouter()

onMounted(async () => {
})

watchEffect(() => {
  if (route.path.includes('/admin')) {
    if (route.path.includes('/admin/login') || route.path.includes('/admin/signup')) {
      layout.value = 'no-layout';
    } else {
      layout.value = 'admin-default';
    }
  } else {
    layout.value = 'default';
  }
})
</script>

<style lang="scss">
</style>
