import {
  TextMatchTransformer,
} from "@lexical/markdown";
import { $createMathNode, $isMathNode, MathNode } from "../../nodes/math/MathNode";

export const MATH_INLINE: TextMatchTransformer = {
  dependencies: [MathNode],
  export: (node, exportChildren, exportFormat) => {
    if (!$isMathNode(node)) {
      return null;
    }
    return `$${node.getEquation()}$`;
  },
  importRegExp: /\$([^$]+?)\$/,
  regExp: /\$([^$]+?)\$$/,
  replace: (textNode, match) => {
    const equation = match[1];
    const mathNode = $createMathNode(equation, true);
    textNode.replace(mathNode);
  },
  trigger: "$",
  type: "text-match",
};

export const MATH_BLOCK: TextMatchTransformer = {
  dependencies: [MathNode],
  export: (node, exportChildren, exportFormat) => {
    if (!$isMathNode(node)) {
      return null;
    }
    return `$$${node.getEquation()}$$`;
  },
  importRegExp: /\$\$([^$]+?)\$\$/,
  regExp: /\$\$([^$]+?)\$\$$/,
  replace: (textNode, match) => {
    const equation = match[1];
    const mathNode = $createMathNode(equation, false);
    textNode.replace(mathNode);
  },
  trigger: "$",
  type: "text-match",
};
