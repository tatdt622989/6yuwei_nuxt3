<template>
  <ul>
    <li>
      <NuxtLink to="/websites" :class="{ current: unitName === 'websites' }">Websites</NuxtLink>
    </li>
    <li>
      <NuxtLink to="/components" :class="{ current: unitName === 'components' }">Component</NuxtLink>
    </li>
    <li>
      <a href="https://blog.6yuwei.com">Blog</a>
    </li>
    <li>
      <NuxtLink to="/3dcgs" :class="{ current: unitName === '3dcgs' }">3DCGs</NuxtLink>
    </li>
    <li>
      <NuxtLink to="/animations" :class="{ current: unitName === 'animations' }">Animations</NuxtLink>
    </li>
    <li v-if="place === 'header'" class="account" :class="{ 'no-login': !store.user }">
      <NuxtLink to="/admin/login/" class="sign-in" v-if="!store.user && store.isUserChecked">Sign in</NuxtLink>
      <NuxtLink to="/admin/account/" id="avatar" v-else="store.user">
        <img :src="avatArURL" alt="avatar" v-if="avatArURL">
        <i class="bi bi-person-fill" v-else></i>
      </NuxtLink>
      <span id="user-name" v-if="userName">{{ userName }}</span>
      <div class="user-menu" v-if="store.user">
        <ul>
          <li>
            <NuxtLink to="/admin/account/">Account</NuxtLink>
          </li>
          <li>
            <a href="javascript:;" @click="logout">Logout</a>
          </li>
        </ul>
      </div>
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
  if (store.user && store.user.photo) {
    return `${store.api}/admin/uploads/${store.user._id}/${store.user.photo}`;
  }
});
const userName = computed(() => {
  if (store.user) {
    return store.user.username;
  }
});
let resize = () => {
  emit('close-menu');
}

async function logout() {
  try {
    const res: { msg: string } = await $fetch(`${store.api}/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (res.msg === "Successful logout") {
      store.user = null;
      store.isUserChecked = true;
      store.pushNotification({
        type: "success",
        message: res.msg,
        timeout: 5000,
      });
      return navigateTo("/");
    }

  } catch (err) {
    console.log(err);
  }
}

onMounted(() => {
  window.addEventListener('resize', resize);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
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

      &:hover,
      &.current {
        color: $mainColor;

        &::after {
          width: 100%;
        }
      }
    }

    .sign-in {
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

    &.account {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      &:not(.no-login):hover {
        .user-menu {
          opacity: 1;
          pointer-events: auto;
        }
      }
      @include media(1200) {
        flex-wrap: wrap;
      }
    }

    .user-menu.user-menu {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: $mainColor;
      border-radius: 12px;
      box-shadow: 0 0 20px rgba($mainColor, 0.3);
      padding: 10px 0;
      opacity: 0;
      pointer-events: none;
      z-index: 99;
      display: flex;
      @extend %ts;
      flex-direction: column;
      overflow: hidden;

      @include media(1200) {
        opacity: 1;
        pointer-events: auto;
        position: static;
        transform: none;
        width: 100%;
        margin-top: 16px;
        padding: 0;
      }

      ul {
        padding: 0;
        margin: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        min-width: 150px;
        width: 100%;
        @include media(1200) {
          padding: 0;
        }

        li {
          margin: 0;
          display: flex;
          width: 100%;
          padding: 0;
          &:last-of-type {
            a {
              border: 0;
            }
          }
          a {
            border-color: $terColor;
            text-align: center;
            color: $secColor;
            padding: 8px 20px;
            width: 100%;
            @extend %ts;
            font-size: 18px;

            @include media(1200) {
              padding: 10px 20px;
            }

            &:hover {
              background-color: lighten($mainColor, 5%);
            }
          }
        }
      }
    }

    #avatar {
      display: flex;
      overflow: hidden;
      border-radius: 999px;
      width: 56px;
      height: 56px;
      border: 2px solid $mainColor;
      @include center;
      background-color: lighten($secColor, 5%);
      flex-shrink: 0;
      margin: 10px 0;
      position: relative;
      padding: 0;


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

    #user-name {
      font-size: 20px;
      font-weight: bold;
      min-width: 0;
      padding-left: 10px;
      @include clamp(1);

      @include media(-1201) {
        display: none;
      }
    }
  }
}</style>
