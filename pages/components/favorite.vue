<template>
    <div class="inner-page">
        <div class="main">
            <div class="head">
                <div class="wrap">
                    <div class="left-layout">
                        <nuxt-link to="/components/" class="btn circle">
                            <i class="bi bi-arrow-left"></i>
                        </nuxt-link>
                        <div class="titleBox">
                            <h1>Favorite</h1>
                        </div>
                    </div>
                    <ComponentsToolbar />
                </div>
            </div>
            <div class="wrap">
                <div class="content">
                    <ComponentsCard v-for="item in componentsList" :component="item" :key="item._id"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
import { Component, ComponentType } from "~/types";

useHead({
    title: "Components - Favorite",
    titleTemplate: "%s - 6yuwei",
    meta: [
        {
            hid: "description",
            name: "description",
            content: "Components - Favorite",
        },
    ],
});

interface ComponentsRes {
    msg: string
    components: Component[]
    pageSize: number
    currentPage: number
    total: number
    totalPage: number
};

const store = useStore();
const route = useRoute();

store.isLoading = true;
const { data: componentsTypeList, error: typeListError } = await useFetch<ComponentType[]>(`${store.api}/components/types/`);
store.isLoading = false;

const componentsList = ref<Component[]>([]);
const keyword = ref("");
const totalPage = ref(1);
const currentPage = computed(() => {
    return route.query.page ? parseInt(route.query.page as string, 10) : 1;
});

async function getComponents() {
    store.isLoading = true;
    try {
        const res = await $fetch<ComponentsRes>(`${store.api}/components/favorites/?page=${currentPage.value}`, {
            method: "GET",
        });
        if (res.msg) {
            totalPage.value = res.totalPage;
            componentsList.value = res.components;
        }
        store.isLoading = false;
    } catch (err) {
        console.log(err);
        store.isLoading = false;
        if (err) {
            return store.pushNotification({
                type: "error",
                message: err.toString(),
                timeout: 5000,
            });
        }
    }
}

watch(currentPage, async () => {
    await getComponents();
});

onMounted(() => {
    getComponents();
});
</script>

<style lang="scss" scoped>
.main {
    padding: 50px 0;

    .wrap {
        max-width: 1480px;
    }

    >.wrap {
        width: 100%;
    }
}

.head {
    display: flex;

    .wrap {
        display: flex;
        align-items: center;
        flex-direction: row;
        padding: 20px 20px 40px;

        @include media(768) {
            // flex-wrap: wrap;
            padding: 30px 20px 20px;
        }

    }

    .left-layout {
        display: flex;
        align-items: center;
        flex-grow: 1;

        @include media(768) {
            // width: 100%;
            margin-bottom: 10px;
            // order: 2;
        }

        >.btn {
            margin-right: 30px;
            flex-shrink: 0;
        }
    }

    :deep(.tool-box) {

        @include media(768) {
            width: auto;
            flex-grow: 0;

        }
    }

    .titleBox {
        .category {
            color: $mainColor;
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            line-height: 1.3;
        }

        h1 {
            margin: 0;
            font-size: 28px;
            @include clamp(2);

            @include media(768) {
                font-size: 24px;
            }

            span {
                color: darken($mainColor, 5%);
            }
        }
    }

    .btn {
        align-self: center;
    }
}

.content {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 44px;
    margin: 0 -15px;

    :deep(.card-wrap) {
        width: calc(33.33%);
        margin-bottom: 60px;
        padding: 0 15px;
        box-sizing: border-box;
        display: flex;

        @include media(1200) {
            width: 50%;
            margin-bottom: 40px;
        }

        @include media(768) {
            width: 100%;
        }

        @include media(576) {
            margin-bottom: 20px;
        }
    }
}
</style>