/**
 * Pre-processes a markdown string before it is passed to Lexical's native markdown parser.
 * This function resolves Reference-style links and images by converting them to inline links/images.
 */
export function preprocessMarkdown(markdown: string): string {
  // 1. Extract all reference definitions: [id]: url "optional title"
  // The regex looks for lines starting with `[id]:` followed by a URL and optionally a title in quotes.
  const definitionRegex = /^\[([^\]]+)\]:\s*(\S+)(?:\s+"([^"]+)")?\s*$/gm;
  
  const references = new Map<string, { url: string; title?: string }>();
  
  let match;
  while ((match = definitionRegex.exec(markdown)) !== null) {
    const id = match[1].toLowerCase();
    const url = match[2];
    const title = match[3];
    references.set(id, { url, title });
  }

  // 2. Remove the definitions from the markdown string (optional, but keeps it clean)
  let processed = markdown.replace(definitionRegex, "");

  // 3. Replace reference images: ![alt][id]
  const refImageRegex = /!\[(.*?)\]\s*\[([^\]]+)\]/g;
  processed = processed.replace(refImageRegex, (original, alt, idStr) => {
    const id = idStr.toLowerCase();
    const ref = references.get(id);
    if (ref) {
      if (ref.title) {
        return `![${alt}](${ref.url} "${ref.title}")`;
      }
      return `![${alt}](${ref.url})`;
    }
    return original; // If no reference found, leave it as is
  });

  // 4. Replace reference links: [text][id]
  const refLinkRegex = /(?<!!)\[(.*?)\]\s*\[([^\]]*)\]/g;
  processed = processed.replace(refLinkRegex, (original, text, idStr) => {
    // If idStr is empty like [id][], the id is the text itself
    const id = (idStr || text).toLowerCase();
    const ref = references.get(id);
    if (ref) {
      if (ref.title) {
        return `[${text}](${ref.url} "${ref.title}")`;
      }
      return `[${text}](${ref.url})`;
    }
    return original;
  });

  // 5. Extract abbreviation definitions: *[HTML]: Hyper Text Markup Language
  const abbrRegex = /^\*\[([^\]]+)\]:\s*(.+)$/gm;
  const abbreviations = new Map<string, string>();
  
  let abbrMatch;
  while ((abbrMatch = abbrRegex.exec(processed)) !== null) {
    const word = abbrMatch[1];
    const title = abbrMatch[2];
    abbreviations.set(word, title);
  }
  
  // Remove abbreviation definitions
  processed = processed.replace(abbrRegex, "");
  
  // Replace words with the custom syntax: ~![word](title)!~
  // We use word boundaries \b to ensure we only replace whole words.
  for (const [word, title] of abbreviations.entries()) {
    // Escape the word for regex
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordRegex = new RegExp(`\\b${escapedWord}\\b`, "g");
    processed = processed.replace(wordRegex, `~![${word}](${title})!~`);
  }

  // 6. Convert `~ ` to `: ` for definition lists
  processed = processed.replace(/^([ \t]*)~\s/gm, "$1: ");

  // 7. Apply Typographic replacements, but strictly IGNORE code blocks and inline code!
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
  const parts = processed.split(codeBlockRegex);

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

  processed = parts.join("");

  return processed;
}
