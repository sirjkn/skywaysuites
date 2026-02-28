import { Link, useNavigate } from 'react-router';
import { Building2, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { getMenuPages, MenuPage } from '../services/api';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuPages, setMenuPages] = useState<MenuPage[]>([]);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadMenuPages = async () => {
      try {
        const pages = await getMenuPages();
        setMenuPages(pages.filter(p => p.visible).sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error('Error loading menu pages:', error);
      }
    };

    loadMenuPages();
  }, []);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-effect shadow-lg' : 'bg-white/95'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-olive p-2.5 rounded-xl group-hover:shadow-charcoal transition-all duration-300 group-hover:scale-110">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xl text-[#36454F]">Skyway Suites</span>
              <span className="text-xs text-[#6B7F39] font-medium">Your Perfect Stay</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {menuPages.map(page => (
              <Link
                key={page.id}
                to={page.path}
                className="text-[#36454F] hover:text-[#6B7F39] transition-all duration-300 font-medium relative group/link"
              >
                {page.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-olive group-hover/link:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-warm rounded-xl shadow-sm">
                  <User className="w-4 h-4 text-[#6B7F39]" />
                  <span className="text-sm text-[#36454F]">{user?.name}</span>
                </div>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" className="border-[#6B7F39] text-[#6B7F39] hover:bg-[#6B7F39] hover:text-white">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-[#36454F] hover:text-[#6B7F39]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-[#36454F] hover:text-[#6B7F39]">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#6B7F39] hover:bg-[#556230] text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#F5E6D3] text-[#36454F] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#6B7F39]/20 bg-white">
          <div className="px-4 py-4 space-y-3">
            {menuPages.map(page => (
              <Link
                key={page.id}
                to={page.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-[#36454F] hover:bg-[#F5E6D3] transition-colors"
              >
                {page.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 bg-[#F5E6D3] rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#6B7F39]" />
                    <span className="text-sm text-[#36454F]">{user?.name}</span>
                  </div>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-[#36454F] hover:bg-[#F5E6D3] transition-colors"
                  >
                    <Settings className="w-4 h-4 inline mr-2" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg text-[#36454F] hover:bg-[#F5E6D3] transition-colors"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-[#36454F] hover:bg-[#F5E6D3] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-[#6B7F39] text-white hover:bg-[#556230] transition-colors text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};