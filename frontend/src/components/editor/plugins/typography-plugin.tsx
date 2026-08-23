import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { TextNode, $createTextNode } from "lexical";
import { $isCodeNode } from "@lexical/code";

const TYPOGRAPHIC_REPLACEMENTS = [
  { regex: /\([cC]\)/g, replacement: "©" },
  { regex: /\([rR]\)/g, replacement: "®" },
  { regex: /\([tT][mM]\)/g, replacement: "™" },
  { regex: /\+-/g, replacement: "±" },
  { regex: /---/g, replacement: "—" }, // em-dash
  { regex: /--/g, replacement: "–" }, // en-dash
  { regex: /\.{2,}/g, replacement: "…" }, // ellipsis
  { regex: /!{4,}/g, replacement: "!!!" }, // collapse !
  { regex: /\?{4,}/g, replacement: "???" }, // collapse ?
  { regex: /,,/g, replacement: "," }, // collapse ,
];

export function TypographyPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (textNode) => {
      // Ignore text nodes that are inside a CodeNode block
      let node = textNode;
      while (node) {
        if ($isCodeNode(node)) return;
        node = node.getParent() as any;
      }

      const text = textNode.getTextContent();
      let newText = text;

      // Apply all typographic replacements
      for (const { regex, replacement } of TYPOGRAPHIC_REPLACEMENTS) {
        newText = newText.replace(regex, replacement);
      }

      if (newText !== text) {
        textNode.setTextContent(newText);
      }
    });
  }, [editor]);

  return null;
}
