import { EditorSidebar } from "@/components/atomsComponents/EditorSidebar";
import { SidebarProvider } from "@/components/shadcnUI/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EditorSidebar />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </>
  )
}

