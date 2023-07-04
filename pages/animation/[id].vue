<template>
  <div class="inner-page">
    <div class="main">
      <div class="wrap">
        <Breadcrumb :breadcrumb="breadcrumb" />
        <div class="info">
          <div class="img-area">
            <div class="showcase">
              <img :src="showcaseURL" :alt="animation?.title" v-if="showcaseURL" @click="openLightbox" />
            </div>
            <div class="preview-list">
              <div class="preview-item" v-for="(item, index) in imgsRef" :key="item">
                <div class="img-wrap" @click="changeShowcase(index)">
                  <img :src="item" :alt="animation?.title" />
                </div>
              </div>
            </div>
            <vue-easy-lightbox v-if="imgsRef.length" :imgs="imgsRef" :index="indexRef" :visible="visibleRef"
              @hide="closeLightbox">
            </vue-easy-lightbox>
          </div>
          <div class="text-wrap">
            <div class="category">{{ animation?.category }}</div>
            <h1 class="title">{{ animation?.title }}</h1>
            <div class="desc">{{ animation?.description }}</div>
            <div class="btn-wrap">
              <a href="javascript:;" class="btn" @click="openYTModal">Visit</a>
            </div>
          </div>
        </div>
        <TextEditor :import-data="animation?.textEditor" />
      </div>
    </div>
    <YTVideoModal :isOpen="yTModal.open" :videoURL="animation?.externalLink" @close-modal="closeYTModal" />
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
import { Editor, Animation, BreadCrumb } from "~~/types";
import VueEasyLightbox from "vue-easy-lightbox";

const store = useStore();
const route = useRoute();
const id = ref(route.params.id);
const { data: animationReq, error } = await useFetch(
  `${store.api}/animations/${id.value}/`
); // get animation by id
const animation = ref<Animation | null>(null);
const breadcrumb = ref<BreadCrumb[]>([]);
const showcaseURL = ref("");
const visibleRef = ref(false);
const indexRef = ref(0); // default 0
const imgsRef = ref<string[]>([]);

const req = animationReq.value as { data: Animation; msg: string };
animation.value = req.data as Animation; // set animation

const yTModal = reactive({
  open: false,
});

useHead({
  title: `${animation.value?.title}`,
  titleTemplate: "%s - 6yuwei",
  meta: [
    {
      hid: "description",
      name: "description",
      content: `${animation.value?.description}`,
    },
  ],
});

useServerSeoMeta({
  title: `${animation.value?.title}`,
  ogTitle: `${animation.value?.title}`,
  description: `${animation.value?.description}`,
  ogDescription: `${animation.value?.description}`,
  ogImage: `${store.api}/admin/uploads/${animation.value?.description}`,
  twitterCard: "summary_large_image",
});

breadcrumb.value = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Animations",
    link: "/animations",
  },
  {
    name: animation.value?.title ?? "",
    link: `/animations/${id.value}`,
  },
];

const changeShowcase = (index: number) => {
  indexRef.value = index;
  showcaseURL.value = imgsRef.value[index];
};

const openLightbox = () => {
  visibleRef.value = true;
};

const closeLightbox = () => {
  visibleRef.value = false;
};

const openYTModal = () => {
  yTModal.open = true;
};

const closeYTModal = () => {
  yTModal.open = false;
};

onMounted(() => {
  if (!animation.value) return;
  if (animation.value?.photos.length > 0) {
    showcaseURL.value = `${store.api}/admin/uploads/${animation.value?.photos[0]?.url as string
      }`;
    imgsRef.value = animation.value?.photos.map((item) => {
      return `${store.api}/admin/uploads/${item.url}`;
    });
  }
});
</script>

<style lang="scss" scoped>
.main {
  background-color: $terColor;
  padding: 60px 0 90px;
  min-height: 0;

  @include media(1200) {
    padding: 40px 0 60px;
  }

  @include media(720) {
    padding: 30px 0 40px;
  }

  :deep(.breadcrumb) {
    margin-bottom: 32px;

    @include media(720) {
      margin-bottom: 22px;
    }

    @include media(480) {
      margin-bottom: 16px;
    }
  }

  .wrap {
    max-width: 1600px;
    width: 100%;
    padding: 0 20px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .info {
    display: flex;
    width: 100%;

    @include media(1200) {
      flex-direction: column;
    }

    .img-area {
      margin-right: 50px;
      flex-shrink: 0;
      min-width: 0;
      width: 55%;

      @include media(1400) {
        margin-right: 30px;
      }

      @include media(1200) {
        width: 100%;
        margin-right: 0;
        margin-bottom: 30px;
      }

      @include media(720) {
        margin-bottom: 20px;
      }
    }

    .showcase {
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 20px;
      cursor: pointer;

      @include media(1200) {
        margin-bottom: 10px;
      }

      img {
        max-width: 100%;
        width: 100%;
        max-height: 500px;
        object-fit: cover;
      }
    }

    .preview-list {
      display: flex;
      flex-grow: 1;
      margin: 0 -10px;

      @include media(720) {
        margin: 0 -5px;
      }

      .preview-item {
        width: 20%;
        padding: 0 10px;
        cursor: pointer;
        box-sizing: border-box;
        @include media(720) {
          padding: 0 5px;
        }

        .img-wrap {
          flex-grow: 1;
          border-radius: 12px;
          overflow: hidden;
          position: relative;

          @include after {
            border-radius: 12px;
            border: 3px solid transparent;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            @extend %ts;
            pointer-events: none;
          }

          &:hover {
            &::after {
              border-color: $mainColor;
            }
          }
        }

        img {
          width: 100%;
          max-width: 100%;
          height: 100px;
          object-fit: cover;

          @include media(720) {
            height: 80px;
          }

          @include media(480) {
            height: auto;
            aspect-ratio: 1/1;
          }
        }
      }
    }

    .text-wrap {
      flex-grow: 1;
      letter-spacing: 1px;
      padding-top: 20px;

      .category {
        font-size: 20px;
        font-weight: bold;
        color: darken($mainColor, 5%);
      }

      .title {
        margin-top: 10px;
      }

      .desc {
        color: $secColor;
        margin-top: 20px;
        margin-bottom: 30px;
        font-size: 18px;
        line-height: 1.7;
        letter-spacing: 1px;
      }

      .btn-wrap {
        .btn {
          height: auto;
          border-radius: 12px;
          padding: 10px 20px;
          font-size: 24px;
        }
      }
    }
  }
}
</style>
