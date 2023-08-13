import { useStore } from "~~/store";
import { User } from "~~/types";

interface LoginStatusRes {
    msg: string;
    user: User | null;
}

export const useGetUserData = () => {
    return async () => {
        try {
            const store = useStore();
            const res: LoginStatusRes = await $fetch(`${store.api}/loginStatus/`, {
                method: "GET",
                credentials: "include",
            });
    
            const data = await res.user;
            if (!data) {
                return null;
            }
        } catch (error: unknown) {
            return null;
        }
    }
}
