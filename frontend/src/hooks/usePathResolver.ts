import { Docs } from "@/types/docs/docs-base";

export function usePathResolver(doc: Docs, path: string[]) {
    if (path.length === 1 || path[1] === "overview") {
        const overviewNode = doc.tree.find(
            (node) =>
                node.id === doc.id ||
                node.id === "overview" ||
                node.title?.trim().toLowerCase() === "overview",
        );
        return {
            title: doc.title,
            content: overviewNode?.content ?? doc.content,
            isOverview: true,
        };
    }

    let current = doc.tree;
    let node;

    for (let i = 1; i < path.length; i++) {
        node = current.find((n) => n.id === path[i]);
        if (!node) break;
        current = node.subTree;
    }

    return {
        title: node?.title ?? doc.title,
        content: node?.content ?? doc.content,
        isOverview: false,
    };
}
