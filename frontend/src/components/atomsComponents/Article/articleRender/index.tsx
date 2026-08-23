"use client";

import "highlight.js/styles/tokyo-night-dark.css";
import "@/styles/render.css"
import { JetBrains_Mono } from "next/font/google";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkDeflist from "remark-deflist";
import remarkFootnotes from "remark-footnotes";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkCallout from "./remark-callout";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Mermaid } from "./Mermaid";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/shadcnUI/button";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcnUI/dialog";
import Link from "next/link";
import { ZoomableImage } from "@/components/atomsComponents/ZoomableImage";

const jetBrains_Mono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
    variable: "--font-JetBrains_Mono",
});


function extractText(node: React.ReactNode): string {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);

    if (Array.isArray(node)) {
        return node.map(extractText).join("");
    }

    if (React.isValidElement(node)) {
        return extractText(
            (node.props as { children?: React.ReactNode }).children,
        );
    }

    return "";
}

export const ArticleRender = ({ content }: { content: string }) => {
    const [buttonText, setButtonText] = React.useState<Record<string, boolean>>(
        {},
    );

    const handleCopy = (key: string, text: string) => {
        navigator.clipboard.writeText(text);
        setButtonText((prev) => ({ ...prev, [key]: true }));
        setTimeout(() => {
            setButtonText((prev) => ({ ...prev, [key]: false }));
        }, 2000);
    };
    const processedContent = React.useMemo(() => {
        if (!content) return "";
        let md = content;
        
        // Apply Typographic replacements, but strictly IGNORE code blocks and inline code!
        const TYPOGRAPHIC_REPLACEMENTS = [
            { regex: /\([cC]\)/g, replacement: "©" },
            { regex: /\([rR]\)/g, replacement: "®" },
            { regex: /\([tT][mM]\)/g, replacement: "™" },
            { regex: /\+-/g, replacement: "±" },
            { regex: /(?<!-)---(?!-)/g, replacement: "—" }, // em-dash
            { regex: /(?<!-)--(?!-)/g, replacement: "–" }, // en-dash
            { regex: /\.{2,}/g, replacement: "…" }, // ellipsis
            { regex: /!{4,}/g, replacement: "!!!" }, // collapse !
            { regex: /\?{4,}/g, replacement: "???" }, // collapse ?
            { regex: /,,/g, replacement: "," }, // collapse ,
        ];

        // Split by code blocks ```...``` and inline code `...`
        const codeBlockRegex = /(```[\s\S]*?```|`[^`\n]+`)/g;
        const parts = md.split(codeBlockRegex);

        for (let i = 0; i < parts.length; i++) {
            // Even indices are normal text, odd indices are code blocks/inline code
            if (i % 2 === 0) {
                // Process normal text line by line to protect Block elements like Horizontal Rules
                const lines = parts[i].split("\n");
                for (let j = 0; j < lines.length; j++) {
                    let line = lines[j];
                    
                    // Skip horizontal rules (3 or more dashes, asterisks, or underscores)
                    if (/^[ \t]*(?:---+|\*\*\*+|___+)[ \t]*$/.test(line)) {
                        continue;
                    }
                    
                    for (const { regex, replacement } of TYPOGRAPHIC_REPLACEMENTS) {
                        line = line.replace(regex, replacement);
                    }
                    lines[j] = line;
                }
                parts[i] = lines.join("\n");
            }
        }
        md = parts.join("");

        // Convert custom markdown syntax back to HTML so rehypeRaw can parse them
        md = md.replace(/==(.*?)==/g, "<mark>$1</mark>");
        md = md.replace(/\+\+(.*?)\+\+/g, "<ins>$1</ins>");
        // Convert definition list `~ ` to `: `
        md = md.replace(/^([ \t]*)~\s/gm, "$1: ");

        // Custom syntax for abbreviations: ~![text](title)!~ with escaped characters handled
        md = md.replace(/(?:\\)?~(?:\\)?!(?:\\)?\[(.*?)\](?:\\)?\((.*?)\)(?:\\)?!(?:\\)?~/g, "<abbr title=\"$2\" class=\"abbreviation-node\">$1</abbr>");

        // Single tilde for subscript, avoiding double tilde (strikethrough). Also handle escaped backslashes from Lexical
        md = md.replace(/(?<!~)(?:\\)?~([^~]+?)(?:\\)?~(?!~)/g, "<sub>$1</sub>");
        
        md = md.replace(/(?:\\)?\^([^^]+?)(?:\\)?\^/g, "<sup>$1</sup>");
        
        return md;
    }, [content]);


    return (
        <div className="typeset typeset-docs">
            <ReactMarkdown
                remarkPlugins={[
                    remarkGfm, 
                    remarkBreaks, 
                    remarkDeflist, 
                    remarkFootnotes as any,
                    remarkDirective,
                    remarkCallout,
                    remarkMath
                ]}
                rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
                components={{
                    /* ── Image ── */
                    img: ({ src, alt, width, height, ...props }) => {
                        if (!src) return null;

                        const imageWidth =
                            typeof width === "string"
                                ? parseInt(width, 10)
                                : width;
                        const imageHeight =
                            typeof height === "string"
                                ? parseInt(height, 10)
                                : height;

                        return (
                            <>
                                <Dialog >
                                    <DialogTrigger asChild>
                                        <Image
                                            width={imageWidth || 800}
                                            height={imageHeight || 450}
                                            alt={alt || "Image"}
                                            className="my-6 sm:my-8 rounded-xl transition-all duration-300 w-fit max-h-[300px] sm:max-h-[450px] mx-auto"
                                            src={src}
                                            {...props}
                                        />
                                    </DialogTrigger>
                                    <DialogContent showCloseButton={true} className="sm:!max-w-6xl max-h-[calc(100vh-4rem)] overflow-hidden p-0">
                                        <DialogHeader className="sr-only">
                                            <DialogTitle>{alt || "Image"}</DialogTitle>
                                            <DialogDescription>
                                                Full size preview of the image.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <ZoomableImage
                                            src={src}
                                            alt={alt || "Image"}
                                            width={imageWidth || 800}
                                            height={imageHeight || 450}
                                        />
                                    </DialogContent>
                                </Dialog>

                            </>
                        );
                    },
                    
                    /* ── Table (Responsive scroll wrapper) ── */
                    table: ({ children, ...props }) => (
                        <div className="typeset-scroll">
                            <table {...props}>{children}</table>
                        </div>
                    ),
                    /* ── Subscript / Superscript ── */
                    sub: (props) => <sub className="text-[0.75em]" {...props} />,
                    sup: (props) => <sup className="text-[0.75em]" {...props} />,
                    
                    /* ── Definition Lists ── */
                    dl: (props) => <dl className="def-list" {...props} />,
                    dt: (props) => <dt className="def-term" {...props} />,
                    dd: (props) => <dd className="def-item" {...props} />,
                    
                    /* ── Mark / Ins ── */
                    mark: (props) => <mark className="bg-yellow-500/30 text-yellow-700 dark:text-yellow-400 rounded-sm px-1" {...props} />,
                    ins: (props) => <ins className="underline" {...props} />,
                    
                    /* ── Span (fallback for legacy sub/sup) ── */
                    span: ({ children, node, className, ...props }) => {
                        if (className?.includes("sub")) {
                            return <sub className="text-[0.75em]" {...props}>{children}</sub>;
                        }
                        if (className?.includes("sup")) {
                            return <sup className="text-[0.75em]" {...props}>{children}</sup>;
                        }
                        return <span className={className} {...props}>{children}</span>;
                    },

                    /* ── Code Block / Inline Code ── */
                    code: ({ inline, className, children, ...rest }: any) => {
                        const match = /language-(\w+)/.exec(className || "");
                        const rawLang = className?.split("language-")[1];
                        const language = rawLang == "null" ? "Plain" :
                            (rawLang ? rawLang.charAt(0).toUpperCase() + rawLang.slice(1) : "");

                        if (language?.toLowerCase() === "mermaid" && !inline) {
                            const chartText = extractText(children).replace(/\n$/, "");
                            return <Mermaid chart={chartText} />;
                        }

                        const codeText = extractText(children);
                        const copyKey = `${language ?? "plain"}-${codeText.slice(0, 50)}`;

                        return language ? (
                            <div
                                className={`relative my-6 sm:my-8 group  ${jetBrains_Mono.className}`}
                                data-not-typeset
                            >
                                {/* Header Bar */}
                                <div className="flex items-center justify-between rounded-t-xl px-4 py-2.5 sticky z-10 bg-[#292929]"
                                >
                                    <div className="flex items-center gap-2">
                                        {/* Terminal dots */}
                                        <div className="hidden sm:flex items-center gap-1.5 mr-1">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/80" />
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/80" />
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
                                        </div>
                                        <span className="text-[11px] font-medium text-white/60 uppercase tracking-wider">
                                            {language}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleCopy(copyKey, codeText)}
                                        className="code-block-copy-btn h-7 px-2.5 gap-1.5 text-[11px] text-white/50 hover:text-white/90 border-none shadow-none bg-transparent hover:bg-white/10 rounded-lg"
                                    >
                                        {buttonText[copyKey] ? (
                                            <>
                                                <Check className="w-3 h-3 text-emerald-400" />
                                                <span className="text-emerald-400">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3 h-3" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Code Body */}
                                <pre
                                    className="overflow-x-auto custom-scroll max-h-[32rem] rounded-b-xl bg-[#1e1e1e]"
                                >
                                    <code
                                        className={`text-xs sm:text-[13px] leading-relaxed custom-scroll ${className} ${jetBrains_Mono.className}`}
                                        style={{ background: "var(--article-code-bg)" }}
                                        {...rest}
                                    >
                                        {typeof children === "string" ? children.trim() : children}
                                    </code>
                                </pre>
                            </div>
                        ) : (
                            <code
                                className={`article-inline-code px-1.5 py-0.5 mx-0.5 rounded-md font-bold text-foreground border border-border/60 bg-muted/60 ${jetBrains_Mono.className}`}
                                {...rest}
                            >
                                {children}
                            </code>
                        );
                    },

                    /* ── Links ── */
                    a: ({ href, children, ...props }) => {
                        const isExternal =
                            typeof window !== "undefined" &&
                            href &&
                            /^https?:\/\//.test(href) &&
                            !href.includes(window.location.hostname);

                        return (
                            <Link
                                className="article-link text-foreground/80 font-medium items-center inline-flex gap-0.5"
                                href={href || "#"}
                                target={isExternal ? "_blank" : undefined}
                                rel={
                                    isExternal
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                                {...props}
                            >
                                {children}
                                {isExternal && (
                                    <SquareArrowOutUpRight className="w-3 h-3 inline-block ml-0.5 opacity-50 flex-shrink-0" />
                                )}
                            </Link>
                        );
                    },
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
};
