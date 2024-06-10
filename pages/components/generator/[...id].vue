<template>
    <div class="inner-page">
        <div class="head">
            <div class="wrap">
                <div class="left-layout" v-if="componentsData || componentsType">
                    <!-- <nuxt-link to="/components/"
                        class="btn circle">
                        <i class="bi bi-arrow-left"></i>
                    </nuxt-link> -->
                    <div class="titleBox">
                        <h1 v-if="componentsType"><span>{{ componentsType?.title }}</span> {{ componentsData?.title ? '- ' +
                            componentsData?.title : '' }}</h1>
                    </div>
                </div>
                <ComponentsToolbar @open-modal="openModal" :can-fine-tuning="canFineTuning" />
            </div>
        </div>
        <client-only>
            <div class="wrap">
                <div class="generator-box"
                    v-if="canFineTuning || !componentsData">
                    <input type="text"
                        placeholder="Describe your components"
                        v-model="prompt" />
                    <button class="generator-btn"
                        :class="{ 'fine-tuning': canFineTuning }"
                        @click="componentGenerator">{{ canFineTuning ? 'Fine-tuning' : 'Generate' }}</button>
                </div>
                <client-only>
                    <swiper :freeMode="true"
                        class="storageList"
                        :slides-per-view="'auto'"
                        :space-between="10"
                        v-show="storageList.length > 0">
                        <swiper-slide v-for="(item, i) in storageList"
                            :key="item._id">
                            <div class="item">
                                <nuxt-link :to="`/components/generator/${componentsType?.customURL}/${item._id}`">
                                    <img :src="`${store.dataApi}/screenshot/?componentId=${item?._id}&v=${fileTs}`"
                                        alt=""
                                        v-if="storageImgShow[i]">
                                </nuxt-link>
                            </div>
                        </swiper-slide>
                    </swiper>
                </client-only>
                <div class="content">
                    <div class="editor">
                        <div class="preview">
                            <span class="title">Preview</span>
                            <iframe :src="iframeSrc"
                                frameborder="0"
                                v-if="iframeSrc"
                                ref="previewer"
                                sandbox="allow-scripts allow-same-origin"></iframe>
                        </div>
                        <div class="style">
                            <span class="title">CSS</span>
                            <div class="code"
                                v-html="cssEl"></div>
                            <button class="copy"
                                @click="() => componentsData?.style ? copyToClipboard(componentsData?.style) : ''">
                                <span class="material-symbols-outlined">
                                    file_copy
                                </span>
                            </button>
                        </div>
                        <div class="bottom">
                            <div class="script">
                                <span class="title">JavaScript</span>
                                <div class="code"
                                    v-html="javascriptEl"></div>
                                <button class="copy"
                                    @click="() => componentsType?.javascript ? copyToClipboard(componentsType?.javascript) : ''">
                                    <span class="material-symbols-outlined">
                                        file_copy
                                    </span>
                                </button>
                            </div>
                            <div class="html">
                                <span class="title">HTML</span>
                                <div class="code"
                                    v-html="htmlEl"></div>
                                <button class="copy"
                                    @click="() => componentsData?.html ? copyToClipboard(componentsData.html) : (componentsType?.html ? copyToClipboard(componentsType?.html) : '')">
                                    <span class="material-symbols-outlined">
                                        file_copy
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="storage"
                        v-show="storageList.length > 0">
                        <div class="storage-item"
                            v-for="(item, i) in storageList"
                            :key="item._id">
                            <div class="item">
                                <nuxt-link :to="`/components/generator/${componentsType?.customURL}/${item._id}`">
                                    <img :src="`${store.dataApi}/screenshot/?componentId=${item?._id}&v=${fileTs}`"
                                        v-if="storageImgShow[i]">
                                </nuxt-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ComponentsTypeModal :is-open="componentsTypeModal.open"
                :active-component-type="componentsType ?? null"
                @close-modal="componentsTypeModal.open = false"
                :prompt="prompt" />
        </client-only>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
import { Component, ComponentType } from "~/types";
// import html2canvas from 'html2canvas';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import CSS from 'highlight.js/lib/languages/css';
import HTML from 'highlight.js/lib/languages/xml';
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import 'highlight.js/styles/atom-one-dark.css';

interface ComponentsRes {
    msg: string
    components: Component[]
    pageSize: number
    currentPage: number
    total: number
    totalPage: number
};

interface BalanceRes {
    msg: string
    balance: number
};

const store = useStore();
const route = useRoute();
const router = useRouter();

const URL = ref(route.params.id);
const typeURL = computed(() => URL.value[0]);
const componentId = computed(() => URL.value[1]);
const fileTs = ref(Date.now());
store.isLoading = true;
const { data: componentsRes, error: componentsError } = componentId.value ? await useFetch(`${store.api}/components/${componentId.value}/`) : { data: null, error: null };
const storageList = ref<Component[]>([]);
const { data: componentsTypeList, error: typeListError } = await useFetch<ComponentType[]>(`${store.api}/components/types/`);
store.isLoading = false;

const componentsData = ref<null | Component>(null);
const canFineTuning = computed(() => componentId.value && store.user?._id === componentsData.value?.userId ? true : false);
const componentsType = computed<null | ComponentType>(() => getComponentType(typeURL.value));
const iframeSrc = computed(() => {
    if (!componentsData.value) return "";
    if (!componentsType.value) return "";
    const api = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/components/sandbox/' : 'https://api.6yuwei.com/components/sandbox/';
    return `${api}?typeId=${componentsType.value._id}&componentId=${componentsData.value._id}`;
});
const copyToClipboard = useCopyToClipboard();
const htmlEl = ref('');
const javascriptEl = ref('');
const cssEl = ref('');
const componentsTypeModal = ref({
    open: false,
    data: {},
});
const previewer = ref<HTMLIFrameElement | null>(null);
const prompt = ref("");
const storageImgShow = ref<Boolean[]>([]);

if (componentsRes) {
    componentsData.value = componentsRes.value as Component;
}

useHead({
    title: `${componentsData.value?.title ?? "generator"}`,
    titleTemplate: "%s - 6yuwei",
    meta: [
        {
            hid: "description",
            name: "description",
            content: `${componentsData.value?.title ?? "generator"}`,
        },
    ],
});

function openModal() {
    componentsTypeModal.value.open = true;
}

async function getComponentsData() {
    if (!componentId.value) return;
    try {
        const res = await $fetch<Component>(`${store.api}/components/${componentId.value}/`, {
            method: "GET",
            credentials: "include",
        });
        if (!res) return;
        componentsData.value = res;
        const iframe = previewer.value;
        if (!iframe) return;
        // reset iframe
        iframe.src = "";
        await nextTick();
        iframe.src = iframeSrc.value;
        // update code
        htmlEl.value = `<pre><code class="language-html">${hljs.highlight(componentsData.value?.html ?? componentsType.value?.html ?? '', {
            language: 'html',
        }).value}</code></pre>`;
        javascriptEl.value = `<pre><code class="language-javascript">${hljs.highlight(componentsType.value?.javascript ?? "", {
            language: 'javascript',
        }).value}</code></pre>`;
        cssEl.value = `<pre><code class="language-css">${hljs.highlight(componentsData.value?.style ?? "", {
            language: 'css',
        }).value}</code></pre>`;
    } catch (err) {
        if (err) {
            store.pushNotification({
                type: "error",
                message: err.toString(),
                timeout: 5000,
            });
            return store.isLoading = false;
        }
    }
}

function getComponentType(type: string) {
    if (!componentsTypeList.value || componentsTypeList.value.length === 0) return null;
    let result = null;
    componentsTypeList.value.forEach((item) => {
        if (item.customURL === type) {
            result = item;
        }
    });
    return result;
}

async function checkStorageImgShow() {
    const req = [];
    for (let i = 0; i < storageList.value.length; i++) {
        const promise = new Promise<Boolean>((resolve, reject) => {
            const img = new Image();
            img.src = `${store.dataApi}/screenshot/?componentId=${storageList.value[i]?._id}&v=${fileTs.value}`;
            img.onload = () => {
                resolve(true);
            }
            img.onerror = () => {
                resolve(false);
            }
        });
        req.push(promise);
    }
    const res = await Promise.all(req);
    storageImgShow.value = res;
}

async function getStorageList() {
    if (!store.user || !componentsType.value?._id) return;
    store.isLoading = true;

    try {
        const res = await $fetch<ComponentsRes>(`${store.api}/components/user/?typeId=${componentsType.value?._id}`, {
            method: "GET",
            credentials: "include",
        });
        if (!res) return;
        storageList.value = res.components;
        for (let i = 0; i < storageList.value.length; i++) {
            storageImgShow.value.push(false);
        }
        await checkStorageImgShow();
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

async function componentGenerator() {
    if (!store.user) return store.pushNotification({
        type: "error",
        message: "Please login first",
        timeout: 5000,
    });
    if (!componentsType.value) {
        openModal();
        return store.pushNotification({
            type: "error",
            message: "Please select a component type",
            timeout: 5000,
        });
    }
    if (!prompt.value) {
        return store.pushNotification({
            type: "error",
            message: "Please enter a description",
            timeout: 5000,
        });
    }

    if (store.isLoading) {
        return store.pushNotification({
            type: "error",
            message: "Please wait for the previous request to complete",
            timeout: 5000,
        });
    }

    store.isLoading = true;

    try {
        const api = canFineTuning.value ? `${store.api}/components/generate/update/` : `${store.api}/components/generate/`;
        const body = canFineTuning.value ? {
            componentId: componentsData.value?._id,
            prompt: prompt.value,
        } : {
            typeId: componentsType.value._id,
            prompt: prompt.value,
        };
        const res = await $fetch<Component>(api, {
            method: "POST",
            credentials: "include",
            body,
        });
        if (!res) return store.isLoading = false;
        store.pushNotification({
            type: "success",
            message: "Generate success",
            timeout: 5000,
        });
        // update balance
        const balanceRes = await $fetch<BalanceRes>(`${store.api}/user/balance/`, {
            method: "GET",
            credentials: "include",
        });
        if (!balanceRes) return;
        store.user.balance = balanceRes.balance;
        if (canFineTuning.value) {
            await getComponentsData();
            await getStorageList();
            updateScreenshot();
            return;
        }
        navigateTo(`/components/generator/${componentsType.value.customURL}/${res._id}`);
    } catch (err) {
        if (err) {
            store.isLoading = false;
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

async function updateScreenshot(forceUpdate = false) {
    if (componentsData.value) {
        // 檢查截圖是否存在
        if (!forceUpdate) {
            try {
                const res = await $fetch(`${store.dataApi}/screenshot`, {
                    method: "GET",
                    credentials: "include",
                    query: {
                        componentId: componentsData.value._id,
                    },
                });
                if (!res) return;
            } catch (err) {
                if (err) {
                    console.log(err);
                }
            }
        }
        const formData = new FormData();
        formData.append("typeId", componentsType.value?._id ?? "");
        formData.append("componentId", componentsData.value._id);
        const screenshotRes = await $fetch(`${store.dataApi}/screenshot/`, {
            method: "POST",
            body: formData,
        });
        if (!screenshotRes) return;
        let storageCurrentIndex = -1;
        storageList.value.forEach((item, index) => {
            if (item._id === componentsData.value?._id) {
                storageCurrentIndex = index;
            }
        });
        if (storageCurrentIndex > -1) {
            storageImgShow.value[storageCurrentIndex] = true;
        }
        fileTs.value = Date.now();
    }
}

// 判斷 componentsType 是否存在
let componentsTypeIsExist = false;
if (componentsTypeList.value && componentsTypeList.value.length > 0 && typeURL.value) {
    componentsTypeList.value.forEach((item) => {
        if (item.customURL === typeURL.value) {
            componentsTypeIsExist = true;
        }
    });
}

watch(() => store.user, (user) => {
    if (user) {
        getStorageList();
    }
}, { immediate: true });

onMounted(async () => {
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('css', CSS);
    hljs.registerLanguage('html', HTML);
    if (route.query.prompt) {
        prompt.value = route.query.prompt as string;
    }
    // 若是 componentsType 不存在，則跳轉到第一個 componentsType
    // if (componentsTypeList.value && componentsTypeList.value.length > 0 && !componentsTypeIsExist) {
    //     const firstComponentType = componentsTypeList.value[0] ?? null;
    //     navigateTo(`/components/generator/${firstComponentType.customURL}/`);
    // }
    // 若是 componentsType 不存在，且 componentsTypeList 不存在，且請求錯誤，則跳轉到 generator 頁面
    if (componentsError?.value || typeListError?.value || componentsTypeList.value?.length === 0) {
        navigateTo("/components/");
    }
    // 若是第一次進入，或是沒有typeID，則打開選擇 componentsType 的 modal
    if (!componentsType.value) {
        openModal();
    }
    htmlEl.value = `<pre><code class="language-html">${hljs.highlight(componentsData.value?.html ?? componentsType.value?.html ?? '', {
        language: 'html',
    }).value}</code></pre>`;
    javascriptEl.value = `<pre><code class="language-javascript">${hljs.highlight(componentsType.value?.javascript ?? "", {
        language: 'javascript',
    }).value}</code></pre>`;
    cssEl.value = `<pre><code class="language-css">${hljs.highlight(componentsData.value?.style ?? "", {
        language: 'css',
    }).value}</code></pre>`;
    await nextTick();
    // updateScreenshot();
});

onBeforeUnmount(() => {
    // hljs unregister
    hljs.unregisterLanguage('javascript');
    hljs.unregisterLanguage('css');
    hljs.unregisterLanguage('html');
});

</script>

<style lang="scss" scoped>
@import '@/assets/scss/_setting.scss';

* {
    box-sizing: border-box;
}

.inner-page {
    .wrap {
        max-width: 1480px;
        display: flex;
        align-items: center;
    }

    >.wrap {
        display: flex;
        flex-direction: column;
    }

    .head {
        display: flex;
        
        .wrap {
            display: flex;
            align-items: flex-start;
            flex-direction: row;
            padding: 50px 20px 28px;
            flex-direction: column;

            @include media(768) {
                flex-wrap: wrap;
                padding: 20px 20px 20px;
            }

        }

        .left-layout {
            display: flex;
            align-items: center;
            width: 100%;
            border-radius: 10px;
            padding-bottom: 10px;

            @include media(768) {
                width: 100%;
                margin-bottom: 0px;
                padding-top: 10px;
            }

            >.btn {
                margin-right: 20px;
                flex-shrink: 0;
            }
        }

        .titleBox {
            display: flex;
            align-items: center;
            .component-type-selector {
                border-radius: 10px;
                padding: 6px 12px;
                padding-left: 0;
                font-size: 24px;
                font-weight: bold;
                margin-right: 14px;
                color: $mainColor;
                @extend %ts;
                position: relative;
                padding-right: 30px;
                cursor: pointer;
                @include after {
                    content: "";
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 12px 6px 0 6px;
                    border-color: $mainColor transparent transparent transparent;
                    position: absolute;
                    right: 9px;
                    @include center(transform, y);
                }
                &.no-change {
                    cursor: default;
                    padding-right: 12px;
                    @include after {
                        display: none;
                    }
                }
            }

            .category {
                color: $mainColor;
                font-size: 20px;
                font-style: normal;
                font-weight: 700;
                line-height: 1.3;
            }

            h1 {
                margin: 0;
                font-size: 26px;
                font-weight: bold;
                line-height: 32px;
                color: $secColor;
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

    .generator-box {
        display: flex;
        overflow: hidden;
        border-radius: 10px;
        background: #FFF;
        box-shadow: 0px 0px 30px 0px rgba(40, 203, 146, 0.20);
        width: 100%;
        margin-bottom: 40px;
        position: relative;

        @include media(1024) {
            margin-bottom: 20px;
        }

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

            @include media(480) {
                font-size: 16px;
            }

            &:focus {
                outline: none;
            }

            &::placeholder {
                color: #A6E1CB;
            }
        }

        .generator-btn {
            background: linear-gradient(90deg, $fiveColor 0%, $sixColor 100%);
            background-size: 100% auto;
            height: 52px;
            border-radius: 10px;
            border: 0;
            color: #FFF;
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            letter-spacing: 0.7px;
            padding: 10px 16px;
            min-width: 172px;
            white-space: nowrap;
            flex-shrink: 0;
            @extend %ts;
            cursor: pointer;

            @include media(768) {
                min-width: 120px;
            }

            @include media(480) {
                font-size: 16px;
            }

            &:hover {
                background-size: 120% auto;
            }

            &.fine-tuning {
                background-image: linear-gradient(90deg, $mainColor 0.3%, rgba(65, 35, 251, 1) 100%);
            }
        }
    }

    .content {
        width: 100%;
        flex-grow: 1;
        display: flex;
        margin-bottom: 72px;

        @include media(1200) {
            flex-direction: column;
        }

        .editor {
            border-radius: 10px;
            background-color: $secColor;
            padding: 20px;
            flex-grow: 1;
            min-width: 0;

            @include media(1200) {
                order: 2;
            }

            .code {
                display: flex;
                margin: 0;
                overflow: auto;
                padding: 16px;
                width: 100%;
                max-height: 500px;

                @include media(768) {
                    max-height: 300px;
                }

                &::-webkit-scrollbar {
                    height: 6px;
                }
            }

            .preview,
            .style,
            .script,
            .html {
                border: 2px solid #696060;
                height: 500px;
                position: relative;
                border-radius: 10px;
                overflow: hidden;
                background-color: darken($secColor, 5%);

                @include media(768) {
                    height: 300px;
                }

                .title {
                    color: #B5B5B5;
                    font-size: 20px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                    left: 14px;
                    top: 7px;
                    position: absolute;
                }

                textarea,
                :deep(pre) {
                    border: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    background: none;
                    padding: 0;
                    resize: vertical;
                    min-height: 260px;
                    color: #fff;

                }

                :deep(pre) {
                    display: flex;
                    align-items: stretch;
                    margin-bottom: 0;
                    margin-top: 25px;
                    padding: 0 8px;
                    width: 100%;

                    code {
                        background: darken($secColor, 5%);
                        display: block;
                        width: 100%;
                    }
                }

                .copy {
                    position: absolute;
                    background: linear-gradient(-45deg, $sixColor 0%, $fiveColor 100%);
                    right: 14px;
                    bottom: 14px;
                    border-radius: 10px;
                    border: 0;
                    padding: 0;
                    @include center;
                    width: 48px;
                    height: 48px;
                    cursor: pointer;
                    background-size: 100%;
                    @extend %ts;

                    span {
                        color: #fff;
                        font-size: 28px;
                    }

                    &:hover {
                        background-size: 135%;
                    }
                }
            }

            .preview {
                margin-bottom: 20px;

                iframe {
                    width: 100%;
                    height: 100%;
                }
            }

            .style {
                height: auto;
                margin-bottom: 20px;
            }

            .bottom {
                display: flex;
                margin: 0 -10px;

                @include media(768) {
                    flex-direction: column;
                }

                .script,
                .html {
                    height: auto;

                    @include media(768) {
                        width: calc(100% - 20px);
                        margin-bottom: 20px;
                    }

                    textarea {}

                    width: calc(50% - 20px);
                    margin: 0 10px;
                }
            }
        }

        .storage {
            max-width: 400px;
            width: 100%;
            display: flex;
            flex-shrink: 0;
            border-radius: 10px;
            margin-left: 40px;
            background-color: $mainColor;
            flex-wrap: wrap;
            padding: 20px 10px;
            align-content: flex-start;

            @include media(1400) {
                margin-left: 20px;
            }

            @include media(1200) {
                margin-left: 0;
                max-width: none;
                margin-bottom: 20px;
                display: none;
            }

            .storage-item {
                width: 50%;
                padding: 0 10px;
                height: 170px;
                display: flex;
                margin-bottom: 20px;

                @include media(1200) {
                    width: 140px;
                    height: 120px;
                }

                .item {
                    width: 100%;
                    height: 100%;
                    background-color: $terColor;
                    border-radius: 10px;
                    overflow: hidden;

                    a {
                        display: flex;
                        width: 100%;
                        height: 100%;
                    }

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }
        }
    }

    .storageList {
        background-color: $mainColor;
        width: 100%;
        padding: 10px;
        margin-bottom: 20px;
        border-radius: 10px;
        position: relative;

        @include media(-1201) {
            display: none;
        }

        @include after {
            width: 60px;
            height: 100%;
            background: linear-gradient(90deg, rgba($mainColor, 0) 0%, $mainColor 100%);
            right: 0;
            top: 0;
            z-index: 2;
        }

        .swiper-slide {
            width: 100px;
        }

        .item {
            width: 100px;
            background-color: $terColor;
            height: 100px;
            border-radius: 10px;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

}</style>