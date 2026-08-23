import {
  ElementTransformer,
} from "@lexical/markdown";
import { $createMermaidNode, $isMermaidNode, MermaidNode } from "../../nodes/mermaid/MermaidNode";

export const MERMAID_BLOCK: ElementTransformer = {
  dependencies: [MermaidNode],
  export: (node, exportChildren, exportFormat) => {
    if (!$isMermaidNode(node)) {
      return null;
    }
    return `\`\`\`mermaid\n${node.getChart()}\n\`\`\``;
  },
  regExp: /^```mermaid\s*\n([\s\S]*?)\n```$/,
  replace: (parentNode, children, match, isImport) => {
    const chart = match[1];
    const mermaidNode = $createMermaidNode(chart);
    parentNode.replace(mermaidNode);
  },
  type: "element",
};
