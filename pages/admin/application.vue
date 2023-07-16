<template>
    <div>
        <div class="titleWrap">
            <div class="text">
                <h2 class="title">Application</h2>
                <p class="result" v-if="keyword">Search keyword: <span>{{ keyword ? `${keyword}` : '' }}</span></p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const keyword = inject("keyword") as Ref<string>;

definePageMeta({
  middleware: ["auth"],
});
</script>

<style lang="scss" scoped>
</style>