<template>
  <div class="inner-page">
    <div class="main">
      <div class="intro">
        <h1>Library of AI components <br>
          built with <span>GPT-4</span> !<i class="bi bi-stars"></i></h1>
        <nuxt-link to="/components/generator" class="try">Try it!</nuxt-link>
      </div>
      <div class="wrap">
        <div class="searchBox">
          <input type="text" placeholder="Search for components created by everyone" />
          <i class="bi bi-search"></i>
        </div>
        <div class="tagBox"></div>
        <div class="content">
          <ComponentsCard />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";

useHead({
  title: "Components",
  titleTemplate: "%s - 6yuwei",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "Library of AI components built with GPT-4!",
    },
  ],
});

const store = useStore();
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_setting.scss';

.main {
  padding-top: 56px;

  .wrap {
    max-width: 1480px;
    box-sizing: border-box;
    margin: 0 auto;
  }

  .intro {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h1 {
    text-align: center;
    color: $secColor;
    font-size: 38px;
    letter-spacing: 1.33px;

    span {
      background: linear-gradient(90deg, $fiveColor, $sixColor);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    i {
      margin-left: 10px;
    }
  }

  .try {
    margin: 0 auto;
    background: linear-gradient(90deg, $fiveColor, $sixColor);
    color: #fff;
    width: 200px;
    height: 56px;
    border-radius: 10px;
    box-shadow: 0px 0px 32px 0px rgba(87, 94, 255, 0.33);
    color: #FFF;
    font-size: 24px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    letter-spacing: 0.6px;
    text-align: center;
    @include center;
    margin-bottom: 70px;
    @extend %ts;
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
    }
  }

  .searchBox {
    display: flex;
    overflow: hidden;
    border-radius: 10px;
    background: #FFF;
    box-shadow: 0px 0px 30px 0px rgba(40, 203, 146, 0.20);
    input {
      width: 100%;
      height: 52px;
      border: 0;
      padding: 0 20px;
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0.7px;
      color: $mainColor;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: #A6E1CB;
      }
    }
  }
}
</style>