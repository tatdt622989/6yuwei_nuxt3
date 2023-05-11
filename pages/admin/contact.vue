<template>
  <div>
    <div class="titleWrap">
      <h2 class="title">Contact</h2>
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
                <th scope="col">Email</th>
                <th scope="col">Message</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in contact" :key="item._id">
                <td>
                  <label class="selector">
                    <input
                      type="checkbox"
                      v-model="selector"
                      :value="item._id"
                    />
                    <span class="bg"></span>
                    <span class="material-symbols-outlined mark"> check </span>
                  </label>
                </td>
                <td class="email">
                  <a href="javascript:;" @click="openTextViewerModal(item.message)">
                    {{ item.email }}
                  </a>
                </td>
                <td class="message">
                  {{ item.message }}
                </td>
                <td>
                  <div class="action-wrap">
                    <button
                      class="action"
                      @click="reply(item.email)"
                    >
                      <span class="material-symbols-outlined icon">
                        reply
                      </span>
                      <span class="text">Reply</span>
                    </button>
                    <button
                      class="action delete"
                      @click="openConfirmModal(deleteData, item?._id)"
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
    <AdminConfirmModal
      :is-open="confirmModal.open"
      :is-confirm="confirmModal.isConfirm"
      @close-modal="confirmModal.open = false"
      @confirm="confirmModal.isConfirm = true"
      @on-confirm="onConfirm"
    />
    <AdminTextViewerModal
    :is-open="textViewerModal.open"
    :message="textViewerModal.message"
    @close-modal="textViewerModal.open = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { Contact } from "~/types";
import { useStore } from "~/store";

useHead({
  title: "Contact",
  titleTemplate: "%s - 6yuwei admin",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "6yuwei - Contact admin",
    },
  ],
});

// 需要驗證身份
definePageMeta({
  middleware: ["auth"],
});

const store = useStore();
const confirmModal = reactive({
  open: false,
  isConfirm: false,
  id: "",
  targetFunc: null as Function | null,
});
const textViewerModal = reactive({
  open: false,
  message: "",
});
const contact = ref<Array<Contact>>([]);
const selector = ref<Array<string>>([]);
const isAllSelected = ref(false);
const currentPage = ref(1);
const total = ref(0);
const totalPage = ref(1);

const onConfirm = async () => {
  confirmModal.isConfirm = true;
  confirmModal.targetFunc && confirmModal.targetFunc();
};

const openConfirmModal = (targetFunc: Function, id: string = "") => {
  confirmModal.isConfirm = false;
  confirmModal.open = true;
  confirmModal.targetFunc = targetFunc;
  confirmModal.id = id;
};

const openTextViewerModal = (message: string) => {
  textViewerModal.open = true;
  textViewerModal.message = message;
};

const selectAllItem = () => {
  if (contact.value) {
    if (!isAllSelected.value) {
      selector.value = [];
    } else {
      selector.value = contact.value.map((item) => item._id as string);
    }
  }
};

const getList = async () => {
  store.setLoading(true);
  const api = `${store.api}/contact/admin/list/?page=${currentPage.value}`;
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
    list: Array<Contact>;
    total: number;
    totalPage: number;
  };
  if (data) {
    total.value = data.total;
    totalPage.value = data.totalPage;
    contact.value = data.list;
  }
  store.setLoading(false);
};

const deleteData = async () => {
  store.setLoading(true);
  const api = `${store.api}/contact/admin/list/delete/`;
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
      id: Date.now(),
      type: "error",
      message: error.data,
      timeout: 5000,
    });
    return store.setLoading(false);
  }
  store.setLoading(false);
  await getList();
  selector.value = [];
};

const reply = (email: string) => {
  window.location.href = `mailto:${email}`;
};

onMounted(async () => {
  store.setLoading(true);
  await getList();
  store.setLoading(false);
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
    font-size: 18px;
    &:nth-of-type(3) {
      width: 50%;
    }
  }
  td {
    border-width: 0 0 1px 0;
    border-color: lighten($terColor, 5%);
    padding: 10px 20px;
    vertical-align: middle;
    letter-spacing: 0.8px;
    font-size: 16px;
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
