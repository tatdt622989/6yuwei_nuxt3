<template>
  <div class="innerPage">
    <Banner :unit-name="'Websites'" :describe="'Websites created using various technologies'" />
    <div class="main">
      <div class="wrap">
        <div class="tools">
          <div class="item filter">
            <button class="btn">
              <span class="material-icons">
                filter_alt
              </span>
            </button>
          </div>
          <div class="item layout">
            <button class="btn" @click="sortToggler">
              <span class="material-icons">{{ layout !== 'card' ? 'grid_view' : 'view_list' }}</span>
            </button>
          </div>
          <div class="item sort">
            <div class="selectWrap">
              <select v-model="sort" name="" class="select">
                <option value="0">
                  Sort By
                </option>
                <option value="1">
                  old -> new
                </option>
                <option value="2">
                  new -> old
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="item card">
            <div class="imgWrap">
              <img src="" alt="">
            </div>
            <div class="info">
              <h3 class="title">
                Website 1
              </h3>
              <p class="desc">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
              </p>
              <div class="btnWrap">
                <a href="#" class="btn">
                  VIEW
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const layout = ref('card');
const sort = ref('0');

const sortToggler = () => {
  layout.value = layout.value === 'card' ? 'list' : 'card';
}
</script>

<style lang="scss" scoped>
.main {
  padding: 60px 0;
  .wrap {
    max-width: 1480px;
    margin: 0 auto;
    box-sizing: border-box;
  }
}
.tools {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 6px;
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 0;
      background-color: transparent;
      // border: 2px solid $secColor;
      cursor: pointer;
      @extend %ts;
      width: 44px;
      height: 44px;
      border-radius: 99px;
      background-color: lighten($terColor, 10%);
      &:hover {
        background-color: $mainColor;
      }
    }
    span {
      font-size: 30px;
      color: $secColor;
    }
    .selectWrap {
      position: relative;
      @include after {
        background: no-repeat url(@/assets/images/select_arrow.svg) center/contain;
        width: 10px;
        height: 10px;
        right: 8px;
        @include center(transform, y);
      }
    }
    .select {
      border: 0;
      // border: 2px solid $secColor;
      background-color: lighten($terColor, 10%);
      height: 44px;
      border-radius: 99px;
      font-size: 20px;
      min-width: 120px;
      padding: 0 24px 0 12px;
      appearance: none;
      font-weight: bold;
      &:active, &:focus {
        outline: 0;
      }
    }
  }
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 30px;
  .imgWrap {
    width: 100%;
    height: 300px;
    overflow: hidden;
    background-color: #ccc;
    border-radius: 20px 20px 0 0;
    overflow: hidden;
    img {
      border-radius: 20px 20px 0 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .info {
    padding: 6px 12px;
    .title {
      @extend %ts;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 12px;
      cursor: pointer;
      &:hover {
        color: $mainColor;
      }
    }
    .desc {
      @extend %ts;
      font-size: 18px;
      margin-bottom: 12px;
    }
  }
  .item {
    background-color: lighten($terColor, 10%);
    border-radius: 20px;
    overflow: hidden;
  }

  .btn {
  }
}
</style>
