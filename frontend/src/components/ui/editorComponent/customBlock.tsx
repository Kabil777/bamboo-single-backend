import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/tiptap-ui-primitive/dropdown-menu";
import {
  BiLogoJavascript,
  BiLogoTypescript,
  BiLogoCPlusPlus,
  BiLogoJava,
} from "react-icons/bi";
import { Code, TerminalSquare } from "lucide-react";
import { SiYaml, SiXml, SiC } from "react-icons/si";
import { FileCode2 } from "lucide-react";

import type { useEditor } from "@tiptap/react";
import { Button } from "@/components/tiptap-ui-primitive/button";

const languages = [
  { label: "Auto", value: "auto", icon: Code },
  { label: "Plain Text", value: "plaintext", icon: FileCode2 },
  { label: "JavaScript", value: "javascript", icon: BiLogoJavascript },
  { label: "TypeScript", value: "typescript", icon: BiLogoTypescript },
  { label: "Go", value: "go", icon: TerminalSquare },
  { label: "C++", value: "cpp", icon: BiLogoCPlusPlus },
  { label: "Java", value: "java", icon: BiLogoJava },
  { label: "XML", value: "xml", icon: SiXml },
  { label: "YAML", value: "yaml", icon: SiYaml },
  { label: "C language", value: "c", icon: SiC },
];

export function MenuBar({
  editor,
}: {
  editor: ReturnType<typeof useEditor> | null;
}) {
  if (!editor) return null;

  const insertCodeBlock = (language: string) => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "codeBlock",
        attrs: { language: language === "auto" ? null : language },
      })
      .run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-style="ghost"
          role="button"
          tabIndex={-1}
          aria-label="List options"
          tooltip="List"
          className="w-10 h-10 flex items-center justify-center"
        >
          <Code  className="tiptap-button-icon" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[140px]">
        <DropdownMenuGroup>
          {languages.map((option) => (
            <DropdownMenuItem key={option.value} asChild>
              <Button
                type="button"
                data-style="ghost"
                role="button"
                tabIndex={-1}
                onClick={() => insertCodeBlock(option.value)}
              >
                <option.icon className="tiptap-button-icon" />
                {option.label && (
                  <span className="tiptap-button-text">{option.label}</span>
                )}
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
