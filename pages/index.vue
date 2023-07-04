<template>
  <div>
    <div class="banner" ref="banner">
      <div class="wrap">
        <div class="text-box">
          <h1>
            <span>I am Yu Wei,</span><br /><span>a front-end engineer </span>.
          </h1>
          <p>Currently dedicated to web front-end, web design, 3D design.</p>
        </div>
        <MainVisual />
      </div>
      <SocialBar />
      <button class="scroll-down" @click="scrollDown" />
    </div>
    <div class="about">
      <div class="wrap">
        <div class="photo" data-aos="fade-in">
          <img src="@/assets/images/my-photo.jpg" alt="my_photo" />
        </div>
        <div class="text-box" data-aos="fade-left">
          <h2>About us</h2>
          <p>
            I am <b>Yu Wei</b>,an <b>frontend engineer</b> .I graduated from a
            <b>visual design</b> school and have <b>two years</b> of experience
            in front-end web development,including web applications, business
            websites, and e-commerce websites.
          </p>
          <p>
            Technologies used in the works:<br />
            <b style="color: white"
              >Vue.js, Nuxt.js, React, TypeScript, JavaScript, Three.js, jQuery,
              SCSS, PHP, Git, Gulp, Webpack</b
            >
          </p>
        </div>
      </div>
    </div>
    <div class="advantages" ref="advantagesEl">
      <div class="wrap">
        <ul class="list">
          <div class="item" data-aos="fade-in">
            <div class="icon">
              <img src="@/assets/images/advantages1.svg" alt="advantages" />
            </div>
            <div class="num" :data-num="nowYear">
              <span class="main-text">{{ nowYear }}</span
              ><span class="unit">+</span>
            </div>
            <p class="text">years of experience</p>
          </div>
          <div class="item" data-aos="fade-in">
            <div class="icon">
              <img src="@/assets/images/advantages2.svg" alt="advantages" />
            </div>
            <div class="num" data-num="30">
              <span class="main-text">30</span><span class="unit">+</span>
            </div>
            <p class="text">Web projects handled</p>
          </div>
          <div class="item" data-aos="fade-in">
            <div class="icon">
              <img src="@/assets/images/advantages3.svg" alt="advantages" />
            </div>
            <div class="num" data-num="12">
              <span class="main-text">12</span><span class="unit">+</span>
            </div>
            <p class="text">often used techniques</p>
          </div>
        </ul>
      </div>
    </div>
    <div class="side-project">
      <div class="wrap">
        <div class="content">
          <h2 data-aos="fade-in">Side project</h2>
          <div class="item-wrap">
            <div
              class="item"
              v-for="(item, i) in sideProjectData"
              :key="item._id"
              :id="item._id"
              data-aos="fade-in"
            >
              <h3 class="title">{{ item.title }}</h3>
              <client-only>
                <swiper
                  class="slider"
                  :modules="modules"
                  :slides-per-view="1"
                  :autoplay="{ delay: 3000 }"
                  :pagination="{
                    clickable: true,
                    el: paginationElList[i],
                  }"
                  :loop="true"
                  :id="'swiper-'+i"
                >
                  <swiper-slide v-for="photo in item.photos" :key="photo._id">
                    <NuxtLink :to="`/website/${item._id}`" class="visit">
                      <img
                        :src="`${store.api}/admin/uploads/${photo.url}`"
                        alt="my-topic"
                      />
                    </NuxtLink>
                  </swiper-slide>
                </swiper>
              </client-only>
              <!-- <h3>Topic chat</h3> -->
              <p class="text">
                {{ item.description }}
              </p>
              <NuxtLink :to="`/website/${item._id}`" class="visit">
                Visit
              </NuxtLink>
              <div class="swiper-pagination"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="other" v-if="false">
      <div class="wrap">
        <div class="head">
          <h2>Other front-end<br />works</h2>
          <!-- <div class="num">
            12
          </div> -->
        </div>
      </div>
      <div class="content">
        <div v-for="(item, i) in other" :key="item.title" class="item">
          <a :href="item.url" target="_blank">
            <img :src="`/images/other${i + 1}.jpg`" :alt="`other${i + 1}`" />
          </a>
          <div class="text-box">
            <p class="en-title">
              {{ item.enTitle }}
            </p>
            <p class="title">
              {{ item.title }}
            </p>
            <a class="linkBtn" href="item.url" target="_blank">Link</a>
          </div>
        </div>
      </div>
    </div>
    <div class="blog">
      <div class="wrap">
        <h2 data-aos="fade-in">Recent posts by Blogs</h2>
        <div class="content">
          <div v-for="(obj, i) in posts" :key="i" class="item" data-aos="fade-in">
            <div class="img-box">
              <a :href="obj.permalink" target="_blank">
                <img v-if="obj.imgUrl" :src="obj.imgUrl" :alt="obj.title" />
              </a>
            </div>
            <div class="text-box">
              <h3>
                <a :href="obj.permalink" target="_blank">{{ obj.title }}</a>
              </h3>
              <p class="description">
                {{ obj.excerpt }}
              </p>
              <a :href="obj.permalink" class="btn" target="_blank"> More </a>
            </div>
          </div>
        </div>
        <a href="https://blog.6yuwei.com/" class="seeMore" target="_blank"
          >see more</a
        >
      </div>
    </div>
    <div class="threedcgs">
      <div class="wrap">
        <h2 data-aos="fade-in">3DCGs</h2>
        <div class="btnBox">
          <button class="prev">
            <span class="material-icons">keyboard_arrow_left</span>
          </button>
          <button class="next">
            <span class="material-icons">keyboard_arrow_right</span>
          </button>
        </div>
      </div>
      <div class="content">
        <client-only>
          <swiper
            data-aos="fade-in"
            class="swiper3DCGS"
            :modules="modules"
            :slides-per-view="1"
            :pagination="{ clickable: true, el: threeDCGsPage }"
            :space-between="40"
            :freeMode="true"
            :loop="true"
            :navigation="{
              nextEl: '.threedcgs .next',
              prevEl: '.threedcgs .prev',
            }"
            :breakpoints="{
              541: {
                slidesPerView: 'auto',
                spaceBetween: 30,
                loop: false,
              },
            }"
          >
            <swiper-slide v-for="item in threeDCGsData" :key="item._id">
              <div class="item">
                <div class="img-box">
                  <NuxtLink :to="`/3dcg/${item._id}`">
                    <img :src="`${store.api}/admin/uploads/${item.photos[0].url}`" alt="my-topic" />
                  </NuxtLink>
                </div>
                <div class="text-box">
                  <p class="title">
                    {{ item.title }}
                  </p>
                  <h3 class="description">
                    {{ item.description }}
                  </h3>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </client-only>
        <div ref="threeDCGsPage" class="swiper-pagination" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "~/store";
import { Pagination, Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { Website, ThreeDCG } from "~/types";
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

interface Post {
  data: string;
  title: string;
  excerpt: string;
  permalink: string;
  updated: string;
  imgUrl: string;
}

useHead({
  title: "Home",
  titleTemplate: "%s - 6yuwei",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "6yuwei home page",
    },
  ],
});

const store = useStore();
const advantagesEl = ref<HTMLDivElement | null>(null);
const banner = ref<HTMLDivElement | null>(null);
const nowYear = new Date().getFullYear() - 2021;
const modules = [Pagination, Autoplay, Navigation];
const { data: sideProjectReq } = await useFetch(
  `${store.api}/websites/list/?homepage=1`,
  {
    method: "GET",
  }
);
const { data:threeDCGsReq } = await useFetch(
  `${store.api}/3dcgs/list/?homepage=1`,
  {
    method: "GET",
  }
);
const sideProjectData = ref<Website[]>([]);
const threeDCGsData = ref<ThreeDCG[]>([]);
const threeDCGsPage = ref<HTMLDivElement | null>(null);
let advantagesIsCounter = false;
const other = [
  {
    title: "說酒人貿易",
    enTitle: "DixitWine",
    url: "https://www.dixitwine.com/",
  },
  {
    title: "拾隱空間設計",
    enTitle: "Shiyin Space Design",
    url: "https://www.10yin-design.com.tw/",
  },
  {
    title: "薇閣精品旅館-大直館",
    enTitle: "Wego Boutique Hotel-Dazhi",
    url: "https://dazhi.we-go.com.tw/",
  },
  {
    title: "權衡國際",
    enTitle: "OUTDOOR FUN TAIWAN",
    url: "https://www.oft.com.tw/",
  },
  {
    title: "旭鴻藥業",
    enTitle: "XU HONG",
    url: "https://www.xuhong.tw/",
  },
  {
    title: "太聯事業",
    enTitle: "AUK CONTRACTORS CO.,LTD.",
    url: "https://www.aukconnector.com/",
  },
  {
    title: "大塚科技",
    enTitle: "Otuska",
    url: "https://www.otsuka-tw.com/",
  },
  {
    title: "喬楀實業有限公司",
    enTitle: "Auto bruce",
    url: "https://www.auto-bruce.com/",
  },
];
const { data: blogsJson } = await useFetch("https://blog.6yuwei.com/api.php");
const posts = ref<Post[] | null>(null);
const paginationElList = ref<HTMLDivElement[] | []>([]);

interface SideProjectReq {
  list: Website[];
  total: number;
  totalPage: number;
}

interface ThreeDCGReq {
  list: ThreeDCG[];
  total: number;
  totalPage: number;
}

if (sideProjectReq.value) {
  const { list } = sideProjectReq.value as SideProjectReq;
  sideProjectData.value = list;
}

if (threeDCGsReq.value) {
  const { list } = threeDCGsReq.value as ThreeDCGReq;
  threeDCGsData.value = list;
}

const advantagesCounter = () => {
  advantagesIsCounter = true;
  const el = advantagesEl.value;
  if (!el) return;
  setTimeout(() => {
    const numEl = el.querySelectorAll(".num");
    const numAry = Array.from(numEl);
    numAry.forEach((item) => {
      const num = item.getAttribute("data-num");
      const numText = item.querySelector(".main-text");
      if (!num || !numText) return;
      const numInt = parseInt(num);
      const per = 50;
      const numInterval = setInterval(() => {
        const numNow = parseInt(numText.innerHTML);
        if (numNow < numInt) {
          numText.innerHTML = `${numNow + 1}`;
        } else {
          clearInterval(numInterval);
        }
      }, per);
    });
  }, 300);
};

const onScroll = () => {
  const el = advantagesEl.value;
  const offset = el?.getBoundingClientRect().top ?? 0 + 300;
  const scrollTop = document.documentElement.scrollTop + window.innerHeight;
  if (offset && scrollTop > offset && !advantagesIsCounter) {
    advantagesCounter();
  }
};

onMounted(() => {
  paginationElList.value = Array.from(
    document.querySelectorAll(".swiper-pagination")
  );
  if (blogsJson.value) {
    posts.value = JSON.parse(blogsJson.value as string).posts as Post[];
    if (posts.value.length > 3) {
      posts.value = posts.value.slice(0, 3);
      getImgLink();
    }
  }
  const NumEl = advantagesEl.value?.querySelectorAll(".main-text");
  NumEl?.forEach((item) => {
    item.innerHTML = "0";
  });
  onScroll();
  window.addEventListener("scroll", onScroll);

  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: true,
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

// const onThreeDCGSwiper = (swiper: any) => {};

const getImgLink = async () => {
  const resAry: Promise<Boolean>[] = [];
  if (!posts.value) return;
  // 檢查圖片是否存在
  posts.value.forEach((item) => {
    const img = new Image();
    img.src = `${item.permalink}cover.jpg`;
    const res: Promise<Boolean> = new Promise((resolve, reject) => {
      img.onload = () => {
        resolve(true);
      };
      img.onerror = (err) => {
        resolve(false);
      };
    });
    resAry.push(res);
  });
  await Promise.all(resAry).then((res) => {
    res.forEach((item, index) => {
      if (item && posts.value) {
        posts.value[index].imgUrl = `${posts.value[index].permalink}cover.jpg`;
      }
    });
  });
};
const scrollDown = () => {
  if (banner.value) {
    const top = banner.value.getBoundingClientRect().height;
    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }
};
</script>

<style lang="scss" scoped>
.banner {
  height: 950px;
  display: flex;
  align-items: stretch;
  position: relative;
  @include media(1200) {
    height: auto;
  }
  .text-box {
    flex-shrink: 0;
    max-width: 695px;
    display: flex;
    width: 100%;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    padding-top: 110px;
    @include media(1600) {
      max-width: 660px;
      padding-left: 30px;
    }
    @include media(1500) {
      max-width: 620px;
    }
    @include media(1400) {
      max-width: 40%;
    }
    @include media(1300) {
      max-width: 45%;
    }
    @include media(1200) {
      padding: 0 20px;
    }
    @include media(1024) {
      order: 2;
      max-width: none;
      padding: 0;
      padding-bottom: 30px;
    }
    @include media(720) {
    }
  }
  h1 {
    font-size: 52px;
    margin: 0;
    letter-spacing: 0.8px;
    color: $secColor;
    margin-bottom: 10px;
    line-height: 1.4;
    @include media(1600) {
      font-size: 48px;
      line-height: 1.3;
    }
    @include media(1400) {
      font-size: 40px;
    }
    @include media(1200) {
      font-size: 36px;
    }
    @include media(720) {
      font-size: 32px;
    }
    span {
      background: -webkit-linear-gradient(180deg, $mainColor, $secColor);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  p {
    margin-top: 0;
    color: #8e8e8e;
    font-size: 24px;
    font-weight: 500;
    width: 480px;
    line-height: 36px;
    letter-spacing: 0.015em;
    margin-bottom: 24px;
    @include media(1600) {
      font-size: 20px;
    }
    @include media(1200) {
      font-size: 18px;
      word-break: break-all;
      display: block;
      width: 100%;
    }
  }
  .visualWrap {
    flex-grow: 1;
    padding-top: 145px;
    padding-bottom: 45px;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    @include media(1200) {
      height: 550px;
      padding-top: 105px;
      padding-bottom: 30px;
    }
    @include media(1024) {
      order: 1;
      height: 450px;
    }
    @include media(540) {
      order: 1;
      height: 400px;
    }
    @include media(420) {
      order: 1;
      height: 340px;
    }
    @include media(375) {
      order: 1;
      height: 310px;
    }
  }
  .wrap {
    @include media(1024) {
      flex-direction: column;
    }
  }
  > .socialList {
    @include media(1200) {
      display: none;
    }
  }
}

h2 {
  font-size: 52px;
  color: $secColor;
  line-height: 78px;
  letter-spacing: 0.015em;
  // box-shadow: inset 0 -10px $mainColor;
  @include media(1400) {
    font-size: 48px;
    line-height: 1.5;
  }
  @include media(1200) {
    font-size: 45px;
    line-height: 1.5;
  }
  @include media(840) {
    font-size: 36px;
  }
}

.wrap {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
}

.about {
  // min-height: 696px;
  background: $secColor;
  padding: 100px 0;
  box-sizing: border-box;
  @include media(1600) {
    padding: 90px 0 80px;
  }
  @include media(1200) {
    padding: 70px 0 60px;
  }
  @include media(840) {
    padding: 50px 0 40px;
  }
  .wrap {
    display: flex;
    align-items: stretch;
    @include media(840) {
      flex-direction: column;
      padding: 0 20px;
    }
    @include media(540) {
      padding: 0 20px;
    }
  }
  .photo {
    border-radius: 20px;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    @include media(1024) {
      // margin-bottom: 30px;
      width: 300px;
      margin-right: 20px;
    }
    @include media(840) {
      // max-width: 540px;
      width: 100%;
      height: 360px;
      margin-right: 20px;
      margin-bottom: 30px;
    }
    @include media(540) {
      height: 200px;
    }
    img {
      opacity: 0.8;
      object-fit: cover;
      @include media(1600) {
        width: 500px;
      }
      @include media(1200) {
        width: 400px;
      }
      @include media(1024) {
        width: 100%;
        height: 100%;
      }
    }
  }
  .text-box {
    padding-left: 100px;
    @include media(1600) {
      padding-left: 60px;
    }
    @include media(1400) {
      padding-left: 40px;
    }
    @include media(1200) {
      padding-left: 20px;
    }
    @include media(1024) {
      padding-left: 0;
    }
    h2 {
      font-weight: bold;
      letter-spacing: 0.015em;
      color: $mainColor;
      margin-bottom: 10px;
      @include media(1600) {
        font-size: 48px;
        line-height: 52px;
      }
      @include media(1400) {
        font-size: 36px;
      }
    }
    p {
      font-size: 24px;
      color: #d3d3d3;
      font-weight: 500;
      line-height: 1.5;
      letter-spacing: 1px;
      padding-right: 8px;
      @include media(1600) {
        font-size: 22px;
      }
      @include media(1400) {
        font-size: 20px;
      }
      &:nth-of-type(2) {
        margin-top: 20px;
        @include media(1600) {
          margin-top: 10px;
        }
      }
    }
    b {
      color: $mainColor;
    }
  }
}

.advantages {
  background-color: #edf7f4;
  padding: 80px 0;
  @include media(1200) {
    padding: 65px 0 85px;
  }
  @include media(720) {
    padding: 22px 0 70px;
  }
  .list {
    display: flex;
    justify-content: space-between;
    width: 100%;
    @include media(720) {
      flex-direction: column;
    }
    .item {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      border-right: 2px solid rgba($secColor, 0.1);
      width: calc(100% / 3);
      &:first-of-type {
        border-left: 2px solid rgba($secColor, 0.1);
      }
      @include media(1200) {
        margin: 28px 0;
      }
      @include media(720) {
        width: 100%;
        border: 0;
        border-bottom: 1px solid rgba($secColor, 0.1);
        margin: 0;
        padding: 30px 0;
        &:first-of-type {
          border-left: 0;
        }
        &:last-of-type {
          border: 0;
        }
      }
      .icon {
        margin-bottom: 10px;
        img {
          width: 130px;
          height: 130px;
          @include media(1200) {
            width: 90px;
            height: 90px;
          }
        }
      }
      .num {
        font-size: 62px;
        color: $mainColor;
        font-weight: bold;
        margin-bottom: 10px;
        @include media(1200) {
          font-size: 48px;
        }
      }
      .text {
        font-size: 30px;
        font-weight: bold;
        color: $secColor;
        @include media(1200) {
          font-size: 24px;
        }
      }
    }
  }
}

.side-project {
  padding: 130px 0 70px 0;
  @include media(1400) {
    padding: 90px 0 90px 0;
  }
  @include media(1200) {
    padding: 60px 0 80px 0;
  }
  h2 {
    color: $secColor;
    letter-spacing: 0.015em;
    margin-bottom: 93px;
    @include media(1400) {
      margin-bottom: 60px;
    }
    @include media(840) {
      margin-bottom: 40px;
    }
  }
  .item-wrap {
    width: calc(100% + 60px);
    display: flex;
    align-items: flex-start;
    // padding-right: 30px;
    box-sizing: border-box;
    margin: 0 -30px;
    flex-wrap: wrap;
    flex-grow: 1;
    @include media(1400) {
      margin: 0 -20px;
      width: calc(100% + 40px);
    }
    @include media(840) {
      margin-bottom: 40px;
      margin: 0 -10px;
      width: calc(100% + 20px);
    }
    @include media(768) {
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin: 0;
      padding: 0;
    }
  }
  .item {
    padding: 45px 45px 70px 45px;
    // min-height: 800px;
    box-shadow: 0 0 52px rgba(40, 203, 146, 0.3);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    flex-grow: 1;
    position: relative;
    margin: 0 30px;
    border-radius: 16px;
    width: calc(50% - 60px);
    flex-grow: 0;
    margin-bottom: 60px;
    @include media(1400) {
      padding: 30px 20px 30px 20px;
      margin: 0 20px;
      margin-bottom: 40px;
      width: calc(50% - 40px);
    }
    @include media(840) {
      margin: 0 10px;
      margin-bottom: 40px;
      width: calc(50% - 20px);
    }
    @include media(768) {
      width: 100%;
      margin: 0;
      margin-bottom: 40px;
    }
    > p.title {
      font-size: 45px;
      font-weight: bold;
      line-height: 1.5;
      margin-bottom: 28px;
      @include media(1400) {
        font-size: 36px;
      }
    }
    > p.text {
      font-size: 20px;
      color: #fff;
      min-height: 60px;
      font-size: 20px;
      line-height: 30px;
      letter-spacing: 0.015em;
      margin-top: 28px;
      margin-bottom: 24px;
      @include clamp(3);
    }
    :deep(.swiper-pagination) {
      transform: translateX(-50%);
      width: auto;
      transform: none;
      max-width: calc(100% - 120px);
      bottom: 88px;
      left: 32px;
      @include media(1400) {
        left: 10px;
        bottom: 45px;
      }
      @include media(840) {
        left: 10px;
        bottom: 48px;
      }
    }
    .slider {
      width: 100%;
      height: 305px;
      background-color: #e1e1e1;
      border-radius: 10px;
      @include media(1200) {
        height: 280px;
      }
      @include media(840) {
        height: 240px;
      }
      @include media(768) {
        height: 200px;
      }
    }
    .swiper-slide {
      a {
        display: flex;
        width: 100%;
        height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    h3 {
      font-size: 36px;
      color: #fff;
      margin-top: 24px;
      margin-bottom: 16px;
      @include media(1200) {
        font-size: 28px;
      }
    }
    .visit {
      width: 180px;
      height: 52px;
      border-radius: 999px;
      font-size: 24px;
      font-weight: bold;
      display: flex;
      align-items: center;
      align-self: flex-end;
      justify-content: center;
      @extend %ts;
      @include media(1400) {
        height: 44px;
        font-size: 20px;
        width: 120px;
      }
    }
    &.item:nth-of-type(2n) {
      display: flex;
      background-color: #1f2229;
      margin-top: -160px;
      @include media(1400) {
        margin-top: -120px;
      }
      @include media(860) {
        margin-top: -80px;
      }
      @include media(768) {
        margin-top: 0;
      }
      :deep(.swiper-pagination-bullet-active) {
        background-color: #60dbfa;
      }
      .title {
        color: #60dbfa;
      }
      .visit {
        background-color: #60dbfa;
        color: #1f2229;
        &:hover {
          background-color: darken(#60dbfa, 15%);
        }
      }
    }
    &.item:nth-of-type(2n + 1) {
      display: flex;
      background: #34495e;
      :deep(.swiper-pagination-bullet-active) {
        background-color: #41b883;
      }
      .title {
        color: #41b883;
      }
      .visit {
        background-color: #41b883;
        color: #34495e;
        &:hover {
          background-color: saturate(#41b883, 15%);
        }
      }
    }
  }
  .content {
    display: flex;
    // margin: 0 -30px;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    @include media(1400) {
    }
    @include media(840) {
      flex-direction: column;
    }
  }
  .wrap {
    display: block;
    min-width: 0;
    width: 100%;
    max-width: 1360px;
  }
}

.other {
  padding-bottom: 90px;
  @include media(1400) {
    padding-bottom: 60px;
  }
  @include media(840) {
    padding-bottom: 40px;
  }
  .head {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .num {
      font-weight: bold;
      font-size: 80px;
      line-height: 120px;
      color: $mainColor;
    }
  }
  h2 {
    font-weight: bold;
    color: $secColor;
    text-align: right;
    margin-bottom: 60px;
    @include media(840) {
      margin-bottom: 40px;
    }
  }
  .wrap {
    display: block;
    max-width: 1360px;
  }
  .content {
    margin: 0 -2px;
    display: flex;
    flex-wrap: wrap;
    .item {
      width: calc(25% - 4px);
      margin: 0 2px 4px 2px;
      position: relative;
      box-sizing: border-box;
      @include media(1400) {
        width: calc(33.33% - 4px);
      }
      @include media(1024) {
        width: calc(50% - 4px);
      }
      @include media(640) {
        width: calc(100% - 4px);
      }
      > a {
        display: block;
        width: 100%;
        height: 340px;
        overflow: hidden;
        img {
          height: 100%;
          object-fit: cover;
          object-position: top center;
          width: 100%;
          @extend %ts;
        }
        &:hover {
          & + .text-box {
            opacity: 1;
          }
          img {
            transform: scale(1.1);
          }
        }
      }
      .text-box {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        pointer-events: none;
        width: 100%;
        height: 100%;
        display: flex;
        background-color: rgba($secColor, 0.7);
        color: $terColor;
        font-size: 20px;
        font-weight: 500;
        letter-spacing: 0.8px;
        box-sizing: border-box;
        flex-direction: column;
        text-align: left;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 32px 20px;
        @extend %ts;
        .en-title {
          font-size: 30px;
          margin-bottom: 20px;
          font-weight: bold;
          line-height: 1.2;
        }
        .title {
          font-size: 18px;
          flex-grow: 1;
        }
        .linkBtn {
          padding: 8px 16px;
          background-color: $terColor;
          align-self: flex-end;
          width: auto;
          height: auto;
          color: $secColor;
          border-radius: 99px;
          font-size: 20px;
          color: $mainColor;
          font-weight: bold;
        }
      }
    }
  }
}

.blog {
  padding: 70px 0 130px 0;
  padding-bottom: 60px;
  background: linear-gradient($terColor, lighten($terColor, 10%));
  @include media(1400) {
    padding-top: 90px;
  }
  @include media(1200) {
    padding-bottom: 50px;
    padding-top: 60px;
  }
  @include media(840) {
    padding-top: 40px;
  }
  h2 {
    text-align: center;
    width: 100%;
    margin-bottom: 75px;
    @include media(1200) {
      margin-bottom: 40px;
    }
  }
  .wrap {
    display: flex;
    flex-direction: column;
    max-width: 1600px;
  }
  .content {
    display: flex;
    margin: 0 -20px;
    margin-bottom: 60px;
    @include media(720) {
      flex-wrap: wrap;
    }
    @include media(1200) {
      margin: 0 -10px;
      margin-bottom: 45px;
    }
    @include media(840) {
      margin-bottom: 0px;
    }
    .item {
      width: 33.33%;
      margin: 0 20px;
      background-color: #fff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0px 0px 16px rgba(40, 203, 146, 0.3);
      @extend %ts;
      @include media(1200) {
        margin: 0 10px;
      }
      @include media(720) {
        width: 100%;
        margin-bottom: 40px;
      }
      &:hover {
        box-shadow: 0px 18px 36px rgba(40, 203, 146, 0.3);
      }
      .img-box {
        overflow: hidden;
        background: no-repeat url(@/assets/images/default.svg) center $mainColor;
        display: flex;
        height: 340px;
        @include media(1200) {
          height: 240px;
        }
        @include media(840) {
          height: 200px;
        }
        @include media(720) {
          height: 260px;
        }
        a {
          width: 100%;
          height: 100%;
          display: flex;
          &:hover {
            img {
              transform: scale(1.1);
            }
          }
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          @extend %ts;
          @include media(1200) {
            height: auto;
          }
        }
      }
      .text-box {
        padding: 32px;
        display: flex;
        width: 100%;
        box-sizing: border-box;
        color: $secColor;
        flex-direction: column;
        @include media(1200) {
          padding: 20px;
        }
        h3 {
          font-weight: bold;
          font-size: 28px;
          line-height: 42px;
          letter-spacing: 0.015em;
          margin: 0;
          margin-bottom: 16px;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          @include media(1200) {
            font-size: 24px;
            margin-bottom: 8px;
          }
          @include media(840) {
            font-size: 20px;
            margin-bottom: 0px;
          }
          a {
            color: $secColor;
            @extend %ts;
            &:hover {
              color: $mainColor;
            }
          }
        }
        p {
          display: -webkit-box;
          font-style: normal;
          font-weight: 500;
          font-size: 20px;
          line-height: 30px;
          letter-spacing: 0.015em;
          width: 100%;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 32px;
          @include media(1200) {
            margin-bottom: 20px;
          }
          @include media(840) {
            font-size: 16px;
          }
        }
      }
      // .more {
      //   width: 180px;
      //   height: 52px;
      //   border-radius: 99px;
      //   background-color: $mainColor;
      //   font-weight: bold;
      //   font-size: 24px;
      //   line-height: 36px;
      //   letter-spacing: 0.015em;
      //   display: flex;
      //   color: $secColor;
      //   @include center;
      //   align-self: flex-end;
      //   @extend %ts;
      //   @include media(1200) {
      //     width: 120px;
      //     font-size: 20px;
      //     height: 44px;
      //   }
      //   &:hover {
      //     background-color: $secColor;
      //     color: $mainColor;
      //   }
      // }
    }
  }
  .seeMore {
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    line-height: 48px;
    color: $mainColor;
    text-align: center;
    margin: 0 auto;
    position: relative;
    display: flex;
    &:hover {
      &::after {
        width: 100%;
      }
    }
    &::after {
      content: "";
      width: 0;
      height: 5px;
      background: $mainColor;
      position: absolute;
      bottom: -8px;
      left: 0;
      @extend %ts;
    }
  }
}

.threedcgs {
  background-color: lighten($terColor, 10%);
  padding-bottom: 154px;
  padding-top: 90px;
  overflow: hidden;
  @include media(1600) {
    padding: 60px 0 100px;
  }
  @include media(1200) {
    padding-top: 40px;
    padding-bottom: 90px;
  }
  @include media(840) {
    padding-top: 20px;
    padding-bottom: 80px;
  }
  .wrap {
    display: flex;
    flex-direction: row;
    max-width: 1640px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 59px;
    @include media(1200) {
      margin-bottom: 40px;
    }
    .btnBox {
      display: flex;
      margin: 0 -6px;
      :deep(.swiper-button-disabled) {
        opacity: 0.5;
        cursor: default;
        &:hover {
          background-color: $mainColor;
          span {
            color: $secColor;
          }
        }
      }
      button {
        width: 52px;
        height: 52px;
        border-radius: 99px;
        background-color: $mainColor;
        border: 0;
        margin: 0 6px;
        cursor: pointer;
        @include center;
        @extend %ts;
        span {
          font-size: 36px;
          color: $secColor;
        }
        &:hover {
          background-color: $secColor;
          span {
            color: $mainColor;
          }
        }
      }
    }
  }
  h2 {
  }
  .content {
    position: relative;
    // margin: 0 -45px;
    // height: 415px;
    // margin-right: -90px;
    padding-left: calc((100% - 1600px) / 2);
    @include media(1600) {
      height: auto;
      padding-left: 20px;
    }
    @include media(1200) {
      margin: 0;
    }
    @include media(540) {
      padding: 0 20px;
    }
  }
  .swiper-wrapper {
    padding: 20px 0;
  }
  :deep(.swiper-slide) {
    display: flex;
    box-sizing: border-box;
    width: 672px;
    position: relative;
    padding: 16px 0;
    @include media(1600) {
      width: auto;
    }
    .img-box {
      border-radius: 16px;
      overflow: hidden;
      width: 100%;
      // border: 1px solid #b3b3b3;
      box-shadow: 0px 0px 16px rgba($mainColor, 0.2);
      display: flex;
      align-items: stretch;
      a {
        display: flex;
        cursor: pointer;
        width: 100%;
      }
    }
    img {
      object-fit: cover;
      width: 100%;
      height: 360px;
      @extend %ts;
      @include media(1600) {
        height: 300px;
      }
      &:hover {
        transform: scale(1.1);
      }
    }
    .item {
      position: relative;
      display: flex;
      width: 100%;
      &:hover {
        .text-box {
          opacity: 1;
        }
      }
    }
    .text-box {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba($mainColor, 0.5);
      top: 0;
      left: 0;
      border-radius: 16px;
      padding: 32px 20px;
      box-sizing: border-box;
      color: #fff;
      opacity: 0;
      pointer-events: none;
      @extend %ts;
      .title {
        font-size: 30px;
        margin-bottom: 20px;
        font-weight: bold;
        line-height: 1.2;
      }
      .description {
        font-size: 18px;
        flex-grow: 1;
      }
    }
  }
}

.scroll-down {
  position: absolute;
  bottom: 0;
  @include center(transform, x);
  background: no-repeat url(@/assets/images/scroll.svg) center/cover;
  width: 53px;
  height: 128px;
  border: 0;
  cursor: pointer;
  @include media(1200) {
    display: none;
  }
}

:deep(.swiper-pagination) {
  @include center(transform, x);
  bottom: -50px;
  justify-content: center;
  display: flex;
  @include media(540) {
    bottom: -20px;
  }
  span {
    display: flex;
    width: 16px;
    height: 16px;
    cursor: pointer;
    border-radius: 99px;
    margin: 0 10px;
    @extend %ts;
    @include media(480) {
      margin: 0 5px;
      width: 10px;
      height: 10px;
    }
    &.swiper-pagination-bullet {
      background-color: $secColor;
      opacity: 1;
      &-active {
        background-color: $mainColor;
        width: 40px;
        @include media(480) {
          width: 20px;
        }
      }
    }
  }
}
</style>
