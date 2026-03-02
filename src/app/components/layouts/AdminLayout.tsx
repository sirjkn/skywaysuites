import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Building2, 
  Star, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  FileStack,
  Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';

export const AdminLayout = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin', label: 'Properties', icon: Building2 },
    { path: '/admin/features', label: 'Features', icon: Star },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { path: '/admin/menu-pages', label: 'Menu Pages', icon: FileStack },
    { path: '/admin/reports', label: 'Reports', icon: FileText },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-warm flex">
      {/* Left Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-[240px] bg-gradient-charcoal fixed h-full z-40 shadow-charcoal">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-gradient-olive rounded-lg flex items-center justify-center shadow-olive">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="font-semibold text-lg text-white">Skyway</span>
          </div>
          <p className="text-xs text-[#95A5A6] ml-10">Admin Panel</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path === '/admin' && location.pathname === '/admin/properties');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-olive text-white shadow-olive'
                    : 'text-[#BDC3C7] hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Desktop */}
        <div className="p-3 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[#BDC3C7] hover:bg-white/5 hover:text-white transition-all"
          >
            <span className="text-sm">View Site</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-olive rounded-lg flex items-center justify-center shadow-olive">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="font-semibold text-base text-[#2C3E50]">Skyway Admin</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-[#F5E6D3] text-[#2C3E50] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 modal-backdrop z-40 animate-fade-in" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-gradient-charcoal shadow-charcoal animate-slide-in-left" onClick={(e) => e.stopPropagation()}>
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-gradient-olive rounded-lg flex items-center justify-center shadow-olive">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <span className="font-semibold text-lg text-white">Skyway</span>
              </div>
              <p className="text-xs text-[#95A5A6] ml-10">Admin Panel</p>
            </div>

            {/* Navigation Links */}
            <nav className="px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                               (item.path === '/admin' && location.pathname === '/admin/properties');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-olive text-white shadow-olive'
                        : 'text-[#BDC3C7] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Section */}
            <div className="absolute bottom-4 left-3 right-3 border-t border-white/10 pt-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[#BDC3C7] hover:bg-white/5 hover:text-white transition-all"
              >
                <span className="text-sm">View Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[#BDC3C7] hover:bg-white/5 hover:text-white transition-all mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[240px] w-full">
        {/* Top Bar - Desktop only */}
        <div className="hidden md:flex bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 lg:px-6 py-4 items-center justify-end gap-4 shadow-sm sticky top-0 z-30">
          <Link
            to="/"
            className="text-sm text-[#2C3E50] hover:text-[#6B7F39] transition-colors font-medium"
          >
            View Site
          </Link>
          <div className="border-l border-gray-300 pl-4 flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-[#6B7F39] font-medium truncate max-w-[150px]">{user?.email || 'admin@skyway.com'}</p>
              <p className="text-xs text-[#7F8C8D]">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-[#F5E6D3] rounded-lg transition-all duration-300"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-[#7F8C8D]" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-3 sm:p-4 md:p-6 page-transition mt-[56px] md:mt-0 w-full overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};