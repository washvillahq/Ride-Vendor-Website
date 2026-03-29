import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Heading from '@tiptap/extension-heading';
import { Bold, Italic, Link2, List, ListOrdered, Quote, Image as ImageIcon, Pilcrow } from 'lucide-react';

const ToolbarButton = ({ icon, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-9 px-2 rounded-lg border text-xs font-medium flex items-center gap-1 ${
      active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
    }`}
    title={label}
    aria-label={label}
  >
    {icon}
  </button>
);

const RichTextEditor = ({
  value = '',
  onChange,
  label = 'Content',
  placeholder = 'Start writing...',
  onUploadImage,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor: current }) => {
      onChange?.(current.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[320px] p-4 text-sm leading-7 outline-none',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  const insertLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter URL', previousUrl);
    if (url === null) return;
    if (!url) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertImage = async () => {
    if (!editor) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (onUploadImage) {
        const result = await onUploadImage(file);
        if (result?.url) {
          editor.chain().focus().setImage({ src: result.url }).run();
          return;
        }
      }

      const localUrl = URL.createObjectURL(file);
      editor.chain().focus().setImage({ src: localUrl }).run();
    };
    input.click();
  };

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">{label}</label>
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <div className="p-3 border-b border-slate-100 flex flex-wrap items-center gap-2 bg-slate-50">
          <ToolbarButton icon={<Pilcrow size={14} />} label="Paragraph" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()} />
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 h-9">
            <label className="text-xs text-slate-500">Heading</label>
            <select
              className="text-xs bg-transparent outline-none"
              value={editor.isActive('heading', { level: 1 })
                ? '1'
                : editor.isActive('heading', { level: 2 })
                ? '2'
                : editor.isActive('heading', { level: 3 })
                ? '3'
                : editor.isActive('heading', { level: 4 })
                ? '4'
                : editor.isActive('heading', { level: 5 })
                ? '5'
                : editor.isActive('heading', { level: 6 })
                ? '6'
                : 'p'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'p') {
                  editor.chain().focus().setParagraph().run();
                  return;
                }
                editor.chain().focus().setHeading({ level: Number(val) }).run();
              }}
            >
              <option value="p">P</option>
              <option value="1">H1</option>
              <option value="2">H2</option>
              <option value="3">H3</option>
              <option value="4">H4</option>
              <option value="5">H5</option>
              <option value="6">H6</option>
            </select>
          </div>
          <ToolbarButton icon={<Bold size={14} />} label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
          <ToolbarButton icon={<Italic size={14} />} label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
          <ToolbarButton icon={<List size={14} />} label="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
          <ToolbarButton icon={<ListOrdered size={14} />} label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
          <ToolbarButton icon={<Quote size={14} />} label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
          <ToolbarButton icon={<Link2 size={14} />} label="Link" active={editor.isActive('link')} onClick={insertLink} />
          <ToolbarButton icon={<ImageIcon size={14} />} label="Image" active={false} onClick={insertImage} />
        </div>
        <EditorContent editor={editor} />
      </div>
      <p className="text-xs text-slate-500">Headings, links, lists, quotes, and images are supported.</p>
    </div>
  );
};

export default RichTextEditor;
