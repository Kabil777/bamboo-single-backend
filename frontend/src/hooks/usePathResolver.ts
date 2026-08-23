import { Docs } from "@/types/docs/docs-base";

export function usePathResolver(doc: Docs, path: string[]) {
    if (path.length === 1 || path[1] === "overview") {
        return {
            title: doc.title,
            // The document row is the only persisted source for the overview.
            // Sidebar entries are navigation-only and must never shadow it.
            content: doc.content,
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
