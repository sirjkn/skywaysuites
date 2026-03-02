import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSlider } from '../components/HeroSlider';
import { PropertyCard } from '../components/PropertyCard';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { getProperties, Property, getCategories, Category } from '../services/api';
import { Mail, Phone, MapPin } from 'lucide-react';

type CategoryFilter = 'All' | 'Bedsitter' | '1-Bedroom' | '2-Bedroom' | '3-Bedroom' | '4-Bedroom';

export const HomePage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('+254712345678');
  const [companyDetails, setCompanyDetails] = useState({
    name: 'Skyway Suites',
    email: 'info@skywaysuites.com',
    phone: '+254 700 000 000',
    address: 'Nairobi, Kenya',
  });
  const [categories, setCategories] = useState<string[]>(['All', 'Bedsitter', '1-Bedroom', '2-Bedroom', '3-Bedroom', '4-Bedroom']);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await getCategories();
        const categoryNames = categoryData.map((cat: Category) => cat.name);
        setCategories(['All', ...categoryNames]);
        console.log('✅ Categories loaded dynamically:', categoryNames);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to default categories if loading fails
        setCategories(['All', 'Bedsitter', '1-Bedroom', '2-Bedroom', '3-Bedroom', '4-Bedroom']);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    // Load WhatsApp settings
    const loadWhatsAppSettings = () => {
      const stored = localStorage.getItem('contactDetailsSettings');
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

  useEffect(() => {
    // Load General Settings
    const loadGeneralSettings = () => {
      const stored = localStorage.getItem('generalSettings');
      if (stored) {
        try {
          const settings = JSON.parse(stored);
          setCompanyDetails({
            name: settings.companyName || 'Skyway Suites',
            email: settings.companyEmail || 'info@skywaysuites.com',
            phone: settings.companyPhone || '+254 700 000 000',
            address: settings.companyAddress || 'Nairobi, Kenya',
          });
        } catch (error) {
          console.error('Error loading general settings:', error);
        }
      }
    };

    loadGeneralSettings();

    // Listen for settings changes
    const handleSettingsChange = () => {
      loadGeneralSettings();
    };

    window.addEventListener('generalSettingsChanged', handleSettingsChange);
    return () => window.removeEventListener('generalSettingsChanged', handleSettingsChange);
  }, []);

  const filteredProperties = selectedCategory === 'All'
    ? properties
    : properties.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-20">
        <HeroSlider />
      </div>

      {/* Properties Section */}
      <section id="properties" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-[#36454F] mb-4">
              Discover Our Properties
            </h2>
            <div className="divider-gradient max-w-md mx-auto mb-6"></div>
            <p className="text-lg text-[#36454F]/70 max-w-2xl mx-auto">
              Browse through our collection of premium properties and find your perfect home
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-in-left">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${ selectedCategory === category
                    ? 'bg-gradient-olive text-white shadow-olive scale-105'
                    : 'bg-white text-[#36454F] hover:bg-[#F5E6D3] border border-[#6B7F39]/20 hover:border-[#6B7F39]/40 hover:scale-102'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                  <div className="h-56 bg-gradient-warm" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-[#F5E6D3] rounded-lg w-3/4" />
                    <div className="h-4 bg-[#F5E6D3] rounded-lg w-1/2" />
                    <div className="h-4 bg-[#F5E6D3] rounded-lg w-full" />
                    <div className="h-4 bg-[#F5E6D3] rounded-lg w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <div className="bg-white rounded-2xl p-12 shadow-warm max-w-md mx-auto">
                <p className="text-xl text-[#36454F]/70">No properties found in this category</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-warm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl md:text-5xl font-bold text-[#36454F] mb-6">
                About Skyway Suites
              </h2>
              <div className="divider-gradient mb-6"></div>
              <p className="text-lg text-[#36454F]/80 mb-6 leading-relaxed">
                Welcome to Skyway Suites, where luxury meets comfort. We specialize in providing premium 
                accommodation solutions for professionals, families, and travelers seeking the perfect blend 
                of modern amenities and warm hospitality.
              </p>
              <p className="text-lg text-[#36454F]/80 mb-8 leading-relaxed">
                Our properties are carefully selected and maintained to ensure you experience the highest 
                standards of quality and service. From cozy bedsitters to spacious family villas, we have 
                something for everyone.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="card-enhanced p-8 text-center bg-white border-2 border-[#6B7F39]/30 hover:border-[#6B7F39] transition-all duration-300 hover:shadow-olive">
                  <h3 className="text-6xl font-extrabold text-[#6B7F39] mb-3 drop-shadow-sm">500+</h3>
                  <p className="text-[#36454F] font-semibold text-lg">Happy Clients</p>
                </div>
                <div className="card-enhanced p-8 text-center bg-white border-2 border-[#6B7F39]/30 hover:border-[#6B7F39] transition-all duration-300 hover:shadow-olive">
                  <h3 className="text-6xl font-extrabold text-[#6B7F39] mb-3 drop-shadow-sm">50+</h3>
                  <p className="text-[#36454F] font-semibold text-lg">Properties</p>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
                alt="Modern luxury property interior"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover hover:scale-105 transition-transform duration-500 border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-[#36454F] mb-4">
              Get In Touch
            </h2>
            <div className="divider-gradient max-w-md mx-auto mb-6"></div>
            <p className="text-lg text-[#36454F]/70">
              Have questions? We're here to help!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 animate-scale-in">
            <div className="card-enhanced p-8 text-center group">
              <div className="bg-gradient-olive w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-olive group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl text-[#36454F] mb-2">Phone</h3>
              <p className="text-[#36454F]/70">{companyDetails.phone}</p>
            </div>

            <div className="card-enhanced p-8 text-center group">
              <div className="bg-gradient-olive w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-olive group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl text-[#36454F] mb-2">Email</h3>
              <p className="text-[#36454F]/70">{companyDetails.email}</p>
            </div>

            <div className="card-enhanced p-8 text-center group">
              <div className="bg-gradient-olive w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-olive group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl text-[#36454F] mb-2">Location</h3>
              <p className="text-[#36454F]/70">{companyDetails.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-charcoal text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-olive rounded-lg flex items-center justify-center shadow-olive">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <span className="font-semibold text-lg">Skyway Suites</span>
              </div>
              <p className="text-[#BDC3C7] text-sm">
                Your premium property partner
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[#F5E6D3]">Quick Links</h4>
              <ul className="space-y-2 text-sm text-[#BDC3C7]">
                <li><a href="#properties" className="hover:text-[#6B7F39] transition-colors">Properties</a></li>
                <li><a href="#about" className="hover:text-[#6B7F39] transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-[#6B7F39] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[#F5E6D3]">Contact</h4>
              <ul className="space-y-2 text-sm text-[#BDC3C7]">
                <li>
                  <a 
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello! I would like to inquire about your properties.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#25D366] transition-colors inline-flex items-center gap-1"
                  >
                    <span>📱 WhatsApp: {whatsappNumber}</span>
                  </a>
                </li>
                <li>{companyDetails.email}</li>
                <li>{companyDetails.address}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[#F5E6D3]">Follow Us</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gradient-olive transition-all duration-300">
                  <span className="text-sm">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gradient-olive transition-all duration-300">
                  <span className="text-sm">t</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gradient-olive transition-all duration-300">
                  <span className="text-sm">in</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-[#BDC3C7] text-sm">
              &copy; 2026 Skyway Suites. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
};