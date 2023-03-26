import { defineStore } from "pinia";
import { User } from "~/types";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  timeout: number;
}

export const useStore = defineStore("main", {
  state: () => ({
    user: null as User | null,
    notifications: [] as Toast[],
    isLoading: false,
    api:  process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://6yuwei.com',
  }),
  getters: {},
  actions: {
    async login() {
      // ...
    },
    pushNotification(notification: Toast) {
      this.notifications.push(notification);
      setTimeout(() => {
        this.notifications = this.notifications.filter(
          (n) => n.id !== notification.id
        );
      }, notification.timeout);
    },
    removeNotification(id: number) {
      this.notifications = this.notifications.filter((n) => n.id !== id);
    },
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },
    setUser(user: User) {
      this.user = user;
    },
  },
});
