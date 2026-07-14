'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  FiBold, 
  FiItalic, 
  FiList, 
  FiRotateCcw, 
  FiRotateCw,
  FiCode,
  FiType
} from 'react-icons/fi';

const TiptapEditor = ({ value, onChange, placeholder = 'Write description...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'w-full min-h-[150px] max-h-[300px] overflow-y-auto bg-slate-50 border border-slate-200 rounded-b-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-sky-500 focus:bg-white transition-colors prose max-w-none',
      },
    },
  });

  // Keep editor content in sync with value prop (for edit modes/resets)
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-400 font-medium">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden focus-within:border-sky-500 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-100/80 border-b border-slate-200 p-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('bold') ? 'bg-sky-100 text-sky-700' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Bold"
        >
          <FiBold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('italic') ? 'bg-sky-100 text-sky-700' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Italic"
        >
          <FiItalic className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 1 }) ? 'bg-sky-100 text-sky-700' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Heading 1"
        >
          H1
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 2 }) ? 'bg-sky-100 text-sky-700' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Heading 2"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('paragraph') ? 'bg-sky-100 text-sky-700' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Paragraph"
        >
          <FiType className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('bulletList') ? 'bg-sky-100 text-sky-700' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Bullet List"
        >
          <FiList className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('codeBlock') ? 'bg-sky-100 text-sky-700' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Code Block"
        >
          <FiCode className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-300 ml-auto mr-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
          title="Undo"
        >
          <FiRotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
          title="Redo"
        >
          <FiRotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
