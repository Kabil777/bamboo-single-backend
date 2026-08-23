import * as Y from "yjs";
import { v7 as uuidv7 } from "uuid";
import { useEffect, useState } from "react";

function buildTree(nodes: any[]) {
    const pages = nodes.filter((n) => n.level === 0);
    const subs = nodes.filter((n) => n.level === 1);

    return pages.map((page) => ({
        ...page,
        children: subs.filter((s) => s.parentId === page.id),
    }));
}

export function useDocsTree(provider: any) {
    const [tree, setTree] = useState<any[]>([]);

    useEffect(() => {
        if (!provider) return;

        const ydoc = provider.document;
        const pages = ydoc.getArray("pages") as Y.Array<Y.Map<any>>;

        const ensureOverview = () => {
            const overviewId = provider.configuration?.name?.split(":")?.[2];
            const exists = pages.toArray().some((page: any) => {
                const pageId = page.get("id");
                const title = String(page.get("title") ?? "").trim().toLowerCase();
                return pageId === overviewId || title === "overview";
            });

            if (exists) return;

            ydoc.transact(() => {
                const overview = new Y.Map();
                overview.set("id", overviewId || uuidv7());
                overview.set("title", "Overview");
                overview.set("parentId", null);
                overview.set("level", 0);
                overview.set("order", 0);
                overview.set("isRoot", true);

                pages.unshift([overview]);
            });
        };

        const onSynced = () => {
            ensureOverview();
            provider.off("synced", onSynced);
        };

        if (provider.synced) {
            ensureOverview();
        } else {
            provider.on("synced", onSynced);
        }

        return () => {
            provider.off("synced", ensureOverview);
        };
    }, [provider]);

    useEffect(() => {
        if (!provider) return;
        const ydoc = provider.document;
        const pages = ydoc.getArray("pages");

        const sync = () => {
            const nodes = pages.toArray().map((p: any) => ({
                id: p.get("id"),
                title: p.get("title"),
                parentId: p.get("parentId"),
                level: p.get("level"),
                order: p.get("order"),
            }));
            setTree(buildTree(nodes));
        };

        pages.observeDeep(sync);
        sync();

        return () => pages.unobserveDeep(sync);
    }, [provider]);

    const addPage = (parentId: string | null) => {
        if (!provider) return;
        const ydoc = provider.document;
        const pages = ydoc.getArray("pages");

        ydoc.transact(() => {
            let level = 0;

            if (parentId) {
                const parent = pages
                    .toArray()
                    .find((p: any) => p.get("id") === parentId);
                if (!parent || parent.get("level") === 1) return;
                level = 1;
            }

            const page = new Y.Map();
            page.set("id", uuidv7());
            page.set("title", "Untitled");
            page.set("parentId", parentId);
            page.set("level", level);
            page.set("order", Date.now());

            pages.push([page]);
        });
    };

    const deletePage = (pageId: string) => {
        if (!provider) return;
        const pages = provider.document.getArray("pages");
        const index = pages.toArray().findIndex((p: any) => p.get("id") === pageId);
        if (index !== -1) pages.delete(index, 1);
    };

    return { tree, addPage, deletePage };
}
