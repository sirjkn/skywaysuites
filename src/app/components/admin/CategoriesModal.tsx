import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'sonner';
import {
  Category,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/api';

interface CategoriesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const CategoriesModal = ({ open, onOpenChange, onUpdate }: CategoriesModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bedrooms: '0',
    description: '',
  });

  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: formData.name,
          bedrooms: parseInt(formData.bedrooms),
          description: formData.description,
        });
        toast.success('Category updated successfully');
      } else {
        await createCategory({
          name: formData.name,
          bedrooms: parseInt(formData.bedrooms),
          description: formData.description,
        });
        toast.success('Category created successfully');
      }
      resetForm();
      loadCategories();
      onUpdate();
    } catch (error) {
      toast.error('Failed to save category');
      console.error(error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      bedrooms: category.bedrooms.toString(),
      description: category.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted successfully');
      loadCategories();
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete category');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      bedrooms: '0',
      description: '',
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#2C3E50]">Manage Categories</DialogTitle>
          <DialogDescription className="text-sm text-[#7F8C8D]">
            Add, edit, or delete categories for your properties.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add Button */}
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#6B7F39] hover:bg-[#556230] text-white w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          )}

          {/* Form */}
          {showForm && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Studio, Bedsitter"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bedrooms">Number of Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="0"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this category"
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="bg-[#6B7F39] hover:bg-[#556230] text-white"
                  >
                    {editingCategory ? 'Update' : 'Create'}
                  </Button>
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-[#2C3E50]">Existing Categories</h3>
            {loading ? (
              <p className="text-center py-8 text-[#7F8C8D]">Loading...</p>
            ) : categories.length === 0 ? (
              <p className="text-center py-8 text-[#7F8C8D]">No categories found</p>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#6B7F39] transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-[#2C3E50]">{category.name}</h4>
                      <p className="text-sm text-[#7F8C8D]">
                        {category.bedrooms} {category.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
                      </p>
                      {category.description && (
                        <p className="text-xs text-[#7F8C8D] mt-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-[#3498DB]" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-[#E74C3C]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};