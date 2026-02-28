import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getPropertyById, getFeatures, Property, Feature } from '../services/api';
import { Navbar } from '../components/Navbar';
import { BookingModal } from '../components/BookingModal';
import { useAuth } from '../contexts/AuthContext';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      try {
        const [propertyData, featuresData] = await Promise.all([
          getPropertyById(id),
          getFeatures(),
        ]);
        
        if (propertyData) {
          setProperty(propertyData);
          setFeatures(featuresData);
        } else {
          toast.error('Property not found');
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading property:', error);
        toast.error('Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id, navigate]);

  const handleBookProperty = () => {
    if (!isAuthenticated) {
      toast.info('Please login to book this property');
      navigate('/login', { state: { from: `/property/${id}` } });
    } else {
      setIsBookingModalOpen(true);
    }
  };

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFA]">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#36454F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#36454F]/70">Loading property...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const propertyFeatures = features.filter(f => property.features.includes(f.id));

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Navbar />
      
      <div className="pt-20">
        {/* Header */}
        <div className="bg-white border-b border-[#6B7F39]/20 sticky top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-[#36454F] hover:text-[#6B7F39]"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Properties
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="icon"
                className="text-[#36454F] hover:text-[#6B7F39]"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative h-[500px] bg-[#36454F]">
          <img
            src={property.images[currentImageIndex]?.url}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'w-8 bg-[#6B7F39]' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and Category */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-[#6B7F39] text-white px-4 py-1 rounded-full text-sm font-medium">
                    {property.category}
                  </span>
                  {property.available && (
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Available
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-[#36454F] mb-3">
                  {property.name}
                </h1>
                <div className="flex items-center gap-2 text-[#6B7F39]">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{property.location}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 p-6 bg-[#F5E6D3]/30 rounded-xl">
                {property.bedrooms > 0 && (
                  <div className="text-center">
                    <Bed className="w-8 h-8 text-[#6B7F39] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#36454F]">{property.bedrooms}</p>
                    <p className="text-sm text-[#36454F]/70">Bedrooms</p>
                  </div>
                )}
                <div className="text-center">
                  <Bath className="w-8 h-8 text-[#6B7F39] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#36454F]">{property.bathrooms}</p>
                  <p className="text-sm text-[#36454F]/70">Bathrooms</p>
                </div>
                <div className="text-center">
                  <Square className="w-8 h-8 text-[#6B7F39] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#36454F]">{property.area}</p>
                  <p className="text-sm text-[#36454F]/70">sqft</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-[#36454F] mb-4">Description</h2>
                <p className="text-lg text-[#36454F]/80 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {propertyFeatures.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#36454F] mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {propertyFeatures.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-center gap-3 p-4 bg-white rounded-lg border border-[#6B7F39]/20 hover:border-[#6B7F39] transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#6B7F39] flex-shrink-0" />
                        <span className="text-[#36454F]">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-white rounded-xl shadow-lg p-6 border border-[#6B7F39]/20">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-[#6B7F39]">${property.price}</span>
                    <span className="text-lg text-[#36454F]/70">/day</span>
                  </div>
                  <p className="text-sm text-[#36454F]/70">Daily rate</p>
                </div>

                <Button
                  onClick={handleBookProperty}
                  className="w-full bg-[#6B7F39] hover:bg-[#556230] text-white text-lg py-6 mb-4"
                  disabled={!property.available}
                >
                  {property.available ? 'Book Property' : 'Not Available'}
                </Button>

                <div className="space-y-3 pt-6 border-t border-[#6B7F39]/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#36454F]/70">Property ID</span>
                    <span className="text-[#36454F] font-medium">#{property.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#36454F]/70">Listed</span>
                    <span className="text-[#36454F] font-medium">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#F5E6D3]/30 rounded-lg">
                  <p className="text-sm text-[#36454F]/80 text-center">
                    Need help? Contact us at <br />
                    <a href="tel:+254700000000" className="text-[#6B7F39] font-medium">
                      +254 700 000 000
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#36454F] text-white py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#F5E6D3]">
            &copy; 2026 Skyway Suites. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          propertyName={property.name}
          propertyPrice={property.price}
          propertyId={property.id}
        />
      )}
    </div>
  );
};