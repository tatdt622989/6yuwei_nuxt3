<template>
  <div class="inner-page">
    <div class="main" :class="{ 'no-login': !store.user }">
      <div class="head">
        <div class="wrap">
          <ComponentsToolbar />
        </div>
      </div>
      <div class="intro">
        <h1>Library of AI components <br>
          built with <span>GPT-4</span> !<i class="bi bi-stars"></i></h1>
        <nuxt-link :to="`/components/generator/`"
          class="try">Try it!</nuxt-link>
      </div>
      <div class="wrap">
        <div class="search-box">
          <input type="text" placeholder="Search for components created by everyone" v-model="keyword" @keyup="(e) => {
            if (e.code === 'Enter') {
              search();
            }
          }" />
          <button class="search-btn" @click="search">
            <i class="bi bi-search"></i>
          </button>
        </div>
        <div class="tag-box">
          <button class="tag-item" v-for="item in componentsTypeList" :key="item._id" @click="typeSearch(item.title)">
            <span>{{ item.title }}</span>
          </button>
        </div>
        <div class="content">
          <ComponentsCard v-for="item in componentsList" :component="item" :key="item._id"
            :favorites-id-list="favoritesIDList" @update-favorites-list="getFavoriteIDList" />
        </div>
        <Pagination :total="totalPage" :url="'/components/'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Component, ComponentType } from "~/types";
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

interface ComponentsRes {
  msg: string
  components: Component[]
  pageSize: number
  currentPage: number
  total: number
  totalPage: number
};

interface FavoriteRes {
  msg: string
  idList: string[]
}

const store = useStore();
const route = useRoute();
const currentPage = computed(() => {
  return route.query.page ? parseInt(route.query.page as string, 10) : 1;
});
const total = ref(0);
const totalPage = ref(1);

store.isLoading = true;
const { data: componentsTypeList, error: typeListError } = await useFetch<ComponentType[]>(`${store.api}/components/types/`);
const { data: componentsRes, error: listError } = await useFetch<ComponentsRes>(`${store.api}/components/?page=${currentPage.value}`);
store.isLoading = false;

const componentsList = ref<Component[]>([]);
const favoritesIDList = ref<string[]>([]);
const keyword = ref("");

async function search() {
  store.isLoading = true;

  try {
    const res = await $fetch<ComponentsRes>(`${store.api}/components/?page=${currentPage.value}&keyword=${keyword.value}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res) return;
    componentsList.value = res.components;
    totalPage.value = res.totalPage;
  } catch (err) {
    if (err) {
      store.pushNotification({
        type: "error",
        message: err.toString(),
        timeout: 5000,
      });
      return;
    }
  }
  store.isLoading = false;
}

function typeSearch(type: string) {
  keyword.value = type;
  search();
}

async function getList() {
  store.isLoading = true;

  try {
    const res = await $fetch<ComponentsRes>(`${store.api}/components/?page=${currentPage.value}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res) return;
    componentsList.value = res.components;
  } catch (err) {
    if (err) {
      store.pushNotification({
        type: "error",
        message: err.toString(),
        timeout: 5000,
      });
      return;
    }
  }
  store.isLoading = false;
}

async function getFavoriteIDList() {
  store.isLoading = true;
  try {
    const res = await $fetch<FavoriteRes>(`${store.api}/components/favorites/id/`, {
      method: "GET",
      credentials: "include",
    });
    if (!res) return;
    favoritesIDList.value = res.idList;
  } catch (err) {
    if (err) {
      store.pushNotification({
        type: "error",
        message: err.toString(),
        timeout: 5000,
      });
      return;
    }
  }
  store.isLoading = false;
}

if (componentsRes.value) {
  total.value = componentsRes.value.total;
  totalPage.value = componentsRes.value.totalPage;
  componentsList.value = componentsRes.value.components;
}

watch(currentPage, async () => {
  await getList();
});

watch(() => store.user, async () => {
    if (store.user) {
        await getFavoriteIDList();
    }
}, {
    immediate: true,
});

onMounted(async () => {
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_setting.scss';

.main {
  padding-top: 50px;
  padding-bottom: 45px;

  // &.no-login {
  //   padding-top: 70px;
  // }

  @include media(768) {
    padding-top: 45px;
  }

  .wrap {
    max-width: 1480px;
    box-sizing: border-box;
    margin: 0 auto;

    &:deep(.tool-box) {
      justify-content: flex-end;
    }
  }

  .intro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 20px;
  }

  h1 {
    text-align: center;
    color: $secColor;
    font-size: 38px;
    letter-spacing: 1.33px;
    margin: 20px 0 36px;

    @include media(768) {
      font-size: 32px;
      margin-bottom: 24px;
    }

    @include media(576) {
      font-size: 28px;
    }

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
    margin-bottom: 50px;
    @extend %ts;
    cursor: pointer;

    @include media(768) {
      margin-bottom: 38px;
    }

    @include media(576) {
      font-size: 20px;
      width: 180px;
    }

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
    margin-bottom: 16px;

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
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin: 0 -8px;
    margin-bottom: 52px;

    @include media(768) {
      margin-bottom: 45px;
    }

    .tag-item {
      border: 2px solid $mainColor;
      border-radius: 10px;
      color: $mainColor;
      border-color: $mainColor;
      padding: 0 20px;
      background: none;
      cursor: pointer;
      @extend %ts;
      margin: 0 8px;
      margin-bottom: 8px;

      @include media(768) {
        padding: 0 10px;
      }

      &:hover {
        background: $mainColor;
        color: $secColor;
      }

      span {
        font-size: 20px;
        line-height: 36px;

        @include media(768) {
          font-size: 18px;
        }
      }
    }
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

      @include media(1200) {
        width: 50%;
        margin-bottom: 40px;
      }

      @include media(768) {
        width: 100%;
      }

      @include media(576) {
        margin-bottom: 20px;
      }
    }
  }
}
</style>