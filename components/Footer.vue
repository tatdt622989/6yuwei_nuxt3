<template>
  <footer>
    <form @submit.prevent class="form" :class="{ 'aos-animate': forceOpenFooter }" data-aos="fade-in" data-aos-offset="50">
      <div class="info">
        <p class="title">Let's make something amazing!</p>
        <p class="subtitle">Send me a message.</p>
      </div>
      <div class="content">
        <div class="mb-3">
          <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="Enter your email"
            v-model="email" />
        </div>
        <div class="mb-3">
          <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Enter your message"
            v-model="message"></textarea>
        </div>
        <div class="recaptcha-text">
          This site is protected by reCAPTCHA and the Google
          <a href="https://policies.google.com/privacy">Privacy Policy</a> and
          <a href="https://policies.google.com/terms">Terms of Service</a>
          apply.
        </div>
        <div class="btn-box">
          <!-- <SocialBar class="footer" /> -->
          <button type="submit" class="btn btn-primary" @click="send">
            Submit
          </button>
        </div>
      </div>
    </form>
    <div class="bottom">
      <div class="logo" data-aos="fade-in" data-aos-offset="0" :class="{ 'aos-animate': forceOpenFooter }">
        <img src="@/assets/images/logo_white.svg" alt="6yuwei" />
      </div>
      <!-- <Navbar class="nav" :place="'footer'" data-aos="fade-in" data-aos-delay="100" data-aos-offset="50"
        :class="{ 'aos-animate': forceOpenFooter }" /> -->
      <div class="copyright" :class="{ 'aos-animate': forceOpenFooter }" data-aos="fade-in" data-aos-delay="200"
        data-aos-offset="50">
        <p>
          <span>Copyright © {{ new Date(Date.now()).getFullYear() }} 6yuwei.All rights
            reserved.</span> &nbsp;&nbsp;| &nbsp;
          <NuxtLink to="/privacy" class="privacy">Privacy</NuxtLink>
        </p>
      </div>
    </div>
    <div class="go-top" :class="{ show: isGoTopOpen }" @click="goTop">
      <img src="@/assets/images/gotop_arrow.svg" alt="gotop" />
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
import { ReCaptchaInstance, load } from "recaptcha-v3";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $recaptcha: (action: string) => Promise<string>;
    $recaptchaLoaded: () => Promise<boolean>;
    $recaptchaInstance: ReCaptchaInstance;
  }
}
const store = useStore();
const route = useRoute();
const isGoTopOpen = ref(false);
const response = ref("");
const email = ref("");
const message = ref("");
let recaptcha: any = null;
const forceOpenFooter = ref(false);

const goTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

const send = async () => {
  if (store.isLoading) return;
  store.isLoading = true;
  if (!email.value || !message.value) {
    store.pushNotification({
      type: "error",
      message: "Please fill in all fields.",
      timeout: 5000,
    });
    return store.isLoading = false;
  }
  if (!recaptcha) {
    await loadRecaptcha();
  }
  const token = (await getRecaptchaToken()) as string;
  const form = new FormData();
  form.append("g-recaptcha-response", token);
  form.append("email", email.value);
  form.append("message", message.value);
  const res = await useFetch(`${store.api}/contact/`, {
    method: "POST",
    body: form,
  });
  const error = res.error.value;
  if (error) {
    store.pushNotification({
      type: "error",
      message: error.data,
      timeout: 5000,
    });
    return store.isLoading = false;

  }
  const data = res.data.value as {
    msg: string;
  };
  email.value = "";
  message.value = "";
  store.pushNotification({
    type: "success",
    message: data.msg,
    timeout: 5000,
  });
  store.isLoading = false;
};

const loadRecaptcha = async () => {
  recaptcha = await load("6LeeIuglAAAAAGa_otd0JHxSOUQbFttupNnSHEuT", {
    autoHideBadge: true,
    explicitRenderParameters: {
      badge: "bottomleft",
      size: "invisible",
    },
  });
};

const getRecaptchaToken = async () => {
  if (!recaptcha) return false;
  const token = (await recaptcha.execute("submit")) as string;
  return token;
};

const handleScroll = () => {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop > 100) {
    isGoTopOpen.value = true;
  } else {
    isGoTopOpen.value = false;
  }
};

watch(() => route.path, () => {
  console.log(route.path);
  if (route.path === "/") {
    forceOpenFooter.value = false;
  } else {
    forceOpenFooter.value = true;
  }
});

onMounted(async () => {
  document.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  document.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

footer {
  background-color: lighten($secColor, 5%);
  display: flex;
  flex-direction: column;
  @include center;
  padding-top: 45px;

  .logo {
    width: 360px;

    @include media(1024) {
      width: auto;
    }

    @include media(768) {
      display: none;
    }
  }

  .socialList.footer {
    position: static;
    display: flex;
    transform: none;
    background: transparent;
    box-shadow: none;
    margin-bottom: 0px;

    li {
      img {
        filter: brightness(0) invert(1);
      }
    }
  }

  :deep(.nav.nav) {
    flex-grow: 1;
    display: flex;
    justify-content: center;

    @include media(1500) {
      display: none;
    }

    @include media(540) {
      flex-wrap: wrap;
    }

    li {
      a {
        color: #fff;

        &:hover,
        &.current {
          color: $mainColor;
        }
      }

      @include media(720) {
        margin: 0 14px;

        a {
          font-size: 18px;
        }
      }

      @include media(540) {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-bottom: 20px;
      }
    }
  }

  .copyright {
    border: 0;
    max-width: 460px;
    width: 100%;
    text-align: right;

    @include media(480) {
      text-align: center;
    }

    p {
      display: inline;
      color: #fff;
      font-weight: 500;
      font-size: 16px;
      line-height: 1.4;
      margin-bottom: 0;

      span,
      a {
        color: #fff;
        font-weight: 500;
        font-size: 16px;
        line-height: 1.4;
        margin-bottom: 0;
      }
    }

    .privacy {
      display: inline;
      color: #fff;
      text-decoration: none;

      &:hover {
        color: $mainColor;
      }
    }
  }

  .bottom {
    background-color: $secColor;
    align-items: center;
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: center;
    border-top: 1px solid lighten($secColor, 10%);
    box-sizing: border-box;
    justify-content: space-between;
    padding: 20px 90px;

    @include media(1600) {
      padding: 20px;
    }

    @include media(768) {
      justify-content: center;
    }
  }
}

.form {
  max-width: 1000px;
  width: 100%;
  margin-bottom: 50px;
  padding: 0 20px;

  @include media(480) {
    margin-bottom: 45px;
  }

  .title {
    font-size: 36px;
    color: #fff;
    font-weight: bold;
    letter-spacing: 1px;
    text-align: center;

    @include media(480) {
      font-size: 28px;
    }
  }

  .subtitle {
    font-size: 20px;
    color: $mainColor;
    text-align: center;
    font-weight: 400;
    letter-spacing: 1px;
    margin-bottom: 30px;

    @include media(480) {
      font-size: 18px;
    }
  }

  input {
    height: 60px;
    padding: 10px 20px;
  }

  textarea {
    resize: none;
    height: 120px;
    padding: 12px 20px;
    box-sizing: border-box;
  }

  input,
  textarea {
    border: 0;
    background-color: $terColor;
    border-radius: 12px;
    border: 2px solid transparent;
    font-size: 20px;

    &:focus {
      background-color: $terColor;
      box-shadow: none;
      border-color: $mainColor;
      box-shadow: 0 0 20px rgba($mainColor, 0.4);
    }
  }

  .btn-box {
    display: flex;
    justify-content: center;

    button {
      background-color: $mainColor;
      border-radius: 12px;
      border: 0;
      color: $secColor;
      max-width: 240px;
      width: 100%;
      font-size: 20px;
      font-weight: bold;
      height: 60px;
      box-shadow: 0 0 20px rgba($mainColor, 0.4);

      &:focus {
        background-color: $mainColor;
        box-shadow: none;
        color: $secColor;
      }

      &:hover {
        box-shadow: 0 0 30px rgba($mainColor, 0.5);
      }
    }
  }

  .recaptcha-text {
    color: #fff;
    text-align: center;
    padding-bottom: 30px;
    opacity: 0.8;
    font-size: 14px;

    @include media(480) {
      text-align: left;
    }

    a {
      color: $mainColor;
      text-decoration: underline;

      &:hover {
        color: lighten($mainColor, 10%);
      }
    }
  }
}

.go-top {
  border-radius: 10px;
  width: 60px;
  height: 60px;
  @include center;
  position: fixed;
  right: 72px;
  bottom: 90px;
  background-color: #fff;
  box-shadow: 0px 0px 32px rgba(40, 203, 146, 0.3);
  z-index: 99;
  // border: 1px solid $mainColor;
  transition: all 0.3s ease-out;
  opacity: 0;
  pointer-events: none;

  @include media(1200) {
    right: 40px;
  }

  @include media(540) {
    right: 20px;
  }

  cursor: pointer;

  &.show {
    opacity: 1;
    pointer-events: auto;
  }

  img {
    width: 36px;
    height: 36px;
    transform: scale(1);
    @extend %ts;
  }

  &:hover {
    transform: rotate(45deg);

    img {
      @extend %ts;
      transform: rotate(-45deg);
      // @include beats(1s, rotate(-45deg));
    }
  }
}</style>
