<template>
  <div id="text-editor">
    <div v-if="editor" class="toolbar">
      <button
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <span class="material-symbols-outlined">format_bold</span>
      </button>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
  extensions: [
    StarterKit,
  ],
})
</script>

<style scoped lang="scss">
#text-editor {
  border: 2px solid darken($terColor, 10%);
  border-radius: 12px;
  height: 300px;
  margin-bottom: 20px;
}
:deep(.ProseMirror) {
  padding: 0 10px;
  &:focus-visible {
    outline: 0;
    box-shadow: none;
  }
}
.toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  border-bottom: 2px solid darken($terColor, 10%);
  button {
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    margin: 0 5px;
    font-size: 1.5rem;
    color: $secColor;
    &.is-active {
      background-color: $mainColor;
    }
  }
}
</style>
