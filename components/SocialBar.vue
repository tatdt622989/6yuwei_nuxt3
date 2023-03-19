<template>
  <ul class="socialList">
    <li>
      <a class="item" href="">
        <img src="@/assets/images/facebook.svg" alt="facebook">
      </a>
    </li>
    <li>
      <a class="item" href="">
        <img src="@/assets/images/linkedin.svg" alt="linkedin">
      </a>
    </li>
    <li>
      <a class="item" href="">
        <img src="@/assets/images/mail.svg" alt="mail">
      </a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
</script>

<style lang="scss">
.socialList {
  right: 0;
  background-color: #fff;
  box-shadow: 0px 0px 32px rgba(40, 203, 146, 0.3);
  @include center(transform, y);
  position: fixed;
  z-index: 99;
  border-radius: 10px 0 0 10px;
  li {
    width: 60px;
    height: 60px;
    @include center;
    a {
      display: flex;
      width: 100%;
      height: 100%;
      @include center;
      @extend %ts;
      &:hover {
        transform: rotate(15deg);
      }
    }
  }
}
</style>
