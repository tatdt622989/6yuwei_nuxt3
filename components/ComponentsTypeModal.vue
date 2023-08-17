<template>
    <ClientOnly>
        <transition name="modal-fade">
            <div v-if="props.isOpen" id="componentsTypeModal" :class="['modal', { open: props.isOpen }]" tabindex="-1"
                aria-labelledby="componentsTypeModalLabel" aria-hidden="true" @click="emit('close-modal')">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content" @click="(e) => e.stopPropagation()">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5">Component Type</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                @click="emit('close-modal')" />
                        </div>
                        <div class="modal-body">
                            <ul class="component-type-list">
                                <li class="item" v-for="item in componentsTypeList" :key="item._id" :class="{ active : item._id === currentType?._id }">
                                    <div class="img-box" @click="currentType = item">
                                        <img :src="`${store.api}/components/types/cover/${item.coverFileName}`" :alt="item.title" v-if="item.coverFileName">
                                    </div>
                                    <p class="title">{{ item.title }}</p>
                                </li>
                            </ul>
                        </div>
                        <div class="modal-footer">
                            <div class="content-wrap">
                                <button type="button" class="btn cancel" @click="emit('close-modal')">
                                    Cancel
                                </button>
                                <button type="button" class="btn btn-primary" @click="apply">
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </ClientOnly>
</template>

<script lang="ts" setup>
import { useStore } from "~/store";
import { ComponentType } from "~/types";
const props = defineProps({
    isOpen: Boolean,
    unitName: String,
    activeComponentType: Object as PropType<ComponentType | null>,
});

const emit = defineEmits(["close-modal"]);
const store = useStore();
const route = useRoute();
const { data: componentsTypeList, error } = await useFetch<ComponentType[]>(`${store.api}/components/types/`);
const currentType = ref<ComponentType | null>(null);

const apply = () => {
    if (!currentType.value) return;
    navigateTo(`/components/generator/${currentType.value.customURL}`);
    emit("close-modal");
};

function bodyOverflow() {
    if (props.isOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
}

watch(() => props.isOpen, () => bodyOverflow);

onMounted(() => {
    if (props.activeComponentType) {
        currentType.value = props.activeComponentType;
    };
    bodyOverflow();
});
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

#componentsTypeModal {
    @extend %ts;
    display: block;
    backdrop-filter: blur(5px);
    background-color: rgba($mainColor, 0.1);

    .modal-dialog {
        max-width: 768px;

        @include media(788) {
            margin: 10px;
        }
    }

    &.open {
        opacity: 1;

        .modal-dialog {
            opacity: 1;
        }
    }

    &.modal-fade-enter-active,
    &.modal-fade-leave-active {
        transition: all 0.5s ease-out !important;
    }

    &.modal-fade-enter-from,
    &.modal-fade-leave-to {
        opacity: 0 !important;
    }

    .modal-header {
        border: 0;

        .modal-title {
            font-weight: bold;
            color: $secColor;
        }

        .btn-close {
            &:focus {
                box-shadow: none;
            }
        }
    }

    .modal-content {
        border-radius: 12px;
        box-shadow: 0 0 10px rgba($terColor, 0.5);
        background: #EFFFF9;
        border: 0;
    }

    .modal-body {
        padding: 28px 20px;
        padding-top: 12px;
        display: block;
    }

    .component-type-list {
        display: flex;
        flex-wrap: wrap;
        margin: 0 -10px;
        padding: 0;

        .item {
            padding: 0 10px;
            width: calc(100%/ 3);
            @include media(540) {
                width: calc(100%/ 2);
            }
            @include media(374) {
                width: 100%;
            }
            &.active {
                .img-box {
                    box-shadow: 0 0 0 3px $mainColor;
                }
            }

            .img-box {
                display: flex;
                border-radius: 10px;
                overflow: hidden;
                margin-bottom: 14px;
                width: 100%;
                // min-height: 163px;
                background-color: darken($terColor, 10%);
                cursor: pointer;

                img {
                    width: 100%;
                    height: auto;
                }
            }
            .title {
                font-size: 22px;
                font-weight: bold;
                color: $secColor;
                text-align: center;
            }
        }
    }

    .modal-footer {
        border-top: 1px solid $terColor;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        width: 100%;

        .content-wrap {
            flex-grow: 1;
            margin: 0 -10px;
        }

        .btn {
            padding: 10px 20px;
            border-radius: 12px;
            border: 0;
            background-color: $mainColor;
            color: $secColor;
            font-weight: bold;
            width: calc(50% - 20px);
            margin: 0 10px;

            &.cancel {
                background-color: $terColor;
            }

            &.delete {
                background-color: $dangerColor;
            }

            &:hover {
                color: $mainColor;
                background-color: $secColor;
            }
        }
    }
}</style>