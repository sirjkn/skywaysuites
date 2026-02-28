import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, UserCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { storageService } from '../../services/storage';
import type { AppUser } from '../../services/storage';

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

const DEFAULT_ROLES: UserRole[] = [
  {
    id: 'admin',
    name: 'Administrator',
    permissions: [
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
      'properties.view',
      'properties.create',
      'properties.edit',
      'properties.delete',
      'customers.view',
      'customers.create',
      'customers.edit',
      'customers.delete',
      'bookings.view',
      'bookings.create',
      'bookings.edit',
      'bookings.delete',
      'features.view',
      'features.create',
      'features.edit',
      'features.delete',
      'settings.view',
      'settings.edit',
      'reports.view',
    ],
  },
  {
    id: 'manager',
    name: 'Manager',
    permissions: [
      'properties.view',
      'properties.edit',
      'customers.view',
      'customers.edit',
      'bookings.view',
      'bookings.edit',
      'features.view',
      'reports.view',
    ],
  },
  {
    id: 'customer',
    name: 'Customer',
    permissions: [
      'properties.view',
      'bookings.view',
      'bookings.create',
    ],
  },
];

const DEFAULT_ADMIN: AppUser = {
  id: 'admin-default',
  name: 'Administrator',
  email: 'admin@123.com',
  password: '123',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

export const UsersSettings: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [roles] = useState<UserRole[]>(DEFAULT_ROLES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const loadedUsers = await storageService.getAppUsers();
      if (loadedUsers && loadedUsers.length > 0) {
        setUsers(loadedUsers);
      } else {
        // Initialize with default admin if no users exist
        const defaultUsers = [DEFAULT_ADMIN];
        setUsers(defaultUsers);
        await storageService.createAppUser(DEFAULT_ADMIN);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      // Initialize with default admin if error
      const defaultUsers = [DEFAULT_ADMIN];
      setUsers(defaultUsers);
      await storageService.createAppUser(DEFAULT_ADMIN);
    }
  };

  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check if email already exists
    if (users.some(u => u.email === formData.email)) {
      toast.error('A user with this email already exists');
      return;
    }

    const newUser: AppUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      createdAt: new Date().toISOString(),
    };

    try {
      await storageService.createAppUser(newUser);
      setUsers([...users, newUser]);
      toast.success('User added successfully');
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'customer' });
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user. Please try again.');
    }
  };

  const handleEditUser = async () => {
    if (!editingUser || !formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check if email already exists (excluding current user)
    if (users.some(u => u.email === formData.email && u.id !== editingUser.id)) {
      toast.error('A user with this email already exists');
      return;
    }

    try {
      await storageService.updateAppUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      const updatedUsers = users.map(u =>
        u.id === editingUser.id
          ? { ...u, name: formData.name, email: formData.email, password: formData.password, role: formData.role }
          : u
      );

      setUsers(updatedUsers);
      toast.success('User updated successfully');
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'customer' });
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Prevent deleting the default admin
    if (userId === 'admin-default') {
      toast.error('Cannot delete the default administrator');
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await storageService.deleteAppUser(userId);
        const updatedUsers = users.filter(u => u.id !== userId);
        setUsers(updatedUsers);
        toast.success('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user. Please try again.');
      }
    }
  };

  const openEditModal = (user: AppUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'customer' });
  };

  const getRolePermissions = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.permissions : [];
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#36454F]">Users & Roles</h2>
          <p className="text-sm text-[#36454F]/70 mt-1">
            Manage system users and their permissions
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#36454F] hover:bg-[#2C3E50] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Roles Overview */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-[#36454F] mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#6B7F39]" />
          Available Roles
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {roles.map(role => (
            <div
              key={role.id}
              className="p-4 bg-[#FAF4EC] rounded-lg border border-[#6B7F39]/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-5 h-5 text-[#6B7F39]" />
                <h4 className="font-semibold text-[#36454F]">{role.name}</h4>
              </div>
              <p className="text-xs text-[#36454F]/70 mb-2">
                {role.permissions.length} permissions
              </p>
              <div className="text-xs text-[#36454F]/60">
                {role.id === 'admin' && '✓ Full system access'}
                {role.id === 'manager' && '✓ Property & booking management'}
                {role.id === 'customer' && '✓ View properties & make bookings'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users List */}
      <div>
        <h3 className="text-lg font-semibold text-[#36454F] mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#6B7F39]" />
          System Users ({users.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5E6D3]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#36454F]">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#36454F]">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#36454F]">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#36454F]">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-[#36454F]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#6B7F39]/10">
              {users.map(user => {
                const role = roles.find(r => r.id === user.role);
                return (
                  <tr key={user.id} className="hover:bg-[#FAF4EC]">
                    <td className="px-4 py-3 text-sm text-[#36454F]">
                      {user.name}
                      {user.id === 'admin-default' && (
                        <span className="ml-2 text-xs bg-[#6B7F39] text-white px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#36454F]">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-red-100 text-red-700'
                            : user.role === 'manager'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {role?.name || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#36454F]/70">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-[#F5E6D3] rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit2 className="w-4 h-4 text-[#6B7F39]" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete user"
                          disabled={user.id === 'admin-default'}
                        >
                          <Trash2
                            className={`w-4 h-4 ${
                              user.id === 'admin-default'
                                ? 'text-gray-300'
                                : 'text-red-500'
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-[#36454F] mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="userName">Full Name</Label>
                <Input
                  id="userName"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="userPassword">Password</Label>
                <Input
                  id="userPassword"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="userRole">Role</Label>
                <Select value={formData.role} onValueChange={value => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#36454F]/60 mt-1">
                  {formData.role && `${getRolePermissions(formData.role).length} permissions included`}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={editingUser ? handleEditUser : handleAddUser}
                className="flex-1 bg-[#36454F] hover:bg-[#2C3E50] text-white"
              >
                {editingUser ? 'Save Changes' : 'Add User'}
              </Button>
              <Button
                onClick={closeModal}
                variant="outline"
                className="flex-1 border-[#6B7F39]/30 text-[#36454F]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};