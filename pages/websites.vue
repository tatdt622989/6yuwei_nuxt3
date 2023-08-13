<template>
  <div class="inner-page">
    <Banner :unit-name="'Websites'" :describe="'Websites created using various technologies'" />
    <div class="main">
      <div class="wrap">
        <div class="tools">
          <div class="item active-category-box">
            <div class="category-wrap">
              <div class="category" v-for="(item, index) in categoryArr" :key="Date.now() + index">
                <span class="text">{{ item }}</span>
                <span class="remove">
                  <span class="material-icons" @click="removeCategory(item)">
                    close
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div class="item filter">
            <button class="btn" @click="filterModal.open = true">
              <span class="material-icons"> filter_alt </span>
            </button>
          </div>
          <div class="item layout">
            <button class="btn" @click="layoutToggler">
              <span class="material-icons">{{
                layout !== "card" ? "grid_view" : "view_list"
              }}</span>
            </button>
          </div>
          <div class="item sort">
            <div class="selectWrap">
              <select v-model="sort" name="" class="select">
                <option value="0" disabled>Sort By</option>
                <option value="asc">old -> new</option>
                <option value="desc">new -> old</option>
              </select>
            </div>
          </div>
        </div>
        <div class="content" :class="[layout]">
          <div class="item card" v-for="website in websites" :key="website._id">
            <div class="item-content">
              <div class="img-wrap">
                <NuxtLink :to="`/website/${website._id}`">
                  <img v-if="website.photos[0]" :src="`${store.api}/admin/uploads/${website.photos[0]?.url}`"
                    :alt="website.title" />
                </NuxtLink>
              </div>
              <div class="info">
                <p class="category">{{ website.category }}</p>
                <h3 class="title">
                  {{ website.title }}
                </h3>
                <p class="desc">
                  {{ website.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Pagination :total="totalPage" :url="'/websites/'" />
      </div>
    </div>
    <FilterModal :is-open="filterModal.open" :active-category-arr="categoryArr" :unit-name="'websites'"
      @close-modal="filterModal.open = false" @set-category-arr="setCategoryArr" />
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
const route = useRoute();
const layout = ref("card");
const sort = ref(route.query.sort || "desc");
const currentPage = computed(() => {
  return route.query.page ? parseInt(route.query.page as string, 10) : 1;
});
const total = ref(0);
const totalPage = ref(1);
const websites = ref<Website[]>([]);
const categoryArr = ref<string[]>([]);
const filterModal = ref({
  open: false,
  data: {},
});

store.isLoading = true;
const { data: websiteRes, error } = await useFetch(`${store.api}/websites/list/?page=${currentPage.value}&sort=${sort.value}`);
store.isLoading = false;

interface ResRef {
  list: Website[];
  total: number;
  totalPage: number;
}

if (websiteRes.value) {
  const res = websiteRes.value as ResRef;
  websites.value = res.list as Website[];
  total.value = res.total;
  totalPage.value = res.totalPage;
}

const layoutToggler = () => {
  layout.value = layout.value === "card" ? "list" : "card";
  try {
    localStorage.setItem("layout", layout.value);
  } catch (error) {
    console.log(error);
  }
};

const setCategoryArr = (arr: string[]) => {
  categoryArr.value = arr;
};

const removeCategory = (category: string) => {
  categoryArr.value = categoryArr.value.filter((item) => item !== category);
};

const getList = async (page: number = 1) => {
  store.isLoading = true;
  let api = `${store.api}/websites/list/?page=${page}&sort=${sort.value}&category=${categoryArr.value.join(
    ","
  )}`;
  const res = await $fetch(api, {
    method: "GET",
    credentials: "include",
  }).catch((err) => {
    if (err) {
      store.pushNotification({
        type: "error",
        message: 'Can not get websites list',
        timeout: 5000,
      });
      return 'error';
    }
  });

  if (res === 'error') {
    store.isLoading = false;
    return;
  }

  const data = res as {
    msg: string;
    list: Array<Website>;
    total: number;
    totalPage: number;
  };

  if (data) {
    total.value = data.total;
    totalPage.value = data.totalPage;
    websites.value = data.list;
  }
  store.isLoading = false;
};

watch(sort, async () => {
  await getList();
});

watch(categoryArr, async () => {
  await getList();
});

watch(currentPage, async () => {
  await getList(currentPage.value);
});

onMounted(async () => {
  const category = decodeURIComponent((route.query.category ?? '') as string);
  if (category) {
    setCategoryArr(category ? (category as string).split(",") : []);
  }
  try {
    const layoutStorage = localStorage.getItem("layout");
    if (layoutStorage) {
      layout.value = layoutStorage;
    }
  } catch (error) {
    console.log(error);
  }
});
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
  align-items: flex-start;
  flex-wrap: wrap;

  @include media(1200) {
    margin-bottom: 40px;
  }

  @include media(768) {
    justify-content: flex-start;
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
      margin-bottom: 10px;

      @include after {
        background: no-repeat url(@/assets/images/select_arrow.svg) center/contain;
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
      color: $secColor;

      &:active,
      &:focus {
        outline: 0;
      }
    }

    &.active-category-box {
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
      margin-left: 0;

      @include media(768) {
        width: 100%;
        order: 10;
        flex-shrink: 0;
        padding-top: 10px;
      }
    }
  }

  .category-wrap {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-left: -5px;

    @include media(768) {
      width: 100%;
    }

    .category {
      display: flex;
      align-items: center;
      max-width: 160px;
      background: $mainColor;
      padding: 7px 6px;
      padding-left: 14px;
      border-radius: 12px;
      margin: 0 5px;
      margin-bottom: 10px;

      .text {
        font-weight: bold;
        font-size: 18px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .remove {
        cursor: pointer;
        @include center;
      }
    }
  }
}

.content {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -20px;

  .img-wrap {
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

    a {
      display: flex;
      width: 100%;
      height: 100%;
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
      line-height: 1.5;
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

  &.list {
    .item {
      width: 100%;
    }

    .item-content {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      width: 100%;

      @include media(768) {
        display: block;
      }

      .img-wrap {
        max-width: 420px;
        flex-shrink: 0;
        height: 280px;
        display: flex;
        align-items: stretch;

        @include media(1024) {
          max-width: 300px;
          height: 200px;
        }

        @include media(768) {
          max-width: 100%;
          height: auto;
          min-height: 300px;
        }

        img {
          display: flex;
          min-height: 300px;
          width: 100%;
          height: auto;
          object-fit: cover;
        }
      }

      .info {
        padding-left: 20px;

        .category {
          font-size: 18px;
        }

        .desc {
          line-height: 1.4;
        }

        .title {
          font-size: 28px;
        }

        @include media(768) {
          padding-left: 0;
        }
      }
    }
  }
}
</style>
