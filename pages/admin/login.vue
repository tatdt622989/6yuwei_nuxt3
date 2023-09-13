<template>
  <div class="main">
    <div class="head">
      <NuxtLink to="/"
        class="back btn">
        <span class="material-icons"> arrow_back </span>
      </NuxtLink>
    </div>
    <form method="POST"
      @submit.prevent="submit">
      <div class="logo">
        <img src="@/assets/images/logo.svg"
          alt="6yuwei">
        <!-- <h1>6yuwei</h1> -->
      </div>
      <div class="inputBox">
        <input v-model="email"
          id="inputEmail"
          placeholder="Account"
          type="text"
          name="email"
          class="form-control account"
          aria-describedby="emailHelp"
          autocomplete="off">
      </div>
      <div class="inputBox mb-5">
        <input v-model="password"
          id="inputPassword"
          placeholder="Password"
          type="password"
          name="password"
          class="form-control password"
          autocomplete="current-password">
      </div>
      <div class="error_message" />
      <button type="submit"
        class="btn btn-primary submit"
        :disabled="isLoading">
        Login
      </button>
      <p class="note text-center mt-3">
        Don't have an account? <NuxtLink to="/admin/signup/">
          Signup
        </NuxtLink>
      </p>
      <p class="or">or</p>
      <button class="googleLogin" @click="googleLogin">
        <svg width="2443"
          height="2500"
          viewBox="0 0 256 262"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid">
          <path
            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            fill="#4285F4" />
          <path
            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            fill="#34A853" />
          <path
            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
            fill="#FBBC05" />
          <path
            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            fill="#EB4335" />
        </svg>
        <span>Sign in with Google</span>
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { User } from '~/types';
import { useStore } from '~/store';

definePageMeta({
  layout: 'no-layout'
})

useHead({
  title: "Login",
  titleTemplate: "%s - 6yuwei",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "6yuwei - Login",
    },
  ],
});

const store = useStore();
const route = useRoute();
const email = ref('');
const password = ref('');
const isLoading = computed(() => store.isLoading);
const redirect = route.query.redirect as string;

interface LoginRes {
  msg: string;
  user?: User;
}

const submit = async () => {
  if (!email.value || !password.value) {
    store.pushNotification({
      type: 'error',
      message: 'Please fill in all the fields.',
      timeout: 5000,
    });
    return;
  }
  store.isLoading = true;
  const json = {
    email: email.value,
    password: password.value,
  };

  const res = await useFetch(`${store.api}/login/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  });

  const error = res.error.value;
  if (error) {
    const status = error.status;
    store.pushNotification({
      type: 'error',
      message: error?.data,
      timeout: 5000,
    });
  }

  store.isLoading = false;
  if (res.data.value) {
    const data = res.data.value as LoginRes;
    const { user } = data;
    if (user) {
      store.user = user;
      store.pushNotification({
        type: 'success',
        message: 'Login successfully!',
        timeout: 3000,
      });
      if (redirect) {
        navigateTo(redirect);
      } else {
        navigateTo('/admin/account/');
      }
    }
  }
};

const googleLogin = async (e: Event) => {
  e.preventDefault();
  window.location.href = `${store.api}/googleLogin/`;
};

onMounted(async () => {
  if (store.user) {
    await navigateTo('/admin/account/');
  }
});
</script>

<style scoped lang="scss">
@import "bootstrap/scss/bootstrap";

.main {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: $terColor;
}

.head {
  width: 100%;

  .btn {
    @include btn;

    span {
      color: $mainColor;
    }

    &:hover {
      background-color: $secColor;
      border-color: $secColor;
    }
  }
}

form {
  max-width: 500px;
  width: 100%;
  margin: auto;

  button.btn-primary.btn-primary {
    width: 100%;
    background-color: $mainColor;
    border-color: $mainColor;
    height: 44px;
    margin-bottom: 0;

    &:hover {
      // background-color: $secColor;
      // border-color: $secColor;
      box-shadow: 0 0 10px rgba($secColor, 0.25);
    }
  }

  input.form-control {
    box-sizing: border-box;
    border: 1px solid #b6b6b6;
    height: 40px;
    background-color: #fff;

    &:focus {
      background-color: #fff;
      border: 2px solid $mainColor;
      box-shadow: 0 0 10px rgba($mainColor, 0.3);
    }

    &.account {
      border-radius: 4px 4px 0 0;
      border-bottom: 0;

      &:focus {
        border: 2px solid $mainColor;
        box-shadow: 0 0 10px rgba($mainColor, 0.3);
      }
    }

    &.password {
      border-radius: 0 0 4px 4px;
    }
  }

  .note {
    a {
      color: $mainColor;
      font-weight: bold;

      &:hover {
        color: darken($mainColor, 10%);
      }
    }
  }

  .or {
    font-size: 18px;
    margin: 16px 0;
    text-align: center;
    font-weight: bold;
  }

  .googleLogin {
    background-color: #fff;
    border-radius: 8px;
    height: 44px;
    align-items: center;
    display: flex;
    @extend %ts;
    width: 100%;
    border: 0;
    @include center;

    svg {
      width: 24px;
      height: 24px;
      margin-right: 14px;
    }

    &:hover {
      box-shadow: 0 0 10px rgba($secColor, 0.2);
    }

    span {
      color: #3c4043;
      font-size: 16px;
    }
  }
}

.logo {
  @include center;
  flex-direction: column;
  padding-bottom: 30px;

  img {
    margin-bottom: 20px;
  }

  h1 {
    font-size: 28px;
    font-weight: bold;
    color: $mainColor;
  }
}

.submit {
  font-weight: bold;
  letter-spacing: 1.2px;
  margin-bottom: 20px;
}
</style>
