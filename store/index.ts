import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    user: null,
  }),
  getters: {},
  actions: {
    async login() {
      // ...
    },
  },
});
