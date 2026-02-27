import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSlider } from '../components/HeroSlider';
import { PropertyCard } from '../components/PropertyCard';
import { getProperties, Property } from '../services/api';
import { Mail, Phone, MapPin } from 'lucide-react';

type CategoryFilter = 'All' | 'Bedsitter' | '1-Bedroom' | '2-Bedroom' | '3-Bedroom' | '4-Bedroom';

export const HomePage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [loading, setLoading] = useState(true);

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

  const categories: CategoryFilter[] = ['All', 'Bedsitter', '1-Bedroom', '2-Bedroom', '3-Bedroom', '4-Bedroom'];

  const filteredProperties = selectedCategory === 'All'
    ? properties
    : properties.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-20">
        <HeroSlider />
      </div>

      {/* Properties Section */}
      <section id="properties" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#36454F] mb-4">
              Discover Our Properties
            </h2>
            <p className="text-lg text-[#36454F]/70 max-w-2xl mx-auto">
              Browse through our collection of premium properties and find your perfect home
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-[#6B7F39] text-white shadow-lg scale-105'
                    : 'bg-white text-[#36454F] hover:bg-[#F5E6D3] border border-[#6B7F39]/20'
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
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                  <div className="h-56 bg-[#F5E6D3]" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-[#F5E6D3] rounded w-3/4" />
                    <div className="h-4 bg-[#F5E6D3] rounded w-1/2" />
                    <div className="h-4 bg-[#F5E6D3] rounded w-full" />
                    <div className="h-4 bg-[#F5E6D3] rounded w-full" />
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
            <div className="text-center py-16">
              <p className="text-xl text-[#36454F]/70">No properties found in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5E6D3]/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#36454F] mb-6">
                About Skyway Suites
              </h2>
              <p className="text-lg text-[#36454F]/80 mb-6">
                Welcome to Skyway Suites, where luxury meets comfort. We specialize in providing premium 
                accommodation solutions for professionals, families, and travelers seeking the perfect blend 
                of modern amenities and warm hospitality.
              </p>
              <p className="text-lg text-[#36454F]/80 mb-6">
                Our properties are carefully selected and maintained to ensure you experience the highest 
                standards of quality and service. From cozy bedsitters to spacious family villas, we have 
                something for everyone.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-3xl font-bold text-[#6B7F39] mb-2">500+</h3>
                  <p className="text-[#36454F]/70">Happy Clients</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-3xl font-bold text-[#6B7F39] mb-2">50+</h3>
                  <p className="text-[#36454F]/70">Properties</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"
                alt="Property"
                className="rounded-lg shadow-lg w-full h-64 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"
                alt="Property"
                className="rounded-lg shadow-lg w-full h-64 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#36454F] mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-[#36454F]/70">
              Have questions? We're here to help!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <div className="bg-[#6B7F39] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl text-[#36454F] mb-2">Phone</h3>
              <p className="text-[#36454F]/70">+254 700 000 000</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <div className="bg-[#6B7F39] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl text-[#36454F] mb-2">Email</h3>
              <p className="text-[#36454F]/70">info@skywaysuites.com</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
              <div className="bg-[#6B7F39] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl text-[#36454F] mb-2">Location</h3>
              <p className="text-[#36454F]/70">Nairobi, Kenya</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#36454F] text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#F5E6D3]">
            &copy; 2026 Skyway Suites. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
