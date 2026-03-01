import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'sonner';
import {
  Location,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../../services/api';

interface LocationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const LocationsModal = ({ open, onOpenChange, onUpdate }: LocationsModalProps) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    area: '',
  });

  useEffect(() => {
    if (open) {
      loadLocations();
    }
  }, [open]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await getLocations();
      setLocations(data);
    } catch (error) {
      toast.error('Failed to load locations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLocation) {
        await updateLocation(editingLocation.id, formData);
        toast.success('Location updated successfully');
      } else {
        await createLocation(formData);
        toast.success('Location created successfully');
      }
      resetForm();
      loadLocations();
      onUpdate();
    } catch (error) {
      toast.error('Failed to save location');
      console.error(error);
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      city: location.city,
      area: location.area || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      await deleteLocation(id);
      toast.success('Location deleted successfully');
      loadLocations();
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete location');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      city: '',
      area: '',
    });
    setEditingLocation(null);
    setShowForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#2C3E50]">Manage Locations</DialogTitle>
          <DialogDescription className="text-sm text-[#7F8C8D]">
            Add, edit, or delete locations as needed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add Button */}
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#36454F] hover:bg-[#2C3E50] text-white w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Location
            </Button>
          )}

          {/* Form */}
          {showForm && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">
                {editingLocation ? 'Edit Location' : 'Add New Location'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Location Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Downtown, Westlands"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g., Nairobi"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="area">Area Description (Optional)</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g., High-end residential area"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="bg-[#36454F] hover:bg-[#2C3E50] text-white"
                  >
                    {editingLocation ? 'Update' : 'Create'}
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

          {/* Locations List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-[#2C3E50]">Existing Locations</h3>
            {loading ? (
              <p className="text-center py-8 text-[#7F8C8D]">Loading...</p>
            ) : locations.length === 0 ? (
              <p className="text-center py-8 text-[#7F8C8D]">No locations found</p>
            ) : (
              <div className="space-y-2">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#6B7F39] transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-[#2C3E50]">
                        {location.name}, {location.city}
                      </h4>
                      {location.area && (
                        <p className="text-sm text-[#7F8C8D] mt-1">{location.area}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(location)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-[#3498DB]" />
                      </button>
                      <button
                        onClick={() => handleDelete(location.id)}
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