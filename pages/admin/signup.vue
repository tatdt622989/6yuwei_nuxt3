<template>
  <div class="main">
    <div class="head">
      <NuxtLink to="/" class="back btn">
        <span class="material-icons"> arrow_back </span>
      </NuxtLink>
    </div>
    <form method="POST" @submit.prevent="submit">
      <div class="logo">
        <img src="@/assets/images/logo.svg" alt="6yuwei">
        <!-- <h1>6yuwei</h1> -->
      </div>
      <div class="inputBox">
        <input
          id="inputName"
          placeholder="Name"
          type="text"
          name="name"
          class="form-control name"
          v-model="username"
        >
      </div>
      <div class="inputBox">
        <input
          id="inputEmail"
          placeholder="Account"
          type="text"
          name="email"
          class="form-control account"
          aria-describedby="emailHelp"
          v-model="email"
        >
      </div>
      <div class="inputBox mb-5">
        <input
          id="inputPassword"
          placeholder="Password"
          type="password"
          name="password"
          class="form-control password"
          v-model="password"
        >
      </div>
      <div class="error_message" />
      <button type="submit" class="btn btn-primary submit" :disabled="isLoading">
        Signup
      </button>
      <p class="note text-center mt-3">
        Already have an account? <NuxtLink to="/admin/login/">Login</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { User } from '~/types';
import { useStore } from '~/store';

definePageMeta({
  layout: 'no-layout'
});

useHead({
  title: "Singup",
  titleTemplate: "%s - 6yuwei",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "6yuwei - Signup",
    },
  ],
});

const store = useStore();
const username = ref('');
const email = ref('');
const password = ref('');
const isLoading = computed(() => store.isLoading);

interface SignupRes {
  msg: string;
  user?: User;
}

const submit = async () => {
  store.isLoading = true;
  const json = {
    username: username.value,
    email: email.value,
    password: password.value,
  };
  const res = await useFetch(`${store.api}/signup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  });

  const error = res.error.value;

  if (error) {
    store.pushNotification({
      type: 'error',
      message: error.data,
      timeout: 5000,
    });
    store.isLoading = false;
    return;
  }

  const data = res.data.value as SignupRes;
  if (res.data.value) {
    const { user } = data;
    if (user) {
      store.setUser(user);
      store.pushNotification({
        type: 'success',
        message: 'Register successfully!',
        timeout: 3000,
      });
      await navigateTo('/admin/account/');
    }
  }
  store.isLoading = false;
}
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
    height: 40px;
    @extend %ts;
    &:hover {
      background-color: $secColor;
      border-color: $secColor;
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
    &.name {
      border-radius: 4px 4px 0 0;
      border-bottom: 0;
      &:focus {
        border: 2px solid $mainColor;
      }
    }
    &.account {
      border-radius: 0;
      border-bottom: 0;
      &:focus {
        border: 2px solid $mainColor;
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
}
</style>
