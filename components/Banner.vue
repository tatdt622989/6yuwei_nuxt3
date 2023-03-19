<template>
  <div class="bannerBox">
    <div class="imgBox">
      <img src="@/assets/images/websites-banner.jpg" alt="websites">
    </div>
    <div class="text-box">
      <div class="wrap">
        <h1 class="title">
          {{ unitName }}
        </h1>
        <h2 class="describe">
          {{ describe }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps(['url', 'unitName', 'describe'])
</script>

<style lang="scss" scoped>
.bannerBox {
  position: relative;

  .imgBox {
    width: 100%;
    img {
      width: 100%;
      height: 360px;
      object-fit: cover;
    }
  }

  .text-box {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    width: 100%;
    .wrap {
      padding: 0 40px;
    }
    .title {
      font-size: 52px;
      text-transform: uppercase;
      color: $secColor;
      margin-bottom: 10px;
    }
    .describe {
      font-size: 24px;
      font-weight: normal;
      color: $secColor;
    }
  }
}
</style>
