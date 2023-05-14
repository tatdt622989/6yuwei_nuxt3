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
            <div class="permissions general">
              <span>General</span>
            </div>
          </div>
          <div class="content">
            <form class="form" @submit.prevent>
              <div class="photo-area">
                <div class="preview">
                  <i class="bi bi-person-fill"></i>
                </div>
                <div class="upload">
                  <label>
                    <span>Upload</span>
                    <input type="file" />
                  </label>
                </div>
              </div>
              <div class="form-area">
                <div class="item">
                  <label for="username" class="form-label">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    placeholder=""
                  />
                </div>
                <div class="item">
                  <label for="phone" class="form-label">Phone</label>
                  <input
                    type="text"
                    class="form-control"
                    id="phone"
                    placeholder=""
                  />
                </div>
                <div class="item">
                  <label for="country" class="form-label">Country</label>
                  <input
                    type="text"
                    class="form-control"
                    id="country"
                    placeholder=""
                  />
                </div>
                <div class="item">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder=""
                  />
                </div>
                <div class="item">
                  <label for="birth" class="form-label">Birth</label>
                  <Datepicker v-model="birth" :enable-time-picker="false" :format="format" />
                </div>
                <div class="item submit">
                  <div class="create-at">
                    <p class="title">Create at</p>
                    <p class="date">2021.08.01</p>
                  </div>
                  <button class="save">Save</button>
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
            <div class="title">Application</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

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

const birth = ref();

const format = (date: Date) => {
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";
.container-fluid {
  padding: 0;
  padding-top: 45px;
}
.area-head {
  align-items: center;
  display: flex;
  padding: 28px 52px;
  border-bottom: 1px solid $terColor;
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
    &.general {
      color: $secColor;
      background: linear-gradient(90deg, #e8d39c -0.45%, #deba5d 100.45%);
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
  }
  .form {
    display: flex;
  }
  .photo-area {
    padding-right: 53px;
    flex-shrink: 0;
    .preview {
      display: flex;
      width: 126px;
      height: 126px;
      border-radius: 999px;
      border: 3px solid $terColor;
      background-color: $secColor;
      @include center;
      margin-bottom: 11px;
      i {
        font-size: 80px;
        color: $mainColor;
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
    .item {
      width: calc(100% / 3);
      padding: 0 28px;
      margin-bottom: 21px;
    }
    .submit {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
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
      @include center;
      &:hover {
        background-color: lighten($secColor, 10%);
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
  .area-head {
    .title, .icon {
      color: $mainColor;
    }
  }
}
</style>
