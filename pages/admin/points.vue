<template>
  <div>
    <div class="titleWrap">
      <div class="text">
        <h2 class="title">Points</h2>
        <p class="result">帳號資料在 <a :href="`${authUrl}/admin/users`" target="_blank" rel="noopener">6yuwei 帳號的會員管理</a>修改；這裡只調整點數。</p>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row">
        <form class="search" @submit.prevent="search(1)">
          <input v-model="q" class="form-control" placeholder="名稱、信箱或帳號 ID" />
          <button class="btn" type="submit">搜尋</button>
        </form>
        <div class="table-responsive">
          <p class="total">Total: {{ total }}</p>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Points</th>
                <th scope="col">Adjust</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.sub">
                <td>{{ item.display.name }}</td>
                <td>{{ item.display.email }}</td>
                <td>{{ item.balance }}</td>
                <td>
                  <form class="adjust" @submit.prevent="adjust(item)">
                    <input v-model.number="deltas[item.sub]" type="number" step="1" class="form-control" placeholder="+10 / -5" />
                    <input v-model="reasons[item.sub]" class="form-control" placeholder="原因" />
                    <button class="btn" type="submit">調整</button>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pager" v-if="totalPage > 1">
            <button class="btn" :disabled="page <= 1" @click="search(page - 1)">上一頁</button>
            <span>{{ page }} / {{ totalPage }}</span>
            <button class="btn" :disabled="page >= totalPage" @click="search(page + 1)">下一頁</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";

// Points live in the API (6yuwei_api/docs/Auth-v2.md §4.2); accounts live at the identity provider
interface Profile {
  sub: string;
  balance: number;
  display: { name: string | null; email: string | null };
}

useHead({ title: "points", titleTemplate: "%s - 6yuwei admin" });
definePageMeta({ middleware: ["auth"], layout: "admin-default" });

const store = useStore();
const authUrl = useRuntimeConfig().public.authUrl;
const route = useRoute();
const q = ref(typeof route.query.q === "string" ? route.query.q : "");
const items = ref<Profile[]>([]);
const total = ref(0);
const page = ref(1);
const limit = 20;
const totalPage = computed(() => Math.max(1, Math.ceil(total.value / limit)));
const deltas = reactive<Record<string, number | undefined>>({});
const reasons = reactive<Record<string, string>>({});

const notify = (type: "success" | "error", message: string) => store.pushNotification({ type, message, timeout: 5000 });

async function search(to = 1) {
  try {
    const res = await $fetch<{ items: Profile[]; total: number }>(
      `${store.api}/admin/profiles/?${new URLSearchParams({ q: q.value, page: String(to), limit: String(limit) })}`,
    );
    items.value = res.items;
    total.value = res.total;
    page.value = to;
  } catch {
    notify("error", "讀取失敗，請確認是管理員帳號");
  }
}

async function adjust(item: Profile) {
  const delta = deltas[item.sub];
  if (!Number.isInteger(delta) || delta === 0) return notify("error", "請輸入非 0 的整數");
  try {
    const res = await $fetch<{ balance: number }>(`${store.api}/admin/profiles/${item.sub}/balance`, {
      method: "POST",
      body: { delta, reason: reasons[item.sub] ?? "" },
    });
    item.balance = res.balance;
    deltas[item.sub] = undefined;
    reasons[item.sub] = "";
    notify("success", `已調整，現在是 ${res.balance} 點`);
  } catch (error: any) {
    notify("error", error?.data?.error === "invalid_balance" ? "點數不能小於 0" : "調整失敗");
  }
}

onMounted(() => search(1));
</script>

<style lang="scss" scoped>
.container-fluid { padding: 30px 0 60px; }
.search, .adjust { display: flex; gap: 8px; align-items: center; }
.search { max-width: 480px; margin-bottom: 16px; }
.adjust input[type="number"] { width: 110px; }
.pager { display: flex; gap: 12px; align-items: center; justify-content: center; }
</style>
