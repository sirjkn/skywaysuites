import { useState, useEffect } from 'react';
import { 
  getCustomers, 
  getProperties, 
  getBookings, 
  getPayments,
  Customer,
  Property,
  Booking,
  Payment 
} from '../../services/api';
import { FileText, Users, Building2, DollarSign, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export const ReportsPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [customerFilter, setCustomerFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersData, propertiesData, bookingsData, paymentsData] = await Promise.all([
        getCustomers(),
        getProperties(),
        getBookings(),
        getPayments(),
      ]);
      setCustomers(customersData);
      setProperties(propertiesData);
      setBookings(bookingsData);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = propertyFilter === 'all' 
    ? properties 
    : properties.filter(p => p.id === propertyFilter);

  const filteredPayments = payments.filter(payment => {
    let matches = true;
    
    if (customerFilter !== 'all') {
      matches = matches && payment.customerId === customerFilter;
    }
    
    if (dateFrom) {
      matches = matches && new Date(payment.date) >= new Date(dateFrom);
    }
    
    if (dateTo) {
      matches = matches && new Date(payment.date) <= new Date(dateTo);
    }
    
    return matches;
  });

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#36454F]">Reports</h1>
        <p className="text-[#36454F]/70 mt-1">View and analyze your business data</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-[#6B7F39]/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#36454F]/70">Total Customers</h3>
            <Users className="w-8 h-8 text-[#6B7F39]" />
          </div>
          <p className="text-3xl font-bold text-[#36454F]">{customers.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-[#6B7F39]/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#36454F]/70">Total Properties</h3>
            <Building2 className="w-8 h-8 text-[#6B7F39]" />
          </div>
          <p className="text-3xl font-bold text-[#36454F]">{properties.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-[#6B7F39]/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#36454F]/70">Total Bookings</h3>
            <Calendar className="w-8 h-8 text-[#6B7F39]" />
          </div>
          <p className="text-3xl font-bold text-[#36454F]">{bookings.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-[#6B7F39]/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#36454F]/70">Total Revenue</h3>
            <DollarSign className="w-8 h-8 text-[#6B7F39]" />
          </div>
          <p className="text-3xl font-bold text-[#36454F]">
            Ksh {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList className="bg-[#F5E6D3]">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        {/* Customers Report */}
        <TabsContent value="customers">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#6B7F39]/20">
            <div className="p-6 border-b border-[#6B7F39]/20">
              <h2 className="text-xl font-semibold text-[#36454F]">Customers Report</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5E6D3]">
                  <tr>
                    <th className="px-6 py-3 text-left text-[#36454F]">Name</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Email</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Phone</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6B7F39]/10">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-[#FAF4EC]">
                      <td className="px-6 py-4 text-[#36454F]">{customer.name}</td>
                      <td className="px-6 py-4 text-[#36454F]">{customer.email}</td>
                      <td className="px-6 py-4 text-[#36454F]">{customer.phone}</td>
                      <td className="px-6 py-4 text-[#36454F]">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Properties Report */}
        <TabsContent value="properties">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#6B7F39]/20">
            <div className="p-6 border-b border-[#6B7F39]/20">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#36454F]">Properties Report</h2>
                <div className="w-64">
                  <Label htmlFor="propertyFilter">Filter by Property</Label>
                  <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                    <SelectTrigger id="propertyFilter" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      {properties.map(property => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5E6D3]">
                  <tr>
                    <th className="px-6 py-3 text-left text-[#36454F]">Property</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Category</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Location</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Price/Day</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6B7F39]/10">
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-[#FAF4EC]">
                      <td className="px-6 py-4 text-[#36454F]">{property.name}</td>
                      <td className="px-6 py-4 text-[#36454F]">{property.category}</td>
                      <td className="px-6 py-4 text-[#36454F]">{property.location}</td>
                      <td className="px-6 py-4 text-[#6B7F39] font-semibold">Ksh {property.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          property.available 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {property.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Payments Report */}
        <TabsContent value="payments">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#6B7F39]/20">
            <div className="p-6 border-b border-[#6B7F39]/20">
              <h2 className="text-xl font-semibold text-[#36454F] mb-4">Payments Report</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dateFrom">Date From</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">Date To</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="customerFilter">Customer</Label>
                  <Select value={customerFilter} onValueChange={setCustomerFilter}>
                    <SelectTrigger id="customerFilter" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5E6D3]">
                  <tr>
                    <th className="px-6 py-3 text-left text-[#36454F]">Date</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Customer</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Amount</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Method</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6B7F39]/10">
                  {filteredPayments.map((payment) => {
                    const customer = customers.find(c => c.id === payment.customerId);
                    return (
                      <tr key={payment.id} className="hover:bg-[#FAF4EC]">
                        <td className="px-6 py-4 text-[#36454F]">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-[#36454F]">{customer?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-[#6B7F39] font-semibold">Ksh {payment.amount}</td>
                        <td className="px-6 py-4 text-[#36454F]">{payment.method}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            payment.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Bookings Report */}
        <TabsContent value="bookings">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#6B7F39]/20">
            <div className="p-6 border-b border-[#6B7F39]/20">
              <h2 className="text-xl font-semibold text-[#36454F]">Bookings Report</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5E6D3]">
                  <tr>
                    <th className="px-6 py-3 text-left text-[#36454F]">Property</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Customer</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Check In</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Check Out</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Total</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Payment Method</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-[#36454F]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6B7F39]/10">
                  {bookings.map((booking) => {
                    const property = properties.find(p => p.id === booking.propertyId);
                    const customer = customers.find(c => c.id === booking.customerId);
                    return (
                      <tr key={booking.id} className="hover:bg-[#FAF4EC]">
                        <td className="px-6 py-4 text-[#36454F]">{property?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-[#36454F]">{customer?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-[#36454F]">
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-[#36454F]">
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-[#6B7F39] font-semibold">Ksh {booking.totalPrice}</td>
                        <td className="px-6 py-4 text-[#36454F]">{booking.paymentMethod || 'N/A'}</td>
                        <td className="px-6 py-4 text-[#36454F] text-sm">{booking.transactionId || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-700' 
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};