<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const title = ref('test');

useServerSeoMeta({
  title: `${title.value}`,
  ogTitle: 'My Amazing Site',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
});

onMounted(() => {
  console.log(route.params.id);
});
</script>

<style lang="scss" scoped></style>