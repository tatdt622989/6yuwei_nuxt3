<template>
  <div>
    <div class="titleWrap">
      <div class="text">
        <h2 class="title">3DCGs</h2>
        <p class="result" v-if="keyword">
          Search keyword: <span>{{ keyword ? `${keyword}` : "" }}</span>
        </p>
      </div>
      <AdminContentToolbar @open-editor-modal="openEditorModal" />
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="table-responsive">
          <div class="table-tool">
            <p class="total">Total: {{ total }}</p>
            <div v-if="selector.length > 0" class="right">
              <p class="selected">{{ selector.length }} item selected</p>
              <button
                class="delete btn"
                @click="openConfirmModal(deleteData, selector.join(','))"
              >
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
                <th scope="col">Home</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="threeDCG in threeDCGs" :key="threeDCG._id">
                <td>
                  <label class="selector">
                    <input
                      type="checkbox"
                      v-model="selector"
                      :value="threeDCG._id"
                    />
                    <span class="bg"></span>
                    <span class="material-symbols-outlined mark"> check </span>
                  </label>
                </td>
                <td>
                  <div
                    class="preview-box"
                    @click="openEditorModal('edit', threeDCG)"
                  >
                    <img
                      v-if="threeDCG.photos[0]"
                      :src="`${store.api}/admin/uploads/${threeDCG.photos[0].url}`"
                      :alt="threeDCG.title"
                    />
                    <span class="material-symbols-outlined">nature_people</span>
                  </div>
                </td>
                <td>{{ threeDCG.title }}</td>
                <td>{{ threeDCG.category }}</td>
                <td>
                  <label class="switch">
                    <input
                      type="checkbox"
                      v-model="threeDCG.visible"
                      @change="
                        updateVisibility(threeDCG._id ?? '', threeDCG.visible)
                      "
                    />
                    <span class="bg">
                      <span class="toggler" />
                    </span>
                  </label>
                </td>
                <td>
                  <label class="switch">
                    <input
                      type="checkbox"
                      v-model="threeDCG.homepage"
                      @change="
                        updateHomepage(threeDCG._id ?? '', threeDCG.homepage)
                      "
                    />
                    <span class="bg">
                      <span class="toggler" />
                    </span>
                  </label>
                </td>
                <td>
                  <div class="action-wrap">
                    <button
                      class="action copy"
                      @click="openConfirmModal(copyWebsite, threeDCG._id)"
                    >
                      <span class="material-symbols-outlined icon">
                        content_copy
                      </span>
                      <span class="text">Copy</span>
                    </button>
                    <button
                      class="action delete"
                      @click="openConfirmModal(deleteData, threeDCG._id)"
                    >
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
        <Pagination :total="totalPage" :current-page="currentPage" />
      </div>
    </div>
    <AdminEditorModal
      :unit="'3dcgs'"
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
import { Editor, ThreeDCG } from "~/types";
import { useStore } from "~/store";

interface UpdateData {
  _id: string;
  data: {
    [key: string]: string | boolean | Array<string>;
  };
}

useHead({
  title: "3DCGs",
  titleTemplate: "%s - 6yuwei admin",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "6yuwei - 3DCGs admin",
    },
  ],
});

// 需要驗證身份
definePageMeta({
  middleware: ["auth"],
});

const store = useStore();
const keyword = inject("keyword") as Ref<string>;

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
const threeDCGs = ref<Array<ThreeDCG>>([]);
const selector = ref<Array<string>>([]);
const isAllSelected = ref(false);
const currentPage = ref(1);
const total = ref(0);
const totalPage = ref(1);
const category = ref([]);

const openEditorModal = (
  action: "add" | "edit",
  data: ThreeDCG | null = null
) => {
  editorModal.open = true;
  editorModal.action = action;
  editorModal.data = data as Editor;
};

const openConfirmModal = (targetFunc: Function, id: string = "") => {
  confirmModal.isConfirm = false;
  confirmModal.open = true;
  confirmModal.targetFunc = targetFunc;
  confirmModal.id = id;
};

const onConfirm = async () => {
  confirmModal.isConfirm = true;
  confirmModal.targetFunc && confirmModal.targetFunc();
};

const closeEditorModal = async () => {
  editorModal.open = false;
};

const setEditorData = (data: Three3DCG) => {
  editorModal.data = data as Editor;
};

const selectAllItem = () => {
  if (threeDCGs.value) {
    if (!isAllSelected.value) {
      selector.value = [];
    } else {
      selector.value = threeDCGs.value.map((item) => item._id as string);
    }
  }
};

const copyWebsite = async () => {
  const id = confirmModal.id;
  const threeDCG = threeDCGs.value.find((item) => item._id === id);
  if (!threeDCG)
    return store.pushNotification({
      type: "error",
      message: "3DCG not found",
      timeout: 5000,
    });
  const api = `${store.api}/3dcgs/admin/list/`;
  const data = {
    title: threeDCG.title,
    description: threeDCG.description,
    externalLink: threeDCG.externalLink,
    textEditor: threeDCG.textEditor,
    category: threeDCG.category,
    visible: threeDCG.visible,
    photos: threeDCG.photos,
  };
  const res = await useFetch(api, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      data,
    }),
  });
  const error = res.error.value;
  if (error) {
    const status = error.status;
    status === 403 && navigateTo("/admin/login");
    store.pushNotification({
      type: "error",
      message: error.data,
      timeout: 5000,
    });
    return;
  }
  if (res.data.value) {
    store.pushNotification({
      type: "success",
      message: "3DCG copied",
      timeout: 5000,
    });
    getList();
  }
};

const getList = async () => {
  store.setLoading(true);
  const api = `${store.api}/3dcgs/admin/list/?page=${currentPage.value}&keyword=${keyword.value}`;
  const res = await useFetch(api, {
    method: "GET",
    credentials: "include",
  });
  const error = res.error.value;

  if (error) {
    const status = error.status;
    status === 403 && navigateTo("/admin/login");
    store.pushNotification({
      type: "error",
      message: 'Can not get threeDCGs list',
      timeout: 5000,
    });
    return store.setLoading(false);
  }

  const data = res.data.value as {
    msg: string;
    list: Array<ThreeDCG>;
    total: number;
    totalPage: number;
  };
  if (data) {
    total.value = data.total;
    totalPage.value = data.totalPage;
    threeDCGs.value = data.list;
  }
  store.setLoading(false);
};

const getCategory = async () => {
  store.setLoading(true);
  const api = `${store.api}/3dcgs/admin/category/`;
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
      type: "error",
      message: err as string,
      timeout: 5000,
    });
  }
  store.setLoading(false);
};

const deleteData = async () => {
  store.setLoading(true);
  const api = `${store.api}/3dcgs/admin/list/delete/`;
  const ids = confirmModal.id.split(",");
  const res = await useFetch(api, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ ids }),
  });
  const error = res.error.value;
  if (error) {
    const status = error.status;
    status === 403 && navigateTo("/admin/login");
    store.pushNotification({
      type: "error",
      message: error.data,
      timeout: 5000,
    });
    return store.setLoading(false);
  }
  store.setLoading(false);
  await getList();
  editorModal.open = false;
  selector.value = [];
};

const updateData = async (data: UpdateData) => {
  store.setLoading(true);
  const api = `${store.api}/3dcgs/admin/list`;
  const res = await useFetch(api, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(data),
  });
  const error = res.error.value;
  const resData = res.data.value as { msg: string; threeDCGs: ThreeDCG };
  if (error) {
    const status = error.status;
    status === 403 && navigateTo("/admin/login");
    store.pushNotification({
      type: "error",
      message: error.data,
      timeout: 5000,
    });
    return store.setLoading(false);
  }
  if (resData) {
    store.pushNotification({
      type: "success",
      message: resData.msg,
      timeout: 3000,
    });
  }
  store.setLoading(false);
  await getList();
  editorModal.open = false;
};

const updateVisibility = async (id: string, visible: boolean) => {
  updateData({
    _id: id,
    data: {
      visible,
    },
  });
};

const updateHomepage = async (id: string, homepage: boolean) => {
  updateData({
    _id: id,
    data: {
      homepage,
    },
  });
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
    const allId = threeDCGs.value.map((item) => item._id);
    const isChecked = val.length === allId.length;
    isAllSelected.value = isChecked;
  }
);

watch(
  () => keyword.value,
  () => {
    currentPage.value = 1;
    getList();
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
  overflow: auto;
  &::-webkit-scrollbar {
    height: 6px;
    width: auto;
  }
  @include media(1024) {
    position: relative;
  }
  table {
    margin-bottom: 20px;
    table-layout: fixed;
    min-width: 1024px;
  }
  th {
    vertical-align: middle;
    padding: 20px;
    border-top: 0;
    border-bottom: 1px solid lighten($terColor, 5%);
    background-color: lighten($terColor, 5%);
    letter-spacing: 0.8px;
    font-size: 18px;
    &:nth-of-type(1) {
      @include media(1200) {
        width: 64px;
        text-align: center;
      }
    }
    &:nth-of-type(2) {
      @include media(1200) {
        width: 120px;
        padding: 20px 0;
      }
    }
    &:nth-of-type(3) {
      width: 20%;
    }
    &:nth-of-type(4) {
      width: 20%;
    }
    @include media(1200) {
      padding: 20px 10px;
    }
  }
  td {
    border-width: 0 0 1px 0;
    border-color: lighten($terColor, 5%);
    padding: 10px 20px;
    vertical-align: middle;
    letter-spacing: 0.8px;
    font-size: 16px;
    &:nth-of-type(1) {
      @include media(1200) {
        text-align: center;
      }
    }
    &:nth-of-type(2) {
      @include media(1200) {
        padding: 10px 0;
      }
    }
    @include media(1200) {
      padding: 10px;
    }
  }
  tr {
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
    display: inline-block;
  }

  .action {
    background: transparent;
    border: 0;
    display: block;
    line-height: 1;
    vertical-align: middle;
    padding: 6px;
    // border: 1px solid $terColor;
    border-radius: 12px;
    @extend %ts;
    &:first-of-type {
      margin-bottom: 4px;
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
  padding: 12px 20px;
  letter-spacing: 0.8px;
  @include media(1024) {
    position: sticky;
    top: 0px;
    width: 100%;
    left: 0;
  }
  @include media(768) {
    flex-direction: column;
    align-items: flex-start;
  }
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
    @include media(768) {
      line-height: 36px;
      margin-bottom: 6px;
    }
  }
  .right {
    align-items: center;
    display: flex;
    margin: 0 -20px;
    @include media(768) {
      margin: 0;
    }
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
  min-width: 0;
  margin-bottom: 30px;
  .text {
    padding-right: 10px;
  }
  .result {
    padding-left: 8px;
    font-size: 20px;
    span {
      font-weight: bold;
    }
  }
  &:deep(.toolbar) {
    min-width: 0;
    flex-shrink: 0;
  }
}
</style>