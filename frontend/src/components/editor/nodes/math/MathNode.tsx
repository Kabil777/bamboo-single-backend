import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import * as React from "react";
import { Suspense } from "react";

const MathComponent = React.lazy(() => import("./MathComponent"));

export type SerializedMathNode = Spread<
  {
    equation: string;
    inline: boolean;
  },
  SerializedLexicalNode
>;

export class MathNode extends DecoratorNode<React.JSX.Element> {
  __equation: string;
  __inline: boolean;

  static getType(): string {
    return "math";
  }

  static clone(node: MathNode): MathNode {
    return new MathNode(node.__equation, node.__inline, node.__key);
  }

  constructor(equation: string, inline?: boolean, key?: NodeKey) {
    super(key);
    this.__equation = equation;
    this.__inline = inline ?? false;
  }

  static importJSON(serializedNode: SerializedMathNode): MathNode {
    const node = $createMathNode(
      serializedNode.equation,
      serializedNode.inline,
    );
    return node;
  }

  exportJSON(): SerializedMathNode {
    return {
      equation: this.getEquation(),
      inline: this.__inline,
      type: "math",
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement(this.__inline ? "span" : "div");
    element.className = config.theme.math || "editor-math";
    return element;
  }

  updateDOM(prevNode: MathNode, dom: HTMLElement): boolean {
    return this.__inline !== prevNode.__inline;
  }

  getEquation(): string {
    return this.__equation;
  }

  setEquation(equation: string): void {
    const writable = this.getWritable();
    writable.__equation = equation;
  }

  decorate(): React.JSX.Element {
    return (
      <Suspense fallback={null}>
        <MathComponent
          equation={this.__equation}
          inline={this.__inline}
          nodeKey={this.__key}
        />
      </Suspense>
    );
  }
}

export function $createMathNode(equation = "", inline = false): MathNode {
  return new MathNode(equation, inline);
}

export function $isMathNode(
  node: LexicalNode | null | undefined,
): node is MathNode {
  return node instanceof MathNode;
}
