<template>
  <div id="sidebar">
    <div class="logo">
      <NuxtLink to="/">
        <img src="@/assets/images/logo.svg" alt="6yuwei">
      </NuxtLink>
    </div>
    <ul>
      <!-- <li>
        <NuxtLink to="/admin/">
          <i class="bi bi-clipboard-data-fill"></i>
          <span class="text">Dashboard</span>
          <span class="material-icons arrow">
            arrow_forward_ios
          </span>
        </NuxtLink>
      </li> -->
      <li>
        <NuxtLink to="/admin/websites/">
          <i class="bi bi-window-sidebar"></i>
          <span class="text">Websites</span>
          <span class="material-icons arrow">
            arrow_forward_ios
          </span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/contact/">
          <i class="bi bi-person-lines-fill"></i>
          <span class="text">Contact</span>
          <span class="material-icons arrow">
            arrow_forward_ios
          </span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss">
#sidebar {
  box-sizing: border-box;
  width: 250px;
  flex-shrink: 0;
  // border-right: 1px solid $light;
  // box-shadow: 0 0 10px rgba(darken($mainColor, 10%), 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  background-color: $terColor;
  overflow: hidden;
  border-radius: 0 40px 40px 0;
  .logo {
    display: flex;
    padding: 20px;
    justify-content: flex-start;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 10px;
    img {
      width: auto;
    }
    h1 {
      font-size: 18px;
      margin-bottom: 0;
      font-weight: bold;
      color: $mainColor;
      line-height: 1;
      padding-left: 10px;
      padding-top: 8px;
      span {
        font-size: 28px;
      }
    }
  }
  ul {
    list-style: none;
    margin-bottom: 0;
    display: flex;
    flex-grow: 1;
    align-items: flex-start;
    flex-direction: column;
    li {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      padding: 10px 20px;
      a {
        width: 100%;
        font-size: 16px;
        font-weight: 500;
        display: flex;
        justify-content: flex-start;
        background-color: $terColor;
        color: $secColor;
        align-items: center;
        height: 44px;
        font-weight: bold;
        border-radius: 8px;
        padding: 0 8px;
        @extend %ts;
        &:hover {
          color: $mainColor;
          background-color: lighten($terColor, 5%);
        }
        .text {
          flex-grow: 1;
        }
        span {
          margin-right: 10px;
        }
        .arrow {
          font-size: 13px;
        }
        i {
          font-size: 22px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
