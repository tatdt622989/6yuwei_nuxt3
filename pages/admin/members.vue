<template>
  <div>
    <div class="titleWrap">
      <div class="text">
        <h2 class="title">Members</h2>
        <p class="result" v-if="keyword">
          Search keyword: <span>{{ keyword ? `${keyword}` : "" }}</span>
        </p>
      </div>
      <!-- <AdminContentToolbar @open-editor-modal="openEditorModal" /> -->
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="table-responsive">
          <div class="table-tool">
            <p class="total">Total: {{ total }}</p>
            <div v-if="selector.length > 0" class="right">
              <p class="selected">{{ selector.length }} item selected</p>
              <button class="delete btn" @click="openConfirmModal(deleteData, selector.join(','))">
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
                    <input type="checkbox" v-model="isAllSelected" @change="selectAllItem" />
                    <span class="bg"></span>
                    <span class="material-symbols-outlined mark"> check </span>
                  </label>
                </th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in members" :key="item._id">
                <td>
                  <label class="selector">
                    <input type="checkbox" v-model="selector" :value="item._id" />
                    <span class="bg"></span>
                    <span class="material-symbols-outlined mark"> check </span>
                  </label>
                </td>
                <td class="name">{{ item.username }}</td>
                <td class="email">{{ item.email }}</td>
                <td>{{ item.phone }}</td>
                <td>
                  <div class="action-wrap">
                    <button class="action delete" @click="openConfirmModal(deleteData, item?._id)">
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
        <Pagination :total="totalPage" :url="'/admin/members/'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Editor, User } from "~/types";
import { useStore } from "~/store";
import { Console } from "console";

interface UpdateData {
  _id: string;
  data: {
    [key: string]: string | boolean | Array<string>;
  };
}

interface DataRes {
  msg: string;
  data: Array<User>;
  total: number;
}

useHead({
  title: "members",
  titleTemplate: "%s - 6yuwei admin",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "6yuwei - members admin",
    },
  ],
});

// 需要驗證身份
definePageMeta({
  middleware: ["auth"],
  layout: 'admin-default'
});

const store = useStore();
const route = useRoute();
const currentPage = computed(() => {
  return route.query.page ? parseInt(route.query.page as string) : 1;
});
const keyword = inject("keyword") as Ref<string>;
const changeToEditor = useChangeToEditor();
const members = ref<User[]>([]);
const selector = ref<Array<string>>([]);
const isAllSelected = ref(false);
const total = ref(0);
const totalPage = ref(1);

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

const selectAllItem = () => {
  if (members.value) {
    if (!isAllSelected.value) {
      selector.value = [];
    } else {
      selector.value = members.value.map((item) => item._id as string);
    }
  }
};

const getList = async () => {
  try {
    const res = await $fetch<DataRes>(`${store.api}/members/?page=${currentPage.value}&limit=12&keyword=${keyword.value}`, {
      method: "GET",
      credentials: "include",
    });

    if (res.data) {
      members.value = res.data;
      total.value = res.total;
      totalPage.value = Math.ceil(res.total / 10);
    }
  } catch (error) {
    console.log(error);
    store.pushNotification({
      type: "error",
      message: 'Something went wrong',
      timeout: 5000,
    });
  }
}

const deleteData = async () => {
  store.isLoading = true;
  const api = `${store.api}/contact/admin/delete/`;
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
    return store.isLoading = false;
  }
  store.isLoading = false;
  await getList();
  selector.value = [];
};

const openEditorModal = (
  action: "add" | "edit",
  data: User | null = null
) => {

  editorModal.action = action;
  editorModal.data = null;
  if (action !== 'add' && action !== 'edit') throw new Error('action must be add or edit');
  if (action === "edit" && data) {
    // editorModal.data = changeToEditor(data);
  }
  editorModal.open = true;
};

const openConfirmModal = (targetFunc: Function, id: string = "") => {
  confirmModal.isConfirm = false;
  confirmModal.open = true;
  if (targetFunc) {
    confirmModal.targetFunc = targetFunc;
  }
  confirmModal.id = id;
};

onMounted(async () => {
  await getList();
});
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
    min-width: 768px;
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
    &:nth-of-type(3) {
      width: 50%;
      @include media(1600) {
        width: 40%;
      }
      @include media(1024) {
        width: auto;
      }
    }
    &:nth-of-type(4) {
      width: 250px;
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
    &.name {
      font-weight: bold;
    }
    &.message {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &.email {
      a {
        color: $secColor;
        font-weight: bold;
        text-decoration: none;
        display: inline;
        word-break: break-word;
        &:hover {
          color: $mainColor;
        }
      }
    }
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
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
    padding: 6px;
    // border: 1px solid $terColor;
    border-radius: 12px;
    @extend %ts;
    margin: 0 10px;
    &:first-of-type {
      margin-left: 0;
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
}
</style>