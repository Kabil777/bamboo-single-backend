import { addClassNamesToElement } from "@lexical/utils";
import type {
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
} from "lexical";
import { ElementNode, Spread } from "lexical";

export type CalloutType = "warning" | "info" | "danger" | "success" | "note";

export type SerializedCalloutNode = Spread<
  {
    calloutType: CalloutType;
  },
  SerializedElementNode
>;

export class CalloutNode extends ElementNode {
  __calloutType: CalloutType;

  constructor(calloutType: CalloutType, key?: NodeKey) {
    super(key);
    this.__calloutType = calloutType;
  }

  static getType(): string {
    return "callout";
  }

  static clone(node: CalloutNode): CalloutNode {
    return new CalloutNode(node.__calloutType, node.__key);
  }

  getCalloutType(): CalloutType {
    return this.__calloutType;
  }

  setCalloutType(type: CalloutType): void {
    const writable = this.getWritable();
    writable.__calloutType = type;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement("div");
    dom.className = `callout callout-${this.__calloutType}`;
    // Optionally add a theme class if defined in editor-theme.ts
    if (config.theme.callout) {
      addClassNamesToElement(dom, config.theme.callout);
    }
    return dom;
  }

  updateDOM(prevNode: CalloutNode, dom: HTMLElement): boolean {
    if (prevNode.__calloutType !== this.__calloutType) {
      dom.className = `callout callout-${this.__calloutType}`;
    }
    return false;
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const { element } = super.exportDOM(editor);
    if (element && element instanceof HTMLElement) {
      element.className = `callout callout-${this.__calloutType}`;
    }
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (node: Node) => {
        if (node instanceof HTMLElement && node.classList.contains("callout")) {
          let type: CalloutType = "warning";
          if (node.classList.contains("callout-info")) type = "info";
          if (node.classList.contains("callout-danger")) type = "danger";
          if (node.classList.contains("callout-success")) type = "success";
          if (node.classList.contains("callout-note")) type = "note";
          
          return {
            conversion: () => ({ node: $createCalloutNode(type) }),
            priority: 2,
          };
        }
        return null;
      },
    };
  }

  static importJSON(serializedNode: SerializedCalloutNode): CalloutNode {
    const node = $createCalloutNode(serializedNode.calloutType);
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON(): SerializedCalloutNode {
    return {
      ...super.exportJSON(),
      calloutType: this.__calloutType,
      type: "callout",
      version: 1,
    };
  }
}

export function $createCalloutNode(type: CalloutType = "warning"): CalloutNode {
  return new CalloutNode(type);
}

export function $isCalloutNode(
  node: LexicalNode | null | undefined,
): node is CalloutNode {
  return node instanceof CalloutNode;
}
