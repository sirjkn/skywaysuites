import { useState, useEffect } from 'react';
import { 
  getBookings, 
  getProperties, 
  getCustomers,
  updateBookingStatus,
  Booking,
  Property,
  Customer
} from '../../services/api';
import { Calendar, Check, X, Eye, Filter, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    type: 'approve' | 'reject' | 'cancel';
    bookingId: string;
    propertyName: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsData, propertiesData, customersData] = await Promise.all([
        getBookings(),
        getProperties(),
        getCustomers(),
      ]);
      setBookings(bookingsData);
      setProperties(propertiesData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'confirmed');
      toast.success('Booking approved successfully!');
      setConfirmDialog(null);
      loadData();
    } catch (error) {
      console.error('Error approving booking:', error);
      toast.error('Failed to approve booking');
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'cancelled');
      toast.success('Booking cancelled successfully!');
      setConfirmDialog(null);
      loadData();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const showConfirmDialog = (type: 'approve' | 'reject' | 'cancel', bookingId: string, propertyName: string) => {
    setConfirmDialog({
      show: true,
      type,
      bookingId,
      propertyName,
    });
  };

  const handleConfirm = () => {
    if (!confirmDialog) return;
    
    if (confirmDialog.type === 'approve') {
      handleApprove(confirmDialog.bookingId);
    } else {
      handleReject(confirmDialog.bookingId);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

  const getProperty = (propertyId: string) => properties.find(p => p.id === propertyId);
  const getCustomer = (customerId: string) => customers.find(c => c.id === customerId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">Bookings Management</h1>
        <p className="text-[#7F8C8D]">Approve, reject, and manage property bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-[#7F8C8D]">Total Bookings</h3>
            <Calendar className="w-5 h-5 text-[#6B7F39]" />
          </div>
          <p className="text-2xl font-bold text-[#2C3E50]">{bookings.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-[#7F8C8D]">Pending Approval</h3>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-[#7F8C8D]">Confirmed</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-[#7F8C8D]">Cancelled</h3>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{cancelledCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-[#7F8C8D]" />
          <span className="text-sm font-medium text-[#2C3E50] mr-2">Filter:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#6B7F39] text-white'
                : 'bg-gray-100 text-[#7F8C8D] hover:bg-gray-200'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-[#7F8C8D] hover:bg-gray-200'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'confirmed'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-[#7F8C8D] hover:bg-gray-200'
            }`}
          >
            Confirmed ({confirmedCount})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'cancelled'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-[#7F8C8D] hover:bg-gray-200'
            }`}
          >
            Cancelled ({cancelledCount})
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5E6D3]">
              <tr>
                <th className="px-6 py-3 text-left text-[#36454F] font-semibold">Property</th>
                <th className="px-6 py-3 text-left text-[#36454F] font-semibold">Customer</th>
                <th className="px-6 py-3 text-left text-[#36454F] font-semibold">Contact</th>
                <th className="px-6 py-3 text-left text-[#36454F] font-semibold">Check In</th>
                <th className="px-6 py-3 text-left text-[#36454F] font-semibold">Check Out</th>
                <th className="px-6 py-3 text-left text-[#36454F] font-semibold">Nights</th>
                <th className="px-6 py-3 text-left text-[#36454F] font-semibold">Total</th>
                <th className="px-6 py-3 text-left text-[#36454F] font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-[#36454F] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-[#7F8C8D]">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const property = getProperty(booking.propertyId);
                  const customer = getCustomer(booking.customerId);
                  const checkIn = new Date(booking.checkIn);
                  const checkOut = new Date(booking.checkOut);
                  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <tr key={booking.id} className="hover:bg-[#FAF4EC] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#2C3E50]">{property?.name || 'N/A'}</div>
                        <div className="text-sm text-[#7F8C8D]">{property?.location || ''}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#2C3E50]">{customer?.name || 'N/A'}</div>
                        <div className="text-sm text-[#7F8C8D]">{customer?.email || ''}</div>
                      </td>
                      <td className="px-6 py-4 text-[#36454F]">{customer?.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-[#36454F]">
                        {checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-[#36454F]">
                        {checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-[#36454F]">{nights}</td>
                      <td className="px-6 py-4 text-[#6B7F39] font-semibold">Ksh {booking.totalPrice.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button
                                onClick={() => showConfirmDialog('approve', booking.id, property?.name || 'N/A')}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm"
                                title="Approve Booking"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => showConfirmDialog('reject', booking.id, property?.name || 'N/A')}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
                                title="Reject Booking"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button
                              onClick={() => showConfirmDialog('cancel', booking.id, property?.name || 'N/A')}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
                              title="Cancel Booking"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                          {booking.status === 'cancelled' && (
                            <span className="text-sm text-[#7F8C8D]">No actions</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Bookings Alert */}
      {pendingCount > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              <strong>{pendingCount}</strong> booking{pendingCount !== 1 ? 's' : ''} awaiting your approval
            </p>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                confirmDialog.type === 'approve' 
                  ? 'bg-green-100' 
                  : 'bg-red-100'
              }`}>
                <AlertCircle className={`w-6 h-6 ${
                  confirmDialog.type === 'approve' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#2C3E50]">
                  {confirmDialog.type === 'approve' ? 'Approve Booking' : 
                   confirmDialog.type === 'reject' ? 'Reject Booking' : 
                   'Cancel Booking'}
                </h3>
              </div>
              <button
                onClick={() => setConfirmDialog(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-[#36454F] mb-2">
                {confirmDialog.type === 'approve' ? (
                  <>Are you sure you want to <strong className="text-green-600">approve</strong> this booking?</>
                ) : confirmDialog.type === 'reject' ? (
                  <>Are you sure you want to <strong className="text-red-600">reject</strong> this booking?</>
                ) : (
                  <>Are you sure you want to <strong className="text-red-600">cancel</strong> this confirmed booking?</>
                )}
              </p>
              <div className="bg-[#FAF4EC] rounded-lg p-3 mt-3">
                <p className="text-sm text-[#36454F]">
                  <strong>Property:</strong> {confirmDialog.propertyName}
                </p>
              </div>
              {confirmDialog.type !== 'approve' && (
                <p className="text-sm text-red-600 mt-3">
                  ⚠️ This action cannot be undone.
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-end gap-3">
              <Button
                onClick={() => setConfirmDialog(null)}
                className="bg-gray-100 hover:bg-gray-200 text-[#36454F] px-6 py-2 text-sm font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className={`${
                  confirmDialog.type === 'approve'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                } text-white px-6 py-2 text-sm font-medium`}
              >
                {confirmDialog.type === 'approve' ? '✓ Approve' : 
                 confirmDialog.type === 'reject' ? '✗ Reject' : 
                 '✗ Cancel Booking'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};