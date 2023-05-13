<template>
  <div>
    <div class="titleWrap">
      <h2 class="title">Account</h2>
    </div>
    <div class="container-fluid">
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
          <form class="form" @submit.prevent></form>
        </div>
      </div>
      <div class="application-area"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
  overflow: hidden;
  box-shadow: 0px 0px 20px rgba(40, 203, 146, 0.4);
  .content {
    background: transparent;
  }
}
</style>
