<template>
  <nav aria-label="Page navigation" class="justify-content-center d-flex">
    <ul class="pagination">
      <li class="page-item first" v-if="currentPage > 1">
        <a class="page-link" href="javascript:;" aria-label="Previous" @click="goToPage(currentPage - 1)">
          <span class="material-symbols-outlined">chevron_left</span>
        </a>
      </li>
      <li class="page-item" v-for="page in pages" :key="page" :class="{ active: page === currentPage }">
        <a class="page-link" href="javascript:;" @click="goToPage(page)">{{ page }}</a>
      </li>
      <li class="page-item last" v-if="currentPage < total">
        <a class="page-link" href="javascript:;" aria-label="Next"  @click="goToPage(currentPage + 1)">
          <span class="material-symbols-outlined">chevron_right</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});
const route = useRoute();
const currentPage = computed(() => {
  return route.query.page ? parseInt(route.query.page as string) : 1;
});
const { total } = toRefs(props);
const maxNum = 5;
const pages = computed(() => {
  const pages = [];
  const start = currentPage.value - Math.floor(maxNum / 2) <= 0 || currentPage.value <= maxNum ? 1 : currentPage.value - Math.floor(maxNum / 2);
  const end = start + maxNum - 1 >= total.value ? total.value : start + maxNum - 1;
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const goToPage = (num: number) => {
  const urlParams = new URLSearchParams(window.location.search);
  // if page param exists, replace it with new value
  if (urlParams.has("page")) {
    urlParams.set("page", num.toString());
  } else {
    urlParams.append("page", num.toString());
  }
  navigateTo(`${props.url}?${urlParams.toString()}`);
}

</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

.pagination {
  border: 0;
  box-shadow: 0 0 10px $terColor;
  align-items: stretch;
  .page-item {
    border: 0;
    position: relative;
    color: $secColor;
    font-weight: bold;
    @include after {
      height: 18px;
      width: 1px;
      background-color: darken($terColor, 10%);
      right: 0;
      z-index: 1;
      @include center(transform, y);
    }
    &.first {
      .page-link {
        border-radius: 12px 0 0 12px;
      }
    }
    &.last {
      @include after {
        display: none;
      }
      .page-link {
        border-radius: 0 12px 12px 0;
      }
    }
    &.active {
      @include after {
        display: none;
      }
      .page-link {
        background-color: $mainColor !important;
      }
    }
    .page-link {
      border: 0;
      color: $secColor;
      background-color: #fff;
      padding: 10px;
      min-width: 44px;
      text-align: center;
      height: 100%;
      @include center;
      &:hover {
        background-color: $terColor;
      }
      &:focus {
        box-shadow: none;
      }
    }
  }
}
</style>
