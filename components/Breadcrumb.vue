<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li
        class="breadcrumb-item"
        :class="{ active: index === props.breadcrumb.length - 1 }"
        aria-current="page"
        v-for="(item, index) in props.breadcrumb"
        :key="item.link"
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
.breadcrumb {
  @include media(480) {
    display: none;
  }
  .breadcrumb-item {
    margin-bottom: 8px;
    a {
      color: $secColor;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      &:hover {
        color: darken($mainColor, 15%);
      }
    }
    &.active {
      a {
        font-weight: bold;
        color: $secColor;
      }
    }
  }
}
</style>
