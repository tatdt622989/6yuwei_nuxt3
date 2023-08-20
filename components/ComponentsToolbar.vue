<template>
    <div class="tool-box">
        <button class="storage btn circle" v-if="!route.path.startsWith('/components/storage')" @click="goAuthPage('/components/storage')">
            <i class="bi bi-inboxes-fill"></i>
        </button>
        <button class="favorite btn circle" v-if="!route.path.startsWith('/components/favorite')" @click="goAuthPage('/components/favorite')">
            <i class="bi bi-star-fill"></i>
        </button>
        <button class="copy btn circle" @click="emit('open-modal', true)" v-if="route.path.startsWith('/components/generator')">
            <i class="bi bi-arrow-left-right"></i>
        </button>
        <div class="balance" v-if="route.path.startsWith('/components/generator/')">
            <p>999</p>
            <img src="@/assets/images/currency.svg" alt="currency">
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";

const store = useStore();
const route = useRoute();
const emit = defineEmits(["open-modal"]);

function goAuthPage(url: string) {
    if (!store.user) {
        store.pushNotification({
            type: "error",
            message: "Please login first",
            timeout: 5000,
        });
        return navigateTo("/admin/login?redirect=/components/");
    }
    navigateTo(url);
}
</script>

<style lang="scss" scoped>
.tool-box {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;

    @include media(768) {
        width: 100%;
        justify-content: flex-start;
        margin-bottom: 10px;
        order: 1;
    }

    .btn {
        margin-left: 20px;
        cursor: pointer;

        @include media(768) {
            margin-left: 0;
            margin-right: 10px;
            order: 2;
        }
    }

    .storage {
        @include media(768) {
            margin-left: 0;
        }
    }

    .balance {
        background-color: $secColor;
        border-radius: 10px;
        display: flex;
        padding: 10px 16px;
        min-width: 140px;
        justify-content: space-between;
        margin-left: 20px;

        @include media(768) {
            padding: 6px 14px;
            align-items: center;
            min-width: 110px;
            order: 1;
            margin-left: 0;
            margin-right: 20px;
        }

        p {
            color: #FFF;
            font-size: 22px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            letter-spacing: 0.77px;

            @include media(768) {
                font-size: 18px;
                vertical-align: middle;
            }
        }

        img {
            @include media(768) {
                width: 24px;
                height: 24px;
            }
        }
    }
}
</style>