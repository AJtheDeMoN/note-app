'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, List, ListOrdered } from 'lucide-react';
import React from 'react';

// The toolbar for the editor
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const buttons = [
    { action: () => editor.chain().focus().toggleBold().run(), icon: Bold, isActive: editor.isActive('bold') },
    { action: () => editor.chain().focus().toggleItalic().run(), icon: Italic, isActive: editor.isActive('italic') },
    { action: () => editor.chain().focus().toggleStrike().run(), icon: Strikethrough, isActive: editor.isActive('strike') },
    { action: () => editor.chain().focus().toggleBulletList().run(), icon: List, isActive: editor.isActive('bulletList') },
    { action: () => editor.chain().focus().toggleOrderedList().run(), icon: ListOrdered, isActive: editor.isActive('orderedList') },
  ];

  return (
    <div className="mb-2 flex flex-wrap items-center gap-2 rounded-md border-2 border-[#6b3323] bg-gray-50 p-2">
      {buttons.map((btn, index) => (
        <button
          key={index}
          onClick={btn.action}
          type="button"
          className={`rounded p-1.5 ${btn.isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-200'}`}
        >
          <btn.icon size={16} />
        </button>
      ))}
    </div>
  );
};

interface RichTextEditorProps {
  content: string;
  onChange: (htmlContent: string) => void;
  disabled?: boolean;
}

export default function RichTextEditor({ content, onChange, disabled }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "w-full rounded border-2 border-[#6b3323] bg-white text-red-500 p-3 mb-14 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50",
      },
    },
  });

  if (!editor) {
    return null;
  }
  editor.view.dom.style.minHeight = '240px'; 

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}