import { useEffect, useState } from 'react';

// Dynamically import ReactQuill to avoid SSR issues and CSS import problems
let ReactQuill: any = null;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import ReactQuill and its CSS
    if (!ReactQuill) {
      import('react-quill').then((mod) => {
        ReactQuill = mod.default;
        
        // Dynamically import the CSS
        import('react-quill/dist/quill.snow.css').catch((err) => {
          console.warn('Failed to load Quill CSS:', err);
        });
      }).catch((err) => {
        console.error('Failed to load ReactQuill:', err);
      });
    }
  }, []);

  // Don't render on server or while loading
  if (!isClient || !ReactQuill) {
    return (
      <div className={`border rounded-lg p-4 ${className || ''}`}>
        <p className="text-gray-400">Loading editor...</p>
      </div>
    );
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'align',
    'link',
    'image',
  ];

  return (
    <div className={className}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white rounded-lg"
      />
    </div>
  );
};
