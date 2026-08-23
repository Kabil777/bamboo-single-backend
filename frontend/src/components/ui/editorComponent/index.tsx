"use client";

import "highlight.js/styles/tokyo-night-dark.css";
import "@/styles/syntax.css";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoFocusExtension, ClearEditorExtension, DecoratorTextExtension, HorizontalRuleExtension, SelectionAlwaysOnDisplayExtension } from "@lexical/extension";
import { AutoLinkExtension, ClickableLinkExtension, LinkExtension } from "@lexical/link";
import { CheckListExtension, ListExtension } from "@lexical/list";
import { $convertToMarkdownString, $convertFromMarkdownString, CHECK_LIST, ELEMENT_TRANSFORMERS, MULTILINE_ELEMENT_TRANSFORMERS, TEXT_FORMAT_TRANSFORMERS, TEXT_MATCH_TRANSFORMERS } from "@lexical/markdown";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OverflowNode } from "@lexical/overflow";
import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { MathNode } from "@/components/editor/nodes/math/MathNode";
import { MermaidNode } from "@/components/editor/nodes/mermaid/MermaidNode";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { RichTextExtension } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { type EditorState, type SerializedEditorState, configExtension, defineExtension, $getRoot } from "lexical";
import { useMemo, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { Doc } from "yjs";
import { CollaborationPluginV2__EXPERIMENTAL as CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { LexicalCollaboration } from "@lexical/react/LexicalCollaborationContext";
import { TableOfContentsPlugin } from "@lexical/react/LexicalTableOfContentsPlugin";
import { ArticleTocRail } from "@/components/atomsComponents/Article/articleTableContent";
import { getBaseOptions } from "@/components/editor/plugins/picker";

import { cn } from "@/lib/utils";

import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { DateTimeExtension } from "@/components/editor/extensions/date-time-extension";
import { EmojisExtension } from "@/components/editor/extensions/emojis-extension";
import { ImagesExtension } from "@/components/editor/extensions/images-extension";
import { MarkdownShortcutsExtension } from "@/components/editor/extensions/markdown-shortcuts-extension";
import { MaxLengthExtension } from "@/components/editor/extensions/max-length-extension";
import { AutocompleteNode } from "@/components/editor/nodes/autocomplete-node";
import { TweetNode } from "@/components/editor/nodes/embeds/tweet-node";
import { YouTubeNode } from "@/components/editor/nodes/embeds/youtube-node";
import { EmojiNode } from "@/components/editor/nodes/emoji-node";
import { LayoutContainerNode } from "@/components/editor/nodes/layout-container-node";
import { LayoutItemNode } from "@/components/editor/nodes/layout-item-node";
import { MentionNode } from "@/components/editor/nodes/mention-node";
import { SpecialTextNode } from "@/components/editor/nodes/special-text-node";
import { CalloutNode } from "@/components/editor/nodes/callout-node";
import { DefListNode } from "@/components/editor/nodes/definition-list/DefListNode";
import { DefTermNode } from "@/components/editor/nodes/definition-list/DefTermNode";
import { DefItemNode } from "@/components/editor/nodes/definition-list/DefItemNode";
import { FootnoteReferenceNode } from "@/components/editor/nodes/footnote/FootnoteReferenceNode";
import { FootnoteBlockNode } from "@/components/editor/nodes/footnote/FootnoteBlockNode";
import { AbbreviationNode } from "@/components/editor/nodes/abbreviation/AbbreviationNode";
import { AutoCompletePlugin } from "@/components/editor/plugins/auto-complete-plugin";
import { CodeActionMenuPlugin } from "@/components/editor/plugins/code-action-menu-plugin";
import { CodeHighlightPlugin } from "@/components/editor/plugins/code-highlight-plugin";
import { TypographyPlugin } from "@/components/editor/plugins/typography-plugin";
import { ComponentPickerMenuPlugin } from "@/components/editor/plugins/component-picker-menu-plugin";
import { ContextMenuPlugin } from "@/components/editor/plugins/context-menu-plugin";
import { DraggableBlockPlugin } from "@/components/editor/plugins/draggable-block-plugin";
import { AutoEmbedPlugin } from "@/components/editor/plugins/embeds/auto-embed-plugin";
import { TwitterPlugin } from "@/components/editor/plugins/embeds/twitter-plugin";
import { YouTubePlugin } from "@/components/editor/plugins/embeds/youtube-plugin";
import { EmojiPickerPlugin } from "@/components/editor/plugins/emoji-picker-plugin";
import { FloatingLinkEditorPlugin } from "@/components/editor/plugins/floating-link-editor-plugin";
import { FloatingTextFormatToolbarPlugin } from "@/components/editor/plugins/floating-text-format-plugin";
import { LayoutPlugin } from "@/components/editor/plugins/layout-plugin";
import { MentionsPlugin } from "@/components/editor/plugins/mentions-plugin";
import { SpecialTextPlugin } from "@/components/editor/plugins/special-text-plugin";
import { TabFocusPlugin } from "@/components/editor/plugins/tab-focus-plugin";
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";

import { InsertColumnsLayout } from "@/components/editor/plugins/toolbar/block-insert/insert-columns-layout";
import { InsertEmbeds } from "@/components/editor/plugins/toolbar/block-insert/insert-embeds";
import { InsertHorizontalRule } from "@/components/editor/plugins/toolbar/block-insert/insert-horizontal-rule";
import { InsertImage } from "@/components/editor/plugins/toolbar/block-insert/insert-image";
import { TableHoverPlugin } from "@/components/editor/plugins/toolbar/table-hover-plugin";
import { ClearFormattingToolbarPlugin } from "@/components/editor/plugins/toolbar/clear-formatting-toolbar-plugin";
import { CodeLanguageToolbarPlugin } from "@/components/editor/plugins/toolbar/code-language-toolbar-plugin";
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin";
import { FontBackgroundToolbarPlugin } from "@/components/editor/plugins/toolbar/font-background-toolbar-plugin";
import { FontColorToolbarPlugin } from "@/components/editor/plugins/toolbar/font-color-toolbar-plugin";
import { FontFamilyToolbarPlugin } from "@/components/editor/plugins/toolbar/font-family-toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin";
import { FontSizeToolbarPlugin } from "@/components/editor/plugins/toolbar/font-size-toolbar-plugin";
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin";
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin";
import { SubSuperToolbarPlugin } from "@/components/editor/plugins/toolbar/subsuper-toolbar-plugin";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { EMOJI } from "@/components/editor/transformers/markdown-emoji-transformer";
import { HR } from "@/components/editor/transformers/markdown-hr-transformer";
import { IMAGE } from "@/components/editor/transformers/markdown-image-transformer";
import { TABLE } from "@/components/editor/transformers/markdown-table-transformer";
import { TWEET } from "@/components/editor/transformers/markdown-tweet-transformer";
import { CALLOUT } from "@/components/editor/plugins/markdown/CalloutTransformer";
import { DEF_LIST } from "@/components/editor/plugins/markdown/DefListTransformer";
import { FOOTNOTE_REFERENCE, FOOTNOTE_BLOCK } from "@/components/editor/plugins/markdown/FootnoteTransformer";
import { ABBREVIATION } from "@/components/editor/plugins/markdown/AbbreviationTransformer";
import { MATH_INLINE, MATH_BLOCK } from "@/components/editor/plugins/markdown/MathTransformer";
import { MERMAID_BLOCK } from "@/components/editor/plugins/markdown/MermaidTransformer";
import { CUSTOM_TEXT_FORMAT_TRANSFORMERS } from "@/components/editor/plugins/markdown/TextFormatTransformers";
import { preprocessMarkdown } from "@/components/editor/utils/markdown-preprocessor";
import { validateUrl } from "@/components/editor/utils/url";
import { Separator } from "@/components/shadcnUI/separator";
import { TooltipProvider } from "@/components/shadcnUI/tooltip";
import { motion } from "framer-motion";

import { ToolBarBottom } from "@/components/atomsComponents/toolBarBottom";
import { useCollaborativeAwareness } from "@/hooks/useCollabrationAwareness";
import { useCollabUser } from "@/hooks/useCollabUser";
import { useDocsMetaProvider } from "@/hooks/useDocsMetaProvider";
import { useHocuspocusProvider } from "@/lib/hocuspocus";
import type { CollabRoomType } from "@/lib/collabRoomName";

const placeholder = "Start typing...";
const maxLength = 100000;

type InvitedUser = {
    userId?: string;
    email?: string | null;
    name?: string | null;
    handle?: string | null;
    coverUrl?: string | null;
    role: "owner" | "can edit" | "can view";
};

type PublishVisibility = "PUBLIC" | "PRIVATE";
type PublishStatus = "PUBLISHED";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuidLike(value: string | null | undefined): value is string {
    return typeof value === "string" && UUID_PATTERN.test(value.trim());
}

function markSaveRequested(
    document: Doc,
    requestedAt: number,
    visibility: PublishVisibility,
    status: PublishStatus,
) {
    const meta = document.getMap("meta");
    document.transact(() => {
        meta.set("saveRequestedAt", requestedAt);
        meta.set("publishVisibility", visibility);
        meta.set("publishStatus", status);
    });
}

const PLAYGROUND_TRANSFORMERS = [
    TABLE, HR, IMAGE, EMOJI, TWEET, CHECK_LIST, CALLOUT, DEF_LIST, FOOTNOTE_BLOCK,
    ...ELEMENT_TRANSFORMERS,
    ...MULTILINE_ELEMENT_TRANSFORMERS,
    FOOTNOTE_REFERENCE,
    ABBREVIATION,
    MATH_INLINE,
    MATH_BLOCK,
    MERMAID_BLOCK,
    ...CUSTOM_TEXT_FORMAT_TRANSFORMERS,
    ...TEXT_FORMAT_TRANSFORMERS,
    ...TEXT_MATCH_TRANSFORMERS,
];

function MarkdownImportPlugin({ setOnImportContent }: { setOnImportContent: (fn: (content: string) => void) => void }) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        setOnImportContent(() => (markdown: string) => {
            const preprocessed = preprocessMarkdown(markdown);
            editor.update(() => {
                $convertFromMarkdownString(preprocessed, PLAYGROUND_TRANSFORMERS);
            });
        });
    }, [editor, setOnImportContent]);
    return null;
}

export default function Editor({
    idContent,
    save,
    resourceType,
    resourceId,
}: {
    idContent: string;
    save: (visibility: "PUBLIC" | "PRIVATE") => void | Promise<void>;
    resourceType: "blog" | "docs";
    resourceId: string;
}) {
    const roomType: CollabRoomType = resourceType === "blog" ? "blog" : "docs-page";
    const [importMarkdownFn, setImportMarkdownFn] = useState<((markdown: string) => void) | undefined>();
    const collabUser = useCollabUser();

    const provider = useHocuspocusProvider(
        idContent,
        roomType,
        resourceType === "docs" ? resourceId : undefined,
    );
    const sidebarProvider = resourceType === "docs" ? useDocsMetaProvider(resourceId) : null;

    const awarenessProvider = resourceType === "docs" ? sidebarProvider : provider;
    const awarenessLocation = resourceType === "docs" ? "sidebar" : "editor";

    const { onlineUsers, totalUsers } = useCollaborativeAwareness(
        awarenessProvider,
        {
            userId: collabUser.id,
            name: collabUser.name,
            color: collabUser.color,
        },
        awarenessLocation,
        { suppressNotifications: true },
    );

    const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
    const [word, setWord] = useState(0);
    const [synced, setSynced] = useState(false);
    const lastSaveStatusRef = useRef<string | null>(null);
    const pendingSaveRequestRef = useRef<number | null>(null);
    const lastHandledPersistedAtRef = useRef<number | null>(null);

    useEffect(() => {
        if (!provider) return;

        const meta = provider.document.getMap("meta");
        lastSaveStatusRef.current = typeof meta.get("saveStatus") === "string" ? String(meta.get("saveStatus")) : null;

        const observer = () => {
            const nextStatusRaw = meta.get("saveStatus");
            const nextStatus = typeof nextStatusRaw === "string" ? nextStatusRaw : null;
            const previousStatus = lastSaveStatusRef.current;
            lastSaveStatusRef.current = nextStatus;
            const persistedAtRaw = meta.get("lastPersistedAt");
            const persistedAt = typeof persistedAtRaw === "number" ? persistedAtRaw : null;

            if (nextStatus === previousStatus) return;

            if (
                nextStatus === "SAVED" &&
                pendingSaveRequestRef.current != null &&
                persistedAt != null &&
                persistedAt >= pendingSaveRequestRef.current &&
                persistedAt !== lastHandledPersistedAtRef.current
            ) {
                lastHandledPersistedAtRef.current = persistedAt;
                pendingSaveRequestRef.current = null;
                toast.success("Saved successfully");
            }
            if (nextStatus === "FAILED") {
                pendingSaveRequestRef.current = null;
                toast.error("Save failed. Try again.");
            }
        };
        meta.observe(observer);
        return () => {
            meta.unobserve(observer);
        };
    }, [provider]);

    useEffect(() => {
        if (!provider) {
            setSynced(false);
            return;
        }
        if (provider.synced) {
            setSynced(true);
            return;
        }
        const handleSynced = () => setSynced(true);
        provider.on("synced", handleSynced);
        return () => {
            provider.off("synced", handleSynced);
        };
    }, [provider]);

    const onSave = async (visibility: PublishVisibility) => {
        if (!provider || !provider.document) {
            toast.warning("Service unavailable");
            return;
        }
        if (!synced) {
            toast.warning("Document is still syncing");
            return;
        }
        if (!isUuidLike(resourceId) || !isUuidLike(idContent)) {
            toast.error("Invalid editor state");
            return;
        }
        if (pendingSaveRequestRef.current != null) {
            toast.info("Save already in progress");
            return;
        }

        try {
            pendingSaveRequestRef.current = Date.now();
            await save(visibility);
            toast.success("Saved successfully");
        } catch (error) {
            // Error toast is already handled inside the save() prop implementations, 
            // but we can catch it here just in case.
        } finally {
            pendingSaveRequestRef.current = null;
        }
    };

    const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
    const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    const AppExtension = useMemo(
        () =>
            defineExtension({
                dependencies: [
                    RichTextExtension,
                    AutoFocusExtension,
                    SelectionAlwaysOnDisplayExtension,
                    configExtension(LinkExtension, {
                        validateUrl,
                        attributes: { rel: "noopener noreferrer", target: "_blank" },
                    }),
                    AutoLinkExtension,
                    ClickableLinkExtension,
                    configExtension(MaxLengthExtension, { disabled: false, maxLength }),
                    configExtension(MarkdownShortcutsExtension, {
                        transformers: PLAYGROUND_TRANSFORMERS,
                    }),
                    ClearEditorExtension,
                    EmojisExtension,
                    DecoratorTextExtension,
                    configExtension(ListExtension, { shouldPreserveNumbering: false }),
                    CheckListExtension,
                    HorizontalRuleExtension,
                    ImagesExtension,
                    DateTimeExtension,
                ],
                name: "@shadcn-editor",
                namespace: "Playground",
                nodes: [
                    OverflowNode,
                    EmojiNode,
                    MentionNode,
                    AutocompleteNode,
                    SpecialTextNode,
                    CodeNode,
                    CodeHighlightNode,
                    TableNode,
                    TableCellNode,
                    TableRowNode,
                    LayoutContainerNode,
                    LayoutItemNode,
                    TweetNode,
                    YouTubeNode,
                    CalloutNode,
                    DefListNode,
                    DefTermNode,
                    DefItemNode,
                    FootnoteReferenceNode,
                    FootnoteBlockNode,
                    AbbreviationNode,
                    MathNode,
                    MermaidNode,
                ],
                theme: editorTheme,
            }),
        [],
    );

    return (
        <div className="content-wrapper p-0 md:px-8 mx-auto w-full max-w-screen-2xl min-h-[calc(100dvh-80px)] flex flex-col relative">
            {provider && (
                <LexicalCollaboration>
                    <div className="w-full relative flex-1 flex flex-col">
                        <TooltipProvider>
                            <LexicalExtensionComposer extension={AppExtension} contentEditable={null}>
                                {provider && provider.document ? (
                                    <CollaborationPlugin
                                        id={idContent}
                                        doc={provider.document}
                                        provider={provider as any}
                                        username={collabUser.name || "Anonymous"}
                                        cursorColor={collabUser.color || "#ff0000"}
                                    />
                                ) : null}
                                {/* Top Toolbar */}
                                <div className="w-full shrink-0 bg-background/95 backdrop-blur-sm z-40 fixed top-14.5">
                                    <div className="max-w-screen-2xl mx-auto px-4 py-2 flex items-center justify-center">
                                        <TooltipProvider>
                                            <ToolbarPlugin>
                                            {({ blockType }) => (
                                                <div className="flex items-center gap-0.5 overflow-x-auto w-auto max-w-full px-1 py-0.5 scrollbar-none">
                                                    <HistoryToolbarPlugin />
                                                    <BlockFormatDropDown />
                                                    {blockType === "code" && <CodeLanguageToolbarPlugin />}
                                                    <div className={cn("flex items-center gap-0.5", blockType === "code" && "pointer-events-none opacity-50")}>
                                                        <ElementFormatToolbarPlugin separator={false} />
                                                        <FontFormatToolbarPlugin />
                                                        <TableHoverPlugin />
                                                        <InsertImage />
                                                        <InsertHorizontalRule />
                                                        <InsertColumnsLayout />
                                                        <InsertEmbeds />
                                                        <FontBackgroundToolbarPlugin />
                                                        <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
                                                        <SubSuperToolbarPlugin />
                                                        <ClearFormattingToolbarPlugin />
                                                    </div>
                                                </div>
                                            )}
                                        </ToolbarPlugin>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                <div className="flex flex-col xl:flex-row items-start justify-center gap-2 xl:gap-8 w-full max-w-screen-2xl mx-auto flex-1 min-h-0 px-1 xl:px-0 mt-5">

                                    {/* Middle - Editor (Paper) */}
                                    <div className={`relative flex flex-col flex-1 w-full min-w-0 max-w-5xl bg-background`}>

                                        <div id="editor-scroll-container" className="relative flex-1">
                                            <div className="min-h-full">
                                                <div className="" ref={onRef}>
                                                    <ContentEditable
                                                        placeholder={placeholder}
                                                        className="min-h-[500px] px-8 md:px-16 py-12 typeset max-w-full focus:outline-none"
                                                        placeholderClassName="px-8 md:px-16 py-12"
                                                    />
                                                </div>
                                            </div>
                                            <ComponentPickerMenuPlugin baseOptions={getBaseOptions()} />
                                            <EmojiPickerPlugin />
                                            <AutoEmbedPlugin />
                                            <MentionsPlugin />
                                            <AutoCompletePlugin />
                                            <ContextMenuPlugin />
                                            <SpecialTextPlugin />
                                            <TabFocusPlugin />
                                            <TabIndentationPlugin />
                                            <CodeHighlightPlugin />
                                            <TablePlugin />
                                            <LayoutPlugin />
                                            <TwitterPlugin />
                                            <YouTubePlugin />
                                            <DraggableBlockPlugin anchorElem={floatingAnchorElem} baseOptions={getBaseOptions()} />
                                            <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} setIsLinkEditMode={setIsLinkEditMode} />
                                            <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} isLinkEditMode={isLinkEditMode} setIsLinkEditMode={setIsLinkEditMode} />
                                            <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                                            <OnChangePlugin onChange={(editorState, editor) => {
                                                editorState.read(() => {
                                                    setWord($getRoot().getTextContent().length);
                                                    if (provider && provider.document) {
                                                        const markdownString = $convertToMarkdownString(PLAYGROUND_TRANSFORMERS);
                                                        provider.document.getMap("meta").set("markdown", markdownString);
                                                    }
                                                });
                                            }} />
                                        </div>
                                    </div>

                                    {/* Floating TOC Rail in Editor (matches Render Page) */}
                                    <TableOfContentsPlugin>
                                        {(tableOfContents, editor) => {
                                            const tocItems = tableOfContents.map(([key, text, tag]) => ({
                                                id: key,
                                                value: text,
                                                depth: parseInt(tag.charAt(1))
                                            }));
                                            return (
                                                <ArticleTocRail
                                                    toc={tocItems}
                                                    onItemClick={(id, e) => {
                                                        e.preventDefault();
                                                        editor.getElementByKey(id)?.scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                    getHeadingElement={(id) => editor.getElementByKey(id) as HTMLElement}
                                                    scrollContainerSelector="#editor-scroll-container"
                                                />
                                            );
                                        }}
                                    </TableOfContentsPlugin>
                                </div>

                                <MarkdownImportPlugin setOnImportContent={setImportMarkdownFn} />
                                <ToolBarBottom
                                    editor={true}
                                    onSave={onSave}
                                    collabUser={collabUser}
                                    invitedUsers={invitedUsers}
                                    setInvitedUsers={setInvitedUsers}
                                    resourceType={resourceType}
                                    resourceId={resourceId}
                                    onlineUsers={onlineUsers}
                                    word={word}
                                    onImportContent={importMarkdownFn}
                                />

                            </LexicalExtensionComposer>

                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    delay: 0.8,
                                    duration: 0.35,
                                    ease: "easeOut",
                                }}
                                className="fixed bottom-6 left-6 z-50 flex items-center gap-1.5 rounded-full border border-border/30 bg-background/60 backdrop-blur-2xl shadow-xl shadow-black/10 dark:shadow-black/30 px-3 py-1.5 text-xs text-foreground ring-1 ring-white/5"
                            >
                                <span className="inline-flex items-center gap-2 ">
                                    <span className="h-2 w-2 rounded-full bg-green-500 " />
                                    Live · {totalUsers} online
                                </span>
                            </motion.div>
                        </TooltipProvider>
                    </div>
                </LexicalCollaboration>
            )}
        </div>
    );
}
