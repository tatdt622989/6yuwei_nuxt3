import { useStore } from "~~/store";
import axios, { AxiosError } from "axios";


export const useAskGptModel = async (prompt: string) => {
  const store = useStore();
  try {
    const res = await axios.get(`${store.api}/chat/?prompt=${prompt}&systemPrompt=You are a professional writer.`, {
      method: "GET",
    });
    return res.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      store.pushNotification({
        type: "error",
        message: error.message,
        timeout: 5000,
      });
    } else {
      store.pushNotification({
        type: "error",
        message: "Unknown error",
        timeout: 5000,
      });
    }
  }
  return null;
};