<template>
    <div class="inner-page">
        <div class="head">
            <div class="wrap">
                <div class="left-layout">
                    <nuxt-link to="/components/" class="btn circle">
                        <i class="bi bi-arrow-left"></i>
                    </nuxt-link>
                    <div class="titleBox">
                        <h1 v-if="componentsType"><span>{{ componentsType?.title }}</span> {{ componentsData?.title ? '- ' +
                            componentsData?.title : '' }}</h1>
                    </div>
                </div>
                <ComponentsToolbar @open-modal="openModal" />
            </div>
        </div>
        <client-only>
            <div class="wrap">
                <div class="generator-box">
                    <input type="text" placeholder="Describe your components" v-model="prompt"/>
                    <button class="generatorBtn" @click="componentGenerator">Generate</button>
                </div>
                <client-only>
                    <swiper :freeMode="true" class="storageList" :slides-per-view="'auto'" :space-between="10" v-show="storageList.length > 0">
                        <swiper-slide v-for="item in storageList" :key="item._id">
                            <div class="item">
                                <nuxt-link :to="`/components/generator/${componentsType?.customURL}/${item._id}`">
                                    <img :src="`/api/components/screenshot/${item.screenshotFileName}`" alt=""
                                    v-if="item.screenshotFileName">
                                </nuxt-link>
                            </div>
                        </swiper-slide>
                    </swiper>
                </client-only>
                <div class="content">
                    <div class="editor">
                        <div class="preview">
                            <span class="title">Preview</span>
                            <iframe :src="iframeSrc" frameborder="0" v-if="iframeSrc" ref="previewer"
                                sandbox="allow-same-origin allow-scripts"></iframe>
                        </div>
                        <div class="style">
                            <span class="title">CSS</span>
                            <div class="code" v-html="cssEl"></div>
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
                                <div class="code" v-html="javascriptEl"></div>
                                <button class="copy"
                                    @click="() => componentsType?.html ? copyToClipboard(componentsType.javascript) : ''">
                                    <span class="material-symbols-outlined">
                                        file_copy
                                    </span>
                                </button>
                            </div>
                            <div class="html">
                                <span class="title">HTML</span>
                                <div class="code" v-html="htmlEl"></div>
                                <button class="copy"
                                    @click="() => componentsType?.html ? copyToClipboard(componentsType.html) : ''">
                                    <span class="material-symbols-outlined">
                                        file_copy
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="storage" v-show="storageList.length > 0">
                        <div class="storage-item" v-for="item in storageList" :key="item._id">
                            <div class="item">
                                <nuxt-link :to="`/components/generator/${componentsType?.customURL}/${item._id}`">
                                    <img :src="`/api/components/screenshot/${item.screenshotFileName}`" alt=""
                                        v-if="item.screenshotFileName">
                                </nuxt-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ComponentsTypeModal :is-open="componentsTypeModal.open" :active-component-type="componentsType ?? null"
                @close-modal="componentsTypeModal.open = false" />
        </client-only>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
import { Component, ComponentType } from "~/types";
import html2canvas from 'html2canvas';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import CSS from 'highlight.js/lib/languages/css';
import HTML from 'highlight.js/lib/languages/xml';
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import 'highlight.js/styles/atom-one-dark.css';

useHead({
  title: "Components - generator",
  titleTemplate: "%s - 6yuwei",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "Components - generator",
    },
  ],
});

interface ComponentsRes {
    msg: string
    components : Component[]
    pageSize : number
    currentPage : number
    total : number
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
const { data: componentsRes, error: componentsError } = componentId.value ? await useFetch(`${store.api}/components/${componentId.value}/`) : { data: null, error: null };
const storageList = ref<Component[]>([]);
const { data: componentsTypeList, error: typeListError } = await useFetch<ComponentType[]>(`${store.api}/components/types/`);
const componentsData = ref<null | Component>(null);
const componentsType = computed<null | ComponentType>(() => getComponentType(typeURL.value));
const iframeSrc = computed(() => {
    if (!componentsData.value) return "";
    if (!componentsType.value) return "";
    return `/api/components/sandbox/?typeId=${componentsType.value._id}&componentId=${componentsData.value._id}`;
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

function openModal() {
    componentsTypeModal.value.open = true;
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

async function getStorageList() {
    if (!store.user) return;
    store.isLoading = true;

    try {
        const res: ComponentsRes = await $fetch(`${store.api}/components/user/?typeId=${componentsType.value?._id}`, {
            method: "GET",
            credentials: "include",
        });
        if (!res) return;
        storageList.value = res.components;
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
    if (!store.user) return navigateTo("/admin/login/?redirect=/components/");
    if (!componentsType.value) return;
    if (!prompt.value) {
        return store.pushNotification({
            type: "error",
            message: "Please enter a description",
            timeout: 5000,
        });
    }
    store.isLoading = true;

    try {
        const res: Component = await $fetch(`${store.api}/components/generate/`, {
            method: "POST",
            credentials: "include",
            body: {
                typeId: componentsType.value._id,
                prompt: prompt.value,
            },
        });
        if (!res) return store.isLoading = false;
        store.pushNotification({
            type: "success",
            message: "Generate success",
            timeout: 5000,
        });
        // update balance
        const balanceRes: BalanceRes = await $fetch(`${store.api}/user/balance/`, {
            method: "GET",
            credentials: "include",
        });
        if (!balanceRes) return;
        store.user.balance = balanceRes.balance;
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

if (componentsRes) {
    componentsData.value = componentsRes.value as Component;
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
    // 若是 componentsType 不存在，則跳轉到第一個 componentsType
    if (componentsTypeList.value && componentsTypeList.value.length > 0 && !componentsTypeIsExist) {
        const firstComponentType = componentsTypeList.value[0] ?? null;
        navigateTo(`/components/generator/${firstComponentType.customURL}/`);
    }
    // 若是 componentsType 不存在，且 componentsTypeList 不存在，且請求錯誤，則跳轉到 generator 頁面
    if (componentsError?.value || typeListError?.value || componentsTypeList.value?.length === 0) {
        navigateTo("/components/");
    }
    // 若是第一次進入，則打開選擇 componentsType 的 modal
    if (typeURL.value && localStorage.getItem("firstIn") !== "1") {
        componentsTypeModal.value.open = true;
        localStorage.setItem("firstIn", "1");
    }
    htmlEl.value = `<pre><code class="language-html">${hljs.highlight(componentsType.value?.html ?? "", {
        language: 'html',
    }).value}</code></pre>`;
    javascriptEl.value = `<pre><code class="language-javascript">${hljs.highlight(componentsType.value?.javascript ?? "", {
        language: 'javascript',
    }).value}</code></pre>`;
    cssEl.value = `<pre><code class="language-css">${hljs.highlight(componentsData.value?.style ?? "", {
        language: 'css',
    }).value}</code></pre>`;
    // 如果 screenshot 不存在，則 iframe 使用 html2canvas 截圖，並將截圖內容填充至600px x 400px的 canvas 中，再將 canvas 轉成 png 並上傳至 api server
    if (!componentsData.value?.screenshotFileName && componentsData.value) {
        await nextTick();
        const iframe = previewer.value;
        if (!iframe) return;
        iframe.onload = function() {
            if (!iframe) return;
            const iframeDocument = iframe.contentDocument;
            if (!iframeDocument) return;
            const iframeBody = iframeDocument.querySelector("body");
            if (!iframeBody) return;
            html2canvas(iframeBody, {
                scale: 1,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#fff",
            }).then((canvas) => {
                const height = canvas.height;
                // fit to 600 x 400
                const ctx = canvas.getContext("2d");
                if (!ctx) return;
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = 600;
                tempCanvas.height = 400;
                const scale = tempCanvas.height / height;
                const tempCtx = tempCanvas.getContext("2d");
                if (!tempCtx) return;
    
                // 如果新宽度大于Canvas宽度，裁剪多余部分
                var newWidth = canvas.width * scale;
                if (newWidth > tempCanvas.width) {
                    var xOffset = (newWidth - tempCanvas.width) / 2;
                    tempCtx.drawImage(canvas, -xOffset, 0, newWidth, tempCanvas.height);
                } else {
                    // 如果新宽度小于等于Canvas宽度，上下居中绘制
                    var yOffset = (tempCanvas.height - tempCanvas.height * scale) / 2;
                    tempCtx.drawImage(canvas, 0, yOffset, newWidth, tempCanvas.height * scale);
                }
    
                tempCanvas.toBlob(async (blob) => {
                    
                    if (!blob) return;
                    const formData = new FormData();
                    formData.append('componentId', componentsData.value?._id ?? "");
                    formData.append('screenshot', blob, "screenshot.png");
                    try {
                        interface uploadRes {
                            screenshotFileName: string
                        }
                        const res: uploadRes = await $fetch(`${store.api}/components/screenshot/`, {
                            method: "POST",
                            credentials: "include",
                            body: formData,
                        });
                        if (!res) return;
                        if (!componentsData.value) return;
                        componentsData.value.screenshotFileName = res.screenshotFileName;
                        getStorageList();
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
                });
            }).catch((err) => {
                console.log(err);
            });
        };
    }
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
            align-items: center;
            flex-direction: row;
            padding: 50px 20px 40px;

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

            &:focus {
                outline: none;
            }

            &::placeholder {
                color: #A6E1CB;
            }
        }

        .generatorBtn {
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
            padding: 10px;
            min-width: 140px;
            @extend %ts;
            cursor: pointer;

            &:hover {
                background-size: 120% auto;
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

}
</style>