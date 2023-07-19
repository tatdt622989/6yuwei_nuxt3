<template>
    <div class="table-responsive px-0">
        <div class="table-tool">
            <p class="total">Total: {{ total }}</p>
            <div v-if="props.selector && props.selector.length > 0" class="right">
                <p class="selected">{{ props.selector.length }} item selected</p>
                <button class="delete btn"
                    @click=" emit('openConfirmModal', emit('deleteItem'), props.selector.join(','), 'delete')">
                    <span class="material-symbols-outlined"> delete </span>
                    Delete
                </button>
            </div>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col" width="65">
                        <label class="selector">
                            <input type="checkbox" v-model="isAllSelected" @change=" emit('selectAllItem')" />
                            <span class="bg"></span>
                            <span class="material-symbols-outlined mark"> check </span>
                        </label>
                    </th>
                    <th scope="col" width="90">Top</th>
                    <th scope="col">Preview</th>
                    <th scope="col">Title</th>
                    <th scope="col">Category</th>
                    <th scope="col">Off/On</th>
                    <th scope="col">Home</th>
                    <th scope="col">Action</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="unitItem in unitItems" :key="unitItem._id">
                    <td>
                        <label class="selector">
                            <input type="checkbox" v-model="selector" :value="unitItem._id" />
                            <span class="bg"></span>
                            <span class="material-symbols-outlined mark"> check </span>
                        </label>
                    </td>
                    <td>
                        <button :class="['pin', { active: unitItem.top }]"
                            @click=" emit('updateTop', unitItem._id ?? '', !unitItem.top)">
                            <span class="material-icons">
                                bookmark
                            </span>
                        </button>
                    </td>
                    <td>
                        <div class="preview-box" @click=" emit('openEditorModal', 'edit', unitItem)">
                            <img v-if="unitItem.photos[0]" :src="`${store.api}/admin/uploads/${unitItem.photos[0].url}`"
                                :alt="unitItem.title" />
                            <span class="material-symbols-outlined">nature_people</span>
                        </div>
                    </td>
                    <td>{{ unitItem.title }}</td>
                    <td>{{ unitItem.category }}</td>
                    <td>
                        <label class="switch">
                            <input type="checkbox" v-model="unitItem.visible" @change="
                                emit('updateVisibility', unitItem._id ?? '', unitItem.visible)
                                " />
                            <span class="bg">
                                <span class="toggler" />
                            </span>
                        </label>
                    </td>
                    <td>
                        <label class="switch">
                            <input type="checkbox" v-model="unitItem.homepage" @change="
                                emit('updateHomepage', unitItem._id ?? '', unitItem.homepage)
                                " />
                            <span class="bg">
                                <span class="toggler" />
                            </span>
                        </label>
                    </td>
                    <td>
                        <div class="action-wrap">
                            <button class="action copy"
                                @click="emit('openConfirmModal', emit('copyItem'), unitItem._id, 'copy')">
                                <span class="material-symbols-outlined icon">
                                    content_copy
                                </span>
                                <span class="text">Copy</span>
                            </button>
                            <button class="action delete"
                                @click="emit('openConfirmModal', emit('deleteItem'), unitItem._id, 'delete')">
                                <span class="material-symbols-outlined icon">
                                    delete
                                </span>
                                <span class="text">Delete</span>
                            </button>
                        </div>
                    </td>
                    <td>
                        <span class="material-symbols-outlined">
                            drag_indicator
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
import { Website, Animation } from "~/types";
import { useStore } from "~/store";

const emit = defineEmits(['openEditorModal', 'openConfirmModal', 'selectAllItem', 'updateTop', 
'updateVisibility', 'updateHomepage', 'deleteItem', 'copyItem', 'setWebsites', 'setIsAllSelected', 'setSelector']);
const props = defineProps({
    unitItems: Array as PropType<Website[] | Animation[]>,
    total: Number,
    selector: Array as PropType<string[]>,
    isAllSelected: Boolean,
});
const store = useStore();
const unitItem = ref<Website[] | Animation[]>([]);
const isAllSelected = ref(false);
const selector = ref<string[]>([]);

// 回寫資料
watch(unitItem, (val) => {
    emit('setWebsites', val);
});
watch(isAllSelected, (val) => {
    emit('setIsAllSelected', val);
});
watch(selector, (val) => {
    emit('setSelector', val);
});

// 覆寫資料
watch(() => props.unitItems, (val) => {
    if (val) unitItem.value = val;
}, { immediate: true });
watch(() => props.isAllSelected, (val) => {
    if (val) isAllSelected.value = val;
}, { immediate: true });
watch(() => props.selector, (val) => {
    if (val) selector.value = val;
}, { immediate: true });
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

.table-responsive {
    background-color: #fff;
    box-shadow: 0 0 10px $terColor;
    border-radius: 12px;
    padding: 0;
    margin-bottom: 30px;
    overflow: auto;

    &::-webkit-scrollbar {
        height: 6px;
        width: auto;
    }

    @include media(1024) {
        position: relative;
    }

    table {
        margin-bottom: 20px;
        table-layout: fixed;
        min-width: 1024px;
    }

    th {
        vertical-align: middle;
        padding: 20px;
        border-top: 0;
        border-bottom: 1px solid lighten($terColor, 5%);
        background-color: lighten($terColor, 5%);
        letter-spacing: 0.8px;
        font-size: 18px;

        &:nth-of-type(1) {
            @include media(1200) {
                width: 64px;
                text-align: center;
            }
        }

        &:nth-of-type(2) {
            text-align: center;
        }

        &:nth-of-type(3) {
            @include media(1200) {
                width: 120px;
                padding: 20px 0;
            }
        }

        &:nth-of-type(4) {
            width: 20%;
        }

        &:nth-of-type(5) {
            width: 15%;
        }

        &:last-of-type {
            width: 80px;
            text-align: center;
        }

        @include media(1200) {
            padding: 20px 10px;
        }
    }

    td {
        border-width: 0 0 1px 0;
        border-color: lighten($terColor, 5%);
        padding: 10px 20px;
        vertical-align: middle;
        letter-spacing: 0.8px;
        font-size: 16px;

        &:nth-of-type(1) {
            @include media(1200) {
                text-align: center;
            }
        }

        &:nth-of-type(2) {
            text-align: center;
        }

        &:nth-of-type(3) {
            @include media(1200) {
                padding: 10px 0;
            }
        }


        @include media(1200) {
            padding: 10px;
        }

        .pin {
            cursor: pointer;
            color: $terColor;
            font-size: 20px;
            background: none;
            border: 0;
            margin: 0 auto;
            border-radius: 99px;
            width: 44px;
            height: 44px;
            @include center;
            @extend %ts;

            span {
                font-size: 32px;
                color: darken($terColor, 8%);
            }

            &.active {
                span {
                    color: $mainColor;
                }
            }

            &:hover {
                background-color: lighten($terColor, 5%);
                color: darken($terColor, 15%);
            }
        }
    }

    tr {}

    .preview-box {
        cursor: pointer;
        width: 80px;
        height: 80px;
        background-color: lighten($terColor, 5%);
        border-radius: 12px;
        display: flex;
        @include center;
        position: relative;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 12px;
            position: relative;
            z-index: 1;
        }

        span {
            position: absolute;
            z-index: 0;
            display: block;
            margin: auto;
            @include center(transform, all);
            font-size: 60px;
            color: darken($terColor, 15%);
        }
    }

    .action-wrap {
        margin: 0 -10px;
        display: inline-block;
    }

    .action {
        background: transparent;
        border: 0;
        display: block;
        line-height: 1;
        vertical-align: middle;
        padding: 6px;
        // border: 1px solid $terColor;
        border-radius: 12px;
        @extend %ts;

        &:first-of-type {
            margin-bottom: 4px;
        }

        &:hover {
            background-color: lighten($terColor, 5%);

            .text,
            .icon {
                // color: $secColor;
            }

            &.delete {

                .text,
                .icon {
                    color: #e75e5e;
                }
            }
        }

        .icon {
            @extend %ts;
            vertical-align: middle;
            color: darken($terColor, 30%);
            margin-right: 6px;
        }

        .text {
            @extend %ts;
            vertical-align: middle;
            font-weight: bold;
            letter-spacing: 0.8px;
        }
    }
}

.selector {
    width: 24px;
    height: 24px;
    position: relative;
    overflow: hidden;
    vertical-align: middle;

    .bg {
        border-radius: 6px;
        background-color: #fff;
        display: flex;
        width: 100%;
        height: 100%;
        border: 1px solid darken($terColor, 10%);
        position: relative;
    }

    .mark {
        border-radius: 6px;
        background-color: transparent;
        padding: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: transparent;
        user-select: none;
        cursor: pointer;
        width: 100%;
        height: 100%;
    }

    input {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;

        &:checked {
            &~.mark {
                display: flex;
                width: 100%;
                height: 100%;
                color: #fff;
                background-color: $mainColor;
                border-color: $mainColor;
                @include center;
            }
        }
    }
}

.switch {
    // background-color: $terColor;
    width: 65px;
    height: 30px;

    .bg {
        border: 1px solid darken($terColor, 10%);
        border-radius: 99px;
        padding: 3px;
        display: flex;
        width: 100%;
        height: 100%;
        @extend %ts;
        position: relative;
        cursor: pointer;
    }

    .toggler {
        background-color: darken($terColor, 10%);
        width: 22px;
        height: 22px;
        border-radius: 99px;
        display: flex;
        position: absolute;
        left: 3px;
        top: 3px;
        @extend %ts;
    }

    input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;

        &:checked {
            background-color: $mainColor;

            &+.bg {
                background-color: $mainColor;
                border-color: $mainColor;

                .toggler {
                    background-color: #fff;
                    transform: translateX(35px);
                }
            }
        }
    }
}

.table-tool {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-transform: capitalize;
    border-bottom: 1px solid lighten($terColor, 5%);
    padding: 12px 20px;
    letter-spacing: 0.8px;

    @include media(1024) {
        position: sticky;
        top: 0px;
        width: 100%;
        left: 0;
    }

    @include media(768) {
        flex-direction: column;
        align-items: flex-start;
    }

    .total,
    .selected {
        margin: 0;
        font-size: 16px;
    }

    .total {
        font-weight: bold;
        font-size: 20px;
        letter-spacing: 0.8px;
        line-height: 50px;

        @include media(768) {
            line-height: 36px;
            margin-bottom: 6px;
        }
    }

    .right {
        align-items: center;
        display: flex;
        margin: 0 -20px;

        @include media(768) {
            margin: 0;
        }
    }

    .btn {
        border: 0;
        border-radius: 12px;
        font-weight: bold;
        cursor: pointer;
        font-size: 16px;
        min-width: 0;
        width: auto;
        padding: 0;
        margin: 0 20px;

        span {
            margin-right: 6px;
        }

        &.delete {
            background-color: transparent;
            color: #e75e5e;
            height: 44px;
            display: flex;
            align-items: center;

            &:hover {
                color: darken(#e75e5e, 10%);
            }
        }
    }
}

.titleWrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 0;
    margin-bottom: 30px;

    .text {
        padding-right: 10px;
    }

    .result {
        padding-left: 8px;
        font-size: 20px;

        span {
            font-weight: bold;
        }
    }

    &:deep(.toolbar) {
        min-width: 0;
        flex-shrink: 0;
    }
}
</style>
