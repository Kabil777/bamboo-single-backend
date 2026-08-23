// --- Tiptap Core Extensions ---
import { markInputRule, markPasteRule } from "@tiptap/core";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
import { CharacterCount } from "@tiptap/extensions";

// --- Paste/Input rule patterns for markdown-it-ins (++...++) and markdown-it-mark (==...==) ---
const highlightInputRegex = /(?:^|\s)==([^=]+)==$/;
const highlightPasteRegex = /(?:^|\s)==([^=]+)==/g;
const insertedInputRegex = /(?:^|\s)\+\+([^+]+)\+\+$/;
const insertedPasteRegex = /(?:^|\s)\+\+([^+]+)\+\+/g;

/**
 * Highlight extension with paste/input rules for ==marked text==
 */
const HighlightWithMarkdown = Highlight.extend({
  addInputRules() {
    return [
      markInputRule({
        find: highlightInputRegex,
        type: this.type,
      }),
    ];
  },
  addPasteRules() {
    return [
      markPasteRule({
        find: highlightPasteRegex,
        type: this.type,
      }),
    ];
  },
});

/**
 * Underline extension with paste/input rules for ++inserted text++
 */
const UnderlineWithMarkdown = Underline.extend({
  addInputRules() {
    return [
      markInputRule({
        find: insertedInputRegex,
        type: this.type,
      }),
    ];
  },
  addPasteRules() {
    return [
      markPasteRule({
        find: insertedPasteRegex,
        type: this.type,
      }),
    ];
  },
});
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import {
  Table,
  TableCell,
  TableHeader,
  TableKit,
  TableRow,
} from "@tiptap/extension-table";

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension";
import { all, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import java from "highlight.js/lib/languages/java";
import yaml from "highlight.js/lib/languages/yaml";
import xml from "highlight.js/lib/languages/xml";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

const lowlight = createLowlight(all);
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("java", java);
lowlight.register("yaml", yaml);
lowlight.register("xml", xml);
lowlight.register("c", c);
lowlight.register("cpp", cpp);

const extensions = [
  StarterKit.configure({
    link: false,
    codeBlock: false,
  }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  TaskList,
  TaskItem.configure({ nested: true }),
  HighlightWithMarkdown.configure({ multicolor: true }),
  UnderlineWithMarkdown,
  Image,
  Typography,
  Superscript,
  Subscript,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  Selection,
  ImageUploadNode.configure({
    accept: "image/*",
    maxSize: MAX_FILE_SIZE,
    limit: 3,
    upload: handleImageUpload,
    onError: (error) => console.error("Upload failed:", error),
  }),
  CharacterCount,
  TrailingNode,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
    protocols: ["http", "https"],
    shouldAutoLink: (url) => {
      try {
        const parsedUrl = url.includes(":")
          ? new URL(url)
          : new URL(`https://${url}`);
        const disallowedDomains = [
          "example-no-autolink.com",
          "another-no-autolink.com",
        ];
        const domain = parsedUrl.hostname;

        return !disallowedDomains.includes(domain);
      } catch {
        return false;
      }
    },
  }),

  CodeBlockLowlight.configure({
    lowlight,
  }),
];

export default extensions;
