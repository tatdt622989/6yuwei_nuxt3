<template>
  <ul>
    <li>
      <NuxtLink to="/websites">Websites</NuxtLink>
    </li>
    <li>
      <a href="https://blog.6yuwei.com">Blog</a>
    </li>
    <li>
      <NuxtLink to="/">3DCGs</NuxtLink>
    </li>
    <li>
      <NuxtLink to="/">Animations</NuxtLink>
    </li>
    <li v-if="place === 'header'">
      <!-- <NuxtLink to="/admin/login/" class="signIn">Sign in</NuxtLink> -->
    </li>
  </ul>
</template>

<script lang="ts" setup>
const props = defineProps({
  place: {
    type: String,
    default: "header",
  },
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_setting.scss';
ul {
  display: flex;
  li {
    margin: 0 30px;
    &:last-child {
      margin-right: 0;
    }
    a {
      color: #8E8E8E;
      font-weight: bold;
      font-size: 20px;
      position: relative;
      @extend %ts;
      &:after {
        content: '';
        position: absolute;
        width: 0;
        height: 5px;
        background: $mainColor;
        left: 0;
        bottom: -9px;
        @extend %ts;
      }
      &:hover {
        color: $mainColor;
        &::after {
          width: 100%;
        }
      }
    }
    .signIn {
      background-color: $mainColor;
      color: #fff;
      padding: 5px 14px;
      border-radius: 5px;
      @extend %ts;
      &::after {
        display: none;
      }
      &:hover {
        background-color: $secColor;
      }
    }
  }
}
</style>
