import { Property } from '../services/api';
import { MapPin, Bed, Bath, Square, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();
  const defaultImage = property.images.find(img => img.isDefault) || property.images[0];

  return (
    <div className="card-enhanced cursor-pointer group overflow-hidden">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={defaultImage?.url}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-gradient-olive text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-olive">
          {property.category}
        </div>
        
        {/* Available Badge */}
        {property.available ? (
          <div className="absolute top-4 right-4 glass-effect text-[#16A34A] px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
            Available
          </div>
        ) : (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
            Unavailable
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col">
        {/* Title and Location */}
        <h3 className="font-semibold text-xl text-[#36454F] mb-2 group-hover:text-[#6B7F39] transition-colors">
          {property.name}
        </h3>
        <div className="flex items-center gap-2 text-[#6B7F39] mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">{property.location}</span>
        </div>

        {/* Availability Status - Fixed height to maintain alignment */}
        <div className="h-[68px] mb-4">
          {!property.available && property.availableAfter && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">
                Available after: {new Date(property.availableAfter).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 mb-4 text-[#36454F]/70">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1.5 bg-[#F5E6D3]/50 px-3 py-1 rounded-lg">
              <Bed className="w-4 h-4 text-[#6B7F39]" />
              <span className="text-sm font-medium">{property.bedrooms} Bed</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-[#F5E6D3]/50 px-3 py-1 rounded-lg">
            <Bath className="w-4 h-4 text-[#6B7F39]" />
            <span className="text-sm font-medium">{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#F5E6D3]/50 px-3 py-1 rounded-lg">
            <Square className="w-4 h-4 text-[#6B7F39]" />
            <span className="text-sm font-medium">{property.area} sqft</span>
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-4 border-t border-[#6B7F39]/10">
          <div>
            <span className="text-3xl font-bold text-black">Ksh {property.price}</span>
            <span className="text-sm text-[#36454F]/70 ml-1">/day</span>
          </div>
          <Button
            onClick={() => navigate(`/property/${property.id}`)}
            className="bg-gradient-charcoal hover:shadow-charcoal text-white group/btn transition-all duration-300"
          >
            <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};