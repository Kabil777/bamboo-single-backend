"use client"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/shadcnUI/collapsible"
import {
  SidebarProvider,
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

export function ArticleTocRail({
  toc,
  onItemClick,
  getHeadingElement,
  scrollContainerSelector,
}: {
  toc: TocItem[]
  onItemClick?: (id: string, e: React.MouseEvent) => void
  getHeadingElement?: (id: string) => HTMLElement | null
  scrollContainerSelector?: string
}) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const visibleItems = toc.slice(0, 20)

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
      className="group/tocrail fixed right-4 xl:right-6 top-1/2 z-[100] hidden w-10 -translate-y-1/2 overflow-visible lg:block"
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
        className="flex w-full cursor-pointer flex-col items-end gap-1.5 rounded-lg py-3 px-1 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
      >
        {visibleItems.map((item) => (
          <span
            key={item.id}
            className={`h-[1.5px] rounded-full transition-all duration-200 ${
              item.depth <= 1
                ? "w-6 bg-foreground/45 group-hover/tocrail:bg-foreground/75"
                : item.depth === 2
                ? "w-4 bg-foreground/35 group-hover/tocrail:bg-foreground/60"
                : "w-2.5 bg-foreground/25 group-hover/tocrail:bg-foreground/45"
            }`}
          />
        ))}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-full top-1/2 z-[101] mr-3.5 w-80 -translate-y-1/2 origin-right rounded-2xl border border-border/60 bg-white/95 p-4.5 shadow-2xl backdrop-blur-xl dark:bg-popover/95 dark:border-border/40"
          >
            <div className="custom-scroll max-h-[calc(100vh-12rem)] overflow-y-auto px-1 pr-1.5">
              <ArticleTableContent
                toc={toc}
                onItemClick={onItemClick}
                getHeadingElement={getHeadingElement}
                scrollContainerSelector={scrollContainerSelector}
              />
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
  onItemClick,
}: {
  item: TocItem
  activeId: string | null
  depth?: number
  onItemClick?: (id: string, e: React.MouseEvent) => void
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
        <SidebarMenuItem className="!w-full min-w-0 !list-none py-0.5">
          <div className="group/tocitem relative flex w-full min-w-0 items-start transition-colors">
            <SidebarMenuButton asChild className="hover:bg-muted/40 focus:!bg-transparent data-[active=true]:bg-transparent active:bg-transparent min-w-0 w-full !h-auto rounded-md px-1.5 py-1">
              <span className="!gap-1.5 flex min-w-0 w-full items-start">
                {/* 4-dot indicator for active items */}
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="mt-1.5 grid size-3 shrink-0 grid-cols-2 gap-[1.5px] p-[0.5px]"
                  >
                    <span className="rounded-[0.5px] bg-foreground" />
                    <span className="rounded-[0.5px] bg-foreground" />
                    <span className="rounded-[0.5px] bg-foreground" />
                    <span className="rounded-[0.5px] bg-foreground" />
                  </span>
                ) : (
                  <span className="w-0 shrink-0" />
                )}

                <Link
                  href={`#${item.id}`}
                  onClick={onItemClick ? (e) => onItemClick(item.id, e) : undefined}
                  className={`
                    block w-full min-w-0 flex-1 text-left whitespace-normal break-words leading-snug
                    transition-all duration-150 ease-out
                    ${
                      depth === 0
                        ? "!text-[13.5px] font-semibold"
                        : depth === 1
                        ? "!text-[13px] font-medium"
                        : "!text-[12.5px] font-normal"
                    }
                    ${
                      isActive
                        ? "text-foreground font-semibold"
                        : depth === 0
                        ? "text-foreground/90 hover:text-foreground"
                        : "text-muted-foreground hover:text-foreground"
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
                      className="mt-0.5 ml-auto rounded p-0.5 flex-shrink-0 text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors duration-150"
                      aria-label={open ? "Collapse" : "Expand"}
                    >
                      <ChevronRight
                        size={13}
                        className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
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
                  duration: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  overflow: "hidden",
                  transformOrigin: "top",
                  willChange: "height",
                }}
              >
                <SidebarMenuSub className="mr-0 min-w-0 overflow-hidden !ml-3.5 !border-l-0 !pl-0 pr-0">
                  {item.items!.map((child) => (
                    <TocItemNode key={child.id} item={child} activeId={activeId} depth={depth + 1} onItemClick={onItemClick} />
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

export const ArticleTableContent = ({
  toc,
  onItemClick,
  getHeadingElement,
  scrollContainerSelector,
}: {
  toc: TocItem[]
  onItemClick?: (id: string, e: React.MouseEvent) => void
  getHeadingElement?: (id: string) => HTMLElement | null
  scrollContainerSelector?: string
}) => {
  const tocTree = buildTocTree(toc)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (toc.length === 0) return

    const headingIds = toc.map((t) => t.id)
    const THRESHOLD = 80 // px: navbar (~80px) + comfortable read offset
    let rafId: number

    const scrollContainer = scrollContainerSelector ? document.querySelector(scrollContainerSelector) : null

    const updateActive = () => {
      const elements = headingIds
        .map((id) => getHeadingElement ? getHeadingElement(id) : document.getElementById(id))
        .filter(Boolean) as HTMLElement[]

      let vh = window.innerHeight
      let offsetTop = 0
      if (scrollContainer) {
        const rect = scrollContainer.getBoundingClientRect()
        vh = rect.height
        offsetTop = rect.top
      }

      // Pick exactly one current section: the last heading above threshold.
      let currentSection: string | null = null
      for (const el of elements) {
        const top = el.getBoundingClientRect().top - offsetTop
        if (top <= THRESHOLD) {
          currentSection = el.id
        } else {
          break
        }
      }

      // If above all headings, use the first visible heading.
      if (!currentSection && elements.length > 0) {
        const firstTop = elements[0].getBoundingClientRect().top - offsetTop
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

    const targetContainer = scrollContainer || window
    targetContainer.addEventListener("scroll", onScroll, { passive: true })
    updateActive() // initial call on mount

    return () => {
      targetContainer.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [toc, getHeadingElement, scrollContainerSelector])

  return (
    <SidebarProvider className="min-h-0 items-start w-full bg-transparent p-0 m-0 [&>div]:bg-transparent [&>div]:p-0 [&>div]:m-0">
      <div className="space-y-0.5 min-w-0 w-full overflow-hidden">
        <SidebarMenu className="min-w-0 gap-0 w-full">
          {tocTree.map((item) => (
            <TocItemNode key={item.id} item={item} activeId={activeId} onItemClick={onItemClick} />
          ))}
        </SidebarMenu>
      </div>
    </SidebarProvider>
  )
}
