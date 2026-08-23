import type { Editor } from "@tiptap/react";
import {
	PanelBottomClose,
	PanelLeftClose,
	PanelRightClose,
	PanelTopClose,
	RefreshCw,
	Table2,
	Trash,
} from "lucide-react";
import { Button } from "@/components/tiptap-ui-primitive/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/tiptap-ui-primitive/dropdown-menu";

const table = [
	{ label: "Insert Table", value: "insert_table", icon: Table2 },
	{ label: "Delete table", value: "delete_table", icon: Trash },
	{ label: "Fix tables", value: "fix_tables", icon: RefreshCw },
	{
		label: "Add column before",
		value: "add_column_before",
		icon: PanelLeftClose,
	},
	{
		label: "Add column after",
		value: "add_column_after",
		icon: PanelRightClose,
	},
	{ label: "Delete column", value: "delete_column", icon: Trash },
	{ label: "Add row before", value: "add_row_before", icon: PanelTopClose },
	{ label: "Add row after", value: "add_row_after", icon: PanelBottomClose },
	{ label: "Delete row", value: "delete_row", icon: Trash },
];
export const TableMenu = ({ editor }: { editor: Editor | null }) => {
	const isTable = !!editor?.isActive("table");

	const handleOption = (value: string) => {
		if (!editor) return;
		switch (value) {
			case "insert_table":
				editor
					.chain()
					.focus()
					.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
					.run();
				break;
			case "delete_table":
				editor.chain().focus().deleteTable().run();
				break;
			case "fix_tables":
				editor.chain().focus().fixTables().run();
				break;
			case "add_column_before":
				editor.chain().focus().addColumnBefore().run();
				break;
			case "add_column_after":
				editor.chain().focus().addColumnAfter().run();
				break;
			case "delete_column":
				editor.chain().focus().deleteColumn().run();
				break;
			case "add_row_before":
				editor.chain().focus().addRowBefore().run();
				break;
			case "add_row_after":
				editor.chain().focus().addRowAfter().run();
				break;
			case "delete_row":
				editor.chain().focus().deleteRow().run();
				break;
			default:
				break;
		}
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
					<Table2 className="tiptap-button-icon" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="min-w-[140px]">
				{table.map((option) => {
					const disabled = option.value === "insert_table" ? isTable : !isTable;
					const Icon = option.icon;
					const isDelete = option.icon === Trash;
					const iconClass = disabled
						? "tiptap-button-icon text-muted-foreground opacity-50"
						: isDelete && isTable
							? "tiptap-button-icon text-destructive"
							: "tiptap-button-icon";
					const itemClass = disabled
						? "tiptap-button text-muted-foreground opacity-50"
						: isDelete && isTable
							? "tiptap-button text-destructive hover:bg-destructive/10"
							: "tiptap-button";

					return (
						<DropdownMenuItem key={option.value} asChild disabled={disabled}>
							<Button
								type="button"
								data-style="ghost"
								role="button"
								className={itemClass}
								tabIndex={-1}
								onClick={() => handleOption(option.value)}
							>
								<Icon className={iconClass} />
								{option.label && (
									<span className="tiptap-button-text">{option.label}</span>
								)}
							</Button>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
