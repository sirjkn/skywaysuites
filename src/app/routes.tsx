import { createBrowserRouter } from 'react-router';
import { RootLayout } from './components/layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminLayout } from './components/layouts/AdminLayout';
import { PropertiesPage } from './pages/admin/PropertiesPage';
import { FeaturesPage } from './pages/admin/FeaturesPage';
import { CustomersPage } from './pages/admin/CustomersPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'property/:id', Component: PropertyDetailPage },
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage },
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
      { path: 'reports', Component: ReportsPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
