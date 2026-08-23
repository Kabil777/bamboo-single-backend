import {
  ElementTransformer,
  TextMatchTransformer,
} from "@lexical/markdown";
import {
  $createFootnoteReferenceNode,
  $isFootnoteReferenceNode,
  FootnoteReferenceNode,
} from "../../nodes/footnote/FootnoteReferenceNode";
import {
  $createFootnoteBlockNode,
  $isFootnoteBlockNode,
  FootnoteBlockNode,
} from "../../nodes/footnote/FootnoteBlockNode";
import { ElementNode, LexicalNode, TextNode } from "lexical";

export const FOOTNOTE_REFERENCE: TextMatchTransformer = {
  dependencies: [FootnoteReferenceNode],
  export: (node, exportChildren, exportFormat) => {
    if (!$isFootnoteReferenceNode(node)) {
      return null;
    }
    return `[^${node.getFootnoteId()}]`;
  },
  importRegExp: /\[\^([^\]]+)\]/,
  regExp: /\[\^([^\]]+)\]$/,
  replace: (textNode, match) => {
    const footnoteId = match[1];
    const footnoteNode = $createFootnoteReferenceNode(footnoteId);
    textNode.replace(footnoteNode);
  },
  trigger: "]",
  type: "text-match",
};

export const FOOTNOTE_BLOCK: ElementTransformer = {
  dependencies: [FootnoteBlockNode],
  export: (node: LexicalNode, traverseChildren: (node: ElementNode) => string) => {
    if (!$isFootnoteBlockNode(node)) {
      return null;
    }
    const childrenText = traverseChildren(node);
    return `[^${node.getFootnoteId()}]: ${childrenText}`;
  },
  regExp: /^\[\^([^\]]+)\]:\s+(.*)$/,
  replace: (
    parentNode: ElementNode,
    children: LexicalNode[],
    match: string[],
    isImport: boolean
  ) => {
    const footnoteId = match[1];
    const footnoteNode = $createFootnoteBlockNode(footnoteId);
    
    // The rest of the line (match[2]) is already parsed into children array by Lexical.
    footnoteNode.append(...children);
    
    parentNode.replace(footnoteNode);
    return true;
  },
  type: "element",
};
