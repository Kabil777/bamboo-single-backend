import { TextFormatTransformer } from "@lexical/markdown";

export const MARK_TRANSFORMER: TextFormatTransformer = {
    format: ["highlight"],
    tag: "==",
    type: "text-format",
};

export const INSERT_TRANSFORMER: TextFormatTransformer = {
    format: ["underline"],
    tag: "++",
    type: "text-format",
};

export const SUBSCRIPT_TRANSFORMER: TextFormatTransformer = {
    format: ["subscript"],
    tag: "~",
    type: "text-format",
};

export const SUPERSCRIPT_TRANSFORMER: TextFormatTransformer = {
    format: ["superscript"],
    tag: "^",
    type: "text-format",
};

export const CUSTOM_TEXT_FORMAT_TRANSFORMERS = [
    MARK_TRANSFORMER,
    INSERT_TRANSFORMER,
    SUBSCRIPT_TRANSFORMER,
    SUPERSCRIPT_TRANSFORMER,
];
