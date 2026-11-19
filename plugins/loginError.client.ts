import { useStore } from "~/store";

/*
 * When sign-in fails, the API sends the browser to /?login_error=<code>
 * (6yuwei_api/docs/Session-API.md §3.2). Show why, then drop the code from the address.
 */
const failed = "登入失敗，請再試一次";
const messages: Record<string, string> = {
  cancelled: "已取消登入",
  expired: "登入逾時，請再試一次",
  failed,
};

export default defineNuxtPlugin(() => {
  const route = useRoute();
  const code = route.query.login_error;
  if (typeof code !== "string") return;
  useStore().pushNotification({ type: "error", message: messages[code] ?? failed, timeout: 5000 });
  const { login_error: _, ...query } = route.query;
  useRouter().replace({ path: route.path, query, hash: route.hash });
});
