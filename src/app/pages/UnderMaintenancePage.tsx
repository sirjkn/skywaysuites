import { Settings, Wrench, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { useEffect, useState } from 'react';

export const UnderMaintenancePage = () => {
  const [maintenanceMessage, setMaintenanceMessage] = useState('We are currently performing scheduled maintenance. Please check back soon!');
  const [companyName, setCompanyName] = useState('Skyway Suites');

  useEffect(() => {
    const stored = localStorage.getItem('generalSettings');
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        setMaintenanceMessage(settings.maintenanceMessage || 'We are currently performing scheduled maintenance. Please check back soon!');
        setCompanyName(settings.companyName || 'Skyway Suites');
      } catch (error) {
        console.error('Error loading general settings:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icon Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-olive rounded-full flex items-center justify-center shadow-olive animate-pulse">
              <Wrench className="w-16 h-16 text-white" />
            </div>
            <div className="absolute top-0 right-0">
              <Settings className="w-10 h-10 text-[#6B7F39] animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-[#36454F] mb-4">
          Under Maintenance
        </h1>

        {/* Subtitle */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-[#6B7F39]" />
          <p className="text-xl text-[#36454F]/80">
            We'll be back shortly
          </p>
        </div>

        {/* Message */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-[#6B7F39]/20">
          <p className="text-lg text-[#36454F]/90 leading-relaxed">
            {maintenanceMessage}
          </p>
        </div>

        {/* Company Name */}
        <p className="text-[#36454F]/70 text-sm">
          {companyName} Team
        </p>

        {/* Admin Login Link */}
        <div className="mt-8">
          <Link to="/login">
            <Button 
              variant="outline" 
              className="text-[#6B7F39] border-[#6B7F39] hover:bg-[#6B7F39] hover:text-white"
            >
              Admin Login
            </Button>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-[#6B7F39] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
