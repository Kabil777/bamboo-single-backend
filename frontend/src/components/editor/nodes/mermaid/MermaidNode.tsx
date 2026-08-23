import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from "@lexical/react/LexicalDecoratorBlockNode";
import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from "lexical";
import * as React from "react";
import { Suspense } from "react";

const MermaidComponent = React.lazy(() => import("./MermaidComponent"));

export type SerializedMermaidNode = Spread<
  {
    chart: string;
  },
  SerializedDecoratorBlockNode
>;

export class MermaidNode extends DecoratorBlockNode {
  __chart: string;

  static getType(): string {
    return "mermaid";
  }

  static clone(node: MermaidNode): MermaidNode {
    return new MermaidNode(node.__chart, node.__format, node.__key);
  }

  constructor(chart: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__chart = chart;
  }

  static importJSON(serializedNode: SerializedMermaidNode): MermaidNode {
    const node = $createMermaidNode(serializedNode.chart);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedMermaidNode {
    return {
      ...super.exportJSON(),
      chart: this.__chart,
      type: "mermaid",
      version: 1,
    };
  }

  getChart(): string {
    return this.__chart;
  }

  setChart(chart: string): void {
    const writable = this.getWritable();
    writable.__chart = chart;
  }

  decorate(): React.JSX.Element {
    return (
      <Suspense fallback={null}>
        <MermaidComponent
          chart={this.__chart}
          nodeKey={this.__key}
          format={this.__format}
        />
      </Suspense>
    );
  }
}

export function $createMermaidNode(chart = ""): MermaidNode {
  return new MermaidNode(chart);
}

export function $isMermaidNode(
  node: LexicalNode | null | undefined,
): node is MermaidNode {
  return node instanceof MermaidNode;
}
