import { useStore } from "~/store";

// Pages under /admin need a signed-in account; visitors go to the identity provider and come back
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;
  const store = useStore();
  const { load, login } = useAuth();
  if (!store.user) await load();
  if (!store.user) {
    login(to.fullPath);
    return abortNavigation();
  }
});
