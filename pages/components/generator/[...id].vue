<template>
    <div class="inner-page">
        <div class="head">
            <div class="wrap">
                <div class="left-layout">
                    <nuxt-link to="/components/" class="btn circle">
                        <i class="bi bi-arrow-left"></i>
                    </nuxt-link>
                    <div class="titleBox">
                        <!-- <p class="category">Button</p> -->
                        <h1 v-if="componentsType"><span>{{ componentsType?.title }}</span> {{ componentsData?.title ? '-' +
                            componentsData?.title : '' }}</h1>
                    </div>
                </div>
                <div class="toolBox">
                    <button class="storage btn circle">
                        <i class="bi bi-inboxes-fill"></i>
                    </button>
                    <button class="copy btn circle" @click="componentsTypeModal.open = true">
                        <i class="bi bi-arrow-left-right"></i>
                    </button>
                    <div class="balance">
                        <p>999</p>
                        <img src="@/assets/images/currency.svg" alt="currency">
                    </div>
                </div>
            </div>
        </div>
        <div class="wrap">
            <div class="generatorBox">
                <input type="text" placeholder="Search for components created by everyone" />
                <button class="generatorBtn">Generate</button>
            </div>
            <client-only>
                <swiper :freeMode="true" class="storageList" :slides-per-view="'auto'" :space-between="10">
                    <swiper-slide v-for="item in storageList" :key="item.id">
                        <div class="item"></div>
                    </swiper-slide>
                </swiper>
            </client-only>
            <div class="content">
                <div class="editor">
                    <div class="preview">
                        <span class="title">Preview</span>
                        <iframe :src="iframeSrc" frameborder="0" sandbox="allow-same-origin" v-if="iframeSrc"></iframe>
                    </div>
                    <div class="style">
                        <span class="title">CSS</span>
                        <textarea readonly></textarea>
                        <button class="copy">
                            <span class="material-symbols-outlined">
                                file_copy
                            </span>
                        </button>
                    </div>
                    <div class="bottom">
                        <div class="script">
                            <span class="title">JavaScript</span>
                            <textarea readonly></textarea>
                            <button class="copy">
                                <span class="material-symbols-outlined">
                                    file_copy
                                </span>
                            </button>
                        </div>
                        <div class="html">
                            <span class="title">HTML</span>
                            <textarea readonly></textarea>
                            <button class="copy">
                                <span class="material-symbols-outlined">
                                    file_copy
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="storage">
                    <div class="storageItem">
                        <div class="item"></div>
                    </div>
                </div>
            </div>
        </div>
        <ComponentsTypeModal :is-open="componentsTypeModal.open" :active-component-type="componentsType ?? null"
            @close-modal="componentsTypeModal.open = false" />
    </div>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
import { Component, ComponentType } from "~/types";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

interface Storage {
    id: string;
    name: string;
    data: string;
}

const store = useStore();
const route = useRoute();
const storageList = ref<Storage[]>([]);
const URL = ref(route.params.id);
const typeURL = computed(() => URL.value[0]);
const componentId = computed(() => URL.value[1]);
const { data: componentsRes, error: componentsError } = componentId.value ? await useFetch(`${store.api}/components/${componentId.value}/`) : { data: null, error: null };
const { data: componentsTypeList, error: typeListError } = await useFetch<ComponentType[]>(`${store.api}/components/types/`);
const componentsData = ref<null | Component>(null);
const componentsType = computed<null | ComponentType>(() => getComponentType(typeURL.value));
const iframeSrc = computed(() => {
    if (!componentsData.value) return "";
    if (!componentsType.value) return "";
    return `${store.api}/components/sandbox/?typeId=${componentsType.value._id}&componentId=${componentsData.value._id}`;
});
const componentsTypeModal = ref({
    open: false,
    data: {},
});

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

// 若是 componentsType 不存在，則跳轉到第一個 componentsType
if (componentsTypeList.value && componentsTypeList.value.length > 0 && !componentsTypeIsExist) {
    const firstComponentType = componentsTypeList.value[0] ?? null;
    navigateTo(`/components/generator/${firstComponentType.customURL}/`);
}

// 若是 componentsType 不存在，且 componentsTypeList 不存在，且請求錯誤，則跳轉到 generator 頁面
if (componentsError?.value || typeListError?.value || componentsTypeList.value?.length === 0) {
    navigateTo("/components/");
}

onMounted(() => {
    console.log(typeURL.value, componentId.value, componentsData.value);
    console.log(componentsData.value);
    for (let i = 0; i < 10; i++) {
        storageList.value.push({
            id: i.toString(),
            name: "Button",
            data: "data"
        });
    }
    // 若是第一次進入，則打開選擇 componentsType 的 modal
    if (typeURL.value && localStorage.getItem("firstIn") !== "1") {
        componentsTypeModal.value.open = true;
        localStorage.setItem("firstIn", "1");
    }
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

        .toolBox {
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

        .btn {
            align-self: center;
        }
    }

    .generatorBox {
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

            @include media(1200) {
                order: 2;
            }

            .preview,
            .style,
            .script,
            .html {
                border: 2px solid #696060;
                height: 545px;
                position: relative;
                border-radius: 10px;
                overflow: hidden;

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

                textarea {
                    border: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    background: none;
                    padding: 0;
                    resize: vertical;
                    min-height: 260px;
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

            .storageItem {
                width: 50%;
                padding: 0 10px;
                height: 170px;
                display: flex;

                @include media(1200) {
                    width: 140px;
                    height: 120px;
                }

                .item {
                    width: 100%;
                    height: 100%;
                    background-color: $terColor;
                    border-radius: 10px;
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
        }
    }

}
</style>