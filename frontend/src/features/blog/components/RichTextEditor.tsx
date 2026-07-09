import React from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// In a real production app, this would be a large library like Tiptap or Lexical
// Lazy loading this component saves significant bundle size on initial load.
const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, className }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Write your post content here...'}
      className={`w-full h-full min-h-[400px] p-4 bg-transparent resize-none focus:outline-none text-primary ${className}`}
    />
  );
};

export default RichTextEditor;
