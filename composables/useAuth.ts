import { useStore } from "~/store";
import type { User } from "~/types";

/*
 * Sign-in through the API's token handler (6yuwei_api/docs/Session-API.md). The site never sees
 * a password or a token: the API keeps them and gives the browser an HttpOnly cookie. The
 * user in the store keeps its old shape, so the pages that read it need no change.
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

export const useAuth = () => {
  const store = useStore();

  /** Reads who is signed in. Returns the user, or null for visitors. */
  const load = async (): Promise<User | null> => {
    try {
      const session = await $fetch<SessionMe>(`${store.api}/session/me`, { credentials: "include" });
      const me = await $fetch<Me>(`${store.api}/me/`, { credentials: "include" }).catch(() => null);
      store.user = {
        _id: session.sub,
        username: session.name ?? "",
        email: session.email ?? "",
        phone: "",
        country: "",
        birth: "",
        permissions: session.roles.includes("admin") ? "admin" : "general",
        createdAt: "",
        photo: "",
        externalPhoto: session.picture ?? "",
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
