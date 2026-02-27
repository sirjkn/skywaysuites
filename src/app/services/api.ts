/**
 * API Service Layer
 * 
 * INTEGRATION WITH YOUR DATABASE:
 * Replace the mock data and functions below with your actual database API calls.
 * Update the BASE_URL with your backend endpoint.
 */

const BASE_URL = 'YOUR_DATABASE_API_URL'; // Replace with your actual API URL

// Types
export interface Property {
  id: string;
  name: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  category: 'Bedsitter' | '1-Bedroom' | '2-Bedroom' | '3-Bedroom' | '4-Bedroom';
  description: string;
  features: string[];
  images: PropertyImage[];
  available: boolean;
  createdAt: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  isDefault: boolean;
}

export interface Feature {
  id: string;
  name: string;
  icon?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

export interface Booking {
  id: string;
  propertyId: string;
  customerId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
}

// Mock Data - Replace with your database calls
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Sunset View Bedsitter',
    price: 45,
    location: 'Downtown, Nairobi',
    bedrooms: 0,
    bathrooms: 1,
    area: 350,
    category: 'Bedsitter',
    description: 'Cozy bedsitter with modern amenities and stunning sunset views. Perfect for young professionals.',
    features: ['1', '2', '3'],
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', isDefault: true },
      { id: '2', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isDefault: false },
    ],
    available: true,
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    name: 'Modern 1-Bedroom Apartment',
    price: 75,
    location: 'Westlands, Nairobi',
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    category: '1-Bedroom',
    description: 'Elegant 1-bedroom apartment with contemporary design and premium finishes.',
    features: ['1', '2', '3', '4'],
    images: [
      { id: '3', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', isDefault: true },
      { id: '4', url: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800', isDefault: false },
    ],
    available: true,
    createdAt: '2026-01-20',
  },
  {
    id: '3',
    name: 'Spacious 2-Bedroom Suite',
    price: 120,
    location: 'Kilimani, Nairobi',
    bedrooms: 2,
    bathrooms: 2,
    area: 850,
    category: '2-Bedroom',
    description: 'Beautiful 2-bedroom suite with ample space and modern kitchen. Family-friendly.',
    features: ['1', '2', '3', '4', '5'],
    images: [
      { id: '5', url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', isDefault: true },
      { id: '6', url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', isDefault: false },
    ],
    available: true,
    createdAt: '2026-02-01',
  },
  {
    id: '4',
    name: 'Luxury 3-Bedroom Penthouse',
    price: 180,
    location: 'Karen, Nairobi',
    bedrooms: 3,
    bathrooms: 3,
    area: 1200,
    category: '3-Bedroom',
    description: 'Luxurious penthouse with panoramic views and top-tier amenities.',
    features: ['1', '2', '3', '4', '5', '6'],
    images: [
      { id: '7', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', isDefault: true },
      { id: '8', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', isDefault: false },
    ],
    available: true,
    createdAt: '2026-02-10',
  },
  {
    id: '5',
    name: 'Executive 4-Bedroom Villa',
    price: 250,
    location: 'Runda, Nairobi',
    bedrooms: 4,
    bathrooms: 4,
    area: 2000,
    category: '4-Bedroom',
    description: 'Grand 4-bedroom villa with private garden, pool, and premium security.',
    features: ['1', '2', '3', '4', '5', '6', '7'],
    images: [
      { id: '9', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', isDefault: true },
      { id: '10', url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', isDefault: false },
    ],
    available: true,
    createdAt: '2026-02-15',
  },
  {
    id: '6',
    name: 'Garden View 2-Bedroom',
    price: 110,
    location: 'Lavington, Nairobi',
    bedrooms: 2,
    bathrooms: 2,
    area: 800,
    category: '2-Bedroom',
    description: 'Serene 2-bedroom with beautiful garden views and peaceful surroundings.',
    features: ['1', '2', '3', '5'],
    images: [
      { id: '11', url: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800', isDefault: true },
      { id: '12', url: 'https://images.unsplash.com/photo-1501876725168-00c445821c9e?w=800', isDefault: false },
    ],
    available: true,
    createdAt: '2026-02-18',
  },
];

const mockFeatures: Feature[] = [
  { id: '1', name: 'WiFi', icon: 'Wifi' },
  { id: '2', name: 'Parking', icon: 'Car' },
  { id: '3', name: 'Air Conditioning', icon: 'Wind' },
  { id: '4', name: 'Swimming Pool', icon: 'Waves' },
  { id: '5', name: 'Gym', icon: 'Dumbbell' },
  { id: '6', name: 'Security', icon: 'ShieldCheck' },
  { id: '7', name: 'Garden', icon: 'Trees' },
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+254712345678',
    address: '123 Main St, Nairobi',
    createdAt: '2026-01-10',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+254723456789',
    address: '456 Oak Ave, Nairobi',
    createdAt: '2026-01-12',
  },
];

const mockBookings: Booking[] = [
  {
    id: '1',
    propertyId: '1',
    customerId: '1',
    checkIn: '2026-03-01',
    checkOut: '2026-03-07',
    totalPrice: 315,
    status: 'confirmed',
    createdAt: '2026-02-20',
  },
];

const mockPayments: Payment[] = [
  {
    id: '1',
    bookingId: '1',
    customerId: '1',
    amount: 315,
    method: 'M-Pesa',
    status: 'completed',
    date: '2026-02-20',
  },
];

// API Functions - Replace these with actual API calls to your database

// Properties API
export const getProperties = async (): Promise<Property[]> => {
  // TODO: Replace with actual API call
  // return fetch(`${BASE_URL}/properties`).then(res => res.json());
  return Promise.resolve(mockProperties);
};

export const getPropertyById = async (id: string): Promise<Property | undefined> => {
  // TODO: Replace with actual API call
  // return fetch(`${BASE_URL}/properties/${id}`).then(res => res.json());
  return Promise.resolve(mockProperties.find(p => p.id === id));
};

export const createProperty = async (property: Omit<Property, 'id' | 'createdAt'>): Promise<Property> => {
  // TODO: Replace with actual API call
  // return fetch(`${BASE_URL}/properties`, { method: 'POST', body: JSON.stringify(property) }).then(res => res.json());
  const newProperty = {
    ...property,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  mockProperties.push(newProperty);
  return Promise.resolve(newProperty);
};

export const updateProperty = async (id: string, property: Partial<Property>): Promise<Property> => {
  // TODO: Replace with actual API call
  // return fetch(`${BASE_URL}/properties/${id}`, { method: 'PUT', body: JSON.stringify(property) }).then(res => res.json());
  const index = mockProperties.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProperties[index] = { ...mockProperties[index], ...property };
    return Promise.resolve(mockProperties[index]);
  }
  throw new Error('Property not found');
};

export const deleteProperty = async (id: string): Promise<void> => {
  // TODO: Replace with actual API call
  // return fetch(`${BASE_URL}/properties/${id}`, { method: 'DELETE' }).then(res => res.json());
  const index = mockProperties.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProperties.splice(index, 1);
  }
  return Promise.resolve();
};

// Features API
export const getFeatures = async (): Promise<Feature[]> => {
  // TODO: Replace with actual API call
  return Promise.resolve(mockFeatures);
};

export const createFeature = async (feature: Omit<Feature, 'id'>): Promise<Feature> => {
  // TODO: Replace with actual API call
  const newFeature = { ...feature, id: Date.now().toString() };
  mockFeatures.push(newFeature);
  return Promise.resolve(newFeature);
};

export const updateFeature = async (id: string, feature: Partial<Feature>): Promise<Feature> => {
  // TODO: Replace with actual API call
  const index = mockFeatures.findIndex(f => f.id === id);
  if (index !== -1) {
    mockFeatures[index] = { ...mockFeatures[index], ...feature };
    return Promise.resolve(mockFeatures[index]);
  }
  throw new Error('Feature not found');
};

export const deleteFeature = async (id: string): Promise<void> => {
  // TODO: Replace with actual API call
  const index = mockFeatures.findIndex(f => f.id === id);
  if (index !== -1) {
    mockFeatures.splice(index, 1);
  }
  return Promise.resolve();
};

// Customers API
export const getCustomers = async (): Promise<Customer[]> => {
  // TODO: Replace with actual API call
  return Promise.resolve(mockCustomers);
};

export const createCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
  // TODO: Replace with actual API call
  const newCustomer = {
    ...customer,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  mockCustomers.push(newCustomer);
  return Promise.resolve(newCustomer);
};

export const updateCustomer = async (id: string, customer: Partial<Customer>): Promise<Customer> => {
  // TODO: Replace with actual API call
  const index = mockCustomers.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCustomers[index] = { ...mockCustomers[index], ...customer };
    return Promise.resolve(mockCustomers[index]);
  }
  throw new Error('Customer not found');
};

export const deleteCustomer = async (id: string): Promise<void> => {
  // TODO: Replace with actual API call
  const index = mockCustomers.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCustomers.splice(index, 1);
  }
  return Promise.resolve();
};

// Bookings API
export const getBookings = async (): Promise<Booking[]> => {
  // TODO: Replace with actual API call
  return Promise.resolve(mockBookings);
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
  // TODO: Replace with actual API call
  const newBooking = {
    ...booking,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  mockBookings.push(newBooking);
  return Promise.resolve(newBooking);
};

// Payments API
export const getPayments = async (): Promise<Payment[]> => {
  // TODO: Replace with actual API call
  return Promise.resolve(mockPayments);
};

export const createPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
  // TODO: Replace with actual API call
  const newPayment = { ...payment, id: Date.now().toString() };
  mockPayments.push(newPayment);
  return Promise.resolve(newPayment);
};

// Authentication API
export const login = async (email: string, password: string): Promise<User> => {
  // TODO: Replace with actual API call to your authentication system
  // return fetch(`${BASE_URL}/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) }).then(res => res.json());
  
  // Mock authentication
  return Promise.resolve({
    id: '1',
    email,
    name: 'User Name',
    role: email.includes('admin') ? 'admin' : 'customer',
  });
};

export const register = async (email: string, password: string, name: string): Promise<User> => {
  // TODO: Replace with actual API call to your authentication system
  // return fetch(`${BASE_URL}/auth/register`, { method: 'POST', body: JSON.stringify({ email, password, name }) }).then(res => res.json());
  
  // Mock registration - automatically create customer record
  const newCustomer = await createCustomer({
    name,
    email,
    phone: '',
    address: '',
  });
  
  return Promise.resolve({
    id: newCustomer.id,
    email,
    name,
    role: 'customer',
  });
};

export const logout = async (): Promise<void> => {
  // TODO: Replace with actual API call
  return Promise.resolve();
};
