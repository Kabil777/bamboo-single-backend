import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  ElementNode,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
} from "lexical";

export type SerializedFootnoteBlockNode = Spread<
  {
    footnoteId: string;
  },
  SerializedElementNode
>;

export class FootnoteBlockNode extends ElementNode {
  __footnoteId: string;

  static getType(): string {
    return "footnote-block";
  }

  static clone(node: FootnoteBlockNode): FootnoteBlockNode {
    return new FootnoteBlockNode(node.__footnoteId, node.__key);
  }

  constructor(footnoteId: string, key?: NodeKey) {
    super(key);
    this.__footnoteId = footnoteId;
  }

  getFootnoteId(): string {
    return this.__footnoteId;
  }

  setFootnoteId(footnoteId: string): void {
    const writable = this.getWritable();
    writable.__footnoteId = footnoteId;
  }

  createDOM(config: any): HTMLElement {
    const dom = document.createElement("div");
    dom.className = "footnote-block";
    dom.setAttribute("data-footnote-id", this.__footnoteId);
    
    // Create a label element for the footnote identifier
    const label = document.createElement("span");
    label.className = "footnote-block-label";
    label.textContent = `[^${this.__footnoteId}]: `;
    label.contentEditable = "false";
    label.style.userSelect = "none";
    
    dom.appendChild(label);
    
    return dom;
  }

  updateDOM(
    prevNode: FootnoteBlockNode,
    dom: HTMLElement,
    config: any
  ): boolean {
    const isUpdated = prevNode.__footnoteId !== this.__footnoteId;
    if (isUpdated) {
      dom.setAttribute("data-footnote-id", this.__footnoteId);
      const label = dom.querySelector(".footnote-block-label");
      if (label) {
        label.textContent = `[^${this.__footnoteId}]: `;
      }
    }
    return false; // returning false tells Lexical not to rebuild the DOM node unless necessary
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (node: Node) => {
        if (
          node instanceof HTMLElement &&
          node.classList.contains("footnote-block")
        ) {
          return {
            conversion: convertFootnoteBlockElement,
            priority: 1,
          };
        }
        return null;
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = this.createDOM({});
    return { element };
  }

  static importJSON(
    serializedNode: SerializedFootnoteBlockNode
  ): FootnoteBlockNode {
    const node = $createFootnoteBlockNode(serializedNode.footnoteId);
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON(): SerializedFootnoteBlockNode {
    return {
      ...super.exportJSON(),
      footnoteId: this.__footnoteId,
      type: "footnote-block",
      version: 1,
    };
  }
}

function convertFootnoteBlockElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const footnoteId = domNode.getAttribute("data-footnote-id");
  if (footnoteId) {
    const node = $createFootnoteBlockNode(footnoteId);
    return { node };
  }
  return null;
}

export function $createFootnoteBlockNode(
  footnoteId: string
): FootnoteBlockNode {
  return new FootnoteBlockNode(footnoteId);
}

export function $isFootnoteBlockNode(
  node: LexicalNode | null | undefined
): node is FootnoteBlockNode {
  return node instanceof FootnoteBlockNode;
}
