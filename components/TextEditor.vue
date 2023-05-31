<template>
  <div class="text-editor">
    <editor-content :editor="editor" />
  </div>
</template>

<script lang="ts" setup>
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import Link from '@tiptap/extension-link';
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import HardBreak from "@tiptap/extension-hard-break";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Editor, EditorContent } from "@tiptap/vue-3";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { lowlight } from "lowlight";

HardBreak.configure({
  keepMarks: false,
});

lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);

const props = defineProps({
  importData: {
    type: String,
    default: "",
  },
});
const editor = ref<any | null>(null);

onMounted(() => {
  editor.value = new Editor({
    editable: false,
    content: props.importData ?? "",
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
      Link.configure({
        protocols: ['ftp', 'mailto'],
      }),
      BulletList,
      ListItem,
      OrderedList,
    ],
  });
});
</script>

<style lang="scss" scoped>
.text-editor {
  padding: 60px 0 40px;
  line-height: 1.7;
  letter-spacing: 1px;
  color: $secColor;
  font-size: 18px;

  :deep(.ProseMirror) {
    h2 {
      font-size: 24px;
    }

    &:focus-visible {
      outline: 0;
      box-shadow: none;
    }

    ul,
    ol {
      padding: 0 1rem;
    }

    ul {
      list-style: disc;
    }

    a {
      color: darken($mainColor, 10%);
      &:hover {
        color: $mainColor;
      }
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
}
</style>