<template>
  <div>
    <Header />
    <slot></slot>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useStore } from "~/store";

const store = useStore();
const { load } = useAuth();

onMounted(() => {
  if (!store.user) load();
});
</script>

<style lang="scss" scoped></style>