<template>
  <header id="header">
    <div :class="['searchBox', { focus: isFocus }]" v-if="hasSearch">
      <input id="headerSearch" type="search" name="" placeholder="Search" @focus="isFocus = true" @blur="isFocus = false"
        v-model="keyword" />
      <button class="btn" @click="setKeyword">
        <span class="material-icons"> search </span>
      </button>
    </div>
    <div class="rightBox">
      <div class="notification">
        <button class="btn">
          <span class="material-icons"> notifications </span>
        </button>
      </div>
      <div class="member">
        <div class="img-box">
          <img v-if="user?.photo" :src="userPhotoPath" :alt="user?.username" />
        </div>
        <div class="txtBox">{{ user?.username }}</div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
const store = useStore();
const route = useRoute();
const isFocus = ref(false);
const externalKeyword = inject("keyword") as Ref<string>;
const keyword = ref("");
const user = computed(() => store.user);
const userPhotoPath = computed(() => {
  if (!user.value) return "";
  return `${store.api}/admin/uploads/${user.value._id}/${user.value.photo}`;
});
const hasSearch = computed(() => {
  const regex = /\/admin\/(account|dashboard)/;
  return !regex.test(route.path);
});
const setKeyword = () => {
  externalKeyword.value = keyword.value;
};
const keydownHandler = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    setKeyword();
  }
};
onMounted(() => {
  keyword.value = externalKeyword.value;
  window.addEventListener("keydown", keydownHandler);
});

onUnmounted(() => {
  window.removeEventListener("keydown", keydownHandler);
});

watch(
  () => route.path,
  () => {
    keyword.value = "";
    setKeyword();
  }
);

watch(
  () => keyword.value,
  (newVal) => {
    if (newVal === "") {
      externalKeyword.value = "";
    }
  }
);
</script>

<style lang="scss">
#header {
  display: flex;
  // border-bottom: 1px solid $light;
  min-height: 75px;
  justify-content: space-between;
  align-items: center;
  padding: 20px 36px;
  padding-top: 40px;
  background-color: lighten($terColor, 5%);

  @include media(1400) {
    padding: 20px;
    padding-top: 40px;
  }

  @include media(1200) {
    padding: 20px;
  }

  @include media(768) {
    flex-direction: column;
    align-items: flex-end;
  }

  .searchBox {
    @include center;
    padding: 0 20px;
    border: 1px solid #fff;
    border-radius: 12px;
    height: 50px;
    background-color: #fff;
    @extend %ts;
    max-width: 360px;
    width: 100%;
    box-shadow: 0 0 10px $terColor;

    &.focus {
      border: 1px solid $mainColor;
      box-shadow: 0 0 0 1px $mainColor;
    }

    @include media(768) {
      order: 2;
      max-width: 100%;
      box-sizing: border-box;
      margin-bottom: 10px;
    }

    .btn {
      @include center;
      margin-right: -10px;
      width: auto;
      background: transparent;
      width: 36px;
      height: 36px;
      border: 0;
      @extend %ts;
      align-self: center;
      cursor: pointer;

      &:hover {
        background-color: $mainColor;
        color: $terColor;
      }

      span {
        display: flex;
      }
    }

    input {
      background-color: #fff;
      flex-grow: 1;
      border: 0;
      height: 100%;
      font-size: 16px;
      appearance: none;

      &:focus {
        outline: 0;
      }

      &::-webkit-clear-button,
      &::-webkit-search-cancel-button {
        appearance: none;
        width: 44px;
        height: 44px;
        background: no-repeat url(@/assets/images/close.svg) center / 24px;
      }
    }
  }

  .member {
    display: flex;
    @include center;
    padding: 6px;
    border-radius: 12px;
    @extend %ts;

    .img-box {
      width: 48px;
      height: 48px;
      border-radius: 99px;
      border: 2px solid $mainColor;
      background: no-repeat url(@/assets/images/emoji-smile-fill.svg) lighten($terColor, 5%) center / 36px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .txtBox {
      font-size: 20px;
      font-weight: bold;
      padding-left: 16px;
    }
  }

  .rightBox {
    display: flex;
    align-items: center;
    margin-left: auto;

    @include media(1024) {
      margin-bottom: 10px;
    }

    .notification {
      margin-right: 10px;

      .btn {
        background: transparent;
        width: 52px;
        height: 52px;
        border: 0;
        @include center;
        cursor: pointer;

        span {
          font-size: 26px;
        }
      }
    }
  }
}</style>
