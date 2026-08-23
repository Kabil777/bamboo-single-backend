import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PhrasingContent, Heading } from "mdast";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function extractTextFromNode(node: PhrasingContent): string {
    if (node.type === "text") return node.value;
    if (node.type === "inlineCode") return node.value;
    if ("children" in node && Array.isArray(node.children)) {
        return node.children.map(extractTextFromNode).join("");
    }
    return "";
}
function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function extractToc(markdown: string) {
    // Tiptap posts are stored as HTML. Extract their headings before falling
    // back to the Markdown parser used by legacy content.
    if (/<h[1-6][\s>]/i.test(markdown)) {
        const toc: { depth: number; value: string; id: string }[] = [];
        const headings = /<h([1-6])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi;
        for (const match of markdown.matchAll(headings)) {
            const value = match[2].replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
            if (value) toc.push({ depth: Number(match[1]), value, id: slugify(value) });
        }
        return toc;
    }
    const tree = unified().use(remarkParse).parse(markdown);

    const toc: { depth: number; value: string; id: string }[] = [];

    visit(tree, "heading", (node: Heading) => {
        const text = node.children.map(extractTextFromNode).join(" ").trim();
        if (!text) return;

        const id = slugify(text);
        toc.push({ depth: node.depth, value: text, id });
    });
    return toc;
}
