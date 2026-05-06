<template>
  <div class="visualWrap">
    <!-- <canvas ref="main" /> -->
    <div class="videoBox">
      <video ref="videoEl" muted loop playsinline poster="/images/main_poster.jpg" @click="playVideo" @touchstart="playVideo">
        <source src="/videos/main.mp4" type="video/mp4" />
      </video>
      <!-- 如果影片沒有自動播放，顯示播放按鈕 -->
      <div v-if="!isPlaying" class="playButton" @click="playVideo" @touchstart="playVideo">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const videoEl = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)

const playVideo = () => {
  if (videoEl.value && !isPlaying.value) {
    videoEl.value.play().then(() => {
      isPlaying.value = true
    }).catch((error) => {
      console.log('播放失敗:', error)
    })
  }
}

// 影片播放事件
const onPlay = () => {
  isPlaying.value = true
}

// 影片暫停事件
const onPause = () => {
  isPlaying.value = false
}

// 影片結束事件
const onEnded = () => {
  isPlaying.value = false
}

onMounted(() => {
  if (videoEl.value) {
    videoEl.value.addEventListener('play', onPlay)
    videoEl.value.addEventListener('pause', onPause)
    videoEl.value.addEventListener('ended', onEnded)
  }
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
  position: relative; // 添加相對定位
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

.playButton {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translate(-50%, -50%) scale(1.1);
  }

  svg {
    margin-left: 4px; // 稍微調整播放圖標位置
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
