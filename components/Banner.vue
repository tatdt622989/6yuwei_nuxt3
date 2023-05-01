<template>
  <div class="bannerBox">
    <div class="imgBox">
      <img :src="imgPath" :alt="props.unitName" />
    </div>
    <div class="text-box">
      <div class="wrap">
        <h1 class="title">
          {{ props.unitName }}
        </h1>
        <h2 class="describe">
          {{ props.describe }}
        </h2>
        <Breadcrumb :breadcrumb="breadcrumb" /> 
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  unitName: {
    type: String,
    required: true,
  },
  describe: {
    type: String,
    required: true,
  },
});
const lowerCaseUnitName = computed(() => props.unitName.toLowerCase());
const imgPath = computed(() => `/images/${lowerCaseUnitName.value}-banner.jpg`);
const breadcrumb = ref([
  {
    name: 'Home',
    link: '/',
  },
  {
    name: props.unitName,
    link: `/${lowerCaseUnitName.value}`,
  },
]);
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
      background: -webkit-linear-gradient(180deg, $mainColor, $secColor);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .describe {
      font-size: 24px;
      font-weight: normal;
      color: $secColor;
      margin-bottom: 20px;
    }
  }
}
</style>
