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
          v-model="email"
          id="inputEmail"
          placeholder="Account"
          type="text"
          name="email"
          class="form-control account"
          aria-describedby="emailHelp"
        >
      </div>
      <div class="inputBox mb-5">
        <input
          v-model="password"
          id="inputPassword"
          placeholder="Password"
          type="password"
          name="password"
          class="form-control password"
        >
      </div>
      <div class="error_message" />
      <button type="submit" class="btn btn-primary submit" :disabled="isLoading">
        Login
      </button>
      <p class="note text-center mt-3">
        Don't have an account? <NuxtLink to="/admin/signup/">
          Signup
        </NuxtLink>
      </p>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { User } from '~/types';
import { useStore } from '~/store';
const store = useStore();
const email = ref('');
const password = ref('');
const isLoading = computed(() => store.isLoading);

interface LoginRes {
  code: number;
  msg: string;
  user?: User;
}

const submit = async () => {
  if (!email.value || !password.value) {
    store.pushNotification({
      id: Date.now(),
      type: 'error',
      message: 'Please fill in all the fields.',
      timeout: 5000,
    });
    return;
  }
  store.setLoading(true);
  const json = {
    email: email.value,
    password: password.value,
  };
  const res = await useFetch(`${store.api}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  });

  store.setLoading(false);
  if (res.data.value) {
    const data = res.data.value as LoginRes;
    const { code } = data;
    const { user } = data;
    if (code === 200 && user) {
      store.setUser(user);
      store.pushNotification({
        id: Date.now(),
        type: 'success',
        message: 'Login successfully!',
        timeout: 5000,
      });
      await navigateTo('/admin/');
    } else {
      store.pushNotification({
        id: Date.now(),
        type: 'error',
        message: data.msg,
        timeout: 5000,
      });
    }
  } else {
    store.pushNotification({
      id: Date.now(),
      type: 'error',
      message: 'Something went wrong, please try again later.',
      timeout: 5000,
    });
  }
};
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
