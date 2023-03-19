<template>
  <header>
    <div class="wrap">
      <NuxtLink to="/">
        <img src="@/assets/images/logo.svg" alt="6yuwei">
      </NuxtLink>
      <button :class="{ open: isMenuOpen }" class="toggler" @click="openMenu">
        <span class="bar"></span>
      </button>
    </div>
    <div class="menu m_menu" :class="{ open: isMenuOpen }">
      <nav>
        <Navbar />
      </nav>
      <SocialBar />
    </div>
  </header>
</template>

<script lang="ts" setup>
const isMenuOpen = ref(false);
const openMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

onMounted(() => {
  document.body.style.overflow = "";
})
</script>

<style lang="scss" scoped>
header {
  padding: 0 90px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 0px 16px rgba(40, 203, 146, 0.3);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  box-sizing: border-box;
  background-color: $terColor;
  @include media(1600) {
    padding: 0 20px;
  }
  @include media(1200) {
    box-shadow: none;
    padding: 0;
    height: 75px;
  }
  .wrap {
    @include media(1200) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      box-shadow: 0px 0px 16px rgba(40, 203, 146, 0.3);
      padding: 0 20px;
      height: 75px;
      position: relative;
      z-index: 2;
    }
  }
}

.menu {
}

.m_menu {
  @include media(1200) {
    display: none;
  }
  .socialList {
    display: none;
    @include media(1200) {
      display: flex;
    }
  }
}

.m_menu.open {
  position: absolute;
  display: flex;
  top: 75px;
  width: 100%;
  height: 100%;
  left: 0;
  height: calc(100vh - 75px);
  flex-direction: column;
  background-color: $terColor;
  align-items: center;
  :deep(nav) {
    width: 100%;
  }
  :deep(ul) {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 30px;
    align-items: stretch;
    li {
      width: 100%;
      margin: 0;
      padding: 0 20px;
      box-sizing: border-box;
      a {
        border-bottom: 1px solid darken($terColor, 10%);
        box-sizing: border-box;
        display: block;
        text-align: center;
        padding: 20px 20px;
        &::after {
          content: normal;
        }
      }
    }
  }
  :deep(.socialList) {
    box-shadow: none;
    position: static;
    background: none;
    transform: none;
    flex-direction: row;
    padding: 30px 20px;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    padding-top: 60px;
    li {
      border: 0;
      padding: 0 10px;
      width: auto;
      a {
        width: 52px;
        height: 52px;
        color: $mainColor;
        background-color: lighten($terColor, 5%);
        border: 0;
        box-sizing: border-box;
        border-radius: 99px;
        @include center;
        img {
          // filter: brightness(0) invert(1);
        }
      }
    }
  }
}

.toggler {
  @include media(-1200) {
    display: none;
  }
  @include center;
  border: 0;
  background-color: transparent;
  display: flex;
  width: 60px;
  height: 60px;
  span {
    display: block;
    height: 4px;
    width: 28px;
    background-color: $mainColor;
    transform-origin: center;
    @extend %ts;
    position: relative;
    &::before {
      left: 0;
      right: 0;
      margin: 0 auto;
      content: "";
      background-color: $mainColor;
      width: 100%;
      height: 4px;
      position: absolute;
      top: -8px;
      transform-origin: center;
      @extend %ts;
    }
    &::after {
      transform-origin: center;
      left: 0;
      right: 0;
      margin: 0 auto;
      content: "";
      background-color: $mainColor;
      width: 100%;
      height: 4px;
      position: absolute;
      bottom: -8px;
      @extend %ts;
    }
  }
  &.open {
    span {
      height: 0;
      &::before {
        transform: rotate(45deg);
        top: -2px;
      }
      &::after {
        bottom: -2px;
        transform: rotate(-45deg);
      }
    }
  }
}
</style>
