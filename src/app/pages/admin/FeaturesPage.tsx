import { useState, useEffect } from 'react';
import { getFeatures, createFeature, updateFeature, deleteFeature, Feature } from '../../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { toast } from 'sonner';

export const FeaturesPage = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [formData, setFormData] = useState({ name: '', icon: '' });

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const data = await getFeatures();
      setFeatures(data);
    } catch (error) {
      toast.error('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', icon: '' });
    setEditingFeature(null);
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setFormData({ name: feature.name, icon: feature.icon || '' });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;
    
    try {
      await deleteFeature(id);
      toast.success('Feature deleted successfully');
      loadFeatures();
    } catch (error) {
      toast.error('Failed to delete feature');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingFeature) {
        await updateFeature(editingFeature.id, formData);
        toast.success('Feature updated successfully');
      } else {
        await createFeature(formData);
        toast.success('Feature created successfully');
      }
      setDialogOpen(false);
      resetForm();
      loadFeatures();
    } catch (error) {
      toast.error('Failed to save feature');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#36454F]">Features</h1>
          <p className="text-[#36454F]/70 mt-1">Manage property features and amenities</p>
        </div>
        <Button onClick={handleAdd} className="bg-[#6B7F39] hover:bg-[#556230] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#6B7F39]/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5E6D3]">
              <tr>
                <th className="px-6 py-4 text-left text-[#36454F]">Feature Name</th>
                <th className="px-6 py-4 text-left text-[#36454F]">Icon</th>
                <th className="px-6 py-4 text-right text-[#36454F]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#6B7F39]/10">
              {features.map((feature) => (
                <tr key={feature.id} className="hover:bg-[#FAF4EC] transition-colors">
                  <td className="px-6 py-4 text-[#36454F] font-medium">{feature.name}</td>
                  <td className="px-6 py-4 text-[#36454F]/70">{feature.icon || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => handleEdit(feature)}
                        variant="ghost"
                        size="sm"
                        className="text-[#6B7F39] hover:text-[#556230]"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(feature.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#36454F]">
              {editingFeature ? 'Edit Feature' : 'Add New Feature'}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#36454F]/70">
              {editingFeature ? 'Edit the details of the feature.' : 'Add a new feature to the system.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Feature Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., WiFi, Parking, Pool"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="icon">Icon (Lucide icon name)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., Wifi, Car, Waves"
                className="mt-1"
              />
              <p className="text-xs text-[#36454F]/70 mt-1">
                Optional: Icon name from Lucide React library
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#6B7F39] hover:bg-[#556230] text-white">
                {editingFeature ? 'Update' : 'Create'} Feature
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};