<template>
  <div>
    <div class="titleWrap">
      <div class="text">
        <h2 class="title">Animations</h2>
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
              <button class="delete btn" @click="openConfirmModal(deleteData, selector.join(','), 'delete')">
                <span class="material-symbols-outlined"> delete </span>
                Delete
              </button>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col" width="65">
                  <label class="selector">
                    <input type="checkbox" v-model="isAllSelected" @change="selectAllItem" />
                    <span class="bg"></span>
                    <span class="material-symbols-outlined mark"> check </span>
                  </label>
                </th>
                <th scope="col" width="90">Top</th>
                <th scope="col">Preview</th>
                <th scope="col">Title</th>
                <th scope="col">Category</th>
                <th scope="col">Off/On</th>
                <th scope="col">Home</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="animation in animations" :key="animation._id">
                <td>
                  <label class="selector">
                    <input type="checkbox" v-model="selector" :value="animation._id" />
                    <span class="bg"></span>
                    <span class="material-symbols-outlined mark"> check </span>
                  </label>
                </td>
                <td>
                  <button :class="['pin', { active: animation.top }]"
                    @click="updateTop(animation._id ?? '', !animation.top)">
                    <span class="material-icons">
                      bookmark
                    </span>
                  </button>
                </td>
                <td>
                  <div class="preview-box" @click="openEditorModal('edit', animation)">
                    <img v-if="animation.photos[0]" :src="`${store.api}/admin/uploads/${animation.photos[0].url}`"
                      :alt="animation.title" />
                    <span class="material-symbols-outlined">nature_people</span>
                  </div>
                </td>
                <td>{{ animation.title }}</td>
                <td>{{ animation.category }}</td>
                <td>
                  <label class="switch">
                    <input type="checkbox" v-model="animation.visible" @change="
                      updateVisibility(animation._id ?? '', animation.visible)
                      " />
                    <span class="bg">
                      <span class="toggler" />
                    </span>
                  </label>
                </td>
                <td>
                  <label class="switch">
                    <input type="checkbox" v-model="animation.homepage" @change="
                      updateHomepage(animation._id ?? '', animation.homepage)
                      " />
                    <span class="bg">
                      <span class="toggler" />
                    </span>
                  </label>
                </td>
                <td>
                  <div class="action-wrap">
                    <button class="action copy" @click="openConfirmModal(copyWebsite, animation._id, 'copy')">
                      <span class="material-symbols-outlined icon">
                        content_copy
                      </span>
                      <span class="text">Copy</span>
                    </button>
                    <button class="action delete" @click="openConfirmModal(deleteData, animation._id, 'delete')">
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
        <Pagination :total="totalPage" :current-page="currentPage" :url="'/admin/animations/'" />
      </div>
    </div>
    <AdminEditorModal :unit="'animations'" :is-open="editorModal.open" :action="editorModal.action"
      :data="editorModal.data" :confirm-modal="confirmModal" :category="category" :delete-data="deleteData"
      @open-confirm-modal="openConfirmModal" @close-modal="closeEditorModal" @reload-list="getList"
      @set-editor-data="setEditorData" @update-category="getCategory" />
    <AdminConfirmModal :is-open="confirmModal.open" :is-confirm="confirmModal.isConfirm" :action="confirmModal.action"
      @close-modal="confirmModal.open = false" @confirm="confirmModal.isConfirm = true" @on-confirm="onConfirm" />
  </div>
</template>

<script lang="ts" setup>
import { Editor, Animation } from "~/types";
import { useStore } from "~/store";

interface UpdateData {
  _id: string;
  data: {
    [key: string]: string | boolean | Array<string>;
  };
}

useHead({
  title: "animations",
  titleTemplate: "%s - 6yuwei admin",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "6yuwei - animations admin",
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
  action: "",
});
const animations = ref<Array<Animation>>([]);
const selector = ref<Array<string>>([]);
const isAllSelected = ref(false);
const currentPage = ref(1);
const total = ref(0);
const totalPage = ref(1);
const category = ref([]);
const changeToEditor = useChangeToEditor();

const openEditorModal = (
  action: "add" | "edit",
  data: Animation | null = null
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
  confirmModal.targetFunc = targetFunc;
  confirmModal.id = id;
  confirmModal.action = action;
};

const onConfirm = async () => {
  confirmModal.isConfirm = true;
  confirmModal.targetFunc && confirmModal.targetFunc();
};

const closeEditorModal = async () => {
  editorModal.open = false;
};

const setEditorData = (data: Editor) => {
  editorModal.data = data;
};

const selectAllItem = () => {
  if (animations.value) {
    if (!isAllSelected.value) {
      selector.value = [];
    } else {
      selector.value = animations.value.map((item) => item._id as string);
    }
  }
};

const copyWebsite = async () => {
  const id = confirmModal.id;
  const animation = animations.value.find((item) => item._id === id);
  if (!animation)
    return store.pushNotification({
      type: "error",
      message: "animation not found",
      timeout: 5000,
    });
  const api = `${store.api}/animations/admin/list/`;
  const data = {
    title: animation.title,
    description: animation.description,
    externalLink: animation.externalLink,
    textEditor: animation.textEditor,
    category: animation.category,
    visible: animation.visible,
    photos: animation.photos,
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
      message: "animation copied",
      timeout: 5000,
    });
    getList();
  }
};

const getList = async () => {
  store.setLoading(true);
  const api = `${store.api}/animations/admin/list/?page=${currentPage.value}&keyword=${keyword.value}`;
  const res = await $fetch(api, {
    method: "GET",
    credentials: "include",
  }).catch((err) => {
    if (err) {
      const status = err.status;
      status === 403 && navigateTo("/admin/login");
      store.pushNotification({
        type: "error",
        message: 'Can not get Animation list',
        timeout: 5000,
      });
      return 'error';
    }
  });

  if (res === 'error') {
    store.setLoading(false);
    return;
  }

  const data = res as {
    msg: string;
    list: Array<Animation>;
    total: number;
    totalPage: number;
  };

  if (data) {
    total.value = data.total;
    totalPage.value = data.totalPage;
    animations.value = data.list;
  }
  store.setLoading(false);
};

const getCategory = async () => {
  store.setLoading(true);
  const api = `${store.api}/animations/admin/category/`;
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
  const api = `${store.api}/animations/admin/list/delete/`;
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
  const api = `${store.api}/animations/admin/list`;
  const res = await useFetch(api, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(data),
  });
  const error = res.error.value;
  const resData = res.data.value as { msg: string; animations: Animation };
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

const updateTop = async (id: string, top: boolean) => {
  updateData({
    _id: id,
    data: {
      top,
    },
  });
};

onMounted(() => {
  getList();
  getCategory();
});

watch(
  () => selector.value,
  (val) => {
    const allId = animations.value.map((item) => item._id);
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
@import "@/assets/scss/adminLayout.scss";
</style>
