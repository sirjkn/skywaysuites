import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { Button } from '../../components/ui/button';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  MenuPage,
  getMenuPages,
  createMenuPage,
  updateMenuPage,
  deleteMenuPage,
} from '../../services/api';

export const MenuPagesPage = () => {
  const [menuPages, setMenuPages] = useState<MenuPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<MenuPage | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    path: '',
    type: 'link' as 'link' | 'anchor',
    order: 0,
    visible: true,
    content: '',
  });

  useEffect(() => {
    loadMenuPages();
  }, []);

  const loadMenuPages = async () => {
    try {
      setLoading(true);
      const pages = await getMenuPages();
      setMenuPages(pages.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error loading menu pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPage) {
        await updateMenuPage(editingPage.id, formData);
      } else {
        await createMenuPage(formData);
      }
      await loadMenuPages();
      resetForm();
    } catch (error) {
      console.error('Error saving menu page:', error);
    }
  };

  const handleEdit = (page: MenuPage) => {
    setEditingPage(page);
    setFormData({
      label: page.label,
      path: page.path,
      type: page.type,
      order: page.order,
      visible: page.visible,
      content: page.content || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu page?')) return;
    try {
      await deleteMenuPage(id);
      await loadMenuPages();
    } catch (error) {
      console.error('Error deleting menu page:', error);
    }
  };

  const handleToggleVisibility = async (page: MenuPage) => {
    try {
      await updateMenuPage(page.id, { visible: !page.visible });
      await loadMenuPages();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      label: '',
      path: '',
      type: 'link',
      order: menuPages.length + 1,
      visible: true,
      content: '',
    });
    setEditingPage(null);
    setShowForm(false);
  };

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      [{ direction: 'rtl' }],
      ['link', 'image', 'video', 'formula'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'check',
    'indent',
    'align',
    'direction',
    'link',
    'image',
    'video',
    'formula',
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C3E50]">Menu Pages</h1>
          <p className="text-[#7F8C8D] text-sm mt-1">Manage navigation menu items with rich content</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#6B7F39] hover:bg-[#556230] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Page
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#2C3E50] mb-4">
            {editingPage ? 'Edit Menu Page' : 'Add New Menu Page'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B7F39]"
                  placeholder="Home, About, Contact..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                  Path
                </label>
                <input
                  type="text"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B7F39]"
                  placeholder="/, /about, #contact..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'link' | 'anchor' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B7F39]"
                >
                  <option value="link">Link (Page)</option>
                  <option value="anchor">Anchor (Section)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B7F39]"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                Page Content (Advanced Editor)
              </label>
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your page content here..."
                  className="h-64"
                  style={{ height: '16rem' }}
                />
              </div>
              <div className="mt-3 p-3 bg-[#F5E6D3]/30 rounded-lg">
                <p className="text-xs text-[#36454F] font-medium mb-1">✨ Advanced Editor Features:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-[#36454F]/80">
                  <div>• Headers (H1-H6)</div>
                  <div>• Text Formatting</div>
                  <div>• Colors & Highlights</div>
                  <div>• Lists & Checkboxes</div>
                  <div>• Code Blocks</div>
                  <div>• Blockquotes</div>
                  <div>• Links & Images</div>
                  <div>• Videos & Formulas</div>
                  <div>• Text Alignment</div>
                  <div>• Subscript/Superscript</div>
                  <div>• Indentation</div>
                  <div>• RTL Support</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-16">
              <input
                type="checkbox"
                id="visible"
                checked={formData.visible}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                className="w-4 h-4 text-[#6B7F39] rounded focus:ring-[#6B7F39]"
              />
              <label htmlFor="visible" className="text-sm text-[#2C3E50]">
                Visible in menu
              </label>
            </div>
            <div className="flex gap-3 pt-2 border-t">
              <Button
                type="submit"
                className="bg-[#6B7F39] hover:bg-[#556230] text-white"
              >
                {editingPage ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                variant="outline"
                className="border-gray-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Pages Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">
                  Label
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">
                  Path
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#7F8C8D]">
                    Loading menu pages...
                  </td>
                </tr>
              ) : menuPages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#7F8C8D]">
                    No menu pages found. Click "Add Menu Page" to create one.
                  </td>
                </tr>
              ) : (
                menuPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-[#7F8C8D]" />
                        <span className="text-sm font-medium text-[#2C3E50]">{page.order}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-[#2C3E50]">{page.label}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm text-[#3498DB] bg-blue-50 px-2 py-1 rounded">
                        {page.path}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {page.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {page.content ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Has Content
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          No Content
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          page.visible
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {page.visible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleVisibility(page)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={page.visible ? 'Hide' : 'Show'}
                        >
                          {page.visible ? (
                            <Eye className="w-4 h-4 text-[#7F8C8D]" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-[#7F8C8D]" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(page)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-[#3498DB]" />
                        </button>
                        <button
                          onClick={() => handleDelete(page.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-[#E74C3C]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Styles for Quill Editor */}
      <style>{`
        .ql-editor {
          min-height: 300px;
          max-height: 500px;
          overflow-y: auto;
          font-size: 15px;
          line-height: 1.6;
        }
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
          border: 1px solid #d1d5db !important;
          border-bottom: none !important;
          padding: 12px 8px;
        }
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border: 1px solid #d1d5db !important;
          font-family: 'Gothic A1', 'Century Gothic', sans-serif;
        }
        .ql-toolbar.ql-snow {
          border: 1px solid #d1d5db !important;
          border-bottom: none !important;
        }
        .ql-container.ql-snow {
          border: 1px solid #d1d5db !important;
        }
        .ql-snow .ql-stroke {
          stroke: #6B7F39;
        }
        .ql-snow .ql-fill {
          fill: #6B7F39;
        }
        .ql-snow .ql-picker-label:hover,
        .ql-snow .ql-picker-label.ql-active,
        .ql-snow .ql-picker-item:hover,
        .ql-snow .ql-picker-item.ql-selected {
          color: #6B7F39;
        }
        .ql-toolbar button:hover,
        .ql-toolbar button.ql-active {
          color: #6B7F39 !important;
        }
        .ql-toolbar button:hover .ql-stroke,
        .ql-toolbar button.ql-active .ql-stroke {
          stroke: #6B7F39 !important;
        }
        .ql-toolbar button:hover .ql-fill,
        .ql-toolbar button.ql-active .ql-fill {
          fill: #6B7F39 !important;
        }
        .ql-snow.ql-toolbar button,
        .ql-snow .ql-toolbar button {
          width: 32px;
          height: 32px;
          padding: 4px;
          margin: 2px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        .ql-snow.ql-toolbar button:hover,
        .ql-snow .ql-toolbar button:hover {
          background: rgba(107, 127, 57, 0.1);
        }
        .ql-snow.ql-toolbar button.ql-active,
        .ql-snow .ql-toolbar button.ql-active {
          background: rgba(107, 127, 57, 0.15);
        }
        .ql-picker-label {
          border-radius: 4px;
          padding: 4px 8px;
          transition: all 0.2s ease;
        }
        .ql-picker-label:hover {
          background: rgba(107, 127, 57, 0.1);
        }
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .ql-editor h1 {
          font-size: 2em;
          font-weight: 600;
          margin-bottom: 0.5em;
          color: #2C3E50;
        }
        .ql-editor h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin-bottom: 0.5em;
          color: #2C3E50;
        }
        .ql-editor h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin-bottom: 0.5em;
          color: #2C3E50;
        }
        .ql-editor h4 {
          font-size: 1.1em;
          font-weight: 600;
          margin-bottom: 0.5em;
          color: #2C3E50;
        }
        .ql-editor blockquote {
          border-left: 4px solid #6B7F39;
          padding-left: 16px;
          margin-left: 0;
          margin-right: 0;
          color: #4b5563;
          font-style: italic;
        }
        .ql-editor code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          color: #6B7F39;
          font-family: 'Courier New', monospace;
        }
        .ql-editor pre {
          background: #2C3E50;
          color: #F5E6D3;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
        }
        .ql-editor a {
          color: #6B7F39;
          text-decoration: underline;
        }
        .ql-editor a:hover {
          color: #556230;
        }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 8px 0;
        }
        .ql-editor ul,
        .ql-editor ol {
          padding-left: 1.5em;
        }
        .ql-editor li {
          margin-bottom: 0.25em;
        }
        .ql-snow .ql-tooltip {
          background: #2C3E50;
          border: none;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          padding: 8px 12px;
        }
        .ql-snow .ql-tooltip input[type=text] {
          border: 1px solid #6B7F39;
          border-radius: 4px;
          padding: 4px 8px;
        }
        .ql-snow .ql-tooltip a.ql-action::after {
          content: 'Edit';
          margin-left: 16px;
          color: #6B7F39;
        }
        .ql-snow .ql-tooltip a.ql-remove::before {
          content: 'Remove';
          color: #E74C3C;
        }
        .ql-snow .ql-tooltip[data-mode=link]::before {
          content: 'Enter link:';
        }
        .ql-snow .ql-tooltip[data-mode=formula]::before {
          content: 'Enter formula:';
        }
        .ql-snow .ql-tooltip[data-mode=video]::before {
          content: 'Enter video URL:';
        }
      `}</style>
    </div>
  );
};