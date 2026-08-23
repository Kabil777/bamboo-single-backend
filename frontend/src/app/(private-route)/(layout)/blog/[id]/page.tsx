import { BlogRenderPage } from "@/components/ui";

export default async function Blog({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <BlogRenderPage id={id} />
  );
}
