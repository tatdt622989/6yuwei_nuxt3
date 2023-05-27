<template>
  <transition name="modal-fade">
    <div
      v-if="props.isOpen"
      id="filterModal"
      :class="['modal', { open: props.isOpen }]"
      tabindex="-1"
      aria-labelledby="filterModalLabel"
      aria-hidden="true"
      @click="emit('close-modal')"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" @click="(e) => e.stopPropagation()">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Filter</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="emit('close-modal')"
            />
          </div>
          <div class="modal-body">
            <div class="container">
              <button
                class="category-btn btn"
                v-for="(item, index) in category"
                :key="Date.now() + index"
                :class="{ active : filter.includes(item) }"
                @click="updateFilter(item)"
              >
                {{ item }}
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <div class="content-wrap">
              <button
                type="button"
                class="btn cancel"
                @click="emit('close-modal')"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="apply"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
const props = defineProps({
  isOpen: Boolean,
  activeCategoryArr: Array,
  unitName: String,
});

const emit = defineEmits(["close-modal", "set-category-arr"]);
const route = useRoute();
const store = useStore();
const category = ref<string[]>([]);
const filter = ref<string[]>([]);

const updateFilter = (category: string) => {
  if (filter.value.includes(category)) {
    filter.value = filter.value.filter((item) => item !== category);
  } else {
    filter.value.push(category);
  }
};

const apply = () => {
  let query = {};
  if (filter.value.length === 0) {
    query = { page: 1 }
  } else {
    const categoryStr = encodeURIComponent(filter.value.join(","));
    query = { category: categoryStr, page: 1 }
  }
  navigateTo({ 
    path: route.path,
    query 
  });
  emit("set-category-arr", filter.value);
  emit("close-modal");
};

watch(
  () => props.activeCategoryArr,
  (val) => {
    if (!val) return;
    filter.value = Object.assign([], val);
  }
);

onMounted(async () => {
  interface categoryRes {
    category: string[];
    msg: string;
  }
  try {
    const res: categoryRes = await $fetch(`${store.api}/${props.unitName}/category/`, {
      method: "GET",
    });
    if (!res) return;
    category.value = res.category;
    filter.value = Object.assign([], props.activeCategoryArr);
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
});
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

#filterModal {
  @extend %ts;
  display: block;
  backdrop-filter: blur(5px);
  background-color: rgba($mainColor, 0.1);
  .modal-dialog {
    width: 768px;
    max-width: 100%;
  }
  &.open {
    opacity: 1;
    .modal-dialog {
      opacity: 1;
    }
  }
  &.modal-fade-enter-active,
  &.modal-fade-leave-active {
    transition: all 0.5s ease-out !important;
  }

  &.modal-fade-enter-from,
  &.modal-fade-leave-to {
    opacity: 0 !important;
  }

  .modal-header {
    border: 0;
    .modal-title {
      font-weight: bold;
      color: $secColor;
    }
    .btn-close {
      &:focus {
        box-shadow: none;
      }
    }
  }

  .modal-content {
    border-radius: 12px;
    box-shadow: 0 0 10px rgba($terColor, 0.5);
    background: #fff;
    border: 0;
  }

  .modal-body {
    padding: 28px 16px;
    padding-top: 12px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .container {
      padding: 0;
    }
  }

  .modal-footer {
    border-top: 1px solid $terColor;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    .content-wrap {
      flex-grow: 1;
      margin: 0 -10px;
    }
    .btn {
      padding: 10px 20px;
      border-radius: 12px;
      border: 0;
      background-color: $mainColor;
      color: $secColor;
      font-weight: bold;
      width: calc(50% - 20px);
      margin: 0 10px;
      &.cancel {
        background-color: $terColor;
      }
      &.delete {
        background-color: $dangerColor;
      }
      &:hover {
        color: $mainColor;
        background-color: $secColor;
      }
    }
  }

  .category-btn {
    border-radius: 12px;
    background-color: $terColor;
    line-height: 1.1;
    width: calc(25% - 10px);
    padding: 5px 10px;
    align-self: stretch;
    height: auto;
    margin: 0 5px;
    min-height: 52px;
    font-weight: bold;
    border: 0;
    &:hover {
      background-color: darken($terColor, 10%);
    }
    &.active {
      background-color: $secColor;
      color: $mainColor;
    }
  }
}
</style>
