<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      id="editorModal"
      :class="['modal', { open: isOpen }]"
      tabindex="-1"
      aria-labelledby="editorModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" @click="(e) => e.stopPropagation()">
          <div class="modal-header">
            <h1 class="modal-title fs-5">{{ props.unit }} Editor</h1>
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
              <div class="col-6 d-flex align-stretch flex-column">
                <div class="img-previewer">
                  <swiper
                    :modules="modules"
                    :slides-per-view="1"
                    :space-between="0"
                    :loop="true"
                    :autoplay="{
                      delay: 3000,
                      disableOnInteraction: true,
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
                        :src="`${store.api}/admin/uploads/${file.data?.url}`"
                        :alt="file.data?.url"
                      />
                    </swiper-slide>
                  </swiper>
                </div>
                <div v-if="fileInfoList.length>0" class="pagination" ref="pagination"></div>
              </div>
              <div class="col-6">
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
              <div class="col-12">
                <div class="mb-4">
                  <label for="FormControlTextarea1" class="form-label"
                    >Describe</label
                  >
                  <textarea
                    id="FormControlTextarea1"
                    class="form-control"
                    rows="3"
                    v-model="description"
                  />
                </div>
              </div>
              <div class="col-12">
                <AdminTextEditor
                  :text-editor="textEditorJson"
                  :is-open="isOpen"
                  @set-text-editor-output="setTextEditorJson"
                  :action="props.action"
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
                      width="calc(100% - 4px)"
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
                    @change="handleFileChange"
                  />
                </label>
                <ul class="files-list">
                  <li
                    class="file-item"
                    v-for="info in fileInfoList"
                    :key="info.data?._id"
                  >
                    <div class="file-info">
                      <span class="material-symbols-outlined">image</span>
                      <div class="file-name">
                        <span>{{ info.data?.url }}</span>
                      </div>
                      <div class="file-size">
                        <span>{{
                          info.data && fileSizeConverter(info.data.size)
                        }}</span>
                      </div>
                    </div>
                    <div class="file-actions">
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
                          emit('open-confirm-modal', info.data?._id ?? '')
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
            <button v-if="action === 'edit'" type="button" class="btn delete">
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
import { Photo, Editor } from "~~/types";
import { Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import axios from "axios";

import "swiper/css";
import "swiper/css/pagination";

interface Validation {
  [K: string]: boolean;
}

interface TextEditorRef {
  generateEditorJson(): void;
}

interface FileInfo {
  data: Photo | null;
  progress: number;
}

const modules = [Pagination, Autoplay];
const pagination = ref(null);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  isConfirm: {
    type: Boolean,
    default: false,
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
  confirmModal: {
    type: Object as PropType<{
      open: boolean;
      isConfirm: boolean;
      id: string;
    }>,
    default: {},
  },
  category: {
    type: Array as PropType<string[]>,
    default: [],
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
const category = ref("");
const description = ref("");
const textEditorJson = ref("");
const textEditorRef = ref<TextEditorRef | null>(null); // 取得text editor 暴露的方法
const fileInfoList = ref<FileInfo[]>([]);
const store = useStore();
const fileSizeConverter = useFileSizeConverter();
const inDropZone = ref(false);
const validation = reactive<Validation>({
  title: false,
  category: false,
});

const updateData = (data: Editor) => {
  if (props.action === "edit" && data) {
    title.value = data.title;
    externalLink.value = data.externalLink;
    category.value = data.category;
    description.value = data.description;
    textEditorJson.value = data.textEditor;
    fileInfoList.value = data.photos.map((item) => {
      return {
        data: item,
        progress: 100,
      };
    });
  }
};

const setTextEditorJson = (content: string) => {
  console.log("content", content);
  textEditorJson.value = content;
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
      id: Date.now(),
      type: "error",
      message: errMsg,
      timeout: 5000,
    });
    return false;
  }
  return true;
};

const save = async () => {
  const api = {
    add: `${store.api}/websites/admin/add/`,
    edit: `${store.api}/websites/admin/update/`,
  };
  console.log("textEditorRef", textEditorRef);
  if (textEditorRef.value) {
    textEditorRef.value.generateEditorJson();
  }
  const data = {
    _id: "",
    title: title.value,
    externalLink: externalLink.value,
    category: category.value,
    description: description.value,
    textEditor: textEditorJson.value,
    photos: fileInfoList.value.map((item) => item.data),
  };
  store.isLoading = true;
  if (!verify()) {
    store.isLoading = false;
    return;
  }
  const method = {
    add: async () => {
      const res = await useFetch(api[props.action], {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const error = res.error.value as Error | null;
      const resData = res.data.value as { code: number; data: Editor } | null;
      return { error, resData };
    },
    edit: async () => {
      data._id = props.data?._id!;
      const res = await useFetch(api[props.action], {
        method: "PUT",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const error = res.error.value as Error | null;
      const resData = res.data.value as { code: number; data: Editor } | null;
      return { error, resData };
    },
  };
  const res = await method[props.action]();
  if (res.error) {
    return store.pushNotification({
      id: Date.now(),
      type: "error",
      message: res.error.message,
      timeout: 5000,
    });
  }
  if (res.resData) {
    if (res.resData.code === 200) {
      store.pushNotification({
        id: Date.now(),
        type: "success",
        message: "Saved successfully",
        timeout: 5000,
      });
      emit("set-editor-data", res.resData.data);
      emit("reload-list");
    } else {
      res.resData.code === 403 && navigateTo("/admin/login");
      store.pushNotification({
        id: Date.now(),
        type: "error",
        message: "Something went wrong",
        timeout: 5000,
      });
      store.isLoading = false;
    }
  }
};

const uploadImg = async (files: FileList, id: string) => {
  const reqList = [];

  if (files.length === 0) {
    return;
  }

  if (fileInfoList.value.length + files.length > 5) {
    store.pushNotification({
      id: Date.now(),
      type: "error",
      message: "You can only upload 5 photos at a time",
      timeout: 5000,
    });
    return;
  }

  try {
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
      };
      fileInfoList.value.push(tempFileInfo);
      const index = fileInfoList.value.length - 1;
      const res = new Promise((resolve, reject) => {
        axios
          .post(`${store.api}/${props.unit}/admin/photo/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total ?? 0)
              );
              fileInfoList.value[index].progress = percentCompleted;
            },
          })
          .then((res) => {
            fileInfoList.value[index].data = res.data.data;
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
      reqList.push(res);
    }
    interface ResData {
      code: number;
      data: Photo;
      msg: string;
    }
    const resList = (await Promise.all(reqList)) as ResData[];
    const errList = resList.filter((item) => item.code !== 200);
    if (errList.some((item) => item.code === 403)) {
      return navigateTo("/admin/login");
    }
    if (errList.length > 0) {
      store.pushNotification({
        id: Date.now(),
        type: "error",
        message: errList[0].msg,
        timeout: 5000,
      });
    } else {
      store.pushNotification({
        id: Date.now(),
        type: "success",
        message: "Upload successfully",
        timeout: 5000,
      });
    }
  } catch (err) {
    store.pushNotification({
      id: Date.now(),
      type: "error",
      message: err as string,
      timeout: 5000,
    });
  }
  fileInfoList.value.filter((fileInfo) => fileInfo.progress === 100);
};

const handleDrop = (e: DragEvent) => {
  inDropZone.value = false;
  if (!props.data) {
    store.pushNotification({
      id: Date.now(),
      type: "error",
      message: "Please save the data first",
      timeout: 5000,
    });
  }
  if (!e.dataTransfer) return;
  const files = e.dataTransfer.files;
  if (!props.data) return;
  uploadImg(files, props.data._id);
};

const handleFileChange = (e: Event) => {
  if (!props.data) {
    store.pushNotification({
      id: Date.now(),
      type: "error",
      message: "Please save the data first",
      timeout: 5000,
    });
  }
  if (!e.target) return;
  const files = (e.target as HTMLInputElement).files;
  console.log("files", files);
  if (!props.data || !files) return;
  uploadImg(files, props.data._id);
};

const handleFileDelete = async () => {
  const api = `${store.api}/${props.unit}/admin/photo/`;
  const data: { [key: string]: string } = {
    photoId: props.confirmModal?.id,
    unitId: props.data?._id ?? "",
  };
  console.log("data", data);
  try {
    const res = await useFetch(api, {
      method: "DELETE",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resData = res.data.value as {
      code: number;
      data: Editor;
      msg: string;
    } | null;
    if (resData) {
      if (resData.code === 200) {
        store.pushNotification({
          id: Date.now(),
          type: "success",
          message: "Deleted successfully",
          timeout: 5000,
        });
        emit("set-editor-data", resData.data);
      } else {
        resData.code === 403 && navigateTo("/admin/login");
        store.pushNotification({
          id: Date.now(),
          type: "error",
          message: resData.msg,
          timeout: 5000,
        });
      }
    }
  } catch (error) {
    return store.pushNotification({
      id: Date.now(),
      type: "error",
      message: error as string,
      timeout: 5000,
    });
  }
};

const reset = () => {
  title.value = "";
  externalLink.value = "";
  category.value = "";
  description.value = "";
  textEditorJson.value = "";
  fileInfoList.value = [];
};

const closeModal = () => {
  // store.setLoading(true);
  emit("close-modal");
};

watch(
  () => props.isOpen,
  (val) => {
    isOpen.value = val;
    emit("update-category");
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

watch(
  () => props.isConfirm,
  (newVal) => {
    if (newVal) {
      handleFileDelete();
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
    max-width: 1000px;
  }
  .modal-header {
    .modal-title {
      font-weight: bold;
      color: $secColor;
      text-transform: capitalize;
    }
  }
  .modal-content {
    border-radius: 12px;
    box-shadow: 0 0 10px rgba($terColor, 0.5);
    background: #fff;
    border: 0;
  }
  .modal-footer {
    border-top: 1px solid $terColor;
    padding: 16px;
    .btn {
      padding: 10px 20px;
      border-radius: 12px;
      border: 0;
      background-color: $mainColor;
      color: $secColor;
      font-weight: bold;
      &.cancel {
        background-color: $terColor;
      }
      &.delete {
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
    }
    datalist {
      display: none;
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
    .swiper {
    }
    .swiper-slide {
      img {
        width: 100%;
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
      rect {
        width: calc(100% - 4px);
      }
    }
    span {
      font-size: 100px;
      color: $mainColor;
    }
    p {
      font-size: 20px;
      font-weight: bold;
      color: $secColor;
      letter-spacing: 0.8px;
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
      .file-info {
        display: flex;
        align-items: center;
        color: $secColor;
        font-weight: bold;
        flex-grow: 1;
        padding-right: 10px;
        letter-spacing: 1px;
        span {
          font-size: 32px;
          color: $secColor;
          margin-right: 10px;
        }
        .file-name {
          flex-grow: 1;
          display: inline-block;
          span {
            line-height: 1.2;
            font-size: 16px;
          }
        }
        .file-size {
          flex-shrink: 0;
          margin-left: 10px;
          display: flex;
          align-items: center;
          span {
            font-size: 16px;
            color: $mainColor;
            line-height: 1.2;
          }
        }
      }
      .file-actions {
        display: flex;
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
