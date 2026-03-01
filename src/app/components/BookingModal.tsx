import { useState, useEffect } from 'react';
import { X, Calendar, FileText, CreditCard, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { getSettings, PaymentMethod, createBooking } from '../services/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  propertyPrice: number;
  propertyId: string;
  onBookingCreated?: () => void;
}

export const BookingModal = ({ 
  isOpen, 
  onClose, 
  propertyName, 
  propertyPrice,
  propertyId,
  onBookingCreated
}: BookingModalProps) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const settings = await getSettings();
        const enabledMethods = settings.paymentMethods.filter(pm => pm.enabled);
        setPaymentMethods(enabledMethods);
        
        // Set default payment method if available
        if (enabledMethods.length > 0) {
          setPaymentMethod(enabledMethods[0].id);
        }
      } catch (error) {
        console.error('Error loading payment methods:', error);
        toast.error('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadPaymentMethods();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const calculateNights = () => {
    if (!fromDate || !toDate) return 0;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights();
  const totalPrice = nights * propertyPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromDate || !toDate) {
      toast.error('Please select both check-in and check-out dates');
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    
    if (from >= to) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    if (from < new Date()) {
      toast.error('Check-in date cannot be in the past');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    // Check if M-Pesa is selected and validate phone number
    const selectedMethod = paymentMethods.find(pm => pm.id === paymentMethod);
    if (selectedMethod?.id === 'mpesa') {
      if (!transactionId) {
        toast.error('Please enter your Mpesa transaction ID');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // First, create or find customer
      const { createCustomer, getCustomers } = await import('../services/api');
      const customers = await getCustomers();
      
      // Check if customer already exists
      let customer = customers.find(c => c.email === customerEmail);
      
      if (!customer) {
        // Create new customer
        customer = await createCustomer({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: '',
        });
      }

      // Get selected payment method name
      const selectedPaymentMethod = paymentMethods.find(pm => pm.id === paymentMethod);

      // Create booking with proper structure
      const bookingData = {
        propertyId,
        customerId: customer.id,
        checkIn: fromDate,
        checkOut: toDate,
        totalPrice,
        status: 'pending' as const,
        paymentMethod: selectedPaymentMethod?.name || paymentMethod,
        transactionId: transactionId || undefined,
      };

      await createBooking(bookingData);
      toast.success('Booking request submitted! Awaiting admin approval.');
      console.log('Booking created:', bookingData);
      setIsSubmitting(false);
      onClose();
      // Reset form
      setFromDate('');
      setToDate('');
      setAdditionalInfo('');
      setPaymentMethod('');
      setTransactionId('');
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      if (onBookingCreated) {
        onBookingCreated();
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fade-in">
      <div 
        className="card-enhanced max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-charcoal p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Book Property</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/90 mt-2">{propertyName}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date Selection */}
          <div className="space-y-4">
            <div>
              <label htmlFor="fromDate" className="flex items-center gap-2 text-[#36454F] mb-2">
                <Calendar className="w-4 h-4 text-[#6B7F39]" />
                Check-in Date
              </label>
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg border border-[#6B7F39]/20 bg-input-background focus:outline-none focus:ring-2 focus:ring-[#6B7F39]/30 transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="toDate" className="flex items-center gap-2 text-[#36454F] mb-2">
                <Calendar className="w-4 h-4 text-[#6B7F39]" />
                Check-out Date
              </label>
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg border border-[#6B7F39]/20 bg-input-background focus:outline-none focus:ring-2 focus:ring-[#6B7F39]/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label htmlFor="additionalInfo" className="flex items-center gap-2 text-[#36454F] mb-2">
              <FileText className="w-4 h-4 text-[#6B7F39]" />
              Additional Information
            </label>
            <textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any special requests or additional information..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-[#6B7F39]/20 bg-input-background focus:outline-none focus:ring-2 focus:ring-[#6B7F39]/30 transition-all resize-none"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label htmlFor="paymentMethod" className="flex items-center gap-2 text-[#36454F] mb-2">
              <CreditCard className="w-4 h-4 text-[#6B7F39]" />
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#6B7F39]/20 bg-input-background focus:outline-none focus:ring-2 focus:ring-[#6B7F39]/30 transition-all"
              required
            >
              <option value="">Select a payment method</option>
              {paymentMethods.map(pm => (
                <option key={pm.id} value={pm.id}>{pm.name}</option>
              ))}
            </select>
          </div>

          {/* Mpesa Number */}
          {paymentMethods.find(pm => pm.id === paymentMethod)?.type === 'mpesa' && (
            <div className="animate-fade-in">
              <label htmlFor="transactionId" className="flex items-center gap-2 text-[#36454F] mb-2">
                <Smartphone className="w-4 h-4 text-[#6B7F39]" />
                Mpesa Transaction ID
              </label>
              <input
                type="text"
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter your M-Pesa transaction ID"
                className="w-full px-4 py-3 rounded-lg border border-[#6B7F39]/20 bg-input-background focus:outline-none focus:ring-2 focus:ring-[#6B7F39]/30 transition-all"
                required
              />
              <p className="text-xs text-[#36454F]/60 mt-1">
                Enter your M-Pesa transaction ID
              </p>
            </div>
          )}

          {/* Customer Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="customerName" className="flex items-center gap-2 text-[#36454F] mb-2">
                <FileText className="w-4 h-4 text-[#6B7F39]" />
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="w-full px-4 py-3 rounded-lg border border-[#6B7F39]/20 bg-input-background focus:outline-none focus:ring-2 focus:ring-[#6B7F39]/30 transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="customerEmail" className="flex items-center gap-2 text-[#36454F] mb-2">
                <FileText className="w-4 h-4 text-[#6B7F39]" />
                Customer Email
              </label>
              <input
                type="email"
                id="customerEmail"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter customer email"
                className="w-full px-4 py-3 rounded-lg border border-[#6B7F39]/20 bg-input-background focus:outline-none focus:ring-2 focus:ring-[#6B7F39]/30 transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="flex items-center gap-2 text-[#36454F] mb-2">
                <FileText className="w-4 h-4 text-[#6B7F39]" />
                Customer Phone
              </label>
              <input
                type="text"
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter customer phone"
                className="w-full px-4 py-3 rounded-lg border border-[#6B7F39]/20 bg-input-background focus:outline-none focus:ring-2 focus:ring-[#6B7F39]/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Booking Summary */}
          {nights > 0 && (
            <div className="bg-gradient-warm p-4 rounded-lg border border-[#6B7F39]/20">
              <h3 className="font-semibold text-[#36454F] mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#36454F]/70">Price per night</span>
                  <span className="text-[#36454F] font-medium">Ksh {propertyPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#36454F]/70">Number of nights</span>
                  <span className="text-[#36454F] font-medium">{nights || 0}</span>
                </div>
                <div className="h-px bg-[#6B7F39]/20 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-[#36454F] font-semibold">Total</span>
                  <span className="text-[#6B7F39] text-xl font-bold">Ksh {totalPrice}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#6B7F39]/20 text-[#36454F] hover:bg-[#F5E6D3]"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-charcoal text-white hover:shadow-charcoal"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner w-4 h-4 mr-2"></div>
                  Processing...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </div>

          <p className="text-xs text-[#36454F]/60 text-center">
            You will receive a confirmation email once your booking is processed
          </p>
        </form>
      </div>
    </div>
  );
};