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
                            <h1>My storage</h1>
                        </div>
                    </div>
                    <ComponentsToolbar />
                </div>
            </div>
            <div class="wrap">
                <div class="search-box">
                    <input type="text" placeholder="Search for components created by everyone" v-model="keyword" @keyup="(e) => {
                        if (e.code === 'Enter') {
                            search();
                        }
                    }" />
                    <button class="search-btn" @click="search">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
                <div class="tag-box">
                    <button class="tag-item" v-for="item in componentsTypeList" :key="item._id"
                        @click="typeSearch(item.title)">
                        <span>{{ item.title }}</span>
                    </button>
                </div>
                <div class="content">
                    <ComponentsCard v-for="item in componentsList" :component="item" :key="item._id" />
                </div>
                <Pagination :total="totalPage" :url="'/components/storage'" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
import { Component, ComponentType } from "~/types";

useHead({
    title: "Components - storage",
    titleTemplate: "%s - 6yuwei",
    meta: [
        {
            hid: "description",
            name: "description",
            content: "Components - storage",
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
const { data: componentsTypeList, error: typeListError } = await useFetch<ComponentType[]>(`${store.api}/components/types/`);
const componentsList = ref<Component[]>([]);
const keyword = ref("");
const totalPage = ref(1);
const currentPage = computed(() => {
    return route.query.page ? parseInt(route.query.page as string, 10) : 1;
});

async function search() {
    store.isLoading = true;

    try {
        const res: ComponentsRes = await $fetch(`${store.api}/components/list/?page=${currentPage.value}&keyword=${keyword.value}`, {
            method: "GET",
            credentials: "include",
        });
        if (!res) return;
        componentsList.value = res.components;
        totalPage.value = res.totalPage;
    } catch (err) {
        if (err) {
            store.pushNotification({
                type: "error",
                message: err.toString(),
                timeout: 5000,
            });
            return;
        }
    }
    store.isLoading = false;
}

function typeSearch(type: string) {
    keyword.value = type;
    search();
}

async function getComponents() {
    store.isLoading = true;
    try {
        const res: ComponentsRes = await $fetch(`${store.api}/components/user/list/?page=${currentPage.value}`, {
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
            flex-wrap: wrap;
            padding: 30px 20px 20px;
        }

    }

    .left-layout {
        display: flex;
        align-items: center;

        @include media(768) {
            width: 100%;
            margin-bottom: 24px;
            // order: 2;
        }

        >.btn {
            margin-right: 30px;
            flex-shrink: 0;
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

.search-box {
    display: flex;
    overflow: hidden;
    border-radius: 10px;
    background: #FFF;
    box-shadow: 0px 0px 30px 0px rgba(40, 203, 146, 0.20);
    align-items: center;
    padding-right: 16px;
    margin-bottom: 16px;

    input {
        width: 100%;
        height: 52px;
        border: 0;
        padding: 0 20px;
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: 0.7px;
        color: $mainColor;

        &:focus {
            outline: none;
        }

        &::placeholder {
            color: #A6E1CB;
        }
    }

    .search-btn {
        background: none;
        border: 0;
        @include center;
        width: 44px;
        height: 44px;
        cursor: pointer;

        i {
            font-size: 22px;
            color: $mainColor;
        }
    }
}

.tag-box {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin: 0 -8px;
    margin-bottom: 60px;

    @include media(768) {
        margin-bottom: 45px;
    }

    .tag-item {
        border: 2px solid $mainColor;
        border-radius: 10px;
        color: $mainColor;
        border-color: $mainColor;
        padding: 0 20px;
        background: none;
        cursor: pointer;
        @extend %ts;
        margin: 0 8px;

        &:hover {
            background: $mainColor;
            color: $secColor;
        }

        span {
            font-size: 20px;
            line-height: 36px;
        }
    }
}</style>