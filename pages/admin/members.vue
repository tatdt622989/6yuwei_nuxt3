<template>
    <div>
        <div class="titleWrap">
            <div class="text">
                <h2 class="title">Members</h2>
                <p class="result" v-if="keyword">
                    Search keyword: <span>{{ keyword ? `${keyword}` : "" }}</span>
                </p>
            </div>
            <AdminContentToolbar @open-editor-modal="openEditorModal" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Editor, Animation } from "~/types";
import { useStore } from "~/store";

interface UpdateData {
  _id: string;
  data: {
    [key: string]: string | boolean | Array<string>;
  };
}

useHead({
  title: "members",
  titleTemplate: "%s - 6yuwei admin",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "6yuwei - members admin",
    },
  ],
});

// 需要驗證身份
definePageMeta({
  middleware: ["auth"],
});

const store = useStore();
const keyword = inject("keyword") as Ref<string>;
const changeToEditor = useChangeToEditor();

const editorModal = reactive({
  open: false,
  action: "add" as "add" | "edit",
  data: null as Editor | null,
});
const openEditorModal = (
  action: "add" | "edit",
  data: Animation | null = null
) => {
  
  editorModal.action = action;
  editorModal.data = null;
  if (action !== 'add' && action !== 'edit') throw new Error('action must be add or edit');
  if (action === "edit" && data) {
    editorModal.data = changeToEditor(data);
  }
  editorModal.open = true;
};
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";
</style>