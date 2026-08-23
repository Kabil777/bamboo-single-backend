import { TextMatchTransformer } from "@lexical/markdown";
import {
  $createAbbreviationNode,
  $isAbbreviationNode,
  AbbreviationNode,
} from "../../nodes/abbreviation/AbbreviationNode";

// Custom syntax for abbreviations: ~![text](title)!~
export const ABBREVIATION: TextMatchTransformer = {
  dependencies: [AbbreviationNode],
  export: (node, exportChildren, exportFormat) => {
    if (!$isAbbreviationNode(node)) {
      return null;
    }
    return `~![${node.getTextContent()}](${node.getTitle()})!~`;
  },
  importRegExp: /~!\[(.*?)\]\((.*?)\)!~/,
  regExp: /~!\[(.*?)\]\((.*?)\)!~$/,
  replace: (textNode, match) => {
    const text = match[1];
    const title = match[2];
    const abbrNode = $createAbbreviationNode(text, title);
    textNode.replace(abbrNode);
  },
  trigger: "~",
  type: "text-match",
};
