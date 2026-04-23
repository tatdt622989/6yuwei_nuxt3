<template>
  <div class="visualWrap">
    <!-- <canvas ref="main" /> -->
    <div class="videoBox">
      <video ref="videoEl" muted autoplay loop playsinline poster="/images/main_poster.jpg">
        <source src="/videos/main.mp4" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script lang="ts" setup>
const videoEl = ref<HTMLVideoElement | null>(null)

onMounted(() => {
  if (videoEl.value) {
    // 嘗試播放，如果失敗則顯示poster
    videoEl.value.play().catch(() => {
      // iOS可能阻止autoplay，顯示poster
      console.log('Autoplay blocked, showing poster')
    })
  }
})

// 添加用戶交互事件來播放影片
const playVideo = () => {
  if (videoEl.value) {
    videoEl.value.play()
  }
}

// 監聽用戶交互
onMounted(() => {
  document.addEventListener('touchstart', playVideo, { once: true })
  document.addEventListener('click', playVideo, { once: true })
})
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
