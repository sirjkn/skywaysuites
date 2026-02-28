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
import { MenuPagesPage } from './pages/admin/MenuPagesPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { NotFound } from './pages/NotFound';
import { Outlet } from 'react-router';

// Root wrapper component that provides AuthContext to all routes
const RootWrapper = () => {
  return (
    <AuthProvider>
      <Outlet />
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