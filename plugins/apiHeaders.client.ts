import { useStore } from "~/store";

/*
 * Every call to the API carries the session cookie and X-Requested-With: 6yuwei. The API refuses
 * session requests that change data without that header (6yuwei_api/docs/Session-API.md §4).
 *
 * This wraps window.fetch, not globalThis.$fetch: Nuxt bundles `$fetch` in app code as an import
 * of ofetch, so replacing globalThis.$fetch does not reach it. ofetch calls window.fetch on every
 * request, so $fetch and useFetch both pass through here. axios uses XMLHttpRequest and sets the
 * header itself (components/admin/EditorModal.vue).
 */
export default defineNuxtPlugin(() => {
  const store = useStore();
  const api = new URL(store.api.replace(/\/?$/, "/"), window.location.origin);
  const toApi = (url: URL) => url.origin === api.origin && (url.pathname + "/").startsWith(api.pathname);

  const original = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const raw = input instanceof Request ? input.url : String(input);
    if (!toApi(new URL(raw, window.location.href))) return original(input, init);
    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
    headers.set("X-Requested-With", "6yuwei");
    return original(input, { ...init, headers, credentials: "include" });
  };
});
