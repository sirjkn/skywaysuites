import { useState, useEffect } from 'react';
import { Button } from './ui/button';

// Load slides from localStorage or use defaults
const getSlides = () => {
  const stored = localStorage.getItem('heroSlides');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading hero slides:', error);
    }
  }
  return [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzIyMDA3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Find Your Perfect Home',
      subtitle: 'Luxury living spaces in prime locations',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1612645213559-6af1d4edeaf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwc3VpdGV8ZW58MXx8fHwxNzcyMjEzNzg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Modern Comfort Awaits',
      subtitle: 'Discover beautifully designed suites',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1674494777503-f5d3484104c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW50aG91c2UlMjBiYWxjb255JTIwdmlld3xlbnwxfHx8fDE3NzIxOTA2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Breathtaking Views',
      subtitle: 'Experience elevated living',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1611094016919-36b65678f3d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cHNjYWxlJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NzIyMTM3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Elegant Interiors',
      subtitle: 'Thoughtfully curated spaces',
    },
  ];
};

export const HeroSlider = () => {
  const [heroSlides, setHeroSlides] = useState(getSlides());
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Auto-play every 5 seconds

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Listen for slider settings changes
  useEffect(() => {
    const handleSliderUpdate = () => {
      setHeroSlides(getSlides());
    };

    window.addEventListener('heroSlidesUpdated', handleSliderUpdate);
    window.addEventListener('sliderSettingsChanged', handleSliderUpdate);
    return () => {
      window.removeEventListener('heroSlidesUpdated', handleSliderUpdate);
      window.removeEventListener('sliderSettingsChanged', handleSliderUpdate);
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden flex items-center justify-center">
      {/* Slider Container - Reduced Width */}
      <div className="relative w-full max-w-[90%] h-full overflow-hidden rounded-none md:rounded-2xl">
        {/* Slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#36454F]/80 to-[#36454F]/40" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-[#F5E6D3] mb-8 animate-fade-in delay-100">
                    {slide.subtitle}
                  </p>
                  <Button 
                    size="lg"
                    className="bg-[#36454F] hover:bg-[#2C3E50] text-white text-lg px-8 py-6 animate-fade-in delay-200"
                    onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Explore Properties
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'w-12 h-3 bg-[#6B7F39]'
                  : 'w-3 h-3 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};