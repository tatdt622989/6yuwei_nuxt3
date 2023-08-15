import { useStore } from "~~/store";
import { User } from "~~/types";

interface LoginStatusRes {
    msg: string;
    user: User | null;
}

export const useGetUserData = () => {
    return async () => {
        const store = useStore();
        try {
            const res: LoginStatusRes = await $fetch(`${store.api}/loginStatus/`, {
                method: "GET",
                credentials: "include",
            });
    
            const data = await res.user;
            store.isUserChecked = true;
            if (!data) {
                return null;
            }
            store.user = data;
        } catch (error: unknown) {
            store.isUserChecked = true;
            return null;
        }
    }
}
