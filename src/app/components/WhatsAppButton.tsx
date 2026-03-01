import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    phoneNumber: '+254712345678',
    message: 'Hello! I would like to inquire about your properties.',
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const loadSettings = () => {
      // Try both keys for backward compatibility
      const storedWhatsApp = localStorage.getItem('whatsappSettings');
      const storedContact = localStorage.getItem('contactDetailsSettings');
      
      const stored = storedWhatsApp || storedContact;
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          console.log('WhatsApp settings loaded:', parsed);
          setSettings({
            enabled: parsed.enabled !== undefined ? parsed.enabled : true,
            phoneNumber: parsed.phoneNumber || '+254712345678',
            message: parsed.message || 'Hello! I would like to inquire about your properties.',
          });
          setIsVisible(parsed.enabled !== undefined ? parsed.enabled : true);
        } catch (error) {
          console.error('Error loading WhatsApp settings:', error);
        }
      } else {
        // No settings found, show by default
        console.log('No WhatsApp settings found, using defaults');
        setIsVisible(true);
      }
    };

    loadSettings();

    // Listen for settings changes
    const handleSettingsChange = () => {
      loadSettings();
    };

    window.addEventListener('whatsappSettingsChanged', handleSettingsChange);
    window.addEventListener('storage', handleSettingsChange);
    return () => {
      window.removeEventListener('whatsappSettingsChanged', handleSettingsChange);
      window.removeEventListener('storage', handleSettingsChange);
    };
  }, []);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(settings.message);
    const whatsappUrl = `https://wa.me/${settings.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Always show the button unless explicitly disabled
  if (!isVisible || settings.enabled === false) {
    console.log('WhatsApp button hidden. Enabled:', settings.enabled, 'isVisible:', isVisible);
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 group"
      style={{ 
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60px',
        height: '60px',
      }}
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" style={{ position: 'relative', zIndex: 2 }} />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#36454F] text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
        Chat with us on WhatsApp
      </span>

      {/* Pulse animation */}
      <span 
        className="absolute rounded-full bg-[#25D366] animate-ping opacity-20"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      />
    </button>
  );
};