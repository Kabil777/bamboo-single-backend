import { DOMConversionMap, DOMExportOutput, ElementNode, LexicalNode, SerializedElementNode, NodeKey } from "lexical";

export type SerializedDefItemNode = SerializedElementNode;

export class DefItemNode extends ElementNode {
  static getType(): string {
    return "def-item";
  }

  static clone(node: DefItemNode): DefItemNode {
    return new DefItemNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("dd");
    dom.classList.add("def-item");
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      dd: (node: Node) => ({
        conversion: convertDefItemElement,
        priority: 0,
      }),
    };
  }

  exportDOM(): DOMExportOutput {
    return { element: this.createDOM() };
  }

  static importJSON(serializedNode: SerializedDefItemNode): DefItemNode {
    return $createDefItemNode();
  }

  exportJSON(): SerializedDefItemNode {
    return {
      ...super.exportJSON(),
      type: "def-item",
      version: 1,
    };
  }

  canBeEmpty(): boolean {
    return false;
  }
}

function convertDefItemElement(domNode: Node) {
  return { node: $createDefItemNode() };
}

export function $createDefItemNode(): DefItemNode {
  return new DefItemNode();
}

export function $isDefItemNode(node: LexicalNode | null | undefined): node is DefItemNode {
  return node instanceof DefItemNode;
}
