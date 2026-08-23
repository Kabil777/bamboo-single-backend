import { SidebarProvider } from "@/components/shadcnUI/sidebar";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex flex-1 flex-col scroll-smooth">
            <SidebarProvider>
                <div className="flex flex-1 w-full">
                    {children}
                </div>
            </SidebarProvider>
        </main>
    )
}