import { useStore } from "~/store";
import type { User } from "~/types";

/*
 * Sign-in through the API's token handler (6yuwei_api/docs/Session-API.md). The site never sees
 * a password or a token: the API keeps them and gives the browser an HttpOnly cookie.
 */

interface SessionMe {
  sub: string;
  name: string | null;
  email: string | null;
  picture: string | null;
  roles: string[];
  accountUrl: string;
}

interface Me {
  balance: number;
}

// A page can ask to sign in more than once while it opens: the auth middleware first, then a
// request that came back 401. Only the first one may leave, or the later one replaces the return
// address the middleware gave.
let leavingToSignIn = false;
// The back button can restore this page from the cache after it left; it may sign in again then
if (typeof window !== "undefined") window.addEventListener("pageshow", () => { leavingToSignIn = false; });

export const useAuth = () => {
  const store = useStore();

  /** Reads who is signed in. Returns the user, or null for visitors. */
  const load = async (): Promise<User | null> => {
    try {
      const session = await $fetch<SessionMe>(`${store.api}/session/me`, { credentials: "include" });
      const me = await $fetch<Me>(`${store.api}/me/`, { credentials: "include" }).catch(() => null);
      store.user = {
        id: session.sub,
        name: session.name ?? "",
        email: session.email ?? "",
        picture: session.picture ?? "",
        isAdmin: session.roles.includes("admin"),
        balance: me?.balance ?? 0,
        accountUrl: session.accountUrl,
      };
    } catch {
      store.user = null;
    }
    store.isUserChecked = true;
    return store.user;
  };

  /** Goes to the identity provider and comes back to returnTo (a path on this site). */
  const login = (returnTo?: string) => {
    if (leavingToSignIn) return;
    leavingToSignIn = true;
    const back = returnTo || window.location.pathname + window.location.search;
    window.location.href = `${store.api}/session/login?app=main&return=${encodeURIComponent(back)}`;
  };

  /** Ends the session here, then at the identity provider, which signs the other sites out too. */
  const logout = async () => {
    try {
      const { logoutUrl } = await $fetch<{ logoutUrl: string }>(`${store.api}/session/logout`, {
        method: "POST",
        credentials: "include",
      });
      store.user = null;
      window.location.href = logoutUrl;
    } catch (error) {
      store.pushNotification({ type: "error", message: "登出失敗，請再試一次", timeout: 5000 });
      console.error(error);
    }
  };

  return { load, login, logout };
};
