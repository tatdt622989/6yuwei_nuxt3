<template>
    <div class="card-wrap">
        <div class="card">
            <div class="head">
                <div class="category">
                    <span>{{ props.component.componentsType.title }}</span>
                    <img src="@/assets/images/arrow.png" alt="arrow">
                </div>
                <button class="favorites" @click="toggleFavorite" >
                    <i class="bi bi-star-fill" v-if="props.favoritesIdList.includes(props.component._id)"></i>
                    <i class="bi bi-star" v-else></i>
                </button>
                <button class="delete" v-if="route.path.startsWith('/components/storage')"
                    @click="emit('delete-component', props.component._id)">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="content">
                <nuxt-link :to="`/components/generator/${props.component.componentsType.customURL}/${props.component._id}`">
                    <img :src="`${store.dataApi}/screenshot/?componentId=${props.component._id}&v=${fileTs}`"
                        :alt="props.component.title" v-if="imgShow">
                </nuxt-link>
            </div>
            <div class="info">
                <div class="text">
                    <h2>{{ props.component.title }}</h2>
                    <p class="by">Create date <span class="author">{{ timeFormat(props.component.createdAt) }}</span></p>
                </div>
                <!-- <button class="copy" @click="copyToClipboard(props.component.style)">
                    <span class="material-symbols-outlined">
                        file_copy
                    </span>
                </button> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Component, ComponentType } from "~/types";
import { useStore } from "~/store";

interface FavoriteRes {
    msg: string
}

const props = defineProps({
    component: {
        type: Object as PropType<Component>,
        default: () => []
    },
    favoritesIdList: {
        type: Array as PropType<string[]>,
        default: () => []
    }
});
const emit = defineEmits(["delete-component", "update-favorites-list"]);
const store = useStore();
const route = useRoute();
const fileTs = Date.now();
const imgShow = ref(false);

function timeFormat(time: string) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
}

async function toggleFavorite() {
    try {
        const res = await $fetch<FavoriteRes>(`${store.api}/components/favorites/`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                componentId: props.component._id
            })
        });
        emit("update-favorites-list");
        if (res.msg) {
            store.pushNotification({
                type: "success",
                message: res.msg,
                timeout: 5000,
            });
            return;
        }
    } catch (error) {
        if (error) {
        store.pushNotification({
            type: "error",
            message: error.toString(),
            timeout: 5000,
        });
        return;
        }
    }
}

onMounted(() => {
    // checkImg
    const img = new Image();
    img.src = `${store.dataApi}/screenshot/?componentId=${props.component._id}&v=${fileTs}`;
    img.onload = () => {
        imgShow.value = true;
    };
    img.onerror = () => {
        imgShow.value = false;
    };
});
</script>

<style lang="scss" scoped>
.card {
    background-color: $secColor;
    border-radius: 10px;
    background: #3F3F3F;
    box-shadow: 0px 0px 25px 0px rgba(40, 203, 146, 0.40);
    padding: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;

    .head {
        display: flex;
        align-items: center;
        padding-bottom: 16px;

        .category {
            display: flex;
            border-radius: 5px 0 0 5px;
            overflow: hidden;

            span {
                background-color: $mainColor;
                color: #fff;
                font-size: 22px;
                font-style: normal;
                font-weight: 700;
                line-height: 36px;
                letter-spacing: 0.77px;
                padding-left: 13px;
                padding-right: 2px;
                @include clamp;
            }

            img {
                height: 36px;
            }
        }

        button {
            padding: 6px;
            @include center;
            border-radius: 99px;
            background: none;
            border: 0;
            @include center;
            width: 44px;
            height: 44px;
            cursor: pointer;
            @extend %ts;

            i {
                @extend %ts;
                color: $mainColor;
                font-size: 28px;
                color: $mainColor;
            }

            &:hover {
                background: $mainColor;

                i {
                    color: $secColor;
                }
            }
        }

        .favorites {
            margin-left: auto;
        }

        .delete {
            margin-left: 16px;
        }
    }

    .content {
        min-height: 243px;
        border-radius: 10px;
        border: 2px solid #737373;
        overflow: hidden;

        @include media(480) {
            // height: 200px;
        }

        a {
            display: flex;
            width: 100%;
            height: 100%;

            img {
                width: 100%;
                // height: 100%;
                // object-fit: cover;
            }
        }
    }

    .info {
        display: flex;
        justify-content: space-between;
        padding-top: 12px;

        .text {
            h2 {
                color: $mainColor;
                font-size: 26px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                letter-spacing: 0.91px;
                @include clamp;
            }

            .by {
                color: #FFF;
                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                letter-spacing: 0.56px;
                @include clamp;
            }

        }

        .copy {
            width: 52px;
            height: 52px;
            border-radius: 10px;
            background: linear-gradient(-45deg, $sixColor 0%, $fiveColor 100%);
            background-size: 100%;
            border: 0;
            @include center;
            margin-top: 8px;
            cursor: pointer;
            @extend %ts;
            flex-shrink: 0;

            span {
                color: #fff;
                font-size: 30px;
            }

            &:hover {
                background-size: 135%;
            }
        }
    }
}
</style>