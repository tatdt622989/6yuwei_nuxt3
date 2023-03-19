<template>
  <footer>
    <div class="logo">
      <img src="@/assets/images/logo_white.svg" alt="6yuwei">
    </div>
    <Navbar class="nav" :place="'footer'" />
    <SocialBar class="footer" />
    <div class="copyright">
      <p>Copyright © 2022 6yuwei.All rights reserved.</p>
    </div>
    <div class="goTop" :class="{'show': isGoTopOpen}" @click="goTop">
      <img src="@/assets/images/gotop_arrow.svg" alt="gotop">
    </div>
  </footer>
</template>

<script lang="ts" setup>
const isGoTopOpen = ref(false)

const goTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  document.addEventListener('scroll', (e) => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    if (scrollTop > 100) {
      isGoTopOpen.value = true
    } else {
      isGoTopOpen.value = false
    }
  })
})
</script>

<style lang="scss">
footer {
  background-color: $secColor;
  display: flex;
  flex-direction: column;
  @include center;
  padding-top: 45px;
  .logo {
    margin-bottom: 36px;
  }
  .socialList.footer {
    position: static;
    display: flex;
    transform: none;
    background: transparent;
    box-shadow: none;
    margin-bottom: 20px;
    li {
      img {
        filter: brightness(0) invert(1);
      }
    }
  }
  .nav.nav {
    margin-bottom: 20px;
    @include media(540) {
      display: flex;
      flex-wrap: wrap;
    }
    li {
      @include media(720) {
        margin: 0 14px;
        a {
          font-size: 18px;
        }
      }
      @include media(540) {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-bottom: 20px;
      }
    }
  }
  .copyright {
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: center;
    border-top: 1px solid lighten($secColor, 10%);
    box-sizing: border-box;
    p {
      color: #fff;
      font-weight: 500;
      font-size: 16px;
      line-height: 30px;
    }
  }
}

.goTop {
  border-radius: 10px;
  width: 60px;
  height: 60px;
  @include center;
  position: fixed;
  right: 72px;
  bottom: 60px;
  background-color: #fff;
  box-shadow: 0px 0px 32px rgba(40, 203, 146, 0.3);
  z-index: 99;
  // border: 1px solid $mainColor;
  transition: all .3s ease-out;
  opacity: 0;
  pointer-events: none;
  @include media(1200) {
    right: 40px;
  }
  @include media(540) {
    right: 20px;
  }
  cursor: pointer;
  &.show {
    opacity: 1;
    pointer-events: auto;
  }
  img {
    width: 36px;
    height: 36px;
    transform: scale(1);
    @extend %ts;
  }
  &:hover {
    transform: rotate(45deg);
    img {
      @extend %ts;
      transform: rotate(-45deg);
      // @include beats(1s, rotate(-45deg));
    }
  }
}
</style>
