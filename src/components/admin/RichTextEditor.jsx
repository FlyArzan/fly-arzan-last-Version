import { useEffect, useCallback } from "react";
import { Box, Tooltip, Divider } from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link2,
  Link2Off,
  Image as ImageIcon,
  Table as TableIcon,
  Heading2,
  Heading3,
  Pilcrow,
  Undo2,
  Redo2,
  RemoveFormatting,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Code as CodeIcon,
  Code2,
} from "lucide-react";

// Brand-aligned dark theme tokens (match the admin panel).
const ACCENT = "#3B82F6";
const TEXT = "#e5e7eb";
const MUTED = "#9ca3af";
const FIELD_BG = "#0B0F16";
const BORDER = "rgba(255,255,255,0.1)";

// A single toolbar control. `active` highlights toggled marks/blocks.
const ToolButton = ({ title, onClick, active, disabled, children }) => (
  <Tooltip title={title} arrow disableInteractive>
    <span>
      <Box
        component="button"
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        disabled={disabled}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 1,
          border: "1px solid",
          borderColor: active ? ACCENT : "transparent",
          bgcolor: active ? "rgba(59,130,246,0.15)" : "transparent",
          color: active ? ACCENT : MUTED,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
          transition: "all 0.12s ease",
          "&:hover": disabled
            ? {}
            : { color: ACCENT, bgcolor: "rgba(255,255,255,0.04)" },
        }}
      >
        {children}
      </Box>
    </span>
  </Tooltip>
);

const ICON = { width: 16, height: 16 };

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ inline: false }),
      Placeholder.configure({
        placeholder: placeholder || "Write the article content…",
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: false }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Keep the editor in sync when the value is set externally (e.g. an existing
  // article loads asynchronously in edit mode). Skip when unchanged to avoid
  // clobbering the caret while typing.
  useEffect(() => {
    if (!editor) return;
    const incoming = value || "";
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, false);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Link URL", prev);
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) return null;

  const btn = (title, icon, onClick, active, disabled) => (
    <ToolButton
      title={title}
      onClick={onClick}
      active={active}
      disabled={disabled}
    >
      {icon}
    </ToolButton>
  );

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: BORDER,
        borderRadius: 1.5,
        bgcolor: FIELD_BG,
        overflow: "hidden",
        "&:focus-within": { borderColor: ACCENT },
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 0.25,
          px: 1,
          py: 0.75,
          borderBottom: "1px solid",
          borderColor: BORDER,
          bgcolor: "#14181F",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        {btn(
          "Heading 2",
          <Heading2 {...ICON} />,
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          editor.isActive("heading", { level: 2 }),
        )}
        {btn(
          "Heading 3",
          <Heading3 {...ICON} />,
          () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          editor.isActive("heading", { level: 3 }),
        )}
        {btn(
          "Paragraph",
          <Pilcrow {...ICON} />,
          () => editor.chain().focus().setParagraph().run(),
          editor.isActive("paragraph"),
        )}

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: BORDER }} />

        {btn(
          "Bold",
          <BoldIcon {...ICON} />,
          () => editor.chain().focus().toggleBold().run(),
          editor.isActive("bold"),
        )}
        {btn(
          "Italic",
          <ItalicIcon {...ICON} />,
          () => editor.chain().focus().toggleItalic().run(),
          editor.isActive("italic"),
        )}
        {btn(
          "Underline",
          <UnderlineIcon {...ICON} />,
          () => editor.chain().focus().toggleUnderline().run(),
          editor.isActive("underline"),
        )}
        {btn(
          "Strikethrough",
          <Strikethrough {...ICON} />,
          () => editor.chain().focus().toggleStrike().run(),
          editor.isActive("strike"),
        )}
        {btn(
          "Highlight",
          <Highlighter {...ICON} />,
          () => editor.chain().focus().toggleHighlight().run(),
          editor.isActive("highlight"),
        )}
        {btn(
          "Inline code",
          <CodeIcon {...ICON} />,
          () => editor.chain().focus().toggleCode().run(),
          editor.isActive("code"),
        )}

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: BORDER }} />

        {btn(
          "Align left",
          <AlignLeft {...ICON} />,
          () => editor.chain().focus().setTextAlign("left").run(),
          editor.isActive({ textAlign: "left" }),
        )}
        {btn(
          "Align center",
          <AlignCenter {...ICON} />,
          () => editor.chain().focus().setTextAlign("center").run(),
          editor.isActive({ textAlign: "center" }),
        )}
        {btn(
          "Align right",
          <AlignRight {...ICON} />,
          () => editor.chain().focus().setTextAlign("right").run(),
          editor.isActive({ textAlign: "right" }),
        )}

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: BORDER }} />

        {btn(
          "Bullet list",
          <List {...ICON} />,
          () => editor.chain().focus().toggleBulletList().run(),
          editor.isActive("bulletList"),
        )}
        {btn(
          "Numbered list",
          <ListOrdered {...ICON} />,
          () => editor.chain().focus().toggleOrderedList().run(),
          editor.isActive("orderedList"),
        )}
        {btn(
          "Quote",
          <Quote {...ICON} />,
          () => editor.chain().focus().toggleBlockquote().run(),
          editor.isActive("blockquote"),
        )}
        {btn(
          "Code block",
          <Code2 {...ICON} />,
          () => editor.chain().focus().toggleCodeBlock().run(),
          editor.isActive("codeBlock"),
        )}
        {btn(
          "Divider",
          <Minus {...ICON} />,
          () => editor.chain().focus().setHorizontalRule().run(),
        )}

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: BORDER }} />

        {btn("Add / edit link", <Link2 {...ICON} />, setLink, editor.isActive("link"))}
        {btn(
          "Remove link",
          <Link2Off {...ICON} />,
          () => editor.chain().focus().unsetLink().run(),
          false,
          !editor.isActive("link"),
        )}
        {btn("Insert image", <ImageIcon {...ICON} />, addImage)}
        {btn(
          "Insert table",
          <TableIcon {...ICON} />,
          () =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run(),
        )}

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: BORDER }} />

        {btn(
          "Clear formatting",
          <RemoveFormatting {...ICON} />,
          () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
        )}
        {btn(
          "Undo",
          <Undo2 {...ICON} />,
          () => editor.chain().focus().undo().run(),
          false,
          !editor.can().undo(),
        )}
        {btn(
          "Redo",
          <Redo2 {...ICON} />,
          () => editor.chain().focus().redo().run(),
          false,
          !editor.can().redo(),
        )}
      </Box>

      {/* Editable content — styled to read like the published article */}
      <Box
        sx={{
          "& .ProseMirror": {
            minHeight: 360,
            maxHeight: 640,
            overflowY: "auto",
            px: 2.5,
            py: 2,
            outline: "none",
            color: TEXT,
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            lineHeight: 1.7,
          },
          "& .ProseMirror > * + *": { marginTop: "0.75em" },
          "& .ProseMirror h2": {
            color: "#fff",
            fontSize: "1.5rem",
            fontWeight: 700,
            marginTop: "1.4em",
            marginBottom: "0.4em",
            lineHeight: 1.3,
          },
          "& .ProseMirror h3": {
            color: "#fff",
            fontSize: "1.2rem",
            fontWeight: 600,
            marginTop: "1.2em",
            marginBottom: "0.3em",
          },
          "& .ProseMirror h4": {
            color: "#f3f4f6",
            fontSize: "1.05rem",
            fontWeight: 600,
            marginTop: "1em",
          },
          "& .ProseMirror p": { margin: 0 },
          "& .ProseMirror ul": { paddingLeft: "1.4em", listStyle: "disc" },
          "& .ProseMirror ol": { paddingLeft: "1.4em", listStyle: "decimal" },
          "& .ProseMirror li": { marginBottom: "0.25em" },
          "& .ProseMirror li p": { margin: 0 },
          "& .ProseMirror a": {
            color: "#60a5fa",
            textDecoration: "underline",
            cursor: "pointer",
          },
          "& .ProseMirror strong": { color: "#fff", fontWeight: 700 },
          "& .ProseMirror mark": {
            bgcolor: "#facc15",
            color: "#1a1a1a",
            borderRadius: 0.25,
            px: 0.25,
          },
          "& .ProseMirror blockquote": {
            borderLeft: `3px solid ${ACCENT}`,
            paddingLeft: "1em",
            margin: "1em 0",
            color: MUTED,
            fontStyle: "italic",
          },
          "& .ProseMirror code": {
            bgcolor: "rgba(255,255,255,0.08)",
            color: "#fca5a5",
            px: 0.5,
            borderRadius: 0.5,
            fontFamily: "monospace",
            fontSize: "0.875em",
          },
          "& .ProseMirror pre": {
            bgcolor: "#000",
            color: "#e5e7eb",
            p: 1.5,
            borderRadius: 1,
            overflowX: "auto",
            fontFamily: "monospace",
          },
          "& .ProseMirror hr": {
            border: "none",
            borderTop: `1px solid ${BORDER}`,
            margin: "1.5em 0",
          },
          "& .ProseMirror img": {
            maxWidth: "100%",
            height: "auto",
            borderRadius: 8,
            margin: "0.5em 0",
          },
          "& .ProseMirror .tableWrapper": { overflowX: "auto", margin: "1em 0" },
          "& .ProseMirror table": {
            borderCollapse: "collapse",
            width: "100%",
            tableLayout: "fixed",
          },
          "& .ProseMirror th, & .ProseMirror td": {
            border: `1px solid ${BORDER}`,
            padding: "6px 10px",
            verticalAlign: "top",
            minWidth: "1em",
          },
          "& .ProseMirror th": {
            bgcolor: "rgba(255,255,255,0.05)",
            fontWeight: 600,
            color: "#fff",
            textAlign: "left",
          },
          // Placeholder for the empty editor
          "& .ProseMirror p.is-editor-empty:first-of-type::before": {
            content: "attr(data-placeholder)",
            float: "left",
            color: "#6b7280",
            pointerEvents: "none",
            height: 0,
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
