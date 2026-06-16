<template>
  <div class="visualWrap">
    <!-- <canvas ref="main" /> -->
    <div class="videoBox">
      <video
        ref="videoEl"
        src="/videos/main.mp4"
        :muted="true"
        autoplay
        loop
        playsinline
        webkit-playsinline
        preload="metadata"
        poster="/images/main_poster.jpg"
      />
      <!-- 覆蓋的預覽圖，確保在影片未播放前絕對能看見 -->
      <img
        v-if="!videoPlaying"
        src="/images/main_poster.jpg"
        alt="Banner Preview"
        class="videoPosterFallback"
      />
      <button
        v-if="showPlayFallback && !videoPlaying"
        type="button"
        class="playButton"
        aria-label="Play video"
        @click="handleManualPlay"
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const videoEl = ref<HTMLVideoElement | null>(null)
const showPlayFallback = ref(false)
const videoPlaying = ref(false)

const handlePlay = () => {
  videoPlaying.value = true
  showPlayFallback.value = false
}

const handlePause = () => {
  videoPlaying.value = false
}

const tryPlay = async (userInitiated = false) => {
  const video = videoEl.value

  if (!video) {
    return
  }

  try {
    video.muted = true
    await video.play()
    videoPlaying.value = true
    showPlayFallback.value = false
  } catch (error) {
    videoPlaying.value = false
    if (!userInitiated) {
      showPlayFallback.value = true
    }
    console.log("影片播放失敗:", error)
  }
}

const handleManualPlay = () => {
  void tryPlay(true)
}

const handleVisibilityChange = () => {
  if (document.visibilityState === "visible") {
    void tryPlay()
  }
}

onMounted(() => {
  const video = videoEl.value
  if (video) {
    video.muted = true
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    
    // 監聽原生播放與暫停事件
    video.addEventListener('play', handlePlay)
    video.addEventListener('playing', handlePlay)
    video.addEventListener('pause', handlePause)
  }

  void tryPlay()
  document.addEventListener("visibilitychange", handleVisibilityChange)
})

onBeforeUnmount(() => {
  const video = videoEl.value
  if (video) {
    video.removeEventListener('play', handlePlay)
    video.removeEventListener('playing', handlePlay)
    video.removeEventListener('pause', handlePause)
  }
  document.removeEventListener("visibilitychange", handleVisibilityChange)
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
  position: relative;

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

  .videoPosterFallback {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 1;
    pointer-events: none;
    border-radius: 30px;

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
  width: 88px;
  height: 88px;
  border: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;

  svg {
    margin-left: 4px;
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

  .loading > div {
    width: 20px;
    height: 20px;
    margin: 3rem 6px;
    background: $secColor;
    border-radius: 50%;
    animation: loading 0.5s infinite alternate;
  }

  .loading > div:nth-child(2) {
    animation-delay: 0.2s;
  }

  .loading > div:nth-child(3) {
    animation-delay: 0.4s;
  }
}
</style>
