<template>
  <div class="login-redirect">
    <p>正在前往 6yuwei 帳號登入⋯</p>
  </div>
</template>

<script lang="ts" setup>
// Signing in happens at the identity provider. This page stays so old links and the
// navigateTo("/admin/login") calls across the site keep working
definePageMeta({ layout: false });
useHead({ meta: [{ name: "robots", content: "noindex" }] });

const route = useRoute();
const { login } = useAuth();
const safe = (value: unknown) => (typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/admin/");

onMounted(() => {
  login(safe(route.query.redirect));
});
</script>

<style lang="scss" scoped>
.login-redirect {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: #666;
}
</style>
