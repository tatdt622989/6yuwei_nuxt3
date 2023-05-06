<template>
  <div class="inner-page">
    <Banner
      :unit-name="'Websites'"
      :describe="'Websites created using various technologies'"
    />
    <div class="main">
      <div class="wrap">
        <div class="tools">
          <div class="item filter">
            <button class="btn">
              <span class="material-icons"> filter_alt </span>
            </button>
          </div>
          <div class="item layout">
            <button class="btn" @click="sortToggler">
              <span class="material-icons">{{
                layout !== "card" ? "grid_view" : "view_list"
              }}</span>
            </button>
          </div>
          <div class="item sort">
            <div class="selectWrap">
              <select v-model="sort" name="" class="select">
                <option value="0">Sort By</option>
                <option value="1">old -> new</option>
                <option value="2">new -> old</option>
              </select>
            </div>
          </div>
        </div>
        <div class="content" :class="[layout]">
          <div class="item card" v-for="website in websites" :key="website._id">
            <div class="item-content">
              <div class="imgWrap" @click="linkTo(website)">
                <img
                  v-if="website.photos[0]"
                  :src="`${store.api}/admin/uploads/${website.photos[0]?.url}`"
                  :alt="website.title"
                />
              </div>
              <div class="info">
                <p class="category">{{ website.category }}</p>
                <h3 class="title">
                  {{ website.title }}
                </h3>
                <p class="desc">
                  {{ website.description }}
                </p>
                <!-- <div class="btnWrap">
                  <a href="#" class="btn">
                    READ MORE
                  </a>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <Pagination :total="totalPage" :current-page="currentPage" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Website } from "~/types";
import { useStore } from "~/store";

useHead({
  title: "Websites",
  titleTemplate: "%s - 6yuwei",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "6yuwei websites page",
    },
  ],
});

const store = useStore();
const layout = ref("card");
const sort = ref("0");
const currentPage = ref(1);
const total = ref(0);
const totalPage = ref(1);
const websites = ref<Website[]>([]);
const { data: websiteReq, error } = await useFetch(
  `${store.api}/websites/list/?page=${currentPage.value}&sort=${sort.value}`
);

interface ResRef {
  list: Website[];
  total: number;
  totalPage: number;
}

if (websiteReq.value) {
  const res = websiteReq.value as ResRef;
  websites.value = res.list as Website[];
  total.value = res.total;
  totalPage.value = res.totalPage;
}

const sortToggler = () => {
  layout.value = layout.value === "card" ? "list" : "card";
};

const linkTo = (website: Website) => {
  navigateTo(`/website/${website._id}`);
};

onMounted(async () => {});
</script>

<style lang="scss" scoped>
.main {
  background-color: $terColor;
  padding: 60px 0;
  min-height: 0;
  @include media(1200) {
    padding-top: 40px;
  }
  .wrap {
    max-width: 1600px;
    margin: 0 auto;
    box-sizing: border-box;
    width: 100%;
  }
}
.tools {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-bottom: 60px;
  @include media(1200) {
    margin-bottom: 40px;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 6px;
    &.layout {
      flex-grow: 0;
      @include media(768) {
        display: none;
      }
    }
    &.sort {
      margin-left: 20px;
      margin-right: 0;
    }
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 0;
      background-color: transparent;
      // border: 2px solid $secColor;
      cursor: pointer;
      @extend %ts;
      width: 44px;
      height: 44px;
      border-radius: 99px;
      background-color: $terColor;
      &:hover {
        background-color: $mainColor;
      }
    }
    span {
      font-size: 30px;
      color: $secColor;
    }
    .selectWrap {
      position: relative;
      @include after {
        background: no-repeat url(@/assets/images/select_arrow.svg)
          center/contain;
        width: 10px;
        height: 10px;
        right: 8px;
        @include center(transform, y);
      }
    }
    .select {
      border: 0;
      background-color: lighten($terColor, 10%);
      box-shadow: 0 0 10px rgba($mainColor, 0.2);
      height: 44px;
      border-radius: 12px;
      font-size: 20px;
      min-width: 120px;
      padding: 0 24px 0 16px;
      appearance: none;
      font-weight: bold;
      &:active,
      &:focus {
        outline: 0;
      }
    }
  }
}
.content {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -20px;
  .imgWrap {
    width: 100%;
    height: 340px;
    overflow: hidden;
    background-color: #ccc;
    overflow: hidden;
    border-radius: 20px;
    position: relative;
    cursor: pointer;
    background: no-repeat url(@/assets/images/default.png) center/cover;
    @include after {
      border-radius: 20px;
      border: 3px solid transparent;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      @extend %ts;
      pointer-events: none;
    }
    &:hover {
      &::after {
        border-color: $mainColor;
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .info {
    padding: 20px 0;
    background: transparent;
    letter-spacing: 1px;
    .category {
      color: $mainColor;
      font-weight: bold;
      font-size: 16px;
      letter-spacing: 1.1px;
      margin-bottom: 10px;
    }
    .title {
      @extend %ts;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 12px;
      margin-top: 0;
      color: $secColor;
      cursor: pointer;
      &:hover {
        color: $mainColor;
      }
    }
    .desc {
      display: -webkit-box;
      overflow: hidden;
      @extend %ts;
      color: lighten($secColor, 20%);
      font-size: 18px;
      margin-bottom: 20px;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
  .item {
    overflow: hidden;
    padding: 0 20px;
    width: calc(100% / 3);
    box-sizing: border-box;
    margin-bottom: 30px;
    // .item-content {
    //   border: 1px solid $mainColor;
    //   padding: 16px;
    //   border-radius: 20px;
    //   background-color: lighten($terColor, 5%);
    // }
    .btnWrap {
      .btn {
        background: transparent;
      }
    }
  }

  &.card {
    margin: 0 -10px;
    @include media(1200) {
      margin: 0 -10px;
    }
    .item {
      padding: 0 10px;
      @include media(1200) {
        width: calc(100% / 2);
      }
      @include media(768) {
        width: 100%;
      }
    }
  }

  .btn {
  }
}
</style>
