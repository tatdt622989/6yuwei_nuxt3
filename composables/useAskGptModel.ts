import { useStore } from "~~/store";

const store = useStore();

export const useAskGptModel = async (prompt: string) => {
  const res = await useFetch(`${store.api}/chat/?prompt=${prompt}`,{
    method: "GET",
  });

  const error = res.error.value;
  const data = res.data.value;
  if (error) {
    store.pushNotification({
      type: "error",
      message: error?.data,
      timeout: 5000,
    });
    return;
  }
  return data;
};