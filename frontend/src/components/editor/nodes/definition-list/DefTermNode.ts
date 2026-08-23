import { DOMConversionMap, DOMExportOutput, ElementNode, LexicalNode, SerializedElementNode, NodeKey } from "lexical";

export type SerializedDefTermNode = SerializedElementNode;

export class DefTermNode extends ElementNode {
  static getType(): string {
    return "def-term";
  }

  static clone(node: DefTermNode): DefTermNode {
    return new DefTermNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("dt");
    dom.classList.add("def-term");
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      dt: (node: Node) => ({
        conversion: convertDefTermElement,
        priority: 0,
      }),
    };
  }

  exportDOM(): DOMExportOutput {
    return { element: this.createDOM() };
  }

  static importJSON(serializedNode: SerializedDefTermNode): DefTermNode {
    return $createDefTermNode();
  }

  exportJSON(): SerializedDefTermNode {
    return {
      ...super.exportJSON(),
      type: "def-term",
      version: 1,
    };
  }

  canBeEmpty(): boolean {
    return false;
  }
}

function convertDefTermElement(domNode: Node) {
  return { node: $createDefTermNode() };
}

export function $createDefTermNode(): DefTermNode {
  return new DefTermNode();
}

export function $isDefTermNode(node: LexicalNode | null | undefined): node is DefTermNode {
  return node instanceof DefTermNode;
}
