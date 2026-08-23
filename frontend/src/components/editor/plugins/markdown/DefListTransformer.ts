import { ElementTransformer } from "@lexical/markdown";
import { LexicalNode, ElementNode, $isParagraphNode, ParagraphNode, $createParagraphNode } from "lexical";
import { $createDefListNode, $isDefListNode, DefListNode } from "../../nodes/definition-list/DefListNode";
import { $createDefTermNode, DefTermNode } from "../../nodes/definition-list/DefTermNode";
import { $createDefItemNode, DefItemNode } from "../../nodes/definition-list/DefItemNode";

export const DEF_LIST: ElementTransformer = {
  dependencies: [DefListNode, DefTermNode, DefItemNode],
  export: (node: LexicalNode, traverseChildren: (node: ElementNode) => string) => {
    if (!$isDefListNode(node)) {
      return null;
    }
    
    let output = "";
    const children = node.getChildren();
    
    for (const child of children) {
      if (child.getType() === "def-term") {
        output += traverseChildren(child as ElementNode) + "\n";
      } else if (child.getType() === "def-item") {
        output += ": " + traverseChildren(child as ElementNode) + "\n";
      }
    }
    
    return output;
  },
  regExp: /^:\s+(.*)$/,
  replace: (
    parentNode: ElementNode,
    children: LexicalNode[],
    match: string[],
    isImport: boolean
  ) => {
    // match[1] contains the definition text after the `: `
    const definitionText = match[1];
    
    const previousNode = parentNode.getPreviousSibling();
    
    // Case 1: The previous node is already a DefListNode.
    // We just append this new definition item to it.
    if ($isDefListNode(previousNode)) {
      const defItemNode = $createDefItemNode();
      defItemNode.append(...children);
      
      // If there's no children but there's a match text (for import), we need to handle it.
      if (isImport && children.length === 0 && definitionText) {
         // The markdown importer handles children for us usually, 
         // but if the children array is empty, we must rely on Lexical's internal parsing.
         // Actually, Lexical parses the line into `children` for us (TextNodes).
         // If we clear parentNode, we should just append `children`.
      }
      
      previousNode.append(defItemNode);
      parentNode.remove();
      return true;
    }
    
    // Case 2: The previous node is a ParagraphNode (the term).
    // We create a new DefListNode, convert the previous node to a DefTermNode,
    // and convert the current node to a DefItemNode.
    if ($isParagraphNode(previousNode)) {
      const defListNode = $createDefListNode();
      
      const defTermNode = $createDefTermNode();
      // Move all children from the paragraph to the term
      defTermNode.append(...previousNode.getChildren());
      
      const defItemNode = $createDefItemNode();
      defItemNode.append(...children);
      
      defListNode.append(defTermNode, defItemNode);
      
      previousNode.replace(defListNode);
      parentNode.remove();
      return true;
    }
    
    // If the previous node is neither a DefListNode nor a ParagraphNode,
    // this `: ...` syntax shouldn't form a definition list.
    return false;
  },
  type: "element",
};
