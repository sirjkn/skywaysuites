import { useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, Customer } from '../../services/api';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { toast } from 'sonner';

export const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    photo: '',
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
    setFormData({ name: '', email: '', phone: '', address: '', photo: '' });
    setEditingCustomer(null);
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
    });
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
      toast.error('Failed to save customer');
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
        <Button onClick={handleAdd} className="bg-[#6B7F39] hover:bg-[#556230] text-white">
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
              <Label htmlFor="photo">Photo URL (optional)</Label>
              <Input
                id="photo"
                type="url"
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#6B7F39] hover:bg-[#556230] text-white">
                {editingCustomer ? 'Update' : 'Create'} Customer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};