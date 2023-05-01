<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li
        class="breadcrumb-item active"
        aria-current="page"
        v-for="(item, index) in props.breadcrumb"
        :key="item.url"
      >
        <nuxt-link :to="index === props.breadcrumb.length - 1 ? '' : item.link">
        {{ item.name }}
        </nuxt-link>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
interface Breadcrumb {
  name: string;
  link: string;
}
const props = defineProps({
  breadcrumb: {
    type: Array as PropType<Breadcrumb[]>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";
</style>
