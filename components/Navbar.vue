<template>
  <ul>
    <li>
      <NuxtLink to="/websites" @click="emit('close-menu')" :class="{current: unitName === 'websites'}">Websites</NuxtLink>
    </li>
    <li>
      <NuxtLink to="/components" @click="emit('close-menu')" :class="{current: unitName === 'components'}">Component</NuxtLink>
    </li>
    <li>
      <a href="https://blog.6yuwei.com">Blog</a>
    </li>
    <li>
      <NuxtLink to="/3dcgs"  @click="emit('close-menu')" :class="{current: unitName === '3dcgs'}">3DCGs</NuxtLink>
    </li>
    <li>
      <NuxtLink to="/animations"  @click="emit('close-menu')" :class="{current: unitName === 'animations'}">Animations</NuxtLink>
    </li>
    <li v-if="place === 'header'">
      <NuxtLink to="/admin/login/" class="signIn" v-if="!store.user">Sign in</NuxtLink>
      <NuxtLink to="/admin/account/" class="avatar" v-if="store.user">
        <img :src="avatArURL" alt="avatar" v-if="avatArURL">
        <i class="bi bi-person-fill" v-else></i>
      </NuxtLink>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";

const props = defineProps({
  place: {
    type: String,
    default: "header",
  },
});
const emit = defineEmits(["close-menu"]);
const current = ref(0);
const route = useRoute();
const unitName = computed(() => route.path.split("/")[1]);
const store = useStore();
const avatArURL = computed(() => {
  if (store.user) {
    return `${store.api}/admin/uploads/${store.user._id}/${store.user.photo}`;
  }
});

onMounted(() => {
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_setting.scss';
ul {
  display: flex;
  align-items: center;
  li {
    margin: 0 30px;
    &:last-child {
      margin-right: 0;
    }
    a {
      color: $secColor;
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
      &:hover, &.current {
        color: $mainColor;
        &::after {
          width: 100%;
        }
      }
    }
    .signIn {
      background-color: $mainColor;
      color: #fff;
      padding: 8px 16px;
      border-radius: 12px;
      @extend %ts;
      box-shadow: 0 0 20px rgba($mainColor, 0.3);
      &::after {
        display: none;
      }
      &:hover {
        background-color: $secColor;
      }
    }

    .avatar {
      display: flex;
      overflow: hidden;
      border-radius: 999px;
      width: 56px;
      height: 56px;
      border: 2px solid $mainColor;
      @include center;
      background-color: lighten($secColor, 5%);
      i {
        font-size: 36px;
        color: $terColor;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
