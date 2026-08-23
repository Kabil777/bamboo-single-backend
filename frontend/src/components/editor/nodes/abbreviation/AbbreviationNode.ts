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

export type SerializedAbbreviationNode = Spread<
  {
    title: string;
  },
  SerializedTextNode
>;

export class AbbreviationNode extends TextNode {
  __title: string;

  static getType(): string {
    return "abbreviation";
  }

  static clone(node: AbbreviationNode): AbbreviationNode {
    return new AbbreviationNode(node.__text, node.__title, node.__key);
  }

  constructor(text: string, title: string, key?: NodeKey) {
    super(text, key);
    this.__title = title;
  }

  getTitle(): string {
    return this.__title;
  }

  createDOM(config: any): HTMLElement {
    const dom = document.createElement("abbr");
    dom.title = this.__title;
    dom.className = "abbreviation-node";
    dom.textContent = this.__text;
    return dom;
  }

  updateDOM(
    prevNode: this,
    dom: HTMLElement,
    config: any
  ): boolean {
    const isUpdated =
      super.updateDOM(prevNode, dom, config) ||
      prevNode.__title !== this.__title;
    if (isUpdated) {
      dom.title = this.__title;
    }
    return isUpdated;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      abbr: (node: Node) => {
        return {
          conversion: convertAbbreviationElement,
          priority: 1,
        };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("abbr");
    element.title = this.__title;
    element.className = "abbreviation-node";
    element.textContent = this.__text;
    return { element };
  }

  static importJSON(
    serializedNode: SerializedAbbreviationNode
  ): AbbreviationNode {
    const node = $createAbbreviationNode(serializedNode.text, serializedNode.title);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedAbbreviationNode {
    return {
      ...super.exportJSON(),
      title: this.__title,
      type: "abbreviation",
      version: 1,
    };
  }
}

function convertAbbreviationElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const textContent = domNode.textContent;
  const title = domNode.getAttribute("title");
  if (textContent !== null && title !== null) {
    const node = $createAbbreviationNode(textContent, title);
    return { node };
  }
  return null;
}

export function $createAbbreviationNode(
  text: string,
  title: string
): AbbreviationNode {
  const node = new AbbreviationNode(text, title);
  node.setMode("token");
  return node;
}

export function $isAbbreviationNode(
  node: LexicalNode | null | undefined
): node is AbbreviationNode {
  return node instanceof AbbreviationNode;
}
