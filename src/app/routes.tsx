import { createBrowserRouter } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { RootLayout } from './components/layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DynamicPage } from './pages/DynamicPage';
import { AdminLayout } from './components/layouts/AdminLayout';
import { DashboardPage } from './pages/admin/DashboardPage';
import { PropertiesPage } from './pages/admin/PropertiesPage';
import { FeaturesPage } from './pages/admin/FeaturesPage';
import { CustomersPage } from './pages/admin/CustomersPage';
import { BookingsPage } from './pages/admin/BookingsPage';
import { MenuPagesPage } from './pages/admin/MenuPagesPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { NotFound } from './pages/NotFound';
import { UnderMaintenancePage } from './pages/UnderMaintenancePage';
import { Outlet, Navigate, useLocation } from 'react-router';
import { useAuth } from './contexts/AuthContext';
import { useEffect, useState } from 'react';

// Maintenance Mode Wrapper - checks if maintenance mode is enabled
const MaintenanceWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkMaintenance = () => {
      const stored = localStorage.getItem('generalSettings');
      if (stored) {
        try {
          const settings = JSON.parse(stored);
          setMaintenanceMode(settings.maintenanceMode || false);
        } catch (error) {
          console.error('Error loading general settings:', error);
          setMaintenanceMode(false);
        }
      } else {
        setMaintenanceMode(false);
      }
    };
    
    // Check admin status from localStorage
    const checkAdminStatus = () => {
      const storedUser = localStorage.getItem('skyway_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setIsAdmin(user.role === 'admin');
        } catch (error) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    
    checkMaintenance();
    checkAdminStatus();
    
    // Listen for settings changes
    const handleSettingsChange = () => {
      checkMaintenance();
    };
    
    // Listen for auth changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'skyway_user') {
        checkAdminStatus();
      }
    };
    
    window.addEventListener('generalSettingsChanged', handleSettingsChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('generalSettingsChanged', handleSettingsChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Allow admins to access the site even in maintenance mode
  // Also allow access to login/register pages so users can login as admin
  if (maintenanceMode && !isAdmin && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/register')) {
    return <UnderMaintenancePage />;
  }
  
  return <>{children}</>;
};

// Root wrapper component that provides AuthContext to all routes
const RootWrapper = () => {
  return (
    <AuthProvider>
      <MaintenanceWrapper>
        <Outlet />
      </MaintenanceWrapper>
    </AuthProvider>
  );
};

export const router = createBrowserRouter([
  {
    element: <RootWrapper />,
    children: [
      {
        path: '/',
        Component: RootLayout,
        children: [
          { index: true, Component: HomePage },
          { path: 'property/:id', Component: PropertyDetailPage },
          { path: 'login', Component: LoginPage },
          { path: 'register', Component: RegisterPage },
          { path: 'page/:slug', Component: DynamicPage },
          { path: ':slug', Component: DynamicPage }, // Catch-all for dynamic menu pages
        ],
      },
      {
        path: '/admin',
        Component: AdminLayout,
        children: [
          { index: true, Component: PropertiesPage },
          { path: 'properties', Component: PropertiesPage },
          { path: 'features', Component: FeaturesPage },
          { path: 'customers', Component: CustomersPage },
          { path: 'bookings', Component: BookingsPage },
          { path: 'menu-pages', Component: MenuPagesPage },
          { path: 'reports', Component: ReportsPage },
          { path: 'settings', Component: SettingsPage },
        ],
      },
      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
]);