import { defineStore } from "pinia";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  timeout: number;
}

export const useStore = defineStore("main", {
  state: () => ({
    user: null,
    notifications: [] as Toast[],
    isLoading: false,
  }),
  getters: {},
  actions: {
    async login() {
      // ...
    },
    pushNotification(notification: Toast) {
      this.notifications.push(notification);
      setTimeout(() => {
        this.notifications = this.notifications.filter((n) => n.id !== notification.id);
      }, notification.timeout);
    },
    removeNotification(id: number) {
      this.notifications = this.notifications.filter((n) => n.id !== id);
    },
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },
  },
});
