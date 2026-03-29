import React, { useEffect, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Link2, Quote } from 'lucide-react';

const ToolButton = ({ icon, label, onClick }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center"
    title={label}
    aria-label={label}
  >
    {icon}
  </button>
);

const RichTextEditor = ({ value = '', onChange, label = 'Content' }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const run = (command, commandValue = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange?.(editorRef.current?.innerHTML || '');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">{label}</label>
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <div className="p-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
          <ToolButton icon={<Bold size={16} />} label="Bold" onClick={() => run('bold')} />
          <ToolButton icon={<Italic size={16} />} label="Italic" onClick={() => run('italic')} />
          <ToolButton icon={<List size={16} />} label="Bulleted list" onClick={() => run('insertUnorderedList')} />
          <ToolButton icon={<ListOrdered size={16} />} label="Numbered list" onClick={() => run('insertOrderedList')} />
          <ToolButton icon={<Quote size={16} />} label="Quote" onClick={() => run('formatBlock', 'blockquote')} />
          <ToolButton
            icon={<Link2 size={16} />}
            label="Insert link"
            onClick={() => {
              const href = window.prompt('Enter URL');
              if (href) run('createLink', href);
            }}
          />
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[320px] p-4 text-sm leading-7 outline-none"
          onInput={() => onChange?.(editorRef.current?.innerHTML || '')}
        />
      </div>
      <p className="text-xs text-slate-500">Use the toolbar to format text. This content is shown on custom pages.</p>
    </div>
  );
};

export default RichTextEditor;
