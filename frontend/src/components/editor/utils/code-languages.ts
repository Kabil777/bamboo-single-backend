export const CODE_LANGUAGE_OPTIONS: [string, string][] = [
  ["plain", "Plain Text"],
  ["c", "C"],
  ["cpp", "C++"],
  ["csharp", "C#"],
  ["css", "CSS"],
  ["clojure", "Clojure"],
  ["dart", "Dart"],
  ["diff", "Diff"],
  ["docker", "Dockerfile"],
  ["elixir", "Elixir"],
  ["erlang", "Erlang"],
  ["fortran", "Fortran"],
  ["go", "Go"],
  ["graphql", "GraphQL"],
  ["groovy", "Groovy"],
  ["haskell", "Haskell"],
  ["html", "HTML"],
  ["java", "Java"],
  ["js", "JavaScript"],
  ["json", "JSON"],
  ["jsx", "JSX"],
  ["julia", "Julia"],
  ["kotlin", "Kotlin"],
  ["less", "Less"],
  ["lua", "Lua"],
  ["markdown", "Markdown"],
  ["mermaid", "Mermaid"],
  ["matlab", "MATLAB"],
  ["objc", "Objective-C"],
  ["ocaml", "OCaml"],
  ["perl", "Perl"],
  ["php", "PHP"],
  ["powershell", "PowerShell"],
  ["python", "Python"],
  ["r", "R"],
  ["ruby", "Ruby"],
  ["rust", "Rust"],
  ["scala", "Scala"],
  ["scss", "SCSS"],
  ["sql", "SQL"],
  ["swift", "Swift"],
  ["toml", "TOML"],
  ["ts", "TypeScript"],
  ["tsx", "TSX"],
  ["wasm", "WebAssembly"],
  ["xml", "XML"],
  ["yaml", "YAML"],
  ["zig", "Zig"],
];

const LANGUAGE_ALIAS_MAP: Record<string, string> = {
  javascript: "js",
  typescript: "ts",
  py: "python",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
  md: "markdown",
  cs: "csharp",
  rb: "ruby",
  kt: "kotlin",
  dockerfile: "docker",
  plaintext: "plain",
  text: "plain",
};

export function normalizeLanguageValue(lang: string | undefined | null): string {
  if (!lang) return "plain";
  const lower = lang.toLowerCase();
  if (LANGUAGE_ALIAS_MAP[lower]) {
    return LANGUAGE_ALIAS_MAP[lower];
  }
  const exists = CODE_LANGUAGE_OPTIONS.some(([val]) => val === lower);
  return exists ? lower : "plain";
}

export function getLanguageFriendlyName(lang: string | undefined | null): string {
  const normalized = normalizeLanguageValue(lang);
  const found = CODE_LANGUAGE_OPTIONS.find(([val]) => val === normalized);
  return found ? found[1] : "Plain Text";
}
