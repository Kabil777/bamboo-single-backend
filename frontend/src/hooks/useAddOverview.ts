import { Docs } from "@/types/docs/docs-base";

export default function injectOverview(
    docId: string,
    tree: Docs["tree"],
    content: string,
): Docs["tree"] {
    const hasOverview = tree.some(
        (n) =>
            n.id === docId ||
            n.id === "overview" ||
            n.title?.trim().toLowerCase() === "overview",
    );

    if (hasOverview) return tree;

    return [
        {
            id: docId,
            title: "Overview",
            content: content,
            subTree: [],
        },
        ...tree,
    ];
}
