<template>
  <form class="codeForm" @submit.prevent="submit">
    <h1>Enter the code</h1>
    <p>
      We sent a 6-digit code to {{ props.email }}. It works for 15 minutes.
      If it does not arrive, check your spam folder.
    </p>
    <input
      id="inputCode"
      v-model="code"
      placeholder="6-digit code"
      inputmode="numeric"
      autocomplete="one-time-code"
      maxlength="6"
      class="form-control"
      aria-label="6-digit code"
    >
    <button type="submit" class="btn btn-primary verify" :disabled="busy">
      Verify
    </button>
    <button type="button" class="link" :disabled="busy" @click="resend">
      Send a new code
    </button>
    <button type="button" class="link" :disabled="busy" @click="emit('back')">
      Back
    </button>
  </form>
</template>

<script lang="ts" setup>
import type { User } from '~/types';
import { useStore } from '~/store';
import { apiErrorMessage } from '~/utils/api-error';

const props = defineProps<{
  email: string;
  password: string;
  /** Someone returning to an unverified account: the code from sign-up may have expired. */
  sendOnOpen?: boolean;
}>();
const emit = defineEmits<{
  verified: [user: User];
  back: [];
}>();

const store = useStore();
const code = ref('');
const busy = ref(false);

const notify = (type: 'success' | 'error', message: string) => {
  store.pushNotification({ type, message, timeout: 5000 });
};

const resend = async () => {
  busy.value = true;
  try {
    await $fetch(`${store.api}/signup/resend/`, {
      method: 'POST',
      body: { email: props.email },
    });
    notify('success', 'A new code is on its way.');
  } catch (error) {
    notify('error', apiErrorMessage(error));
  } finally {
    busy.value = false;
  }
};

const submit = async () => {
  const entered = code.value.replace(/\D/g, '');
  if (entered.length !== 6) {
    notify('error', 'Please enter the 6-digit code.');
    return;
  }
  busy.value = true;
  try {
    const { user } = await $fetch<{ user: User }>(`${store.api}/signup/verify/`, {
      method: 'POST',
      credentials: 'include',
      body: { email: props.email, password: props.password, code: entered },
    });
    emit('verified', user);
  } catch (error) {
    notify('error', apiErrorMessage(error));
  } finally {
    busy.value = false;
  }
};

onMounted(() => {
  if (props.sendOnOpen) resend();
});
</script>

<style scoped lang="scss">
.codeForm {
  max-width: 500px;
  width: 100%;
  margin: auto;

  h1 {
    font-size: 24px;
    font-weight: bold;
    color: $mainColor;
    margin-bottom: 12px;
  }

  p {
    margin-bottom: 16px;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    height: 44px;
    margin-bottom: 16px;
    padding: 0 12px;
    border: 1px solid #b6b6b6;
    border-radius: 4px;
    background-color: #fff;
    font-size: 16px;

    &:focus {
      border: 2px solid $mainColor;
      box-shadow: 0 0 10px rgba($mainColor, 0.3);
    }
  }

  .verify {
    width: 100%;
    height: 44px;
    font-weight: bold;
    color: #fff;
    background-color: $mainColor;
    border-color: $mainColor;
  }

  .link {
    display: block;
    width: 100%;
    margin-top: 12px;
    padding: 8px;
    border: 0;
    background: none;
    color: $mainColor;
    font-weight: bold;
  }
}
</style>
