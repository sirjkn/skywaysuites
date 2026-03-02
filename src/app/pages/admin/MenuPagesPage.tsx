import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { RichTextEditor } from '../../components/RichTextEditor';
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
          className="bg-[#36454F] hover:bg-[#2C3E50] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Hide Form' : 'Add New Page'}
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
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  placeholder="Write your page content here..."
                  className="h-64"
                />
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
                className="bg-[#36454F] hover:bg-[#2C3E50] text-white"
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
    </div>
  );
};