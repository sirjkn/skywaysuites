import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-[#FDFCFA] to-[#FAF4EC] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8 group">
          <div className="bg-[#36454F] p-3 rounded-lg group-hover:bg-[#2C3E50] transition-colors">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <span className="text-3xl font-bold text-[#36454F]">Skyway Suites</span>
        </Link>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#6B7F39]/10">
          <h1 className="text-3xl font-bold text-[#36454F] mb-2">Welcome Back</h1>
          <p className="text-[#36454F]/70 mb-8">Login to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-[#36454F]">Email Address</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7F39]" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 h-12 border-[#6B7F39]/20 focus:border-[#6B7F39]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-[#36454F]">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7F39]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 border-[#6B7F39]/20 focus:border-[#6B7F39]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7F39] hover:text-[#556230]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#36454F] hover:bg-[#2C3E50] text-white h-12 text-lg"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#36454F]/70">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#6B7F39] hover:text-[#556230] font-medium">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-[#6B7F39]/10">
            <p className="text-sm text-center text-[#36454F]/70">
              Demo: Use any email/password to login
              <br />
              <span className="text-xs">
                (email with 'admin' for admin access)
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-[#6B7F39] hover:text-[#556230]">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};