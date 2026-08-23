import { DOMConversionMap, DOMExportOutput, ElementNode, LexicalNode, SerializedElementNode, NodeKey } from "lexical";

export type SerializedDefListNode = SerializedElementNode;

export class DefListNode extends ElementNode {
  static getType(): string {
    return "def-list";
  }

  static clone(node: DefListNode): DefListNode {
    return new DefListNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("dl");
    dom.classList.add("def-list");
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      dl: (node: Node) => ({
        conversion: convertDefListElement,
        priority: 0,
      }),
    };
  }

  exportDOM(): DOMExportOutput {
    return { element: this.createDOM() };
  }

  static importJSON(serializedNode: SerializedDefListNode): DefListNode {
    return $createDefListNode();
  }

  exportJSON(): SerializedDefListNode {
    return {
      ...super.exportJSON(),
      type: "def-list",
      version: 1,
    };
  }
}

function convertDefListElement(domNode: Node) {
  return { node: $createDefListNode() };
}

export function $createDefListNode(): DefListNode {
  return new DefListNode();
}

export function $isDefListNode(node: LexicalNode | null | undefined): node is DefListNode {
  return node instanceof DefListNode;
}
