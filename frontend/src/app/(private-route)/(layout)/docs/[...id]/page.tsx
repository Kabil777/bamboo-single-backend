
import { DocsRenderPage } from "@/components/ui";

export default async function DocsReadPage({ params }: { params: { id: string[] } }) {
    const { id } = await params;
    return <DocsRenderPage id={id} />;
}
