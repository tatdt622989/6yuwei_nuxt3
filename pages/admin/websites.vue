<template>
  <div>
    <div class="titleWrap">
      <div class="text">
        <h2 class="title">Websites</h2>
        <p class="result"
          v-if="keyword">Search keyword: <span>{{ keyword ? `${keyword}` : "" }}</span></p>
      </div>
      <AdminContentToolbar @open-editor-modal="openEditorModal" />
    </div>
    <div class="container-fluid">
      <div class="row">
        <AdminDefaultTable @copy-item="copyData"
          @delete-item="deleteData"
          @open-editor-modal="openEditorModal"
          @open-confirm-modal="openConfirmModal"
          @update-visibility="updateVisibility"
          @update-homepage="updateHomepage"
          @update-top="updateTop"
          @update-sort-data="updateSortData"
          @select-all-item="selectAllItem"
          @set-unit-items="setWebsites"
          @set-is-all-selected="setIsAllSelected"
          @set-selector="setSelector"
          :is-all-selected="isAllSelected"
          :selector="selector"
          :unit-items="websites"
          :total="total"
          :is-confirm="confirmModal.isConfirm"
          :confirm-action="confirmModal.action"
          :confirm-id="confirmModal.id"
          :unit="'websites'"
        />
        <Pagination :total="totalPage"
          :url="'/admin/websites/'" />
      </div>
    </div>
    <AdminEditorModal :unit="'websites'"
      :is-open="editorModal.open"
      :action="editorModal.action"
      :data="editorModal.data"
      :confirm-modal="confirmModal"
      :category="category"
      :delete-data="deleteData"
      @open-confirm-modal="openConfirmModal"
      @close-modal="closeEditorModal"
      @reload-list="getList"
      @set-editor-data="setEditorData"
      @update-category="getCategory" />
    <AdminConfirmModal :is-open="confirmModal.open"
      :is-confirm="confirmModal.isConfirm"
      :action="confirmModal.action"
      @close-modal="confirmModal.open = false"
      @confirm="confirmModal.isConfirm = true"
      @on-confirm="onConfirm" />
  </div>
</template>

<script lang="ts" setup>
import type { Editor, Website } from "~/types";
import { useStore } from "~/store";

interface UpdateData {
  _id: string;
  data: {
    [key: string]: string | boolean | Array<string>;
  };
}

interface MultipleUpdateRes {
  msg: string;
}

useHead({
  title: "Websites",
  titleTemplate: "%s - 6yuwei admin",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "6yuwei - Websites admin",
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
  action: "",
});
const websites = ref<Array<Website>>([]);
const selector = ref<Array<string>>([]);
const isAllSelected = ref(false);
const total = ref(0);
const totalPage = ref(1);
const category = ref([]);
const changeToEditor = useChangeToEditor();

const openEditorModal = (
  action: "add" | "edit",
  data: Website | null = null
) => {

  editorModal.action = action;
  editorModal.data = null;
  if (action !== 'add' && action !== 'edit') throw new Error('action must be add or edit');
  if (action === "edit" && data) {
    editorModal.data = changeToEditor(data);
  }
  editorModal.open = true;
};

const openConfirmModal = (targetFunc: Function, id: string = "", action: string) => {
  confirmModal.isConfirm = false;
  confirmModal.open = true;
  if (targetFunc) {
    confirmModal.targetFunc = targetFunc;
  }
  confirmModal.id = id;
  confirmModal.action = action;
};

const onConfirm = async () => {
  confirmModal.isConfirm = true;
  if (confirmModal.targetFunc) {
    confirmModal.targetFunc && confirmModal.targetFunc();
  }
};

const closeEditorModal = async () => {
  editorModal.open = false;
};

const setEditorData = (data: Editor) => {
  editorModal.data = data;
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

const copyData = async () => {
  const id = confirmModal.id;
  const website = websites.value.find((item) => item._id === id);
  if (!website)
    return store.pushNotification({
      type: "error",
      message: "Website not found",
      timeout: 5000,
    });
  const api = `${store.api}/websites/admin/`;
  const data = {
    title: website.title,
    description: website.description,
    externalLink: website.externalLink,
    textEditor: website.textEditor,
    category: website.category,
    visible: website.visible,
    photos: website.photos,
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
      message: "Website copied",
      timeout: 5000,
    });
    getList();
  }
};

const getList = async () => {
  store.isLoading = true;
  const api = `${store.api}/websites/admin/?page=${currentPage.value}&keyword=${keyword.value}`;
  const res = await $fetch(api, {
    method: "GET",
    credentials: "include",
  }).catch((err) => {
    if (err) {
      const status = err.status;
      status === 403 && navigateTo("/admin/login");
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
const getCategory = async () => {
  store.isLoading = true;
  const api = `${store.api}/websites/admin/category/`;
  try {
    const res = await $fetch(api, {
      method: "GET",
      credentials: "include",
    });
    console.log('getCategory', res);

    const data = res as {
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
  store.isLoading = false;
};

const deleteData = async () => {
  store.isLoading = true;
  const api = `${store.api}/websites/admin/delete/`;
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
  editorModal.open = false;
  selector.value = [];
};

const updateData = async (data: UpdateData) => {
  store.isLoading = true;
  const api = `${store.api}/websites/admin/`;
  const res = await useFetch(api, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(data),
  });
  const error = res.error.value;
  const resData = res.data.value as { msg: string; website: Website };
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
  if (resData) {
    store.pushNotification({
      type: "success",
      message: resData.msg,
      timeout: 3000,
    });
  }
  store.isLoading = false;
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
const updateTop = async (id: string, top: boolean) => {
  updateData({
    _id: id,
    data: {
      top,
    },
  });
};
const updateSortData = async (unitItems: Website[]) => {
  store.isLoading = true;
  try {
    const res = await $fetch<MultipleUpdateRes>(`${store.api}/websites/admin/multiple/`, {
      method: 'PUT',
      credentials: "include",
      body: {
        data: unitItems,
      },
    });

    if (res.msg) {
      store.pushNotification({
        type: 'success',
        message: res.msg,
        timeout: 5000,
      });
    }
  } catch (err) {
    console.log(err);
  }
  store.isLoading = false;
};

const setWebsites = (data: Array<Website>) => {
  websites.value = data;
};
const setIsAllSelected = (val: boolean) => {
  isAllSelected.value = val;
};
const setSelector = (val: Array<string>) => {
  selector.value = val;
};

onMounted(() => {
  getList();
  getCategory();
});

watch(
  () => selector.value,
  (val) => {
    const allId = websites.value.map((item) => item._id);
    const isChecked = val.length === allId.length;
    isAllSelected.value = isChecked;
  }
);

watch(
  () => keyword.value,
  () => {
    navigateTo(`/admin/websites/?keyword=${keyword.value}&page=1`);
    getList();
  }
);

watch(
  () => currentPage.value,
  () => {
    getList();
  }
);
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

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
}</style>
