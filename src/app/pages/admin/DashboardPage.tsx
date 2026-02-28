import { Building2, Star, Users, FileText, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { getProperties, getCustomers } from '../../services/api';

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalCustomers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    loading: true,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [properties, customers] = await Promise.all([
          getProperties(),
          getCustomers(),
        ]);
        
        setStats({
          totalProperties: properties.length,
          totalCustomers: customers.length,
          totalBookings: 0, // Mock data
          totalRevenue: 0, // Mock data
          loading: false,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    loadStats();
  }, []);

  const quickActions = [
    {
      title: 'Properties',
      description: 'Manage property listings with full CRUD operations',
      icon: Building2,
      color: 'bg-blue-50',
      iconColor: 'text-blue-500',
      path: '/admin/properties',
    },
    {
      title: 'Features',
      description: 'Manage property features and amenities',
      icon: Star,
      color: 'bg-purple-50',
      iconColor: 'text-purple-500',
      path: '/admin/features',
    },
    {
      title: 'Customers',
      description: 'View and manage customer information',
      icon: Users,
      color: 'bg-green-50',
      iconColor: 'text-green-500',
      path: '/admin/customers',
    },
    {
      title: 'Reports',
      description: 'View analytics and detailed reports',
      icon: FileText,
      color: 'bg-orange-50',
      iconColor: 'text-orange-500',
      path: '/admin/reports',
    },
    {
      title: 'Settings',
      description: 'Configure system settings and preferences',
      icon: SettingsIcon,
      color: 'bg-red-50',
      iconColor: 'text-red-500',
      path: '/admin/settings',
    },
  ];

  const statCards = [
    {
      label: 'Total Properties',
      value: stats.loading ? '--' : stats.totalProperties,
      loading: stats.loading,
    },
    {
      label: 'Total Customers',
      value: stats.loading ? '--' : stats.totalCustomers,
      loading: stats.loading,
    },
    {
      label: 'Total Bookings',
      value: stats.loading ? '--' : stats.totalBookings,
      loading: stats.loading,
    },
    {
      label: 'Total Revenue',
      value: stats.loading ? 'Sh --' : `Sh ${stats.totalRevenue.toLocaleString()}`,
      loading: stats.loading,
      highlight: true,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">Admin Dashboard</h1>
        <p className="text-[#7F8C8D]">Manage all aspects of Skyway Suites</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.path}
              to={action.path}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className={`${action.color} ${action.iconColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-[#2C3E50] mb-2">{action.title}</h3>
              <p className="text-sm text-[#7F8C8D] leading-relaxed">{action.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h4 className="text-sm text-[#7F8C8D] mb-2">{stat.label}</h4>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold ${stat.highlight ? 'text-[#6B7F39]' : 'text-[#2C3E50]'}`}>
                {stat.value}
              </p>
            </div>
            {stat.loading && (
              <p className="text-xs text-[#7F8C8D] mt-1">Loading...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};