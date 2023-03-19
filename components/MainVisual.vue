<template>
  <div class="visualWrap">
    <!-- <canvas ref="main" /> -->
    <div class="videoBox">
      <video src="@/assets/videos/main.mp4?v=4" muted autoplay loop playsinline></video>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.videoBox {
  overflow: hidden;
  border-radius: 30px;
  background-color: #bfe6dc;
  display: flex;
  width: 100%;
  transform: rotate(0deg);
  video {
    transform: rotate(0deg);
    border-radius: 30px;
    width: 100%;
    height: 100%;
    object-fit: contain;
    @include media(540) {
      object-fit: cover;
    }
  }
}

canvas {
  min-width: 0;
  width: 100% !important;
  height: 100% !important;
  border-radius: 20px;
  touch-action: auto !important;
}

.loadingBox {
  position: absolute;
  width: 100%;
  height: 100%;

  @keyframes loading {
    to {
      opacity: 0.1;
      transform: translate3d(0, -1rem, 0);
    }
  }

  .loading {
    display: flex;
    justify-content: center;
  }

  .loading>div {
    width: 20px;
    height: 20px;
    margin: 3rem 6px;
    background: $secColor;
    border-radius: 50%;
    animation: loading 0.5s infinite alternate;
  }

  .loading>div:nth-child(2) {
    animation-delay: 0.2s;
  }

  .loading>div:nth-child(3) {
    animation-delay: 0.4s;
  }
}
</style>
