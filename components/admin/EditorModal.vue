<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      id="editorModal"
      :class="['modal', { open: isOpen }]"
      tabindex="-1"
      aria-labelledby="editorModalLabel"
      aria-hidden="true"
      @mousedown.self="closeModal"
    >
      <div class="modal-dialog">
        <div class="modal-content" @click="(e: Event) => e.stopPropagation()">
          <div class="modal-header">
            <h1 class="modal-title fs-4">{{ props.unit }} Editor</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeModal"
            />
          </div>
          <div class="modal-body container">
            <form action="" class="row" @submit.prevent>
              <div
                class="col-md-6 col-sm-12 d-flex align-items-start justify-content-start flex-wrap"
              >
                <div class="img-previewer">
                  <swiper
                    @swiper="onSwiper"
                    :modules="modules"
                    :slides-per-view="1"
                    :space-between="0"
                    :loop="true"
                    :autoplay="{
                      delay: 3000,
                      disableOnInteraction: false,
                    }"
                    :pagination="{
                      clickable: true,
                      el: pagination,
                    }"
                  >
                    <swiper-slide
                      v-for="file in fileInfoList"
                      :key="file.data?._id"
                    >
                      <img
                        v-if="file.progress === 100"
                        v-show="file.isLoaded"
                        :src="`${store.api}/admin/uploads/${file.data?.url}?v=${fileTs}`"
                        :alt="file.data?.url"
                        @load="file.isLoaded = true"
                      />
                    </swiper-slide>
                  </swiper>
                </div>
                <div
                  v-show="fileInfoList.length > 0"
                  class="pagination"
                  ref="pagination"
                ></div>
              </div>
              <div class="col-md-6 col-sm-12 pt-3">
                <div class="mb-3">
                  <label
                    for="FormControlInput1"
                    class="form-label"
                    :class="{ 'is-invalid': validation.title }"
                    >Title</label
                  >
                  <input
                    id="FormControlInput1"
                    type="text"
                    class="form-control"
                    v-model="title"
                  />
                </div>
                <div class="mb-3">
                  <label for="FormControlInput1" class="form-label">Link</label>
                  <input
                    id="FormControlInput1"
                    type="text"
                    class="form-control"
                    v-model="externalLink"
                  />
                </div>
                <div class="mb-3">
                  <label for="FormControlInput1" class="form-label"
                    >Category</label
                  >
                  <input
                    type="text"
                    v-model="category"
                    list="category"
                    class="form-select"
                    aria-label="Default select example"
                    :class="{ 'is-invalid': validation.category }"
                  />
                  <datalist id="category">
                    <option
                      v-for="(item, index) in props.category"
                      :value="item"
                      :key="Date.now() + index"
                    ></option>
                  </datalist>
                </div>
              </div>
              <!-- <div class="col-12">
                <div class="mb-2">
                  <label for="FormControlTextarea1" class="form-label has-btn">
                    <span class="text">Youtube URL</span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="youtubeLink"
                  />
                </div>
              </div> -->
              <div class="col-12">
                <div class="mb-2">
                  <label for="FormControlTextarea1" class="form-label has-btn">
                    <span class="text">Describe</span>
                    <button
                      class="btn btn-circle ai"
                      @click="textGenerator('describe')"
                    >
                      <span class="material-icons icon"> auto_fix_normal </span>
                      Auto
                    </button>
                  </label>
                  <textarea
                    id="FormControlTextarea1"
                    class="form-control"
                    rows="3"
                    v-model="description"
                  />
                </div>
              </div>
              <div class="col-12">
                <label for="FormControlTextarea1" class="form-label has-btn"
                  ><span class="text">Content</span
                  ><button
                    class="btn btn-circle ai"
                    @click="textGenerator('content')"
                  >
                    <span class="material-icons icon"> auto_fix_normal </span>
                    Auto
                  </button></label
                >
                <AdminTextEditor
                  :text-editor="textEditorHTML"
                  :is-open="isOpen"
                  @set-text-editor-output="setTextEditorHTML"
                  :action="action"
                  ref="textEditorRef"
                />
              </div>
              <div class="col-12">
                <label
                  class="upload-area mb-4"
                  @drop.prevent="handleDrop"
                  @dragover.prevent
                  @dragenter="inDropZone = true"
                  @dragleave="inDropZone = false"
                  :class="{ active: inDropZone }"
                >
                  <svg width="100%" height="200">
                    <rect
                      x="2"
                      y="2"
                      width="100%"
                      height="196"
                      stroke-dasharray="12,6"
                      stroke="#28CB92"
                      stroke-width="2"
                      fill="none"
                      rx="12"
                      ry="12"
                    />
                  </svg>
                  <span class="material-symbols-outlined">{{
                    inDropZone ? "place_item" : "cloud_upload"
                  }}</span>
                  <p class="note">
                    {{
                      inDropZone
                        ? "Drop here"
                        : "Click to upload or drag and Drop files to upload"
                    }}
                  </p>
                  <p class="limit">Max file size: 10MB</p>
                  <input
                    id="fileInput"
                    type="file"
                    class="form-control"
                    multiple
                    @change="fileChange"
                    ref="fileInputRef"
                    accept="image/*"
                  />
                </label>
                <ul class="files-list">
                  <li
                    class="file-item"
                    v-for="info in fileInfoList"
                    :key="info.data?._id"
                  >
                    <div class="file-title">
                      <span class="material-symbols-outlined">image</span>
                      <div class="file-name">
                        <span>{{ info.data?.url }}</span>
                      </div>
                    </div>
                    <div class="file-actions">
                      <div class="file-size">
                        <span>{{
                          info.data && fileSizeConverter(info.data.size)
                        }}</span>
                      </div>
                      <button
                        class="btn btn-sm done"
                        v-if="info.progress === 100"
                      >
                        <span class="material-symbols-outlined"
                          >cloud_done</span
                        >
                      </button>
                      <button
                        class="btn btn-sm remove"
                        @click="
                          emit(
                            'open-confirm-modal',
                            fileDelete,
                            info.data?._id ?? ''
                          )
                        "
                      >
                        <span class="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                    <div class="progress-bar">
                      <div
                        class="progress-bar-inner"
                        :style="{ width: info.progress + '%' }"
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              v-if="action === 'edit'"
              type="button"
              class="btn delete"
              @click="
                emit(
                  'open-confirm-modal',
                  props.deleteData,
                  props.data?._id ?? ''
                )
              "
            >
              Delete
            </button>
            <button type="button" class="btn cancel" @click="closeModal">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="save">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
import type { Photo, Editor } from "~/types";
import { Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import axios from "axios";

import "swiper/css";
import "swiper/css/pagination";

interface Validation {
  [K: string]: boolean;
}

interface TextEditorRef {
  generateEditorHTML(): void;
}

interface FileInfo {
  data: Photo | null;
  progress: number;
  isLoaded: boolean;
}

const modules = [Pagination, Autoplay];
const pagination = ref(null);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  confirmModal: {
    type: Object as PropType<{
      open: boolean;
      isConfirm: boolean;
      id: string;
    }>,
    default: {},
  },
  action: {
    type: String as PropType<"add" | "edit">,
    default: "add",
  },
  data: {
    type: Object as PropType<Editor | null>,
    default: {},
  },
  unit: {
    type: String,
  },
  category: {
    type: Array as PropType<string[]>,
    default: [],
  },
  deleteData: {
    type: Function as PropType<(id: string) => void>,
  },
});
const emit = defineEmits([
  "close-modal",
  "reload-list",
  "set-editor-data",
  "open-confirm-modal",
  "update-category",
]);

const isOpen = ref(props.isOpen);
const title = ref("");
const externalLink = ref("");
// const youtubeLink = ref("");
const category = ref("");
const description = ref("");
const textEditorHTML = ref("");
const textEditorRef = ref<TextEditorRef | null>(null); // 取得text editor 暴露的方法
const fileInfoList = ref<FileInfo[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);
const store = useStore();
const fileSizeConverter = useFileSizeConverter();
const inDropZone = ref(false);
const validation = reactive<Validation>({
  title: false,
  category: false,
});
const swiperInstance = ref<any | null>(null);
const action = ref<'edit'|'add'>('edit');
const fileTs = ref(Date.now());

function onSwiper(swiper: any) {
  swiperInstance.value = swiper;
}

const updateData = (data: Editor) => {
  if (action.value === "edit" && data) {
    title.value = data.title;
    externalLink.value = data.externalLink;
    category.value = data.category;
    description.value = data.description;
    textEditorHTML.value = data.textEditor;
    fileInfoList.value = data.photos.map((item: Photo) => {
      return {
        data: item,
        progress: 100,
        isLoaded: true,
      };
    });
  }
};

const setTextEditorHTML = (content: string) => {
  textEditorHTML.value = content;
};

const verify = () => {
  let errMsg = "";
  if (!title.value) {
    validation.title = true;
    errMsg += "Title is required. ";
  }
  if (!category.value) {
    validation.category = true;
    errMsg += "Category is required. ";
  }
  if (errMsg) {
    store.pushNotification({
      type: "error",
      message: errMsg,
      timeout: 5000,
    });
    return false;
  }
  return true;
};

const save = async () => {
  const api = `${store.api}/${props.unit}/admin/`;
  if (textEditorRef.value) {
    textEditorRef.value.generateEditorHTML();
  }
  const data = {
    title: title.value,
    externalLink: externalLink.value,
    category: category.value,
    description: description.value,
    textEditor: textEditorHTML.value,
  };
  const method = {
    add: async () => {
      const res = await useFetch(api, {
        method: "POST",
        body: JSON.stringify({
          data,
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const error = res.error.value as Error | null;
      const resData = res.data.value as { data: Editor } | null;
      action.value = "edit";
      return { error, resData };
    },
    edit: async () => {
      const res = await useFetch(api, {
        method: "PUT",
        body: JSON.stringify({
          _id: props.data?._id,
          data,
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const error = res.error.value as Error | null;
      const resData = res.data.value as { data: Editor } | null;
      return { error, resData };
    },
  };
  if (store.isLoading) return;
  store.isLoading = true;
  if (!verify()) {
    store.isLoading = false;
    return;
  }
  const res = await method[action.value]();
  if (res.error) {
    navigateTo("/admin/login");
    return store.pushNotification({
      type: "error",
      message: res.error.message,
      timeout: 5000,
    });
  }
  if (res.resData) {
    store.pushNotification({
      type: "success",
      message: "Saved successfully",
      timeout: 3000,
    });
    emit("set-editor-data", res.resData.data);
    store.isLoading = false;
    emit("update-category");
    emit("reload-list");
  }
};

const uploadImg = async (files: FileList, id: string) => {
  const reqList = [];

  if (files.length === 0) {
    return;
  }

  if (fileInfoList.value.length + files.length > 5) {
    store.pushNotification({
      type: "error",
      message: "You can only upload 5 photos at a time",
      timeout: 5000,
    });
    return fileInputRef.value && (fileInputRef.value.value = "");
  }

  for (let i = 0; i < files.length; i++) {
    const formData = new FormData();
    formData.append("file", files[i]);
    formData.append("unitId", id);
    const tempFileInfo: FileInfo = {
      data: {
        _id: "",
        url: files[i].name,
        size: files[i].size,
        updatedAt: "",
        createdAt: "",
      },
      progress: 0,
      isLoaded: false,
    };
    fileInfoList.value.unshift(tempFileInfo);
    const res = new Promise((resolve, reject) => {
      axios
        .post(`${store.api}/${props.unit}/admin/photo/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          onUploadProgress: (progressEvent: ProgressEvent): void => {
            const index = fileInfoList.value.findIndex(
              (item: FileInfo) => item?.data?.url === files[i].name
            );
            if (index < 0) {
              console.error(`Cannot find file info for ${files[i].name}`);
              return;
            }
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 0)
            );
            try {
              fileInfoList.value[index].progress = percentCompleted;
            } catch (err) {
              console.error(err);
            }
          },
        })
        .then((res) => {
          const index = fileInfoList.value.findIndex(
              (item) => item.data?.url === files[i].name
            );
          fileInfoList.value[index].data = res.data.data;
          resolve(res.data);
        })
        .catch((err) => {
          const index = fileInfoList.value.findIndex(
              (item) => item.data?.url === files[i].name
            );
          fileInfoList.value[index].progress = 0;
          reject(err);
        });
    });
    reqList.push(res);
  }

  try {
    interface ResData {
      data: Photo;
      msg: string;
    }
    (await Promise.all(reqList)) as ResData[];
    store.pushNotification({
      type: "success",
      message: "Upload successfully",
      timeout: 3000,
    });
    swiperInstance.value?.slideTo(0);
    fileTs.value = Date.now();
  } catch (err: any) {
    const status = err.response?.status;
    status === 403 && navigateTo("/admin/login");
    store.pushNotification({
      type: "error",
      message: err.response?.data,
      timeout: 5000,
    });
    fileInputRef.value && (fileInputRef.value.value = "");
  }
  fileInfoList.value = fileInfoList.value.filter(
    (fileInfo: FileInfo) => fileInfo.progress === 100
  );
  emit("reload-list");
};

const handleDrop = (e: DragEvent) => {
  inDropZone.value = false;
  if (!props.data) {
    store.pushNotification({
      type: "error",
      message: "Please save the data first",
      timeout: 5000,
    });
  }
  if (!e.dataTransfer)
    return fileInputRef.value && (fileInputRef.value.value = "");
  const files = e.dataTransfer.files;
  if (!props.data) return fileInputRef.value && (fileInputRef.value.value = "");
  if (props.data && props.data._id) {
    uploadImg(files, props.data._id);
  }
};

const fileChange = (e: Event) => {
  const el = e.target as HTMLInputElement;
  if (!el) return;
  if (!props.data) {
    store.pushNotification({
      type: "error",
      message: "Please save the data first",
      timeout: 5000,
    });
    return fileInputRef.value && (fileInputRef.value.value = "");
  }
  const files = (el as HTMLInputElement).files;
  if (props.data && props.data._id && files) {
    uploadImg(files, props.data._id);
  }
};

const fileDelete = async () => {
  const api = `${store.api}/${props.unit}/admin/photo/`;
  const data: { [key: string]: string } = {
    photoId: props.confirmModal?.id,
    unitId: props.data?._id ?? "",
  };
  if (store.isLoading) return;
  store.isLoading = true;
  try {
    const res = await useFetch(api, {
      method: "DELETE",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const error = res.error.value;
    if (error) {
      const status = error.status;
      status === 403 && navigateTo("/admin/login");
      return store.pushNotification({
        type: "error",
        message: error.message,
        timeout: 5000,
      });
    }

    const resData = res.data.value as {
      data: Editor;
      msg: string;
    } | null;
    if (resData) {
      store.pushNotification({
        type: "success",
        message: "Deleted successfully",
        timeout: 3000,
      });
      fileInfoList.value = fileInfoList.value.filter(
        (fileInfo) => fileInfo.data?._id !== props.confirmModal?.id
      );
      store.isLoading = false;
    }
  } catch (error) {
    store.isLoading = false;
    return store.pushNotification({
      type: "error",
      message: error as string,
      timeout: 5000,
    });
  }
  emit("reload-list");
};

const reset = () => {
  title.value = "";
  externalLink.value = "";
  category.value = "";
  description.value = "";
  textEditorHTML.value = "";
  fileInfoList.value = [];
};

const closeModal = () => {
  emit("close-modal");
};

const keyupHandler = (e: KeyboardEvent) => {
  // if (e.key === "Escape") {
  //   closeModal();
  // }
};

const textGenerator = async (inputType: "describe" | "content") => {
  const topic = title.value ?? "";
  if (store.isLoading) return;
  if (!topic) {
    return store.pushNotification({
      type: "error",
      message: "Please enter the title first",
      timeout: 5000,
    });
  }
  store.isLoading = true;
  const prompt = {
    describe: `使用這個「${topic}」作為主題，撰寫一則簡短的描述。並且與${
      category.value ?? "網頁"
    }內容相關。`,
    content: `使用這個「${topic}」作為主題，撰寫一篇段落分明的文章。並且與${
      category.value ?? "網頁"
    }內容相關。`,
  };
  const text = (await useAskGptModel(prompt[inputType])) as string;
  if (text) {
    if (inputType === "describe") {
      description.value = text;
    } else {
      textEditorHTML.value = text;
    }
  }
  store.isLoading = false;
};

onMounted(() => {
  window.addEventListener("keyup", keyupHandler);
});

onUnmounted(() => {
  window.removeEventListener("keyup", keyupHandler);
});

watch(
  () => props.isOpen,
  (val) => {
    isOpen.value = val;
    action.value = props.action;
  }
);

watch(
  () => props.data,
  (val) => {
    if (val) {
      updateData(val);
    } else {
      reset();
    }
  }
);
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

#editorModal {
  @extend %ts;
  display: block;
  backdrop-filter: blur(5px);
  background-color: rgba($mainColor, 0.1);
  .btn-close {
    &:focus,
    &:focus-visible {
      box-shadow: none;
    }
  }
  .modal-dialog {
    max-width: 1100px;
    margin: 0;
    margin-left: auto;
    height: 100%;
  }
  .modal-header {
    border-radius: 0;
    border: 0;
    padding: 22px 48px;
    border-bottom: 1px solid $terColor;
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 2;
    .modal-title {
      font-weight: bold;
      color: $secColor;
      text-transform: capitalize;
    }
  }
  .modal-content {
    border-radius: 40px 0 0 40px;
    box-shadow: 0 0 10px rgba($terColor, 0.5);
    background: #fff;
    border: 0;
    height: 100%;
    position: relative;
    transform: translateX(30px);
    overflow: hidden;
    @include media(1100) {
      border-radius: 0;
    }
    .modal-body {
      overflow: auto;
      padding: 32px 48px;
      max-width: none;
      @include media(1100) {
        padding: 32px 20px;
      }
    }
  }
  .modal-footer {
    border-top: 1px solid $terColor;
    padding: 16px;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    z-index: 2;
    @include media(480) {
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
    }
    .btn {
      padding: 10px 20px;
      border-radius: 12px;
      border: 0;
      background-color: $mainColor;
      color: $secColor;
      font-weight: bold;
      @include media(480) {
        width: 100%;
      }
      &.cancel {
        @include media(480) {
          width: 100%;
        }
        background-color: $terColor;
      }
      &.delete {
        @include media(480) {
          width: calc(50% - 8px);
          & + .cancel {
            width: calc(50% - 8px);
          }
        }
        color: #fff;
        background-color: $dangerColor;
      }
      &:hover {
        color: $mainColor;
        background-color: $secColor;
      }
    }
  }
  &.open {
    opacity: 1;
    .modal-dialog {
      opacity: 1;
      .modal-content {
        transform: translateX(0);
      }
    }
  }
  &.modal-fade-enter-active,
  &.modal-fade-leave-active {
    transition: all 0.5s ease-out !important;
  }

  &.modal-fade-enter-from,
  &.modal-fade-leave-to {
    transform: translateX(30px);
    opacity: 0 !important;
  }

  form {
    input,
    select,
    textarea {
      border: 2px solid darken($terColor, 10%);
      color: $secColor;
      border-radius: 12px;
      &:focus {
        box-shadow: none;
        border-color: $mainColor;
      }
    }
    input,
    select {
      letter-spacing: 1px;
      height: 44px;
    }
    label {
      letter-spacing: 1px;
      font-weight: bold;
      font-size: 18px;
    }
    datalist {
      display: none;
    }
    .ai {
      width: auto;
      height: 40px;
      background-color: $mainColor;
      border-radius: 12px;
      font-weight: bold;
      font-size: 18px;

      @include center;
      box-shadow: 0 0 16px rgba($mainColor, 0.4);
      .icon {
        color: $secColor;
        font-size: 26px;
        margin-right: 3px;
      }
      &:hover {
        background-color: $secColor;
        color: $mainColor;
        .icon {
          color: $mainColor;
        }
      }
    }
    label.has-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      margin-bottom: 10px;
      .text {
        margin-right: 14px;
      }
    }
  }

  .img-previewer {
    display: flex;
    width: 100%;
    background-color: lighten($terColor, 5%);
    border-radius: 16px;
    margin-bottom: 10px;
    overflow: hidden;
    position: relative;
    flex-grow: 1;
    align-self: flex-start;
    min-height: 285px;
    .swiper {
      width: 100%;
    }
    .swiper-slide {
      img {
        width: 100%;
        height: 285px;
        object-fit: cover;
      }
    }
  }
  .pagination {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 16px;
  }
  .upload-area {
    position: relative;
    @include center;
    flex-direction: column;
    height: 200px;
    text-align: center;
    overflow: hidden;
    @extend %ts;
    &.active {
      background-color: lighten($terColor, 5%);
    }
    svg {
      position: absolute;
      pointer-events: none;
      top: 0;
      left: 0;
      width: 100%;
      pointer-events: none;
      rect {
        width: calc(100% - 4px);
      }
    }
    span {
      font-size: 100px;
      color: $mainColor;
      pointer-events: none;
    }
    p {
      font-size: 20px;
      font-weight: bold;
      color: $secColor;
      letter-spacing: 0.8px;
      pointer-events: none;
      &.note {
        margin-bottom: 10px;
        color: $secColor;
      }
      &.limit {
        font-size: 16px;
        color: $mainColor;
      }
    }
    input {
      display: none;
    }
  }
  .files-list {
    margin-bottom: 20px;
    padding-left: 0;
    .file-item {
      display: flex;
      align-items: stretch;
      position: relative;
      justify-content: space-between;
      padding: 10px;
      padding-bottom: 14px;
      background-color: lighten($terColor, 5%);
      overflow: hidden;
      border-radius: 12px;
      margin-bottom: 20px;
      @include media(768) {
        flex-wrap: wrap;
      }
      .file-title {
        display: flex;
        align-items: center;
        color: $secColor;
        font-weight: bold;
        flex-grow: 1;
        padding-right: 10px;
        letter-spacing: 1px;
        max-width: 100%;
        @include media(768) {
          width: 100%;
          margin-bottom: 10px;
        }
        span {
          font-size: 32px;
          color: $secColor;
          margin-right: 10px;
        }
        .file-name {
          flex-grow: 1;
          display: inline-block;
          min-width: 0;
          word-break: break-word;
          span {
            line-height: 1.2;
            font-size: 16px;
            width: 100%;
            display: inline-block;
          }
        }
      }
      .file-actions {
        display: flex;
        @include media(768) {
          margin-left: auto;
        }
        .file-size {
          flex-shrink: 0;
          margin: 0 10px;
          display: flex;
          align-items: center;
          span {
            font-size: 16px;
            color: $mainColor;
            line-height: 1.2;
            font-weight: bold;
          }
        }
        .btn {
          border: 0;
          border-radius: 99px;
          width: 44px;
          height: 44px;
          background: none;
          @include center;
          span {
            font-size: 28px;
          }
        }
        .done {
          color: $mainColor;
        }
        .remove {
          color: $secColor;
          &:hover {
            color: $dangerColor;
            background-color: #fff;
          }
        }
      }
      .progress-bar {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 4px;
        background-color: $terColor;
        left: 0;
        .progress-bar-inner {
          height: 100%;
          background-color: $mainColor;
          @extend %ts;
        }
      }
    }
  }
}
</style>
