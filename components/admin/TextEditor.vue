<template>
  <div id="text-editor">
    <div v-if="editor" class="toolbar">
      <button
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <span class="material-icons">format_bold</span>
      </button>
      <button
        @click="editor?.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        <span class="material-icons">format_italic</span>
      </button>
      <button
        @click="editor?.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        <span class="material-icons"> strikethrough_s </span>
      </button>
      <button
        @click="editor?.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
      >
        <span class="material-icons"> terminal </span>
      </button>
      <label id="color-selector">
        <input
          type="color"
          @input="(e) => setColor(e)"
          :value="editor.getAttributes('textStyle').color"
        />
        <span class="material-icons"> format_color_text </span>
      </label>
      <button
        @click="editor?.chain().focus().setTextAlign('left').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
      >
        <span class="material-symbols-outlined"> format_align_left </span>
      </button>
      <button
        @click="editor?.chain().focus().setTextAlign('center').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
      >
        <span class="material-symbols-outlined"> format_align_center </span>
      </button>
      <button
        @click="editor?.chain().focus().setTextAlign('right').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
      >
        <span class="material-symbols-outlined"> format_align_right </span>
      </button>
      <button
        @click="editor?.chain().focus().setTextAlign('justify').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
      >
        <span class="material-symbols-outlined"> format_align_justify </span>
      </button>
      <select
        class="form-select"
        id="text-selector"
        v-model="textSelector"
        @change="changeTextSelector"
      >
        <option value="Normal">Normal</option>
        <option value="1">H1</option>
        <option value="2">H2</option>
        <option value="3">H3</option>
        <option value="4">H4</option>
        <option value="5">H5</option>
        <option value="6">H6</option>
      </select>
    </div>
    <editor-content class="text-editor-content" :editor="editor" />
  </div>
</template>

<script lang="ts" setup>
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import HardBreak from '@tiptap/extension-hard-break'
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { lowlight } from "lowlight";

HardBreak.configure({
  keepMarks: false,
})

lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);

const props = defineProps({
  textEditor: String,
  action: String,
  isOpen: Boolean,
});

const emit = defineEmits(["set-text-editor-output"]);

const textSelector = ref("");

const editor = useEditor({
  content: ``,
  extensions: [
    Document,
    Paragraph,
    Text,
    Heading,
    Bold,
    Italic,
    Strike,
    Color,
    TextStyle,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),
  ],
});

const changeTextSelector = () => {
  if (editor.value) {
    if (textSelector.value === "Normal") {
      editor.value.chain().focus().setParagraph().run();
    } else {
      editor.value
        .chain()
        .focus()
        .setHeading({
          level: parseInt(textSelector.value, 10) as 1 | 2 | 3 | 4 | 5 | 6,
        })
        .run();
    }
  }
};

const setColor = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (editor.value) {
    editor.value.chain().focus().setColor(target.value).run();
  }
};

const generateEditorHTML = () => {
  if (editor.value) {
    emit("set-text-editor-output", editor.value.getHTML());
  }
};

const setEditorContent = () => {
  if (editor.value && props.textEditor) {
    editor.value.commands.setContent(props.textEditor);
  }
};

// check if it's a heading and set the textSelector
watchEffect(() => {
  if (editor.value) {
    if (editor.value.isActive("heading")) {
      textSelector.value = editor.value
        .getAttributes("heading")
        .level.toString();
    } else {
      textSelector.value = "Normal";
    }
  }
});

watch(
  () => props.textEditor,
  () => {
    setEditorContent();
  }
);

onMounted(() => {
  if (props.textEditor) {
    setEditorContent();
  }
});

// 將generateEditorHTML方法暴露出去
defineExpose({
  generateEditorHTML,
});
</script>

<style scoped lang="scss">
#text-editor {
  border: 2px solid darken($terColor, 10%);
  border-radius: 12px;
  height: 300px;
  margin-bottom: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: stretch;
  box-sizing: content-box;
}
:deep(.ProseMirror) {
  box-sizing: border-box;
  padding: 10px;
  overflow: auto;
  min-width: 0;
  height: 248px;
  width: 100%;
  &:focus-visible {
    outline: 0;
    box-shadow: none;
  }

  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: "JetBrainsMono", monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }

    .hljs {
      color: #abb2bf;
      background: #282c34;
    }
    .hljs-keyword,
    .hljs-operator,
    .hljs-pattern-match {
      color: #f92672;
    }
    .hljs-function,
    .hljs-pattern-match .hljs-constructor {
      color: #61aeee;
    }
    .hljs-function .hljs-params {
      color: #a6e22e;
    }
    .hljs-function .hljs-params .hljs-typing {
      color: #fd971f;
    }
    .hljs-module-access .hljs-module {
      color: #7e57c2;
    }
    .hljs-constructor {
      color: #e2b93d;
    }
    .hljs-constructor .hljs-string {
      color: #9ccc65;
    }
    .hljs-comment,
    .hljs-quote {
      color: #b18eb1;
      font-style: italic;
    }
    .hljs-doctag,
    .hljs-formula {
      color: #c678dd;
    }
    .hljs-deletion,
    .hljs-name,
    .hljs-section,
    .hljs-selector-tag,
    .hljs-subst {
      color: #e06c75;
    }
    .hljs-literal {
      color: #56b6c2;
    }
    .hljs-addition,
    .hljs-attribute,
    .hljs-meta .hljs-string,
    .hljs-regexp,
    .hljs-string {
      color: #98c379;
    }
    .hljs-built_in,
    .hljs-class .hljs-title,
    .hljs-title.class_ {
      color: #e6c07b;
    }
    .hljs-attr,
    .hljs-number,
    .hljs-selector-attr,
    .hljs-selector-class,
    .hljs-selector-pseudo,
    .hljs-template-variable,
    .hljs-type,
    .hljs-variable {
      color: #d19a66;
    }
    .hljs-bullet,
    .hljs-link,
    .hljs-meta,
    .hljs-selector-id,
    .hljs-symbol,
    .hljs-title {
      color: #61aeee;
    }
    .hljs-emphasis {
      font-style: italic;
    }
    .hljs-strong {
      font-weight: 700;
    }
    .hljs-link {
      text-decoration: underline;
    }
  }
}
.text-editor-content {
}
.toolbar {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-start;
  padding: 2.5px 5px;
  border-bottom: 2px solid darken($terColor, 10%);
  background-color: lighten($terColor, 5%);
  margin: 0 -2.5px;
  align-items: center;
  box-sizing: border-box;
  min-width: 0;
  flex-wrap: wrap;
  button {
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    margin: 2.5p;
    font-size: 1.5rem;
    color: $secColor;
    @include center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    @extend %ts;
    flex-shrink: 0;
    &:hover {
      background-color: darken($terColor, 10%);
    }
    span {
      color: $secColor;
    }
    &.is-active {
      background-color: $mainColor;
    }
  }
}
#text-selector {
  height: 36px;
  border-radius: 12px;
  padding: 0 10px;
  padding-right: 40px;
  border: 0;
  margin: 2.5px;
  flex-grow: 0;
  width: auto;
  position: relative;
  &:focus-visible {
    outline: 0;
    box-shadow: none;
  }
}
#color-selector {
  display: flex;
  position: relative;
  width: 40px;
  height: 40px;
  @include center;
  border-radius: 12px;
  margin: 0 2.5px;
  cursor: pointer;
  z-index: 1;
  &:hover {
    background-color: darken($terColor, 10%);
  }
  span {
    color: $secColor;
    cursor: pointer;
  }
  input {
    cursor: pointer;
    top: 0;
    left: 0;
    display: none;
    width: 100%;
    height: 100%;
    display: flex;
    opacity: 0;
    position: absolute;
    z-index: 0;
  }
}
</style>
