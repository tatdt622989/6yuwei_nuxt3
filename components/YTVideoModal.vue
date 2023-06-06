<template>
    <div>
        <transition name="modal-fade">
            <div v-if="props.isOpen" id="YTVideoModal" :class="['modal', { open: props.isOpen }]" tabindex="-1"
                aria-labelledby="YTVideoModalLabel" aria-hidden="true" @click="emit('close-modal')">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content" @click="(e: Event) => e.stopPropagation()">
                        <div class="modal-header">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                @click="emit('close-modal')" />
                        </div>
                        <div class="modal-body">
                            <div class="container">
                                <iframe v-if="isOpen"
                                    :src="ytURL"
                                    title="YouTube video player" frameborder="0"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    isOpen: Boolean,
    videoURL: String
});
const emit = defineEmits(["close-modal"]);
const origin = ref('');
const ytURL = computed(() => {
    const url = props.videoURL;
    if (!url) return "";
    const code = url.split("v=")[1];
    return `https://www.youtube.com/embed/${code}?autoplay=1&mute=1&loop=1&playlist=${code}&playsinline=1&origin=${origin.value}`;
});

onMounted(() => {
    origin.value = window.location.origin;
});
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

#YTVideoModal {
    @extend %ts;
    display: block;
    backdrop-filter: blur(5px);
    background-color: rgba($mainColor, 0.1);

    .modal-dialog {
        width: 1400px;
        max-width: 100%;
        margin: 0 auto;
        padding: 0 8px;
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
            filter: brightness(0) invert(1);
            &:focus {
                box-shadow: none;
            }
        }
    }

    .modal-content {
        border-radius: 12px;
        box-shadow: 0 0 15px rgba($secColor, 0.8);
        background: #222222;
        border: 0;
        width: 100%;
        margin: 0 auto;
    }

    .modal-body {
        padding: 10px;
        padding-top: 0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .container {
            padding: 0;
            width: 100%;
            padding-bottom: 56.25%; /* 16:9 aspect ratio */
            position: relative;
            margin: 0;
            max-width: none;

            iframe {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
        }
    }
}
</style>