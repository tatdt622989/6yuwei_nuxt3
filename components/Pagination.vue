<template>
  <nav aria-label="Page navigation" class="justify-content-center d-flex">
    <ul class="pagination">
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous">
          <span class="material-symbols-outlined">chevron_left</span>
        </a>
      </li>
      <li class="page-item" v-for="page in pages" :key="page" :class="{ active: page === currentPage }">
        <a class="page-link" href="#">{{ page }}</a>
      </li>
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Next">
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
  currentPage: {
    type: Number,
    required: true,
  },
});

const { total, currentPage } = toRefs(props);
const maxNum = 5;
const pages = computed(() => {
  const pages = [];
  const start = currentPage.value - Math.floor(maxNum / 2) <= 0 ? 1 : currentPage.value - Math.floor(maxNum / 2);
  const end = start + maxNum - 1 >= total.value ? total.value : start + maxNum - 1;
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

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
    &:first-of-type {
      .page-link {
        border-radius: 12px 0 0 12px;
      }
    }
    &:last-of-type {
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
        background-color: $mainColor;
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