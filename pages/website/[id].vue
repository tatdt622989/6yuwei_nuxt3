<template>
  <div class="inner-page">
    <div class="main">
      <div class="wrap">
        <Breadcrumb :breadcrumb="breadcrumb" />
        <div class="info">
          <div class="img-wrap">
            <div class="showcase">
              <img
                :src="showcaseURL"
                :alt="website?.title"
                v-if="showcaseURL"
              />
            </div>
            <div class="preview-list"></div>
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
        <div class="text-editor"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
import { Website } from "~~/types";

const store = useStore();
const route = useRoute();
const title = ref("example");
const id = ref(route.params.id);
const website = ref<Website | null>();
const breadcrumb = computed(() => {
  return [
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
});
const showcaseURL = ref("");

(async () => {
  const api = `${store.api}/websites/${id.value}/`;
  const res = await useFetch(api);
  if (res.error.value) {
    return;
  }
  const data = res.data.value as { data: Website; msg: string };
  if (!data) return;
  website.value = data.data as Website;
  showcaseURL.value = `${store.api}/admin/uploads/${
    website.value?.photos[0].url as string
  }/`;
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
})();

onMounted(() => {});
</script>

<style lang="scss" scoped>
.main {
  background-color: $terColor;
  padding: 60px 0 90px;
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
    .img-wrap {
      margin-right: 50px;
      min-width: 0;
      border-radius: 20px;
      overflow: hidden;
      img {
        max-width: 100%;
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
}
</style>
