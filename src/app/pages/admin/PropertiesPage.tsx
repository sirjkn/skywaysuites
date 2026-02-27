import { useState, useEffect } from 'react';
import { 
  getProperties, 
  getFeatures, 
  createProperty, 
  updateProperty, 
  deleteProperty,
  Property, 
  Feature 
} from '../../services/api';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { toast } from 'sonner';

export const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    location: '',
    bedrooms: '0',
    bathrooms: '1',
    area: '',
    category: 'Bedsitter' as Property['category'],
    description: '',
    features: [] as string[],
    imageUrls: [''],
    defaultImageIndex: 0,
    available: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [propertiesData, featuresData] = await Promise.all([
        getProperties(),
        getFeatures(),
      ]);
      setProperties(propertiesData);
      setFeatures(featuresData);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      location: '',
      bedrooms: '0',
      bathrooms: '1',
      area: '',
      category: 'Bedsitter',
      description: '',
      features: [],
      imageUrls: [''],
      defaultImageIndex: 0,
      available: true,
    });
    setEditingProperty(null);
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      price: property.price.toString(),
      location: property.location,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area.toString(),
      category: property.category,
      description: property.description,
      features: property.features,
      imageUrls: property.images.map(img => img.url),
      defaultImageIndex: property.images.findIndex(img => img.isDefault),
      available: property.available,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await deleteProperty(id);
      toast.success('Property deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete property');
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const propertyData = {
      name: formData.name,
      price: parseFloat(formData.price),
      location: formData.location,
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      area: parseInt(formData.area),
      category: formData.category,
      description: formData.description,
      features: formData.features,
      images: formData.imageUrls.filter(url => url.trim()).map((url, index) => ({
        id: `img-${index}`,
        url,
        isDefault: index === formData.defaultImageIndex,
      })),
      available: formData.available,
    };

    try {
      if (editingProperty) {
        await updateProperty(editingProperty.id, propertyData);
        toast.success('Property updated successfully');
      } else {
        await createProperty(propertyData);
        toast.success('Property created successfully');
      }
      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error('Failed to save property');
      console.error(error);
    }
  };

  const addImageUrl = () => {
    setFormData({
      ...formData,
      imageUrls: [...formData.imageUrls, ''],
    });
  };

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...formData.imageUrls];
    newUrls[index] = url;
    setFormData({ ...formData, imageUrls: newUrls });
  };

  const removeImageUrl = (index: number) => {
    const newUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData({ 
      ...formData, 
      imageUrls: newUrls.length > 0 ? newUrls : [''],
      defaultImageIndex: formData.defaultImageIndex >= newUrls.length ? 0 : formData.defaultImageIndex,
    });
  };

  const toggleFeature = (featureId: string) => {
    setFormData({
      ...formData,
      features: formData.features.includes(featureId)
        ? formData.features.filter(id => id !== featureId)
        : [...formData.features, featureId],
    });
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#36454F]">Properties</h1>
          <p className="text-[#36454F]/70 mt-1">Manage your property listings</p>
        </div>
        <Button onClick={handleAdd} className="bg-[#6B7F39] hover:bg-[#556230]">
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#6B7F39]/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5E6D3]">
              <tr>
                <th className="px-6 py-4 text-left text-[#36454F]">Property</th>
                <th className="px-6 py-4 text-left text-[#36454F]">Category</th>
                <th className="px-6 py-4 text-left text-[#36454F]">Location</th>
                <th className="px-6 py-4 text-left text-[#36454F]">Price/Day</th>
                <th className="px-6 py-4 text-left text-[#36454F]">Status</th>
                <th className="px-6 py-4 text-right text-[#36454F]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#6B7F39]/10">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-[#FAF4EC] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={property.images.find(img => img.isDefault)?.url}
                        alt={property.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-[#36454F]">{property.name}</p>
                        <p className="text-sm text-[#36454F]/70">{property.bedrooms} bed, {property.bathrooms} bath</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#36454F]">{property.category}</td>
                  <td className="px-6 py-4 text-[#36454F]">{property.location}</td>
                  <td className="px-6 py-4 text-[#6B7F39] font-semibold">${property.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      property.available 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {property.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => handleEdit(property)}
                        variant="ghost"
                        size="sm"
                        className="text-[#6B7F39] hover:text-[#556230]"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(property.id)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#36454F]">
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Property Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value as Property['category'] })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bedsitter">Bedsitter</SelectItem>
                    <SelectItem value="1-Bedroom">1-Bedroom</SelectItem>
                    <SelectItem value="2-Bedroom">2-Bedroom</SelectItem>
                    <SelectItem value="3-Bedroom">3-Bedroom</SelectItem>
                    <SelectItem value="4-Bedroom">4-Bedroom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price per Day ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
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
              
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="1"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="area">Area (sqft)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label>Features</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature.id}`}
                      checked={formData.features.includes(feature.id)}
                      onCheckedChange={() => toggleFeature(feature.id)}
                    />
                    <label htmlFor={`feature-${feature.id}`} className="text-sm cursor-pointer">
                      {feature.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Images (URLs)</Label>
                <Button type="button" onClick={addImageUrl} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Image
                </Button>
              </div>
              <div className="space-y-3">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, defaultImageIndex: index })}
                      className={formData.defaultImageIndex === index ? 'bg-[#6B7F39] text-white' : ''}
                    >
                      Default
                    </Button>
                    {formData.imageUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImageUrl(index)}
                        className="text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked as boolean })}
              />
              <label htmlFor="available" className="text-sm cursor-pointer">
                Property is available for booking
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#6B7F39] hover:bg-[#556230]">
                {editingProperty ? 'Update' : 'Create'} Property
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
