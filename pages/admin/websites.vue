<template>
  <div>
    <div class="titleWrap">
      <h2 class="title">Websites</h2>
      <AdminContentToolbar @open-editor-modal="openEditorModal" />
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="table-responsive">
          <div class="table-tool">
            <p class="total">Total: {{ total }}</p>
            <div v-if="selector.length > 0" class="right">
              <p class="selected">{{ selector.length }} item selected</p>
              <button class="delete btn">
                <span class="material-symbols-outlined"> delete </span>
                Delete
              </button>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col" width="90">
                  <label class="selector">
                    <input
                      type="checkbox"
                      v-model="isAllSelected"
                      @change="selectAllItem"
                    />
                    <span class="bg"></span>
                    <span class="material-symbols-outlined mark"> check </span>
                  </label>
                </th>
                <th scope="col">Preview</th>
                <th scope="col">Title</th>
                <th scope="col">Category</th>
                <th scope="col">Off/On</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="website in websites" :key="website._id">
                <td>
                  <label class="selector">
                    <input
                      type="checkbox"
                      v-model="selector"
                      :value="website._id"
                    />
                    <span class="bg"></span>
                    <span class="material-symbols-outlined mark"> check </span>
                  </label>
                </td>
                <td>
                  <div
                    class="preview-box"
                    @click="openEditorModal('edit', website)"
                  >
                    <img
                      v-if="website.photos[0]"
                      :src="`${store.api}/admin/uploads/${website.photos[0].url}`"
                      :alt="website.title"
                    />
                    <span class="material-symbols-outlined">nature_people</span>
                  </div>
                </td>
                <td>{{ website.title }}</td>
                <td>{{ website.category }}</td>
                <td>
                  <label class="switch">
                    <input type="checkbox" v-model="website.visible" />
                    <span class="bg">
                      <span class="toggler" />
                    </span>
                  </label>
                </td>
                <td>
                  <div class="action-wrap">
                    <button class="action copy">
                      <span class="material-symbols-outlined icon">
                        content_copy
                      </span>
                      <span class="text">Copy</span>
                    </button>
                    <button class="action delete">
                      <span class="material-symbols-outlined icon">
                        delete
                      </span>
                      <span class="text">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <AdminPagination :total="totalPage" :current-page="currentPage" />
      </div>
    </div>
    <AdminEditorModal
      :unit="'websites'"
      :is-open="editorModal.open"
      :action="editorModal.action"
      :data="editorModal.data"
      :confirm-modal="confirmModal"
      :category="category"
      @open-confirm-modal="openConfirmModal"
      @close-modal="closeEditorModal"
      @reload-list="getList"
      @set-editor-data="setEditorData"
      @update-category="getCategory"
      :delete-data="deleteData"
    />
    <AdminConfirmModal
      :is-open="confirmModal.open"
      :is-confirm="confirmModal.isConfirm"
      @close-modal="confirmModal.open = false"
      @confirm="confirmModal.isConfirm = true"
      @on-confirm="onConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import { Editor, Website } from "~/types";
import { useStore } from "~/store";

// 需要驗證身份
definePageMeta({
  middleware: ["auth"],
});

const store = useStore();
const user = computed(() => store.user);

const editorModal = reactive({
  open: false,
  action: "add" as "add" | "edit",
  data: null as Editor | null,
});
const confirmModal = reactive({
  open: false,
  isConfirm: false,
  id: "",
  targetFunc: null as Function | null,
});
const websites = ref<Array<Website>>([]);
const selector = ref<Array<string>>([]);
const isAllSelected = ref(false);
const currentPage = ref(1);
const total = ref(0);
const totalPage = ref(1);
const category = ref([]);

const openEditorModal = (
  action: "add" | "edit",
  data: Website | null = null
) => {
  editorModal.open = true;
  editorModal.action = action;
  editorModal.data = data as Editor;
};

const openConfirmModal = (id: string, targetFunc: Function) => {
  console.log(targetFunc);
  confirmModal.isConfirm = false;
  confirmModal.open = true;
  confirmModal.id = id;
  confirmModal.targetFunc = targetFunc;
};

const onConfirm = async () => {
  console.log("confirm", confirmModal);
  confirmModal.isConfirm = true;
  confirmModal.targetFunc && confirmModal.targetFunc();
};

const closeEditorModal = async () => {
  editorModal.open = false;
};

const setEditorData = (data: Website) => {
  editorModal.data = data as Editor;
};

const selectAllItem = () => {
  if (websites.value) {
    if (!isAllSelected.value) {
      selector.value = [];
    } else {
      selector.value = websites.value.map((item) => item._id as string);
    }
  }
};

const copyWebsite = async (website: Website) => {
  const api = `${store.api}/websites/admin/add/`;
  const data = {
    title: website.title,
    description: website.description,
    externalLink: website.externalLink,
    textEditor: website.textEditor,
    category: website.category,
  };
};

const getList = async () => {
  store.setLoading(true);
  const api = `${store.api}/websites/admin/list/?page=${currentPage.value}`;
  const res = await useFetch(api, {
    method: "GET",
    credentials: "include",
  });
  const error = res.error.value;

  if (error) {
    const status = error.status;
    status === 403 && navigateTo("/admin/login");
    store.pushNotification({
      id: Date.now(),
      type: "error",
      message: error.data,
      timeout: 5000,
    });
    return store.setLoading(false);
  }

  const data = res.data.value as {
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
  store.setLoading(false);
};

const getCategory = async () => {
  store.setLoading(true);
  const api = `${store.api}/websites/admin/category/`;
  try {
    const res = await useFetch(api, {
      method: "GET",
      credentials: "include",
    });

    const error = res.error.value;
    if (error) {
      const status = error.status;
      status === 403 && navigateTo("/admin/login");
      store.pushNotification({
        id: Date.now(),
        type: "error",
        message: error.data,
        timeout: 5000,
      });
      return store.setLoading(false);
    }

    const data = res.data.value as {
      msg: string;
      list: Array<string>;
      category: [];
    };
    if (data) {
      category.value = data.category;
    }
  } catch (err) {
    store.pushNotification({
      id: Date.now(),
      type: "error",
      message: err as string,
      timeout: 5000,
    });
  }
  store.setLoading(false);
};

const deleteData = async () => {
  store.setLoading(true);
  const api = `${store.api}/websites/admin/delete/`;
  const ids = confirmModal.id.split(",");
  console.log(ids);
  // const res = await useFetch(api, {
  //   method: "POST",
  //   credentials: "include",
  //   body: JSON.stringify({ ids }),
  // });
  store.setLoading(false);
};

onMounted(async () => {
  store.setLoading(true);
  await getList();
  await getCategory();
  store.setLoading(false);
});

watch(
  () => selector.value,
  (val) => {
    const allId = websites.value.map((item) => item._id);
    const isChecked = val.length === allId.length;
    isAllSelected.value = isChecked;
  }
);
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

.table-responsive {
  background-color: #fff;
  box-shadow: 0 0 10px $terColor;
  border-radius: 12px;
  padding: 0;
  margin-bottom: 30px;
  table {
    margin-bottom: 20px;
    table-layout: fixed;
  }
  th {
    vertical-align: middle;
    padding: 20px;
    border-top: 0;
    border-bottom: 1px solid lighten($terColor, 5%);
    background-color: lighten($terColor, 5%);
    letter-spacing: 0.8px;
  }
  td {
    border-width: 0 0 1px 0;
    border-color: lighten($terColor, 5%);
    padding: 10px 20px;
    vertical-align: middle;
    letter-spacing: 0.8px;
  }
  .preview-box {
    cursor: pointer;
    width: 80px;
    height: 80px;
    background-color: lighten($terColor, 5%);
    border-radius: 12px;
    display: flex;
    @include center;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
      position: relative;
      z-index: 1;
    }
    span {
      position: absolute;
      z-index: 0;
      display: block;
      margin: auto;
      @include center(transform, all);
      font-size: 60px;
      color: darken($terColor, 15%);
    }
  }

  .action-wrap {
    margin: 0 -10px;
  }

  .action {
    background: transparent;
    border: 0;
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
    padding: 10px;
    // border: 1px solid $terColor;
    border-radius: 12px;
    @extend %ts;
    &:first-of-type {
      margin-right: 10px;
    }
    &:hover {
      background-color: lighten($terColor, 5%);
      .text,
      .icon {
        // color: $secColor;
      }
      &.delete {
        .text,
        .icon {
          color: #e75e5e;
        }
      }
    }
    .icon {
      @extend %ts;
      vertical-align: middle;
      color: darken($terColor, 30%);
      margin-right: 6px;
    }

    .text {
      @extend %ts;
      vertical-align: middle;
      font-weight: bold;
      letter-spacing: 0.8px;
    }
  }
}

.selector {
  width: 24px;
  height: 24px;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  .bg {
    border-radius: 6px;
    background-color: #fff;
    display: flex;
    width: 100%;
    height: 100%;
    border: 1px solid darken($terColor, 10%);
    position: relative;
  }
  .mark {
    border-radius: 6px;
    background-color: transparent;
    padding: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: transparent;
    user-select: none;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
  input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
    &:checked {
      & ~ .mark {
        display: flex;
        width: 100%;
        height: 100%;
        color: #fff;
        background-color: $mainColor;
        border-color: $mainColor;
        @include center;
      }
    }
  }
}

.switch {
  // background-color: $terColor;
  width: 65px;
  height: 30px;
  .bg {
    border: 1px solid darken($terColor, 10%);
    border-radius: 99px;
    padding: 3px;
    display: flex;
    width: 100%;
    height: 100%;
    @extend %ts;
    position: relative;
    cursor: pointer;
  }
  .toggler {
    background-color: darken($terColor, 10%);
    width: 22px;
    height: 22px;
    border-radius: 99px;
    display: flex;
    position: absolute;
    left: 3px;
    top: 3px;
    @extend %ts;
  }
  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    &:checked {
      background-color: $mainColor;
      & + .bg {
        background-color: $mainColor;
        border-color: $mainColor;
        .toggler {
          background-color: #fff;
          transform: translateX(35px);
        }
      }
    }
  }
}

.table-tool {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: capitalize;
  border-bottom: 1px solid lighten($terColor, 5%);
  padding: 8px 20px;
  letter-spacing: 0.8px;
  .total,
  .selected {
    margin: 0;
    font-size: 16px;
  }
  .total {
    font-weight: bold;
    font-size: 20px;
    letter-spacing: 0.8px;
    line-height: 50px;
  }
  .right {
    align-items: center;
    display: flex;
    margin: 0 -20px;
  }
  .btn {
    border: 0;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    font-size: 16px;
    min-width: 0;
    width: auto;
    padding: 0;
    margin: 0 20px;
    span {
      margin-right: 6px;
    }
    &.delete {
      background-color: transparent;
      color: #e75e5e;
      height: 44px;
      display: flex;
      align-items: center;
      &:hover {
        color: darken(#e75e5e, 10%);
      }
    }
  }
}

.titleWrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
</style>
