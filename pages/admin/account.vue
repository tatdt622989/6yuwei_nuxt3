<template>
  <div>
    <div class="titleWrap">
      <h2 class="title">Account</h2>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="profile-area">
          <div class="area-head">
            <div class="icon">
              <i class="bi bi-person-circle"></i>
            </div>
            <div class="title">Profile</div>
            <div class="permissions" :class="user.permissions">
              <span>{{ user.permissions }}</span>
            </div>
          </div>
          <div class="content">
            <form class="form" @submit.prevent>
              <div class="photo-area">
                <div class="preview">
                  <i class="bi bi-person-fill"></i>
                  <img v-if="preview || user.photo || user.externalPhoto" :src="preview || userPhotoPath || (user.externalPhoto as string)" :alt="user.username" />
                </div>
                <div class="upload">
                  <label>
                    <span>Upload</span>
                    <input type="file" @change="handlePhoto" ref="userFileInput" />
                  </label>
                </div>
              </div>
              <div class="form-area">
                <div class="item">
                  <label for="username" class="form-label">Username</label>
                  <input type="text" class="form-control" id="username" placeholder="" v-model="user.username" />
                </div>
                <div class="item">
                  <label for="phone" class="form-label">Phone</label>
                  <input type="text" class="form-control" id="phone" placeholder="" v-model="user.phone" />
                </div>
                <div class="item">
                  <label for="country" class="form-label">Country</label>
                  <input type="text" class="form-control" id="country" placeholder="" v-model="user.country" />
                </div>
                <div class="item">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" placeholder="" v-model="user.email" readonly />
                </div>
                <div class="item">
                  <label for="birth" class="form-label">Birth</label>
                  <Datepicker v-model="user.birth" :enable-time-picker="false" :format="format" />
                </div>
                <div class="item submit">
                  <div class="create-at">
                    <p class="title">Create at</p>
                    <p class="date">{{ createdAt }}</p>
                  </div>
                  <button class="save" @click="saveUser">Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="application-area">
          <div class="area-head">
            <div class="icon">
              <i class="bi bi-app-indicator"></i>
            </div>
            <div class="title">Applications</div>
          </div>
          <div class="content">
            <div class="common-area">
              <div class="balance-box">
                <span class="title">Balance</span>
                <div class="balance">
                  <p>{{ store.user ? store.user?.balance : 30 }}</p>
                  <img src="@/assets/images/currency.svg" alt="currency">
                </div>
              </div>
            </div>
            <div class="application-wrap">
              <div class="application-item">
                <div class="preview">
                  <img src="@/assets/images/ai_component.png" alt="ai_component">
                  <!-- <span class="title"> AI Component </span> -->
                </div>
                <NuxtLink to="/components" class="btn link-btn">More</NuxtLink>
              </div>
              <!-- <div class="application-item">
                <div class="preview">
                  <span class="title"> Diary Box </span>
                </div>
                <NuxtLink to="/admin/application/1" class="btn link-btn"
                  >Manage</NuxtLink
                >
              </div>
              <div class="application-item">
                <div class="preview">
                  <span class="title"> Diary Box </span>
                </div>
                <NuxtLink to="/admin/application/1" class="btn link-btn"
                  >Manage</NuxtLink
                >
              </div>
              <div class="application-item">
                <div class="preview">
                  <span class="title"> Diary Box </span>
                </div>
                <NuxtLink to="/admin/application/1" class="btn link-btn"
                  >Manage</NuxtLink
                >
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useStore } from "~/store";
import type { User } from "~/types";

// 需要驗證身份
definePageMeta({
  middleware: ["auth"],
  layout: 'admin-default'
});

useHead({
  title: "Account",
  titleTemplate: "%s - 6yuwei admin",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "6yuwei - Account admin",
    },
  ],
});

const store = useStore();
const route = useRoute();

interface userRef {
  msg: string;
  user: User;
}
const preview = ref<string>("");
const userPhotoFile = ref<File | null>(null);
const userFileInput = ref<HTMLInputElement | null>(null);
const user = ref<User>({
  _id: "",
  username: "",
  phone: "",
  country: "",
  email: "",
  birth: "",
  permissions: "user",
  createdAt: "",
  photo: "",
  externalPhoto: "",
  balance: 0,
});
const userPhotoPath = computed(() => {
  if (!user.value.photo) return "";
  return `${store.api}/admin/uploads/${user.value._id}/${user.value.photo}`;
});
const createdAt = computed(() => {
  const date = new Date(user.value.createdAt);
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  return `${date.getFullYear()}-${month}-${day}`;
});

const format = (date: Date) => {
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

const handlePhoto = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    preview.value = reader.result as string;
  };
  userPhotoFile.value = file;
};

const saveUser = async () => {
  store.isLoading = true;
  const formData = new FormData();
  formData.append("username", user.value.username ?? '');
  formData.append("phone", user.value.phone ?? '');
  formData.append("country", user.value.country ?? '');
  formData.append("birth", user.value.birth ?? '');
  if (userPhotoFile.value) {
    formData.append("photo", userPhotoFile.value);
  }
  const { data: userRef, error } = await useFetch(`${store.api}/user/`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
  if (error.value) {
    const status = error.value.status;
    status === 403 && navigateTo("/admin/login");
    return store.pushNotification({
      type: "error",
      message: error.value.data as string,
      timeout: 5000,
    });
  }
  const data = (userRef.value as userRef).user;
  if (data) {
    user.value = data;
    store.pushNotification({
      type: "success",
      message: "User updated",
      timeout: 5000,
    });
  }
  userFileInput.value!.value = "";
  store.isLoading = false;
};

onMounted(async () => {
  if (!store.user) {
    navigateTo("/admin/login");
  }

  const data = store.user;
  if (data) {
    user.value = data;
  }
});
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

.container-fluid {
  padding: 0;
  padding-top: 45px;

  .row {
    margin: 0;
    padding-bottom: 60px;
  }
}

.area-head {
  align-items: center;
  display: flex;
  padding: 28px 52px;
  border-bottom: 1px solid $terColor;

  @include media(1600) {
    padding: 28px 32px;
  }

  @include media(480) {
    padding: 20px 24px;
  }

  .icon {
    color: $secColor;
    font-size: 38px;
    margin-right: 10px;
  }

  .title {
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    line-height: 42px;
    color: $secColor;
    letter-spacing: 1px;

    @include media(480) {
      font-size: 24px;
    }
  }

  .permissions {
    font-style: normal;
    font-weight: 900;
    font-size: 18px;
    line-height: 27px;
    border-radius: 12px;
    height: 38px;
    padding: 5px 16px;
    @include center;
    letter-spacing: 0.8px;
    margin-left: 30px;
    text-transform: capitalize;

    @include media(480) {
      font-size: 16px;
      margin-left: auto;
    }

    @include media(374) {
      padding: 5px 12px;
    }

    &.general {
      color: $secColor;
      background: linear-gradient(90deg, #e8d39c -0.45%, #e09b34 100.45%);
    }

    &.admin {
      color: #fff;
      background: linear-gradient(90deg, #575eff -0.45%, #ff007a 100.45%);
    }
  }

}

.profile-area {
  background-color: $mainColor;
  border-radius: 30px;
  padding: 0;
  box-shadow: 0px 0px 20px rgba(40, 203, 146, 0.4);
  margin-bottom: 52px;

  .content {
    background: transparent;
    display: flex;
    padding: 42px 53px 57px;

    @include media(1600) {
      padding: 32px;
      padding-bottom: 14px;
    }

    @include media(1200) {
      padding: 28px 20px;
      padding-bottom: 22px;
    }
  }

  .form {
    display: flex;

    @include media(540) {
      flex-direction: column;
    }
  }

  .photo-area {
    padding-right: 53px;
    flex-shrink: 0;
    display: block;

    @include media(1600) {
      padding-right: 32px;
    }

    @include media(540) {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 30px;
    }

    .preview {
      display: flex;
      width: 126px;
      height: 126px;
      border-radius: 999px;
      border: 3px solid $terColor;
      background-color: $secColor;
      @include center;
      margin-bottom: 11px;
      position: relative;
      overflow: hidden;

      i {
        font-size: 80px;
        color: $mainColor;
        @include center(transform, all);
      }

      img {
        position: absolute;
        @include center(transform, all);
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .upload {
      display: flex;

      label {
        @extend %ts;
        background-color: $secColor;
        border-radius: 12px;
        display: flex;
        color: $mainColor;
        font-size: 20px;
        font-weight: bold;
        padding: 12px 24px;
        border: 0;
        height: 52px;
        @include center;
        cursor: pointer;

        input {
          display: none;
        }

        &:hover {
          background-color: lighten($secColor, 10%);
        }
      }
    }
  }

  .form-area {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -28px;

    @include media(1600) {
      margin: 0 -16px;
    }

    .item {
      width: calc(100% / 3);
      padding: 0 28px;
      margin-bottom: 21px;

      // @include media()
      @include media(1600) {
        padding: 0 16px;
      }

      @include media(1200) {
        width: 50%;
      }

      @include media(960) {
        width: 100%;
      }
    }

    .submit {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      @include media(1400) {
        flex-direction: column;
        align-items: flex-end;
      }

      @include media(1200) {
        flex-direction: row;
        align-items: flex-end;
      }
    }

    label {
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      color: $secColor;
      line-height: 24px;
      letter-spacing: 0.8px;
    }

    input {
      background-color: $terColor;
      height: 52px;
      border-radius: 12px;
      color: $secColor;
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 30px;
      border: 2px solid $terColor;

      &:focus {
        box-shadow: none;
        border: 2px solid $secColor;
      }
    }

    .create-at {
      @include media(1400) {
        text-align: right;
        margin-bottom: 10px;
      }

      @include media(1200) {
        text-align: left;
        margin-bottom: 0;
      }

      .title {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 0;
      }

      .date {
        color: $secColor;
        font-family: "Poppins";
        font-style: normal;
        font-weight: 900;
        font-size: 20px;
        line-height: 30px;
        letter-spacing: 0.02em;
        margin-bottom: 0;
      }
    }

    .save {
      background: $secColor;
      border-radius: 12px;
      color: $mainColor;
      @extend %ts;
      border: 0;
      font-weight: 700;
      font-size: 20px;
      line-height: 30px;
      letter-spacing: 0.025em;
      width: 200px;
      height: 52px;
      margin-left: 10px;
      @include center;

      &:hover {
        background-color: lighten($secColor, 10%);
      }

      @include media(1800) {
        width: 150px;
      }

      @include media(540) {
        width: 120px;
      }
    }
  }

  :deep(.dp__input) {
    background-color: $terColor;
    height: 52px;
    border-radius: 12px;
    color: $secColor;
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    border: 2px solid $terColor;

    &:focus {
      box-shadow: none;
      border: 2px solid $secColor;
    }
  }

  :deep(.dp__action_button) {
    @include center;
    padding: 4px 8px;
    height: auto;
  }

  :deep(.dp__theme_light) {
    --dp-primary-color: #28cb92;
  }
}

.application-area {
  background-color: $secColor;
  border-radius: 30px;
  padding: 0;
  box-shadow: 0px 0px 20px rgba(40, 203, 146, 0.4);
  display: flex;
  flex-direction: column;

  .area-head {

    .title,
    .icon {
      color: $mainColor;
    }
  }

  .common-area {
    display: flex;
    justify-content: flex-start;

    .balance-box {
      display: flex;
      align-items: center;
      margin-bottom: 30px;

      .title {
        color: #fff;
        font-weight: bold;
        font-size: 24px;
        margin-right: 20px;
        letter-spacing: 0.8px;
        @include media(768) {
          font-size: 20px;
        }
      }
    }

    .balance {
      background-color: lighten($secColor, 10%);
      border-radius: 10px;
      display: flex;
      padding: 10px 16px;
      min-width: 140px;
      justify-content: space-between;
      margin-left: 20px;
      margin-left: auto;

      @include media(768) {
        padding: 6px 14px;
        align-items: center;
        min-width: 110px;
        order: 1;
        margin-left: 0;
        margin-right: 20px;
      }

      p {
        color: #FFF;
        font-size: 22px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: 0.77px;
        margin: 0;

        @include media(768) {
          font-size: 18px;
          vertical-align: middle;
        }
      }

      img {
        @include media(768) {
          width: 24px;
          height: 24px;
        }
      }
    }
  }

  .application-item {
    display: flex;
    width: 25%;
    padding: 0 22px;
    flex-direction: column;

    @include media(1400) {
      width: 33.33%;
      padding: 0 10px;
      margin-bottom: 40px;
    }

    @include media(960) {
      width: 50%;
      padding: 0 10px;
      margin-bottom: 40px;
    }

    @include media(640) {
      width: 100%;
      padding: 0 10px;
      margin-bottom: 40px;
    }

    .link-btn {
      width: 100%;
      height: 52px;
      border-radius: 12px;
      background-color: $mainColor;
      @include center;
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 30px;

      &:hover {
        background-color: lighten($mainColor, 10%);
      }
    }

    .preview {
      min-height: 300px;
      width: 100%;
      display: flex;
      background: $secColor;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 35px;
      position: relative;
      border: 2px solid $mainColor;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      @include media(1920) {
        min-height: 250px;
      }

      @include media(1600) {
        min-height: 200px;
      }

      // @include after {
      //   display: flex;
      //   width: 100%;
      //   height: 100%;
      //   background: linear-gradient(180deg,
      //       #d9d9d9 0%,
      //       rgba(63, 63, 63, 0) 0.01%,
      //       #28cb92 100%);
      //   top: 0;
      //   left: 0;
      // }

      .title {
        font-weight: 700;
        font-size: 28px;
        line-height: 42px;
        letter-spacing: 0.025em;
        text-align: center;
        color: #fff;
        position: absolute;
        bottom: 0;
        width: 100%;
        left: 0;
        z-index: 1;
        bottom: 6px;
      }
    }
  }

  .content {
    background: transparent;
    display: block;
    flex-wrap: wrap;
    padding: 30px 53px 57px;

    @include media(1600) {
      padding: 32px;
    }

    @include media(1200) {
      padding: 40px 20px 0;
    }
  }

  .application-wrap {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -22px;

    @include media(1200) {
      margin: 0 -10px;
    }
  }
}</style>
