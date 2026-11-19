import { useStore } from "~~/store";

/** Loads the signed-in user once (see useAuth). */
export const useGetUserData = () => {
  const { load } = useAuth();
  return async () => {
    const store = useStore();
    if (store.user) return null;
    await load();
    return null;
  };
};
