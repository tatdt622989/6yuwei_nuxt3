<template>
    <div class="tool-box">
        <NuxtLink class="back btn circle"
            v-if="route.path.startsWith('/components/generator')"
            to="/components/">
            <i class="bi bi-arrow-left"></i>
            <span class="text">Back</span>
        </NuxtLink>
        <NuxtLink class="storage btn circle"
            v-if="route.path.startsWith('/components/generator') && componentId"
            to="/components/generator/">
            <i class="bi bi-plus-lg"></i>
            <span class="text">New</span>
        </NuxtLink>
        <button class="storage btn circle"
            v-if="!route.path.startsWith('/components/storage')"
            @click="goAuthPage('/components/storage')">
            <i class="bi bi-inboxes-fill"></i>
            <span class="text">My storage</span>
        </button>
        <button class="favorite btn circle"
            v-if="!route.path.startsWith('/components/favorite')"
            @click="goAuthPage('/components/favorite')">
            <i class="bi bi-star-fill"></i>
            <span class="text">Favorite</span>
        </button>
        <button class="copy btn circle"
            @click="emit('open-modal', true)"
            v-if="route.path.startsWith('/components/generator') && (!props.canFineTuning || !componentId)">
            <i class="bi bi-arrow-left-right"></i>
            <span class="text">Switch type</span>
        </button>
        <div class="balance"
            v-if="route.path.startsWith('/components/generator/')">
            <p>{{ store.user ? store.user?.balance : 30 }}</p>
            <img src="@/assets/images/currency.svg"
                alt="currency">
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";

const store = useStore();
const route = useRoute();
const emit = defineEmits(["open-modal"]);
const componentId = computed(() => route.path.split("/")[4]);
const props = defineProps({
    canFineTuning: {
        type: Boolean,
        default: false,
    },
});

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
    margin-left: auto;
    padding: 0;
    padding-top: 20px;
    width: 100%;

    @include media(768) {
        width: 100%;
        justify-content: flex-start;
        margin-bottom: 10px;
    }

    @include media(480) {
        flex-wrap: wrap;
        justify-content: flex-end;
    }

    .btn {
        cursor: pointer;
        border-radius: 10px;
        box-sizing: border-box;
        margin-left: 20px;
        padding: 8px 12px;
        height: auto;
        width: auto;
        @include media(840) {
            margin-left: 10px;
        }

        @include media(768) {
            margin-left: 10px;
            padding: 6px 10px;
            width: 48px;
        }

        i {
            margin-right: 6px;
            @include media(768) {
                margin-right: 0;
            }
        }

        .text {
            font-size: 16px;
            @include media(768) {
                display: none;
            }
        }

        @include media(768) {
            margin-left: 0;
            margin-right: 10px;
        }

        &.back {
            margin-right: auto;
            margin-left: 0;
            background-color: $secColor;
            color: $mainColor;
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

        @include media(840) {
            padding: 6px 14px;
            align-items: center;
            min-width: 110px;
            margin-left: 10px;
        }

        @include media(768) {
            margin-left: 0px;
        }

        @include media(480) {
            margin-right: auto;
            min-height: 36px;
            width: 100%;
            margin-bottom: 0;
            margin-top: 10px;
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

            @include media(480) {
                font-size: 16px;
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