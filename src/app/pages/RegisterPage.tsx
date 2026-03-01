import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Mail, Lock, User, Eye, EyeOff, Phone, MapPin, Upload, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { convertToWebP, isValidImageFile } from '../utils/imageUtils';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    photo: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!isValidImageFile(file)) {
      toast.error('Invalid image file. Please upload a valid image.');
      return;
    }

    setUploadingPhoto(true);
    try {
      const webPImage = await convertToWebP(file, { maxWidth: 800, maxHeight: 800, quality: 0.85 });
      setFormData({ ...formData, photo: webPImage });
      setPhotoPreview(webPImage);
      toast.success('Photo uploaded and converted to WebP successfully!');
    } catch (error) {
      console.error('Error converting image to WebP:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.name, formData.phone);
      toast.success('Registration successful! Welcome to Skyway Suites');
      navigate('/', { replace: true });
    } catch (error: any) {
      const errorMessage = error?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-[#FDFCFA] to-[#FAF4EC] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8 group">
          <div className="bg-[#36454F] p-3 rounded-lg group-hover:bg-[#2C3E50] transition-colors">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <span className="text-3xl font-bold text-[#36454F]">Skyway Suites</span>
        </Link>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#6B7F39]/10">
          <h1 className="text-3xl font-bold text-[#36454F] mb-2">Create Account</h1>
          <p className="text-[#36454F]/70 mb-8">Join Skyway Suites today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-[#36454F]">Full Name</Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7F39]" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="pl-10 h-12 border-[#6B7F39]/20 focus:border-[#6B7F39]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-[#36454F]">Email Address</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7F39]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="pl-10 h-12 border-[#6B7F39]/20 focus:border-[#6B7F39]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-[#36454F]">Phone Number</Label>
              <div className="relative mt-2">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7F39]" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 700 000 000"
                  className="pl-10 h-12 border-[#6B7F39]/20 focus:border-[#6B7F39]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-[#36454F]">Address</Label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-[#6B7F39]" />
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows={3}
                  className="pl-10 border-[#6B7F39]/20 focus:border-[#6B7F39] resize-none"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="photoUpload" className="text-[#36454F]">Profile Photo (optional)</Label>
              <div className="mt-2">
                {photoPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-lg object-cover border-2 border-[#6B7F39]/30"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        setPhotoPreview('');
                        setFormData({ ...formData, photo: '' });
                      }}
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      id="photoUpload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="cursor-pointer"
                    />
                    {uploadingPhoto && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
                        <Upload className="w-5 h-5 text-[#6B7F39] animate-pulse" />
                        <span className="ml-2 text-sm text-[#36454F]">Converting...</span>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-[#36454F]/60 mt-1">
                  Images will be automatically converted to WebP format
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-[#36454F]">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7F39]" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
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

            <div>
              <Label htmlFor="confirmPassword" className="text-[#36454F]">Confirm Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7F39]" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10 h-12 border-[#6B7F39]/20 focus:border-[#6B7F39]"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#36454F] hover:bg-[#2C3E50] text-white h-12 text-lg"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#36454F]/70">
              Already have an account?{' '}
              <Link to="/login" className="text-[#6B7F39] hover:text-[#556230] font-medium">
                Login here
              </Link>
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