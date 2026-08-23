"use client"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/shadcnUI/collapsible"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub
} from "@/components/shadcnUI/sidebar"
import { ChevronRight } from "lucide-react"
import React, { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"

type TocItem = {
  id: string
  value: string
  depth: number
  items?: TocItem[]
}

export function ArticleTocRail({ toc }: { toc: TocItem[] }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const visibleItems = toc.slice(0, 18)

  const keepOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }

  const closeAfterPointerLeaves = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 220)
  }

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  if (!visibleItems.length) return null

  return (
    <aside
      className="group/tocrail fixed right-5 top-1/2 z-[100] hidden w-9 -translate-y-1/2 overflow-visible lg:block"
      onMouseEnter={keepOpen}
      onMouseLeave={closeAfterPointerLeaves}
      onFocusCapture={keepOpen}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <button
        type="button"
        aria-label="Open table of contents"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer flex-col items-end gap-1.5 rounded-md py-2 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {visibleItems.map((item) => (
          <span
            key={item.id}
            className={`h-px rounded-full bg-foreground/45 transition-colors group-hover/tocrail:bg-foreground/70 ${item.depth <= 1 ? "w-7" : item.depth === 2 ? "w-5" : "w-3"}`}
          />
        ))}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-full top-1/2 z-[101] mr-3 w-72 -translate-y-1/2 origin-right rounded-xl border border-border/70 bg-white p-4 backdrop-blur dark:bg-popover"
          >
            <h2 className="mb-3 text-sm font-bold tracking-tight text-foreground">Table of contents</h2>
            <div className="custom-scroll max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">
              <ArticleTableContent toc={toc} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}

function buildTocTree(flatItems: TocItem[]): TocItem[] {
  const root: TocItem[] = []
  const stack: TocItem[] = []

  flatItems.forEach((item) => {
    const newItem = { ...item, items: [] }
    while (stack.length > 0 && stack[stack.length - 1].depth >= item.depth) {
      stack.pop()
    }
    if (stack.length === 0) {
      root.push(newItem)
    } else {
      stack[stack.length - 1].items!.push(newItem)
    }
    stack.push(newItem)
  })

  return root
}

// ─── Proper React component so hooks are legal ─────────────────────────────
function TocItemNode({
  item,
  activeId,
  depth = 0,
}: {
  item: TocItem
  activeId: string | null
  depth?: number
}) {
  const hasChildren = item.items && item.items.length > 0
  const [open, setOpen] = useState<boolean>(true)
  const isActive = activeId === item.id

  return (
    <Collapsible
      asChild
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible min-w-0 w-full"
    >
      <div>
        <SidebarMenuItem className="!w-full min-w-0 !list-none">
          <div
            className="group/tocitem relative flex w-full min-w-0 items-start transition-colors"
          >
            <SidebarMenuButton asChild className="hover:bg-transparent focus:!bg-transparent data-[active=true]:bg-transparent active:bg-transparent min-w-0 w-full !h-auto">
              <span className="!gap-0 flex min-w-0 w-full items-start !px-0 !py-1.5 pr-1">
                <span aria-hidden="true" className={`mt-1.5 mr-2 grid size-3 shrink-0 grid-cols-2 gap-px p-0.5 transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}>
                  {Array.from({ length: 4 }, (_, index) => <span key={index} className="rounded-[1px] bg-foreground" />)}
                </span>
                <Link
                  href={`#${item.id}`}
                  className={`
                    block w-full min-w-0 flex-1 text-left whitespace-normal break-words leading-snug
                    transition-all duration-200 ease-out
                    ${depth === 0 ? "!text-[15px] font-medium" : "!text-sm font-normal"}
                    ${isActive
                      ? "text-foreground"
                      : "text-foreground/80 hover:text-foreground"
                    }
                  `}
                  title={item.value}
                >
                  {item.value}
                </Link>
                {hasChildren && (
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="mt-0.5 ml-1 rounded-md p-1 flex-shrink-0 hover:bg-muted/50 transition-colors duration-150"
                      aria-label={open ? "Collapse" : "Expand"}
                    >
                      <ChevronRight
                        size={14}
                        className={`text-muted-foreground/50 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
                      />
                    </button>
                  </CollapsibleTrigger>
                )}
              </span>
            </SidebarMenuButton>
          </div>

          {hasChildren && (
            <CollapsibleContent forceMount asChild>
              <motion.div
                initial={false}
                animate={open ? "open" : "closed"}
                variants={{
                  open: { height: "auto", opacity: 1 },
                  closed: { height: 0, opacity: 0 },
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  overflow: "hidden",
                  transformOrigin: "top",
                  willChange: "height",
                }}
              >
                <SidebarMenuSub className="mr-0 min-w-0 overflow-hidden !ml-4 !border-l-0 !pl-0 pr-0">
                  {item.items!.map((child) => (
                    <TocItemNode key={child.id} item={child} activeId={activeId} depth={depth + 1} />
                  ))}
                </SidebarMenuSub>
              </motion.div>
            </CollapsibleContent>
          )}
        </SidebarMenuItem>
      </div>
    </Collapsible>
  )
}

export const ArticleTableContent = ({ toc }: { toc: TocItem[] }) => {
  const tocTree = buildTocTree(toc)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (toc.length === 0) return

    const headingIds = toc.map((t) => t.id)

    const THRESHOLD = 80 // px: navbar (~80px) + comfortable read offset

    let rafId: number

    const updateActive = () => {
      const elements = headingIds
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[]

      const vh = window.innerHeight

      // Pick exactly one current section: the last heading above threshold.
      let currentSection: string | null = null
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= THRESHOLD) {
          currentSection = el.id
        } else {
          break
        }
      }

      // If above all headings, use the first visible heading.
      if (!currentSection && elements.length > 0) {
        const firstTop = elements[0].getBoundingClientRect().top
        if (firstTop < vh * 0.9) {
          currentSection = elements[0].id
        }
      }

      setActiveId((prev) => (prev === currentSection ? prev : currentSection))
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateActive)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    updateActive() // initial call on mount

    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [toc])

  return (
    <div className="space-y-0.5 min-w-0 overflow-hidden">
      <SidebarMenu className="min-w-0 gap-0">
        {tocTree.map((item) => (
          <TocItemNode key={item.id} item={item} activeId={activeId} />
        ))}
      </SidebarMenu>
    </div>
  )
}
