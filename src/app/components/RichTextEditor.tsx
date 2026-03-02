import { useState } from 'react';
import { Button } from './ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFormat = (format: string) => {
    const textarea = document.querySelector('textarea[data-rich-editor="true"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = '';
    let formatTag = '';

    switch (format) {
      case 'bold':
        formatTag = '**';
        newText = value.substring(0, start) + `${formatTag}${selectedText}${formatTag}` + value.substring(end);
        break;
      case 'italic':
        formatTag = '_';
        newText = value.substring(0, start) + `${formatTag}${selectedText}${formatTag}` + value.substring(end);
        break;
      case 'underline':
        formatTag = '__';
        newText = value.substring(0, start) + `${formatTag}${selectedText}${formatTag}` + value.substring(end);
        break;
      case 'bullet':
        newText = value.substring(0, start) + `\n• ${selectedText}` + value.substring(end);
        break;
      case 'ordered':
        newText = value.substring(0, start) + `\n1. ${selectedText}` + value.substring(end);
        break;
      case 'link':
        newText = value.substring(0, start) + `[${selectedText}](url)` + value.substring(end);
        break;
      default:
        return;
    }

    onChange(newText);
    
    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formatTag.length, end + formatTag.length);
    }, 0);
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${className || ''}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('bold')}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('italic')}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('underline')}
          className="h-8 w-8 p-0"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('bullet')}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('ordered')}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('link')}
          className="h-8 w-8 p-0"
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Text Area */}
      <textarea
        data-rich-editor="true"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`w-full min-h-[200px] p-4 resize-y focus:outline-none ${
          isFocused ? 'ring-2 ring-blue-500 ring-inset' : ''
        }`}
      />
    </div>
  );
};