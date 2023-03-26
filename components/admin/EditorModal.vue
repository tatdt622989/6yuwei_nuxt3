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
            <h1 class="modal-title fs-5">
              Create a new website
            </h1>
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
              <div class="col-6 d-flex align-stretch">
                <div class="img-previewer">
                  <div class="imgList">
                    <div class="imgItem">
                      <img src="" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label
                    for="FormControlInput1"
                    class="form-label"
                  >Link</label>
                  <input
                    id="FormControlInput1"
                    type="text"
                    class="form-control"
                  >
                </div>
                <div class="mb-3">
                  <label
                    for="FormControlInput1"
                    class="form-label"
                  >Title</label>
                  <input
                    id="FormControlInput1"
                    type="text"
                    class="form-control"
                  >
                </div>
                <div class="mb-3">
                  <label
                    for="FormControlInput1"
                    class="form-label"
                  >Category</label>
                  <select class="form-select" aria-label="Default select example">
                    <option selected>
                      Open this select menu
                    </option>
                    <option value="1">
                      One
                    </option>
                    <option value="2">
                      Two
                    </option>
                    <option value="3">
                      Three
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-12">
                <div class="mb-4">
                  <label
                    for="FormControlTextarea1"
                    class="form-label"
                  >Describe</label>
                  <textarea
                    id="FormControlTextarea1"
                    class="form-control"
                    rows="3"
                  />
                </div>
              </div>
              <div class="col-12">
                <client-only>
                  <AdminTextEditor />
                </client-only>
              </div>
              <div class="col-12">
                <label class="upload-area mb-4">
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
                  <span class="material-symbols-outlined">cloud_upload</span>
                  <p class="note">Click to upload or drag and Drop files to upload</p>
                  <p class="limit">Max file size: 10MB</p>
                  <input
                    id="fileInput"
                    type="file"
                    class="form-control"
                    multiple
                  >
                </label>
                <ul class="files-list">
                  <li class="file-item">
                    <div class="file-info">
                      <span class="material-symbols-outlined">image</span>
                      <div class="file-name">
                        my-work.jpg
                      </div>
                      <div class="file-size">
                        1.2MB
                      </div>
                    </div>
                    <div class="file-actions">
                      <button class="btn btn-sm done">
                        <span class="material-symbols-outlined">cloud_done</span>
                      </button>
                      <button class="btn btn-sm remove">
                        <span class="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-bar-inner" :style="{ width : '50%' }" />
                    </div>
                  </li>
                </ul>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

const props = defineProps({
  isOpenProp: {
    type: Boolean,
    default: false,
  },
  action: {
    type: String,
    default: "add",
  },
});
const emit = defineEmits(["close-modal"]);

const isOpen = ref(props.isOpenProp);

watch(
  () => props.isOpenProp,
  (val) => {
    isOpen.value = val;
  }
);

const closeModal = () => {
  isOpen.value = false;
  emit("close-modal", "editorModal");
};
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

#editorModal {
  @extend %ts;
  display: block;
  backdrop-filter: blur(5px);
  background-color: rgba($mainColor, 0.1);
  .btn-close {
    &:focus, &:focus-visible {
      box-shadow: none;
    }
  }
  .modal-dialog {
    max-width: 1000px;
  }
  .modal-header {
    .modal-title {
      font-weight: bold;
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
    transition: all .5s ease-out !important;
  }

  &.modal-fade-enter-from,
  &.modal-fade-leave-to {
    opacity: 0 !important;
  }

  form {
    input, select, textarea {
      border: 2px solid darken($terColor, 10%);
      color: $secColor;
      border-radius: 12px;
      &:focus {
        box-shadow: none;
        border-color: $mainColor;
      }
    }
    input, select {
      letter-spacing: 1px;
      height: 44px;
    }
    label {
      letter-spacing: 1px;
      font-weight: bold;
    }
  }
  .img-previewer {
    display: flex;
    width: 100%;
    background-color: lighten($terColor, 5%);
    border-radius: 16px;
    margin-bottom: 16px;
  }
  .upload-area {
    position: relative;
    @include center;
    flex-direction: column;
    height: 200px;
    text-align: center;
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
      align-items: center;
      position: relative;
      justify-content: space-between;
      padding: 10px;
      background-color: lighten($terColor, 5%);
      overflow: hidden;
      border-radius: 12px;
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
        }
        .file-size {
          flex-shrink: 0;
          color: $mainColor;
          margin-left: 10px;
        }
      }
      .file-actions {
        display: flex;
        .btn {
          border: 0;
          width: auto;
          background: none;
          span {
            font-size: 28px;
          }
        }
        .done {
          color: $mainColor;
        }
        .remove {
          color: $dangerColor;
        }
      }
      .progress-bar {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 4px;
        background-color: $mainColor;
        left: 0;
      }
    }
  }
}
</style>
