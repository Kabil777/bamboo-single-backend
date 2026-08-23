import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread,
  TextNode,
} from "lexical";

export type SerializedFootnoteReferenceNode = Spread<
  {
    footnoteId: string;
  },
  SerializedTextNode
>;

export class FootnoteReferenceNode extends TextNode {
  __footnoteId: string;

  static getType(): string {
    return "footnote-reference";
  }

  static clone(node: FootnoteReferenceNode): FootnoteReferenceNode {
    return new FootnoteReferenceNode(node.__footnoteId, node.__text, node.__key);
  }

  constructor(footnoteId: string, text?: string, key?: NodeKey) {
    super(text ?? `[^${footnoteId}]`, key);
    this.__footnoteId = footnoteId;
  }

  getFootnoteId(): string {
    return this.__footnoteId;
  }

  createDOM(config: any): HTMLElement {
    const dom = document.createElement("sup");
    dom.className = "footnote-ref";
    dom.textContent = `[${this.__footnoteId}]`;
    return dom;
  }

  updateDOM(
    prevNode: FootnoteReferenceNode,
    dom: HTMLElement,
    config: any
  ): boolean {
    const isUpdated = prevNode.__footnoteId !== this.__footnoteId;
    if (isUpdated) {
      dom.textContent = `[${this.__footnoteId}]`;
    }
    return isUpdated;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      sup: (node: Node) => {
        if ((node as HTMLElement).classList.contains("footnote-ref")) {
          return {
            conversion: convertFootnoteReferenceElement,
            priority: 1,
          };
        }
        return null;
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("sup");
    element.className = "footnote-ref";
    element.textContent = `[${this.__footnoteId}]`;
    return { element };
  }

  static importJSON(
    serializedNode: SerializedFootnoteReferenceNode
  ): FootnoteReferenceNode {
    const node = $createFootnoteReferenceNode(serializedNode.footnoteId);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedFootnoteReferenceNode {
    return {
      ...super.exportJSON(),
      footnoteId: this.__footnoteId,
      type: "footnote-reference",
      version: 1,
    };
  }
}

function convertFootnoteReferenceElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const textContent = domNode.textContent;
  if (textContent !== null) {
    // extract "1" from "[1]"
    const match = textContent.match(/\[(.*?)\]/);
    if (match) {
      const node = $createFootnoteReferenceNode(match[1]);
      return { node };
    }
  }
  return null;
}

export function $createFootnoteReferenceNode(
  footnoteId: string
): FootnoteReferenceNode {
  const node = new FootnoteReferenceNode(footnoteId);
  node.setMode("token"); // treat as a single token so it's deleted as a unit
  return node;
}

export function $isFootnoteReferenceNode(
  node: LexicalNode | null | undefined
): node is FootnoteReferenceNode {
  return node instanceof FootnoteReferenceNode;
}
