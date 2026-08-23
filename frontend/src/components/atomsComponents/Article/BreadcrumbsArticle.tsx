import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/shadcnUI/breadcrumb";
import { DocsTreeNode } from "@/types/docs/docs-base";
import Link from "next/link";
import React, { useMemo } from "react";


export function BreadcrumbsArticle({ docId, doc, id }: { docId: string, doc: any, id: string[] }) {
    /** Get breadcrumbs trail for current path */
    function getBreadcrumbs(
        nodes: DocsTreeNode[],
        pathIds: string[],
    ): { title: string; id: string }[] {
        const result: { title: string; id: string }[] = [];
        let current = nodes;

        for (const pathId of pathIds) {
            const node = current.find((n) => n.id === pathId);
            if (!node) break;
            result.push({ title: node.title, id: node.id });
            current = node.subTree || [];
        }

        return result;
    }
    const breadcrumbs = useMemo(() => {
        if (!doc || !doc.tree) return [];
        // Path starts from id[1] as id[0] is the main doc ID
        return getBreadcrumbs(doc.tree, id.slice(1));
    }, [doc, id]);
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Link href={`/docs/${docId}`}>{doc.title}</Link>
                </BreadcrumbItem>
                {breadcrumbs.map((bc, idx) => (
                    <React.Fragment key={bc.id}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {idx === breadcrumbs.length - 1 ? (
                                <BreadcrumbPage>{bc.title}</BreadcrumbPage>
                            ) : (
                                <Link href={`/docs/${docId}/${id.slice(1, idx + 2).join("/")}`}>
                                    {bc.title}
                                </Link>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}