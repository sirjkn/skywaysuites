import { useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, Customer } from '../../services/api';
import { Plus, Edit, Trash2, User, Upload, X, Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { convertToWebP, isValidImageFile } from '../../utils/imageUtils';

export const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    photo: '',
    password: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '', photo: '', password: '' });
    setEditingCustomer(null);
    setPhotoPreview('');
    setShowPassword(false);
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      photo: customer.photo || '',
      password: '',
    });
    setPhotoPreview(customer.photo || '');
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      await deleteCustomer(id);
      toast.success('Customer deleted successfully');
      loadCustomers();
    } catch (error) {
      toast.error('Failed to delete customer');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
        toast.success('Customer updated successfully');
      } else {
        await createCustomer(formData);
        toast.success('Customer created successfully');
      }
      setDialogOpen(false);
      resetForm();
      loadCustomers();
    } catch (error) {
      // Check if it's a duplicate email error
      if (error instanceof Error && error.message.includes('email already exists')) {
        toast.error('This email is already registered in the system');
      } else {
        toast.error('Failed to save customer');
      }
      console.error('Error saving customer:', error);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!isValidImageFile(file)) {
      toast.error('Invalid image file. Please upload a valid image.');
      return;
    }

    setUploadingPhoto(true);
    try {
      const webPImage = await convertToWebP(file, { maxWidth: 800, maxHeight: 800, quality: 0.85 });
      setFormData({ ...formData, photo: webPImage });
      setPhotoPreview(webPImage);
      toast.success('Photo uploaded and converted to WebP successfully!');
    } catch (error) {
      console.error('Error converting image to WebP:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#36454F]">Customers</h1>
          <p className="text-[#36454F]/70 mt-1">Manage customer information</p>
        </div>
        <Button onClick={handleAdd} className="bg-[#36454F] hover:bg-[#2C3E50] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#6B7F39]/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5E6D3]">
              <tr>
                <th className="px-6 py-4 text-left text-[#36454F]">Customer</th>
                <th className="px-6 py-4 text-left text-[#36454F]">Email</th>
                <th className="px-6 py-4 text-left text-[#36454F]">Phone</th>
                <th className="px-6 py-4 text-left text-[#36454F]">Address</th>
                <th className="px-6 py-4 text-right text-[#36454F]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#6B7F39]/10">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#FAF4EC] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {customer.photo ? (
                        <img
                          src={customer.photo}
                          alt={customer.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#6B7F39] flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <span className="font-medium text-[#36454F]">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#36454F]">{customer.email}</td>
                  <td className="px-6 py-4 text-[#36454F]">{customer.phone}</td>
                  <td className="px-6 py-4 text-[#36454F]">{customer.address}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => handleEdit(customer)}
                        variant="ghost"
                        size="sm"
                        className="text-[#6B7F39] hover:text-[#556230]"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(customer.id)}
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
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#36454F]/70">
              {editingCustomer ? 'Update the customer details below.' : 'Enter the customer details below.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Customer Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                rows={3}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="photoUpload">Upload Photo (optional)</Label>
              <div className="mt-1">
                {photoPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-lg object-cover border-2 border-[#6B7F39]/30"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        setPhotoPreview('');
                        setFormData({ ...formData, photo: '' });
                      }}
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      id="photoUpload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="cursor-pointer"
                    />
                    {uploadingPhoto && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
                        <Upload className="w-5 h-5 text-[#6B7F39] animate-pulse" />
                        <span className="ml-2 text-sm text-[#36454F]">Converting to WebP...</span>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-[#36454F]/60 mt-1">
                  Images will be automatically converted to WebP format and compressed for faster loading
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="password">{editingCustomer ? 'Password (leave blank to keep unchanged)' : 'Password'}</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7F39]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingCustomer}
                  placeholder="Enter password"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7F39] hover:text-[#556230]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#36454F] hover:bg-[#2C3E50] text-white">
                {editingCustomer ? 'Update' : 'Create'} Customer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};