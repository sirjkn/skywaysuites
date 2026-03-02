import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getPropertyById, getFeatures, Property, Feature } from '../services/api';
import { Navbar } from '../components/Navbar';
import { BookingModal } from '../components/BookingModal';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { useAuth } from '../contexts/AuthContext';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyFeatures, setPropertyFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [whatsappNumber, setWhatsappNumber] = useState('+254712345678');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activePhotoCategory, setActivePhotoCategory] = useState<string>('Living Room');
  const [lightboxImages, setLightboxImages] = useState<Array<{id: string, url: string, category?: string}>>([]);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      try {
        // Start loading property data immediately
        const propertyPromise = getPropertyById(id);
        const featuresPromise = getFeatures();
        
        // Use Promise.allSettled to handle partial failures gracefully
        const [propertyResult, featuresResult] = await Promise.allSettled([
          propertyPromise,
          featuresPromise,
        ]);
        
        if (propertyResult.status === 'fulfilled' && propertyResult.value) {
          setProperty(propertyResult.value);
          
          // Preload the first image only for faster initial render
          if (propertyResult.value.images && propertyResult.value.images.length > 0) {
            const firstImage = new Image();
            firstImage.src = propertyResult.value.images[0].url;
          }
          
          if (featuresResult.status === 'fulfilled') {
            setPropertyFeatures(featuresResult.value.filter(f => propertyResult.value.features.includes(f.id)));
          }
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

  useEffect(() => {
    // Load WhatsApp settings
    const loadWhatsAppSettings = () => {
      const stored = localStorage.getItem('whatsappSettings');
      if (stored) {
        try {
          const settings = JSON.parse(stored);
          setWhatsappNumber(settings.phoneNumber || '+254712345678');
        } catch (error) {
          console.error('Error loading WhatsApp settings:', error);
        }
      }
    };

    loadWhatsAppSettings();

    // Listen for settings changes
    const handleSettingsChange = () => {
      loadWhatsAppSettings();
    };

    window.addEventListener('whatsappSettingsChanged', handleSettingsChange);
    return () => window.removeEventListener('whatsappSettingsChanged', handleSettingsChange);
  }, []);

  const handleBookProperty = () => {
    if (!isAuthenticated) {
      toast.info('Please login to book this property');
      navigate('/login', { state: { from: `/property/${id}` } });
    } else {
      setIsBookingModalOpen(true);
    }
  };

  const nextImage = () => {
    if (property && property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => {
        const nextIndex = (prev + 1) % property.images.length;
        return nextIndex;
      });
    }
  };

  const prevImage = () => {
    if (property && property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => {
        const prevIndex = (prev - 1 + property.images.length) % property.images.length;
        return prevIndex;
      });
    }
  };

  const openLightbox = (index: number) => {
    if (property && index >= 0 && index < property.images.length) {
      setCurrentImageIndex(index);
      setIsLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  useEffect(() => {
    // Prevent scrolling when lightbox is open
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

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

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and Category */}
              <div>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="bg-[#6B7F39] text-white px-4 py-1 rounded-full text-sm font-medium">
                    {property.category}
                  </span>
                  {property.available ? (
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Available
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Unavailable
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

                {/* Availability Notice */}
                {!property.available && property.availableAfter && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="text-red-700 font-semibold">
                      This property is currently booked. It will be available after{' '}
                      <span className="font-bold">
                        {new Date(property.availableAfter).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </p>
                  </div>
                )}
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

              {/* Categorized Photos Section */}
              {property.images && property.images.length > 0 && (() => {
                // Define all available categories in order
                const categories = ['Living Room', 'Bedroom', 'Dining', 'Kitchen', 'Bathroom', 'Amenities'] as const;
                
                // Filter images based on selected category - ensure images have categories
                const filteredImages = property.images.filter(img => 
                  img && img.category && img.category === activePhotoCategory
                );

                return (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#36454F] mb-4">Photo Gallery</h2>
                    
                    {/* Category Tabs - Always show all categories */}
                    <div className="border-b border-gray-200 mb-6">
                      <div className="flex gap-0 overflow-x-auto scrollbar-hide">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => setActivePhotoCategory(category)}
                            className={`px-6 py-3 font-medium whitespace-nowrap transition-all border-r border-gray-200 last:border-r-0 ${
                              activePhotoCategory === category
                                ? 'bg-[#36454F] text-white'
                                : 'bg-white text-[#36454F] hover:bg-gray-50'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Photo Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {filteredImages.length > 0 ? (
                        filteredImages.map((image) => {
                          // Ensure image exists and has an id
                          if (!image || !image.id || !image.url) return null;
                          
                          // Find the original index in the full images array
                          const originalIndex = property.images.findIndex(img => img && img.id === image.id);
                          
                          // Safety check: don't render if index is invalid
                          if (originalIndex === -1 || originalIndex >= property.images.length) {
                            return null;
                          }
                          
                          return (
                            <button
                              key={`${image.id}-${originalIndex}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openLightbox(originalIndex);
                              }}
                              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer border border-gray-200 hover:border-[#6B7F39] transition-colors bg-gray-100"
                            >
                              <img
                                src={image.url}
                                alt={image.category || `Photo ${originalIndex + 1}`}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  // Handle image load errors gracefully
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              {/* Category Badge - Only show if image has category */}
                              {image.category && (
                                <div className="absolute top-2 left-2 bg-[#36454F]/90 text-white text-xs px-2 py-1 rounded">
                                  {image.category}
                                </div>
                              )}
                              {/* Overlay on hover */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  View Photo
                                </span>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="col-span-full text-center py-12 text-[#36454F]/60">
                          No photos in this category
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

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
                  className="w-full bg-[#36454F] hover:bg-[#2C3E50] text-white text-lg py-6 mb-4"
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
                    Need help? <br />
                    <a 
                      href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello! I would like to inquire about ' + property.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:text-[#128C7E] font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      WhatsApp us at {whatsappNumber}
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
          onBookingCreated={() => {
            // Reload property data to reflect booking changes
            if (id) {
              getPropertyById(id).then(data => {
                if (data) setProperty(data);
              });
            }
          }}
        />
      )}

      {/* Image Lightbox Modal */}
      {isLightboxOpen && property.images.length > 0 && property.images[currentImageIndex] && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-[110] bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
            <span className="text-sm font-medium">
              {currentImageIndex + 1} / {property.images.length}
            </span>
          </div>

          {/* Previous Button */}
          {property.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Main Image */}
          <div 
            className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={property.images[currentImageIndex].url}
              alt={`${property.name} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Next Button */}
          {property.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Thumbnail Navigation - Optimized */}
          {property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[110] max-w-full">
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-3">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-[90vw] md:max-w-2xl">
                  {property.images.map((image, index) => {
                    // Only render thumbnails within visible range (current +/- 10 images)
                    const shouldRender = Math.abs(index - currentImageIndex) <= 10;
                    if (!shouldRender) {
                      return (
                        <div
                          key={index}
                          className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gray-700"
                        />
                      );
                    }
                    
                    const isActive = index === currentImageIndex;
                    const thumbnailClass = isActive
                      ? 'border-[#6B7F39] scale-110 shadow-lg'
                      : 'border-white/30 hover:border-white/60 opacity-70 hover:opacity-100';
                    
                    return (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all border-2 ${thumbnailClass}`}
                      >
                        <img
                          src={image.url}
                          alt={`Thumbnail ${index + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
};
