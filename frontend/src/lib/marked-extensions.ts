/**
 * Custom marked extensions for markdown-it compatible syntax:
 * - Footnotes:  [^id] references + [^id]: definitions + ^[inline footnotes]
 * - Definition lists:  Term\n: Definition
 * - Abbreviations:  *[ABBR]: Full text
 * - Custom containers:  ::: type\ncontent\n:::
 */
import type { MarkedExtension } from "marked";

// ─── Footnotes ───────────────────────────────────────────────────────────────

export function footnoteExtension(): MarkedExtension {
  return {
    walkTokens(token) {
      // no-op, handled by renderer hooks
    },
    hooks: {
      postprocess(html: string): string {
        // 1. Collect footnote definitions: [^id]: text
        const definitions = new Map<string, string>();
        let cleaned = html.replace(
          /\[\^([^\]]+)\]:\s*(.+?)(?=<\/p>|<br|$|\n)/gm,
          (_match, id: string, text: string) => {
            definitions.set(id.trim(), text.trim());
            return "";
          },
        );

        // 2. Handle inline footnotes: ^[text]
        let inlineCounter = 0;
        cleaned = cleaned.replace(/\^\[([^\]]+)\]/g, (_match, text: string) => {
          inlineCounter++;
          const id = `inline-fn-${inlineCounter}`;
          definitions.set(id, text);
          return `<sup class="footnote-ref"><a href="#fn-${id}" id="fnref-${id}">[${definitions.size}]</a></sup>`;
        });

        // 3. Replace footnote references: [^id]
        const refOrder: string[] = [];
        cleaned = cleaned.replace(/\[\^([^\]]+)\]/g, (_match, id: string) => {
          const trimId = id.trim();
          if (!refOrder.includes(trimId)) {
            refOrder.push(trimId);
          }
          const num = refOrder.indexOf(trimId) + 1;
          return `<sup class="footnote-ref"><a href="#fn-${trimId}" id="fnref-${trimId}">[${num}]</a></sup>`;
        });

        // 4. Build footnotes section
        const allIds = [...new Set([...refOrder, ...definitions.keys()])];
        if (allIds.length > 0) {
          let footnoteSection =
            '<hr class="footnotes-sep">\n<section class="footnotes">\n<ol class="footnotes-list">\n';
          for (const id of allIds) {
            const text = definitions.get(id) || id;
            footnoteSection += `<li id="fn-${id}" class="footnote-item"><p>${text} <a href="#fnref-${id}" class="footnote-backref">↩</a></p></li>\n`;
          }
          footnoteSection += "</ol>\n</section>";
          cleaned += footnoteSection;
        }

        // Clean up empty paragraphs left over
        cleaned = cleaned.replace(/<p>\s*<\/p>/g, "");

        return cleaned;
      },
    },
  };
}

// ─── Definition Lists ────────────────────────────────────────────────────────

export function definitionListExtension(): MarkedExtension {
  return {
    hooks: {
      postprocess(html: string): string {
        // Match pattern: <p>Term</p>\n<p>: Definition</p>
        // Also handle multiple consecutive definitions
        const dlPattern =
          /<p>([^<]+?)<\/p>\s*(?:<p>:\s*(.+?)<\/p>\s*)+/g;

        return html.replace(dlPattern, (match) => {
          // Extract term lines and definition lines
          const termMatch = match.match(/<p>([^:][^<]*?)<\/p>/);
          const defMatches = [...match.matchAll(/<p>:\s*(.+?)<\/p>/g)];

          if (!termMatch || defMatches.length === 0) return match;

          let dl = "<dl>\n";
          dl += `<dt>${termMatch[1].trim()}</dt>\n`;
          for (const def of defMatches) {
            dl += `<dd>${def[1].trim()}</dd>\n`;
          }
          dl += "</dl>";
          return dl;
        });
      },
    },
  };
}

// ─── Abbreviations ───────────────────────────────────────────────────────────

export function abbreviationExtension(): MarkedExtension {
  return {
    hooks: {
      postprocess(html: string): string {
        // 1. Collect abbreviation definitions: *[ABBR]: Full Text
        const abbreviations = new Map<string, string>();
        let cleaned = html.replace(
          /(?:<p>)?\*\[([^\]]+)\]:\s*(.+?)(?:<\/p>|$)/gm,
          (_match, abbr: string, title: string) => {
            abbreviations.set(abbr.trim(), title.trim());
            return "";
          },
        );

        // 2. Replace abbreviations in text (word-boundary aware)
        for (const [abbr, title] of abbreviations) {
          const escapedAbbr = abbr.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
          );
          // Only match standalone occurrences, not inside tags or attributes
          const regex = new RegExp(
            `(?<![a-zA-Z])${escapedAbbr}(?![a-zA-Z])`,
            "g",
          );
          cleaned = cleaned.replace(regex, (match) => {
            return `<abbr title="${title}">${match}</abbr>`;
          });
        }

        // Clean up empty paragraphs
        cleaned = cleaned.replace(/<p>\s*<\/p>/g, "");

        return cleaned;
      },
    },
  };
}

// ─── Custom Containers ───────────────────────────────────────────────────────

export function containerExtension(): MarkedExtension {
  return {
    hooks: {
      preprocess(markdown: string): string {
        // Convert ::: type\ncontent\n::: to HTML divs before marked parses
        return markdown.replace(
          /^:::\s*(\w+)\s*\n([\s\S]*?)^:::\s*$/gm,
          (_match, type: string, content: string) => {
            return `<div class="custom-container ${type.trim()}">\n<p class="custom-container-title">${type.trim().toUpperCase()}</p>\n\n${content.trim()}\n\n</div>`;
          },
        );
      },
    },
  };
}
