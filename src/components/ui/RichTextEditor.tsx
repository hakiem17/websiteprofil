"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    Quote,
    Undo,
    Redo,
    Strikethrough,
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="border-b border-slate-200 dark:border-slate-700 p-2 flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-900 rounded-t-lg">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive("bold") ? "bg-slate-200 dark:bg-slate-700 text-primary" : "text-slate-600 dark:text-slate-400"
                    }`}
                title="Bold"
                type="button"
            >
                <Bold className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive("italic") ? "bg-slate-200 dark:bg-slate-700 text-primary" : "text-slate-600 dark:text-slate-400"
                    }`}
                title="Italic"
                type="button"
            >
                <Italic className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive("strike") ? "bg-slate-200 dark:bg-slate-700 text-primary" : "text-slate-600 dark:text-slate-400"
                    }`}
                title="Strikethrough"
                type="button"
            >
                <Strikethrough className="h-4 w-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center" />

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-slate-200 dark:bg-slate-700 text-primary" : "text-slate-600 dark:text-slate-400"
                    }`}
                title="Heading 2"
                type="button"
            >
                <Heading2 className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive("heading", { level: 3 }) ? "bg-slate-200 dark:bg-slate-700 text-primary" : "text-slate-600 dark:text-slate-400"
                    }`}
                title="Heading 3"
                type="button"
            >
                <Heading3 className="h-4 w-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center" />

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive("bulletList") ? "bg-slate-200 dark:bg-slate-700 text-primary" : "text-slate-600 dark:text-slate-400"
                    }`}
                title="Bullet List"
                type="button"
            >
                <List className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive("orderedList") ? "bg-slate-200 dark:bg-slate-700 text-primary" : "text-slate-600 dark:text-slate-400"
                    }`}
                title="Ordered List"
                type="button"
            >
                <ListOrdered className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive("blockquote") ? "bg-slate-200 dark:bg-slate-700 text-primary" : "text-slate-600 dark:text-slate-400"
                    }`}
                title="Blockquote"
                type="button"
            >
                <Quote className="h-4 w-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center" />

            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400 disabled:opacity-50"
                title="Undo"
                type="button"
            >
                <Undo className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400 disabled:opacity-50"
                title="Redo"
                type="button"
            >
                <Redo className="h-4 w-4" />
            </button>
        </div>
    );
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        immediatelyRender: false,
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    "prose dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none",
            },
        },
    });

    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
