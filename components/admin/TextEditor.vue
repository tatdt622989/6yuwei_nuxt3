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
      <select class="form-control" name="" id="">
        <option value="">Normal</option>
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
        <option value="h4">H4</option>
        <option value="h5">H5</option>
        <option value="h6">H6</option>
      </select>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script lang="ts" setup>
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { lowlight } from "lowlight";

lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);

const editor = useEditor({
  content: `
        <p>
          That’s a boring paragraph followed by a fenced code block:
        </p>
        <pre><code class="language-javascript">for (var i=1; i <= 20; i++)
{
  if (i % 15 == 0)
    console.log("FizzBuzz");
  else if (i % 3 == 0)
    console.log("Fizz");
  else if (i % 5 == 0)
    console.log("Buzz");
  else
    console.log(i);
}</code></pre>
        <p>
          Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.
        </p>
      `,
  extensions: [
    StarterKit,
    CodeBlockLowlight.configure({
      lowlight,
    }),
  ],
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
}
:deep(.ProseMirror) {
  box-sizing: border-box;
  padding: 10px;
  overflow: auto;
  min-width: 0;
  height: 248px;
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
.toolbar {
  display: flex;
  justify-content: flex-start;
  padding: 5px 5px;
  border-bottom: 2px solid darken($terColor, 10%);
  background-color: lighten($terColor, 5%);
  margin: 0 -2.5px;
  align-items: center;
  button {
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    margin: 0 2.5px;
    font-size: 1.5rem;
    color: $secColor;
    @include center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
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
</style>
