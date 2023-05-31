<template>
    <transition name="modal-fade">
        <div v-if="props.isOpen" id="textEditorToolModal" :class="['modal', { open: props.isOpen }]" tabindex="-1"
            aria-labelledby="textEditorToolModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" @click="(e: Event) => e.stopPropagation()">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">{{ props.toolName }}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="emit('close-modal')" />
                    </div>
                    <div class="modal-body container">
                        <input class="form-control" type="text" v-model="link" v-if="props.toolName">
                    </div>
                    <div class="modal-footer">
                        <div class="btn-wrap">
                            <button type="button" class="btn cancel" @click="emit('close-modal')">
                                Cancel
                            </button>
                            <button type="button" class="btn btn-primary" @click="confirm">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
  
<script lang="ts" setup>
const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    toolName: {
        type: String,
        default: "",
    },
    link: {
        type: String,
        default: "",
    },
});
const emit = defineEmits(["close-modal", "on-confirm"]);
const link = ref("");

const confirm = () => {
    emit("on-confirm", props.toolName, link.value);
    emit("close-modal");
};

watch(
    () => props.link,
    (val) => {
        link.value = val;
    }
);
</script>
  
<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

#textEditorToolModal {
    @extend %ts;
    display: block;
    backdrop-filter: blur(5px);
    background-color: rgba($mainColor, 0.1);

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
        .modal-title {
            font-weight: bold;
            color: $secColor;
        }
    }

    .modal-content {
        border-radius: 12px;
        box-shadow: 0 0 10px rgba($terColor, 0.5);
        background: #fff;
        border: 0;
    }

    .modal-body {
        padding: 28px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;

        input,
        select,
        textarea {
            border: 2px solid darken($terColor, 10%);
            color: $secColor;
            border-radius: 12px;

            &:focus {
                box-shadow: none;
                border-color: $mainColor;
            }
        }

        input,
        select {
            letter-spacing: 1px;
            height: 44px;
        }

        label {
            letter-spacing: 1px;
            font-weight: bold;
            font-size: 18px;
        }

        datalist {
            display: none;
        }

        .ai {
            width: auto;
            height: 40px;
            background-color: $mainColor;
            border-radius: 12px;
            font-weight: bold;
            font-size: 18px;

            @include center;
            box-shadow: 0 0 16px rgba($mainColor, 0.4);

            .icon {
                color: $secColor;
                font-size: 26px;
                margin-right: 3px;
            }

            &:hover {
                background-color: $secColor;
                color: $mainColor;

                .icon {
                    color: $mainColor;
                }
            }
        }

        label.has-btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
            margin-bottom: 10px;

            .text {
                margin-right: 14px;
            }
        }

        .icon {
            font-size: 70px;
            color: $mainColor;
        }

        .title {
            font-weight: bold;
            font-size: 24px;
            color: $secColor;
            text-align: center;
        }
    }

    .modal-footer {
        border-top: 1px solid $terColor;
        padding: 16px;
        display: flex;
        justify-content: space-between;

        .btn-wrap {
            margin: 0 -10px;
            flex-grow: 1;
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
}
</style>
  