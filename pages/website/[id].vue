<template>
  <div class="inner-page">
    <div class="main">
      <div class="wrap">
        <Breadcrumb :breadcrumb="breadcrumb" />
        <div class="info">
          <div class="img-area">
            <div class="showcase">
              <img
                :src="showcaseURL"
                :alt="website?.title"
                v-if="showcaseURL"
                @click="openLightbox"
              />
            </div>
            <div class="preview-list">
              <div
                class="preview-item"
                v-for="(item, index) in imgsRef"
                :key="item"
              >
                <div class="img-wrap" @click="changeShowcase(index)">
                  <img :src="item" :alt="website?.title" />
                </div>
              </div>
            </div>
            <vue-easy-lightbox
              v-if="imgsRef.length"
              :imgs="imgsRef"
              :index="indexRef"
              :visible="visibleRef"
              @hide="closeLightbox"
            >
            </vue-easy-lightbox>
          </div>
          <div class="text-wrap">
            <div class="category">{{ website?.category }}</div>
            <h1 class="title">{{ website?.title }}</h1>
            <div class="desc">{{ website?.description }}</div>
            <div class="btn-wrap">
              <a :href="website?.externalLink" class="btn">Visit Website</a>
            </div>
          </div>
        </div>
        <div class="text-editor">
          <editor-content :editor="editor" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
import { Website, BreadCrumb } from "~~/types";
import VueEasyLightbox from "vue-easy-lightbox";
import StarterKit from '@tiptap/starter-kit';
import { Editor, EditorContent } from "@tiptap/vue-3";

const store = useStore();
const route = useRoute();
const id = ref(route.params.id);
const { data: websiteReq, error } = await useFetch(
  `${store.api}/websites/${id.value}/`
); // get website by id
const website = ref<Website | null>(null);
const breadcrumb = ref<BreadCrumb[]>([]);
const showcaseURL = ref("");
const visibleRef = ref(false);
const indexRef = ref(0); // default 0
const imgsRef = ref<string[]>([]);
const editor = ref<any | null>(null);

const req = websiteReq.value as { data: Website; msg: string };
website.value = req.data as Website; // set website

useHead({
  title: `${website.value?.title}`,
  titleTemplate: "%s - 6yuwei",
  meta: [
    {
      hid: "description",
      name: "description",
      content: `${website.value?.description}`,
    },
  ],
});

useServerSeoMeta({
  title: `${website.value?.title}`,
  ogTitle: `${website.value?.title}`,
  description: `${website.value?.description}`,
  ogDescription: `${website.value?.description}`,
  ogImage: `${store.api}/admin/uploads/${website.value?.description}`,
  twitterCard: "summary_large_image",
});

breadcrumb.value = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Websites",
    link: "/websites",
  },
  {
    name: website.value?.title ?? "",
    link: `/websites/${id.value}`,
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

onMounted(() => {
  if (!website.value) return;
  showcaseURL.value = `${store.api}/admin/uploads/${
    website.value?.photos[0].url as string
  }/`;
  imgsRef.value = website.value?.photos.map((item) => {
    return `${store.api}/admin/uploads/${item.url}`;
  });
  editor.value = new Editor({
    editable: false,
    content: website.value?.textEditor ?? "",
    extensions: [
      StarterKit,
    ],
  });
});
</script>

<style lang="scss" scoped>
.main {
  background-color: $terColor;
  padding: 60px 0 90px;
  min-height: 0;
  :deep(.breadcrumb) {
    margin-bottom: 40px;
  }
  .wrap {
    max-width: 1600px;
    width: 100%;
    padding: 0 20px;
    margin: 0 auto;
  }
  .info {
    display: flex;
    width: 100%;
    .img-area {
      margin-right: 50px;
      flex-shrink: 0;
      min-width: 0;
      width: 55%;
    }
    .showcase {
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 20px;
      cursor: pointer;
      img {
        max-width: 100%;
        width: 100%;
      }
    }
    .preview-list {
      display: flex;
      flex-grow: 1;
      margin: 0 -10px;
      .preview-item {
        width: 20%;
        padding: 0 10px;
        cursor: pointer;
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
        }
      }
    }
    .text-wrap {
      min-width: 600px;
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
        line-height: 1.5;
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
  .text-editor {
    padding: 30px 0;
  }
}
</style>
