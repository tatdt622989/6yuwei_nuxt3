<template>
  <div class="inner-page">
    <div class="main">
      <div class="wrap">
        <div class="info">
          <div class="img-wrap">
            <div class="showcase">
              <img :src="showcaseURL" :alt="website?.title" v-if="showcaseURL">
            </div>
            <div class="preview-list"></div>
          </div>
          <div class="text-wrap">
            <div class="category">{{ website?.category }}</div>
            <h1>{{ website?.title }}</h1>
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
const title = ref('test');
const id = ref(route.params.id);
const website = ref<Website | null>();
const showcaseURL = ref('');

(async () => {
  const api = `${store.api}/websites/${id.value}/`;
  const res = await useFetch(api);
  if (res.error.value) {
    return;
  }
  const data = res.data.value as {data: Website, msg: string};
  if (!data) return;
  website.value = data.data as Website;
  showcaseURL.value = `${store.api}/admin/uploads/${website.value?.photos[0].url as string}/`;
})();

useServerSeoMeta({
  title: `${title.value}`,
  ogTitle: 'My Amazing Site',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
});

onMounted(() => {
});
</script>

<style lang="scss" scoped>
.main {
  min-height: 0;
  padding: 90px 0;
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
      padding-right: 50px;
      min-width: 0;
      img {
        max-width: 100%;
      }
    }
    .text-wrap {
      min-width: 600px;
      flex-grow: 1;
    }
  }
}
</style>