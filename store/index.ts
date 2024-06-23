import { defineStore } from "pinia";
import type { User } from "~/types";

interface Toast {
  id?: number;
  message: string;
  type: "success" | "error" | "info";
  timeout: number;
}

export const useStore = defineStore("main", {
  state: () => ({
    user: null as User | null,
    notifications: [] as Toast[],
    isLoading: false,
    isUserChecked: false,
    api:  process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://6yuwei.com/api',
    dataApi:  process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : 'https://data.6yuwei.com',
  }),
  actions: {
    pushNotification(notification: Toast) {
      notification.id = Date.now();
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
    setUser(user: User) {
      this.user = user;
    },
  },
});
