import { Link } from 'react-router';
import { Home, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-[#FDFCFA] to-[#FAF4EC] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="bg-[#6B7F39] p-6 rounded-full">
            <Building2 className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-[#36454F] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#36454F] mb-4">Page Not Found</h2>
        <p className="text-lg text-[#36454F]/70 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <Link to="/">
          <Button className="bg-[#36454F] hover:bg-[#2C3E50] text-white">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};