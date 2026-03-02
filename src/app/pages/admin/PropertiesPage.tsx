import { useState, useEffect } from 'react';
import { 
  getProperties, 
  getFeatures, 
  getCategories,
  getLocations,
  createProperty, 
  updateProperty, 
  deleteProperty,
  Property, 
  Feature,
  Category,
  Location
} from '../../services/api';
import { Plus, Edit, Trash2, X, Upload, MapPin, Tag } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { compressAndConvertToWebP, validateImageFile, formatBytes } from '../../utils/imageCompression';
import { CategoriesModal } from '../../components/admin/CategoriesModal';
import { LocationsModal } from '../../components/admin/LocationsModal';

interface ImageUpload {
  file?: File;
  dataUrl: string;
  isDefault: boolean;
  uploadProgress: number;
  category: 'Living Room' | 'Bedroom' | 'Dining' | 'Kitchen' | 'Bathroom' | 'Amenities';
}

export const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [locationsModalOpen, setLocationsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [uploadingImages, setUploadingImages] = useState<ImageUpload[]>([]);
  const [selectedImageCategory, setSelectedImageCategory] = useState<'Living Room' | 'Bedroom' | 'Dining' | 'Kitchen' | 'Bathroom' | 'Amenities'>('Living Room');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    locationId: '',
    bedrooms: '0',
    bathrooms: '1',
    area: '',
    categoryId: '',
    description: '',
    features: [] as string[],
    available: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [propertiesData, featuresData, categoriesData, locationsData] = await Promise.all([
        getProperties(),
        getFeatures(),
        getCategories(),
        getLocations(),
      ]);
      setProperties(propertiesData);
      setFeatures(featuresData);
      setCategories(categoriesData);
      setLocations(locationsData);
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
      locationId: '',
      bedrooms: '0',
      bathrooms: '1',
      area: '',
      categoryId: '',
      description: '',
      features: [],
      available: true,
    });
    setUploadingImages([]);
    setEditingProperty(null);
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    
    // Find matching category and location
    const category = categories.find(c => c.name === property.category);
    const location = locations.find(l => property.location.includes(l.name));
    
    setFormData({
      name: property.name,
      price: property.price.toString(),
      locationId: location?.id || '',
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area.toString(),
      categoryId: category?.id || '',
      description: property.description,
      features: property.features,
      available: property.available,
    });
    
    // Set existing images
    setUploadingImages(property.images.map(img => ({
      dataUrl: img.url,
      isDefault: img.isDefault,
      uploadProgress: 100,
      category: img.category || 'Living Room' // Use existing category or default to Living Room
    })));
    
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    // Show initial toast for multiple files
    if (files.length > 1) {
      toast.info(`📤 Uploading ${files.length} images...`);
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const file of files) {
      // Validate file
      const error = validateImageFile(file, 5);
      if (error) {
        toast.error(`${file.name}: ${error}`);
        errorCount++;
        continue;
      }
      
      // Add placeholder for upload progress
      const uploadId = Date.now() + Math.random();
      const newImage: ImageUpload = {
        file,
        dataUrl: '',
        isDefault: uploadingImages.length === 0,
        uploadProgress: 0,
        category: selectedImageCategory
      };
      
      setUploadingImages(prev => [...prev, newImage]);
      
      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadingImages(prev => 
            prev.map(img => 
              img.file === file && img.uploadProgress < 90 
                ? { ...img, uploadProgress: img.uploadProgress + 10 }
                : img
            )
          );
        }, 100);
        
        // Compress and convert to WebP
        const result = await compressAndConvertToWebP(file);
        
        clearInterval(progressInterval);
        
        // Update with compressed image
        setUploadingImages(prev => 
          prev.map(img => 
            img.file === file 
              ? { 
                  ...img, 
                  dataUrl: result.dataUrl, 
                  file: result.file,
                  uploadProgress: 100 
                }
              : img
          )
        );
        
        successCount++;
        
        if (files.length === 1) {
          toast.success(`Image compressed: ${formatBytes(result.originalSize)} → ${formatBytes(result.compressedSize)} (${result.compressionRatio.toFixed(1)}% reduction)`);
        }
      } catch (error) {
        errorCount++;
        toast.error(error instanceof Error ? error.message : `Failed to compress ${file.name}`);
        setUploadingImages(prev => prev.filter(img => img.file !== file));
      }
    }
    
    // Show summary for multiple files
    if (files.length > 1) {
      if (successCount > 0 && errorCount === 0) {
        toast.success(`✅ Successfully uploaded ${successCount} image${successCount > 1 ? 's' : ''}!`);
      } else if (successCount > 0 && errorCount > 0) {
        toast.warning(`⚠️ Uploaded ${successCount} image${successCount > 1 ? 's' : ''}, ${errorCount} failed.`);
      } else if (errorCount > 0) {
        toast.error(`❌ Failed to upload ${errorCount} image${errorCount > 1 ? 's' : ''}.`);
      }
    }
    
    // Reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setUploadingImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // If removed image was default and there are other images, make first one default
      if (prev[index].isDefault && newImages.length > 0) {
        newImages[0].isDefault = true;
      }
      return newImages;
    });
  };

  const setDefaultImage = (index: number) => {
    setUploadingImages(prev => 
      prev.map((img, i) => ({
        ...img,
        isDefault: i === index,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadingImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    const category = categories.find(c => c.id === formData.categoryId);
    const location = locations.find(l => l.id === formData.locationId);
    
    if (!category || !location) {
      toast.error('Please select valid category and location');
      return;
    }
    
    const propertyData = {
      name: formData.name,
      price: parseFloat(formData.price),
      location: `${location.name}, ${location.city}`,
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      area: parseInt(formData.area),
      category: category.name as Property['category'],
      description: formData.description,
      features: formData.features,
      images: uploadingImages.map((img, index) => ({
        id: `img-${index}`,
        url: img.dataUrl,
        isDefault: img.isDefault,
        category: img.category,
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
      // Show detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to save property';
      toast.error(errorMessage);
      console.error('Error saving property:', error);
    }
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">Properties</h1>
          <p className="text-sm text-[#7F8C8D] mt-1">Manage your property listings</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            onClick={() => setCategoriesModalOpen(true)} 
            variant="outline" 
            className="text-xs sm:text-sm flex-1 sm:flex-none"
          >
            <Tag className="w-4 h-4 mr-2" />
            Categories
          </Button>
          <Button 
            onClick={() => setLocationsModalOpen(true)} 
            variant="outline" 
            className="text-xs sm:text-sm flex-1 sm:flex-none"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Locations
          </Button>
          <Button 
            onClick={handleAdd} 
            className="bg-[#36454F] hover:bg-[#2C3E50] text-white text-xs sm:text-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Property</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Category</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Location</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Price/Day</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Status</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 text-right text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-4 md:px-6 py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={property.images.find(img => img.isDefault)?.url}
                        alt={property.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-[#2C3E50] text-sm sm:text-base truncate">{property.name}</p>
                        <p className="text-xs sm:text-sm text-[#7F8C8D]">{property.bedrooms} bed, {property.bathrooms} bath</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-4 text-xs sm:text-sm text-[#2C3E50]">{property.category}</td>
                  <td className="px-3 sm:px-4 md:px-6 py-4 text-xs sm:text-sm text-[#2C3E50]">{property.location}</td>
                  <td className="px-3 sm:px-4 md:px-6 py-4 text-xs sm:text-sm font-semibold text-[#6B7F39]">Ksh {property.price}</td>
                  <td className="px-3 sm:px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      property.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {property.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <button
                        onClick={() => handleEdit(property)}
                        className="p-1.5 sm:p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3498DB]" />
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E74C3C]" />
                      </button>
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
            <DialogTitle className="text-2xl text-[#2C3E50]">
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#7F8C8D]">
              {editingProperty ? 'Update the details of this property.' : 'Enter the details of the new property.'}
            </DialogDescription>
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
                  value={formData.categoryId} 
                  onValueChange={(value) => {
                    const category = categories.find(c => c.id === value);
                    setFormData({ 
                      ...formData, 
                      categoryId: value,
                      bedrooms: category?.bedrooms.toString() || '0'
                    });
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories && categories.length > 0 ? (
                      categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name} ({category.bedrooms} {category.bedrooms === 1 ? 'bedroom' : 'bedrooms'})
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-4 text-sm text-center text-[#7F8C8D]">
                        No categories available. Click "Categories" button to add one.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price per Day (Ksh)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 1500"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Select 
                  value={formData.locationId} 
                  onValueChange={(value) => setFormData({ ...formData, locationId: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations && locations.length > 0 ? (
                      locations.map(location => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}, {location.city}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-4 text-sm text-center text-[#7F8C8D]">
                        No locations available. Click "Locations" button to add one.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  required
                  className="mt-1"
                  readOnly
                />
              </div>
              
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="area">Area (sq ft)</Label>
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
                rows={3}
                className="mt-1"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label>Property Images (Max 5MB each)</Label>
              
              {/* Category Tabs */}
              <div className="mt-3 flex flex-wrap gap-2">
                {(['Living Room', 'Bedroom', 'Dining', 'Kitchen', 'Bathroom', 'Amenities'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedImageCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedImageCategory === cat
                        ? 'bg-[#6B7F39] text-white'
                        : 'bg-gray-100 text-[#2C3E50] hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                    {uploadingImages.filter(img => img.category === cat).length > 0 && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                        {uploadingImages.filter(img => img.category === cat).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-3 space-y-4">
                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 border border-[#6B7F39] rounded-lg cursor-pointer hover:bg-[#6B7F39] hover:text-white transition-colors text-[#6B7F39] font-medium"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload to {selectedImageCategory}
                  </label>
                  <p className="text-xs text-[#7F8C8D] mt-1">
                    💡 Currently uploading to: <strong>{selectedImageCategory}</strong>. Select multiple images at once.
                  </p>
                </div>

                {/* Image Previews - Grouped by Category */}
                {(['Living Room', 'Bedroom', 'Dining', 'Kitchen', 'Bathroom', 'Amenities'] as const).map((cat) => {
                  const categoryImages = uploadingImages
                    .map((img, idx) => ({ img, idx }))
                    .filter(({ img }) => img.category === cat);
                  
                  if (categoryImages.length === 0) return null;

                  return (
                    <div key={cat} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-[#2C3E50] mb-3">{cat} ({categoryImages.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categoryImages.map(({ img: image, idx: index }) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                              {image.dataUrl ? (
                                <img
                                  src={image.dataUrl}
                                  alt={`${cat} ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-sm text-[#7F8C8D]">
                                      {image.uploadProgress}%
                                    </div>
                                    <div className="w-16 h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                                      <div 
                                        className="h-full bg-[#6B7F39] transition-all"
                                        style={{ width: `${image.uploadProgress}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            {image.uploadProgress === 100 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDefaultImage(index)}
                                  className={`absolute bottom-2 left-2 right-2 py-1 px-2 text-xs rounded ${
                                    image.isDefault
                                      ? 'bg-[#6B7F39] text-white'
                                      : 'bg-white text-[#6B7F39] opacity-0 group-hover:opacity-100'
                                  } transition-opacity`}
                                >
                                  {image.isDefault ? 'Default' : 'Set as Default'}
                                </button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <Label>Features</Label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature.id}`}
                      checked={formData.features.includes(feature.id)}
                      onCheckedChange={() => toggleFeature(feature.id)}
                    />
                    <label
                      htmlFor={`feature-${feature.id}`}
                      className="text-sm text-[#2C3E50] cursor-pointer"
                    >
                      {feature.name}
                    </label>
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
              <label htmlFor="available" className="text-sm text-[#2C3E50]">
                Available for booking
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#36454F] hover:bg-[#2C3E50] text-white">
                {editingProperty ? 'Update Property' : 'Create Property'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Categories Modal */}
      <CategoriesModal 
        open={categoriesModalOpen} 
        onOpenChange={setCategoriesModalOpen}
        onUpdate={loadData}
      />

      {/* Locations Modal */}
      <LocationsModal 
        open={locationsModalOpen} 
        onOpenChange={setLocationsModalOpen}
        onUpdate={loadData}
      />
    </div>
  );
};