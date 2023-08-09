<template>
  <div class="inner-page">
    <div class="main">
      <div class="intro">
        <h1>Library of AI components <br>
          built with <span>GPT-4</span> !<i class="bi bi-stars"></i></h1>
        <nuxt-link to="/components/generator" class="try">Try it!</nuxt-link>
      </div>
      <div class="wrap">
        <div class="search-box">
          <input type="text" placeholder="Search for components created by everyone" />
          <button class="search-btn">
            <i class="bi bi-search"></i>
          </button>
        </div>
        <div class="tag-box"></div>
        <div class="content">
          <ComponentsCard v-for="item in 5" />
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

  .search-box {
    display: flex;
    overflow: hidden;
    border-radius: 10px;
    background: #FFF;
    box-shadow: 0px 0px 30px 0px rgba(40, 203, 146, 0.20);
    align-items: center;
    padding-right: 16px;
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
    .search-btn {
      background: none;
      border: 0;
      @include center;
      width: 44px;
      height: 44px;
      cursor: pointer;
      i {
        font-size: 22px;
        color: $mainColor;
      }
    }
  }

  .tag-box {
    margin-bottom: 60px;
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 44px;
    margin: 0 -15px;
    :deep(.card-wrap) {
      width: calc(33.33%);
      margin-bottom: 60px;
      padding: 0 15px;
      box-sizing: border-box;
      display: flex;
    }
  }
}
</style>