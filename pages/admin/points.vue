<template>
  <div>
    <div class="titleWrap">
      <div class="text">
        <h2 class="title">Points</h2>
        <p class="result" v-if="keyword">Search keyword: <span>{{ keyword }}</span></p>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="table-responsive">
          <div class="table-tool">
            <p class="total">Total: {{ total }}</p>
            <p class="note">
              帳號資料在
              <a :href="`${authUrl}/admin/users`" target="_blank" rel="noopener">6yuwei 帳號的會員管理</a>
              修改，這裡只調整點數。
            </p>
          </div>
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
                <td class="name" :title="item.display.name ?? undefined">{{ item.display.name || "—" }}</td>
                <td class="email" :title="item.display.email ?? undefined">{{ item.display.email || "—" }}</td>
                <td class="balance">{{ item.balance }}</td>
                <td>
                  <form class="adjust" @submit.prevent="adjust(item)">
                    <input
                      v-model.number="deltas[item.sub]"
                      type="number"
                      step="1"
                      class="field delta"
                      placeholder="+10 / -5"
                      aria-label="點數增減"
                    />
                    <input v-model="reasons[item.sub]" class="field reason" placeholder="原因" aria-label="原因" />
                    <button class="action" type="submit">
                      <span class="material-symbols-outlined icon"> add_card </span>
                      <span class="text">Adjust</span>
                    </button>
                  </form>
                </td>
              </tr>
              <tr v-if="loaded && items.length === 0">
                <td colspan="4" class="empty">沒有符合的帳號</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :total="totalPage" :url="'/admin/points/'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { apiErrorMessage } from "~/utils/api-error";
import { useStore } from "~/store";

// Points live in the API (6yuwei_api/docs/Auth-v2.md §4.2); accounts live at the identity provider
interface Profile {
  sub: string;
  balance: number;
  display: { name: string | null; email: string | null };
}

useHead({ title: "Points", titleTemplate: "%s - 6yuwei admin", meta: [{ name: "robots", content: "noindex" }] });
definePageMeta({ middleware: ["auth"], layout: "admin-default" });

const store = useStore();
const authUrl = useRuntimeConfig().public.authUrl;
const route = useRoute();
// The header search box fills this (layouts/adminDefault.vue), like the other admin pages
const keyword = inject("keyword") as Ref<string>;
const currentPage = computed(() => Number(route.query.page) || 1);
const limit = 20;
const items = ref<Profile[]>([]);
const total = ref(0);
const loaded = ref(false);
const totalPage = computed(() => Math.max(1, Math.ceil(total.value / limit)));
const deltas = reactive<Record<string, number | undefined>>({});
const reasons = reactive<Record<string, string>>({});

const notify = (type: "success" | "error", message: string) => store.pushNotification({ type, message, timeout: 5000 });

async function getList() {
  store.isLoading = true;
  try {
    const query = new URLSearchParams({ q: keyword.value ?? "", page: String(currentPage.value), limit: String(limit) });
    const res = await $fetch<{ items: Profile[]; total: number }>(`${store.api}/admin/profiles/?${query}`);
    items.value = res.items;
    total.value = res.total;
  } catch (error: any) {
    if (error?.status === 401) return navigateTo("/admin/login");
    notify("error", apiErrorMessage(error));
  } finally {
    loaded.value = true;
    store.isLoading = false;
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
  } catch (error) {
    notify("error", apiErrorMessage(error));
  }
}

onMounted(getList);
watch(currentPage, getList);
watch(keyword, () => {
  if (currentPage.value !== 1) return navigateTo("/admin/points/?page=1");
  getList();
});
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

.table-responsive {
  background-color: #fff;
  box-shadow: 0 0 10px $terColor;
  border-radius: 12px;
  padding: 0;
  margin-bottom: 30px;
  overflow: auto;
  &::-webkit-scrollbar {
    height: 6px;
    width: auto;
  }
  table {
    margin-bottom: 20px;
    table-layout: fixed;
    min-width: 900px;
  }
  th {
    vertical-align: middle;
    padding: 20px;
    border-top: 0;
    border-bottom: 1px solid lighten($terColor, 5%);
    background-color: lighten($terColor, 5%);
    letter-spacing: 0.8px;
    font-size: 18px;
    &:nth-of-type(3) {
      width: 120px;
    }
    &:nth-of-type(4) {
      width: 420px;
    }
  }
  td {
    border-width: 0 0 1px 0;
    border-color: lighten($terColor, 5%);
    padding: 10px 20px;
    vertical-align: middle;
    letter-spacing: 0.8px;
    font-size: 16px;
    &.name,
    &.email {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &.name {
      color: $secColor;
      font-weight: bold;
    }
    &.balance {
      font-weight: bold;
      font-size: 18px;
      color: $fourColor;
    }
    &.empty {
      text-align: center;
      padding: 40px 20px;
      color: darken($terColor, 40%);
    }
  }
}

.adjust {
  display: flex;
  align-items: center;
  gap: 10px;
  .field {
    height: 40px;
    border: 1px solid darken($terColor, 10%);
    border-radius: 12px;
    padding: 0 12px;
    font-size: 15px;
    outline: none;
    background-color: #fff;
    @extend %ts;
    &:focus {
      border-color: $mainColor;
      box-shadow: 0 0 0 3px rgba($mainColor, 0.15);
    }
  }
  .delta {
    width: 110px;
  }
  .reason {
    flex: 1;
    min-width: 0;
  }
  .action {
    background: transparent;
    border: 0;
    line-height: 1;
    padding: 8px 10px;
    border-radius: 12px;
    white-space: nowrap;
    @extend %ts;
    &:hover {
      background-color: lighten($terColor, 5%);
      .icon,
      .text {
        color: $fourColor;
      }
    }
    .icon {
      @extend %ts;
      vertical-align: middle;
      color: darken($terColor, 30%);
      margin-right: 6px;
    }
    .text {
      @extend %ts;
      vertical-align: middle;
      font-weight: bold;
      letter-spacing: 0.8px;
    }
  }
}

.table-tool {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid lighten($terColor, 5%);
  padding: 12px 20px;
  letter-spacing: 0.8px;
  @include media(768) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }
  .total {
    margin: 0;
    font-weight: bold;
    font-size: 20px;
    line-height: 50px;
  }
  .note {
    margin: 0;
    font-size: 15px;
    color: darken($terColor, 45%);
    a {
      color: $secColor;
      font-weight: bold;
      text-decoration: none;
      &:hover {
        color: $mainColor;
      }
    }
  }
}

.titleWrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  .text {
    padding-right: 10px;
  }
  .result {
    padding-left: 8px;
    font-size: 20px;
    span {
      font-weight: bold;
    }
  }
}
</style>
