import { useStore } from "~/store";
import { User } from "~~/types";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;
  const store = useStore();
  const api = `${store.api}/loginStatus/`;
  const res = await useFetch(api, {
    method: "GET",
    credentials: "include",
  });
  const data = res.data.value as { msg: string; user: User };
  const error = res.error.value as Error;
  if (error) {
    store.pushNotification({
      id: Date.now(),
      type: "error",
      message: error.message,
      timeout: 5000,
    });
    return navigateTo("/admin/login/");
  }
  if (data) {
    store.setUser(data.user);
  } else {
    return navigateTo("/admin/login/");
  }
});
