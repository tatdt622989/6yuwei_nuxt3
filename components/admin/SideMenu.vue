<template>
  <div id="sidebar" :class="{ open: open }">
    <div class="logo">
      <NuxtLink to="/">
        <img src="@/assets/images/logo.svg" alt="6yuwei" />
      </NuxtLink>
    </div>
    <transition name="fade">
      <ul v-if="open">
        <!-- <li>
          <NuxtLink to="/admin/">
            <i class="bi bi-clipboard-data-fill"></i>
            <span class="text">Dashboard</span>
            <span class="material-icons arrow">
              arrow_forward_ios
            </span>
          </NuxtLink>
        </li> -->
        <li>
          <NuxtLink
            to="/admin/websites/"
            :class="{ active: currentPath === '/admin/websites/' }"
          >
            <i class="bi bi-window-sidebar"></i>
            <span class="text">Websites</span>
            <span class="material-icons arrow"> arrow_forward_ios </span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/admin/3dcgs/"
            :class="{ active: currentPath === '/admin/3dcgs/' }"
          >
            <i class="bi bi-box"></i>
            <span class="text">3DCG</span>
            <span class="material-icons arrow"> arrow_forward_ios </span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/admin/animations/"
            :class="{ active: currentPath === '/admin/animations/' }"
          >
            <i class="bi bi-film"></i>
            <span class="text">Animation</span>
            <span class="material-icons arrow"> arrow_forward_ios </span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/admin/contact/"
            :class="{ active: currentPath === '/admin/contact/' }"
          >
            <i class="bi bi-person-lines-fill"></i>
            <span class="text">Contact</span>
            <span class="material-icons arrow"> arrow_forward_ios </span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/admin/member/"
            :class="{ active: currentPath === '/admin/member/' }"
          >
            <i class="bi bi-people-fill"></i>
            <span class="text">Member</span>
            <span class="material-icons arrow"> arrow_forward_ios </span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/admin/account/"
            :class="{ active: currentPath === '/admin/account/' }"
          >
            <i class="bi bi-person-circle"></i>
            <span class="text">Account</span>
            <span class="material-icons arrow"> arrow_forward_ios </span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/admin/application/"
            :class="{ active: currentPath === '/admin/application/' }"
          >
            <i class="bi bi-app-indicator"></i>
            <span class="text">Application</span>
            <span class="material-icons arrow"> arrow_forward_ios </span>
          </NuxtLink>
        </li>
      </ul>
    </transition>
    <div class="toggler">
      <button @click="open = !open">
        <span class="line"></span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const currentPath = computed(() => route.path);
const open = ref(false);

watch(
  () => route.path,
  (value) => {
    if (window.innerWidth < 1201) {
      open.value = false;
    }
  }
);

onMounted(() => {
  if (window.innerWidth > 1200) {
    open.value = true;
  } else {
    open.value = false;
  }
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1200) {
      open.value = true;
    } else {
      open.value = false;
    }
  });
});
</script>

<style lang="scss">
#sidebar {
  box-sizing: border-box;
  width: 250px;
  flex-shrink: 0;
  // border-right: 1px solid $light;
  // box-shadow: 0 0 10px rgba(darken($mainColor, 10%), 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  background-color: $terColor;
  overflow: hidden;
  border-radius: 0 40px 40px 0;
  justify-content: space-between;
  align-items: center;
  @include media(1600) {
    width: 200px;
  }
  @include media(1200) {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 0 20px;
    border-radius: 0;
    overflow: visible;
    box-shadow: 0 0 10px darken($terColor, 15%);
    z-index: 99;
  }
  .logo {
    display: flex;
    padding: 20px;
    justify-content: flex-start;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 10px;
    @include media(1200) {
      width: auto;
      padding: 10px 0px;
      margin-bottom: 0;
    }
    img {
      width: auto;
      @include media(1600) {
        width: 120px;
      }
      @include media(1200) {
        height: 45px;
        width: auto;
      }
    }
    h1 {
      font-size: 18px;
      margin-bottom: 0;
      font-weight: bold;
      color: $mainColor;
      line-height: 1;
      padding-left: 10px;
      padding-top: 8px;
      span {
        font-size: 28px;
      }
    }
  }
  ul {
    list-style: none;
    margin-bottom: 0;
    display: flex;
    flex-grow: 1;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    @include media(1200) {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      position: absolute;
      top: 65px;
      left: 0;
      background-color: darken($terColor, 5%);
      height: calc(100vh - 65px);
      align-content: flex-start;
      padding: 20px 10px;
      opacity: 1;
      pointer-events: none;
      width: 100%;
      box-sizing: border-box;
      z-index: -1;
    }
    li {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      padding: 10px 20px;
      @include media(1600) {
        padding: 10px;
      }
      a {
        width: 100%;
        font-size: 16px;
        font-weight: 500;
        display: flex;
        justify-content: flex-start;
        background-color: $terColor;
        color: $secColor;
        align-items: center;
        height: 44px;
        font-weight: bold;
        border-radius: 8px;
        padding: 0 4px 0 14px;
        @extend %ts;
        @include media(1200) {
          background-color: transparent;
        }
        &:hover,
        &.active {
          color: $fourColor;
          background-color: lighten($terColor, 5%);
          @include media(1200) {
            background-color: $terColor;
          }
        }
        .text {
          flex-grow: 1;
        }
        span {
          margin-right: 10px;
        }
        .arrow {
          font-size: 13px;
        }
        i {
          font-size: 22px;
          margin-right: 10px;
        }
      }
    }
  }
  .toggler {
    @include media(-1201) {
      display: none;
    }
    button {
      width: 52px;
      height: 52px;
      display: flex;
      background: transparent;
      border: 0;
      @include center;
      border-radius: 999px;
      cursor: pointer;
      @extend %ts;
      &:hover {
        // background-color: lighten($terColor, 5%);
      }
      .line {
        width: 28px;
        height: 2px;
        background-color: $secColor;
        position: relative;
        margin: 10px 0;
        @extend %ts;
        @include before {
          @extend %ts;
          width: 100%;
          height: 2px;
          background-color: $secColor;
          top: -10px;
          left: 0;
        }
        @include after {
          @extend %ts;
          width: 100%;
          height: 2px;
          background-color: $secColor;
          top: 10px;
          left: 0;
        }
      }
    }
  }
  &.open {
    @include media(1200) {
      width: 100%;
      ul {
        pointer-events: auto;
      }
      .toggler {
        .line {
          background: transparent;
          &::before {
            @include center(transform, y);
            transform: rotate(45deg);
          }
          &::after {
            @include center(transform, y);
            transform: rotate(-45deg);
          }
        }
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s ease-out !important;
  }

  .fade-enter-from,
  .fade-leave-to {
    // display: none;
    opacity: 0 !important;
  }
}
</style>
