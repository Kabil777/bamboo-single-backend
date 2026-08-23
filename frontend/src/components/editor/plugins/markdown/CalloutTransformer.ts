import { MultilineElementTransformer } from "@lexical/markdown";
import { $createCalloutNode, $isCalloutNode, CalloutNode, CalloutType } from "../../nodes/callout-node";
import { LexicalNode, $createParagraphNode, $createTextNode } from "lexical";

export const CALLOUT: MultilineElementTransformer = {
  dependencies: [CalloutNode],
  export: (node: LexicalNode, exportChildren) => {
    if (!$isCalloutNode(node)) {
      return null;
    }
    const type = node.getCalloutType();
    const childrenStr = exportChildren(node);
    return `::: ${type}\n${childrenStr}\n:::`;
  },
  regExpStart: /^:::\s*(warning|info|danger|success|note)\s*$/,
  regExpEnd: {
    regExp: /^:::\s*$/,
  },
  replace: (rootNode, children, startMatch, endMatch, linesInBetween, isImport) => {
    const type = (startMatch[1] as CalloutType) || "warning";
    const calloutNode = $createCalloutNode(type);
    
    if (children && children.length > 0) {
      for (const child of children) {
        calloutNode.append(child);
      }
    } else if (linesInBetween && linesInBetween.length > 0) {
      for (const line of linesInBetween) {
        const p = $createParagraphNode();
        if (line.trim().length > 0) {
          p.append($createTextNode(line));
        }
        calloutNode.append(p);
      }
    } else {
      calloutNode.append($createParagraphNode());
    }

    rootNode.append(calloutNode);
  },
  type: "multiline-element",
};
