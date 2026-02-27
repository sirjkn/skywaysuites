import { Link, useNavigate } from 'react-router';
import { Building2, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-[#6B7F39] p-2 rounded-lg group-hover:bg-[#556230] transition-colors">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xl text-[#36454F]">Skyway Suites</span>
              <span className="text-xs text-[#6B7F39]">Your Perfect Stay</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-[#36454F] hover:text-[#6B7F39] transition-colors font-medium"
            >
              Home
            </Link>
            <a
              href="#properties"
              className="text-[#36454F] hover:text-[#6B7F39] transition-colors font-medium"
            >
              Properties
            </a>
            <a
              href="#about"
              className="text-[#36454F] hover:text-[#6B7F39] transition-colors font-medium"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-[#36454F] hover:text-[#6B7F39] transition-colors font-medium"
            >
              Contact
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#F5E6D3] rounded-lg">
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
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-[#36454F] hover:bg-[#F5E6D3] transition-colors"
            >
              Home
            </Link>
            <a
              href="#properties"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-[#36454F] hover:bg-[#F5E6D3] transition-colors"
            >
              Properties
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-[#36454F] hover:bg-[#F5E6D3] transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-[#36454F] hover:bg-[#F5E6D3] transition-colors"
            >
              Contact
            </a>

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
