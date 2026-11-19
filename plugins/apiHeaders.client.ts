import { useStore } from "~/store";

/*
 * Every call to the API carries the session cookie and X-Requested-With: 6yuwei. The API refuses
 * session requests that change data without that header (6yuwei_api/docs/Session-API.md §4).
 */
export default defineNuxtPlugin(() => {
  const store = useStore();
  globalThis.$fetch = $fetch.create({
    onRequest({ request, options }) {
      const url = typeof request === "string" ? request : request.url;
      if (!url.startsWith(store.api)) return;
      options.credentials = "include";
      const headers = new Headers(options.headers as HeadersInit | undefined);
      headers.set("X-Requested-With", "6yuwei");
      options.headers = headers;
    },
  }) as typeof globalThis.$fetch;
});
