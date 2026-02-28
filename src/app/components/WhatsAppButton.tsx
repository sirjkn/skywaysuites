import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    phoneNumber: '+254712345678',
    message: 'Hello! I would like to inquire about your properties.',
  });

  useEffect(() => {
    // Load settings from localStorage
    const loadSettings = () => {
      const stored = localStorage.getItem('whatsappSettings');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSettings(parsed);
        } catch (error) {
          console.error('Error loading WhatsApp settings:', error);
        }
      }
    };

    loadSettings();

    // Listen for settings changes
    const handleSettingsChange = () => {
      loadSettings();
    };

    window.addEventListener('whatsappSettingsChanged', handleSettingsChange);
    return () => window.removeEventListener('whatsappSettingsChanged', handleSettingsChange);
  }, []);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(settings.message);
    const whatsappUrl = `https://wa.me/${settings.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!settings.enabled) {
    return null;
  }

  return (
    <>
      {/* Floating WhatsApp Button - Always Visible */}
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#36454F] text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
          Chat with us on WhatsApp
        </span>

        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </button>
    </>
  );
};