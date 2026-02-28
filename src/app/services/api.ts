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
  availableAfter?: string; // Date when property becomes available again
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

export interface MenuPage {
  id: string;
  label: string;
  path: string;
  type: 'link' | 'anchor';
  order: number;
  visible: boolean;
  content?: string; // HTML content for the page
}

export interface Category {
  id: string;
  name: string;
  bedrooms: number;
  description?: string;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  area?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  type: 'mpesa' | 'stripe' | 'paypal' | 'bank_transfer' | 'cash';
}

export interface Settings {
  paymentMethods: PaymentMethod[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    darkMode: boolean;
  };
  contactDetails: {
    phoneNumber: string;
    email: string;
    message: string;
    enabled: boolean;
  };
  sms: {
    provider: string;
    enabled: boolean;
  };
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

const mockBookings: Booking[] = [
  {
    id: '1',
    propertyId: '1',
    customerId: '1',
    checkIn: '2026-02-26',
    checkOut: '2026-03-15',
    totalPrice: 765,
    status: 'confirmed',
    createdAt: '2026-02-20',
  },
  {
    id: '2',
    propertyId: '3',
    customerId: '2',
    checkIn: '2026-03-10',
    checkOut: '2026-03-20',
    totalPrice: 1200,
    status: 'confirmed',
    createdAt: '2026-02-22',
  },
  {
    id: '3',
    propertyId: '2',
    customerId: '1',
    checkIn: '2026-02-15',
    checkOut: '2026-02-20',
    totalPrice: 375,
    status: 'confirmed',
    createdAt: '2026-02-10',
  },
  {
    id: '4',
    propertyId: '4',
    customerId: '2',
    checkIn: '2026-03-05',
    checkOut: '2026-03-12',
    totalPrice: 1260,
    status: 'pending',
    createdAt: '2026-02-27',
  },
  {
    id: '5',
    propertyId: '5',
    customerId: '1',
    checkIn: '2026-03-15',
    checkOut: '2026-03-22',
    totalPrice: 1750,
    status: 'pending',
    createdAt: '2026-02-28',
  },
  {
    id: '6',
    propertyId: '6',
    customerId: '2',
    checkIn: '2026-03-01',
    checkOut: '2026-03-08',
    totalPrice: 770,
    status: 'pending',
    createdAt: '2026-02-28',
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

const mockMenuPages: MenuPage[] = [
  {
    id: '1',
    label: 'Home',
    path: '/',
    type: 'link',
    order: 1,
    visible: true,
  },
  {
    id: '2',
    label: 'About Us',
    path: '/about',
    type: 'link',
    order: 2,
    visible: true,
    content: `
      <h2>About Skyway Suites</h2>
      <p>Welcome to Skyway Suites, your premier destination for luxury property rentals. We specialize in providing high-quality accommodation solutions for both short-term and long-term stays.</p>
      
      <h3>Our Mission</h3>
      <p>To provide exceptional living experiences through carefully curated properties that meet the highest standards of comfort, safety, and convenience.</p>
      
      <h3>Why Choose Us?</h3>
      <ul>
        <li><strong>Quality Properties:</strong> Each property is carefully vetted and maintained to ensure the highest standards.</li>
        <li><strong>Prime Locations:</strong> Our properties are located in the most desirable areas, close to amenities and transportation.</li>
        <li><strong>24/7 Support:</strong> Our dedicated team is always available to assist you with any questions or concerns.</li>
        <li><strong>Flexible Booking:</strong> We offer flexible booking options to suit your needs.</li>
      </ul>
      
      <h3>Contact Us</h3>
      <p>Have questions? Reach out to us at <strong>+254 700 000 000</strong> or email us at <strong>info@skywaysuites.com</strong></p>
    `,
  },
  {
    id: '3',
    label: 'Contact',
    path: '/contact',
    type: 'link',
    order: 3,
    visible: true,
    content: `
      <h2>Get In Touch</h2>
      <p>We'd love to hear from you! Whether you have a question about our properties, pricing, or anything else, our team is ready to answer all your questions.</p>
      
      <h3>Contact Information</h3>
      <p><strong>Phone:</strong> +254 700 000 000</p>
      <p><strong>Email:</strong> info@skywaysuites.com</p>
      <p><strong>Address:</strong> Nairobi, Kenya</p>
      
      <h3>Business Hours</h3>
      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
      <p>Saturday: 9:00 AM - 4:00 PM</p>
      <p>Sunday: Closed</p>
      
      <blockquote>
        <p>"Your satisfaction is our priority. We strive to provide the best service possible."</p>
      </blockquote>
    `,
  },
];

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Bedsitter',
    bedrooms: 0,
    description: 'Cozy bedsitter with modern amenities and stunning sunset views. Perfect for young professionals.',
  },
  {
    id: '2',
    name: '1-Bedroom',
    bedrooms: 1,
    description: 'Elegant 1-bedroom apartment with contemporary design and premium finishes.',
  },
  {
    id: '3',
    name: '2-Bedroom',
    bedrooms: 2,
    description: 'Beautiful 2-bedroom suite with ample space and modern kitchen. Family-friendly.',
  },
  {
    id: '4',
    name: '3-Bedroom',
    bedrooms: 3,
    description: 'Luxurious penthouse with panoramic views and top-tier amenities.',
  },
  {
    id: '5',
    name: '4-Bedroom',
    bedrooms: 4,
    description: 'Grand 4-bedroom villa with private garden, pool, and premium security.',
  },
];

const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Downtown',
    city: 'Nairobi',
    area: 'Central Business District',
  },
  {
    id: '2',
    name: 'Westlands',
    city: 'Nairobi',
    area: 'High-end residential area',
  },
  {
    id: '3',
    name: 'Kilimani',
    city: 'Nairobi',
    area: 'Residential and commercial area',
  },
  {
    id: '4',
    name: 'Karen',
    city: 'Nairobi',
    area: 'Luxury residential area',
  },
  {
    id: '5',
    name: 'Runda',
    city: 'Nairobi',
    area: 'Residential and commercial area',
  },
  {
    id: '6',
    name: 'Lavington',
    city: 'Nairobi',
    area: 'Residential area',
  },
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'M-Pesa',
    enabled: true,
    type: 'mpesa',
  },
  {
    id: '2',
    name: 'Stripe',
    enabled: false,
    type: 'stripe',
  },
  {
    id: '3',
    name: 'PayPal',
    enabled: false,
    type: 'paypal',
  },
  {
    id: '4',
    name: 'Bank Transfer',
    enabled: false,
    type: 'bank_transfer',
  },
  {
    id: '5',
    name: 'Cash',
    enabled: false,
    type: 'cash',
  },
];

const mockSettings: Settings = {
  paymentMethods: mockPaymentMethods,
  theme: {
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    darkMode: false,
  },
  contactDetails: {
    phoneNumber: '+254 700 000 000',
    email: 'info@skywaysuites.com',
    message: 'Your satisfaction is our priority. We strive to provide the best service possible.',
    enabled: true,
  },
  sms: {
    provider: 'Twilio',
    enabled: true,
  },
};

// API Functions - Replace these with actual API calls to your database

// Helper function to calculate property availability based on bookings
const calculatePropertyAvailability = (propertyId: string): { available: boolean; availableAfter?: string } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate date comparison
  
  // Get all confirmed bookings for this property
  const propertyBookings = mockBookings.filter(
    booking => booking.propertyId === propertyId && booking.status === 'confirmed'
  );
  
  // Find if there's an active booking (checkout date is in the future)
  const activeBooking = propertyBookings.find(booking => {
    const checkOutDate = new Date(booking.checkOut);
    return checkOutDate >= today;
  });
  
  if (activeBooking) {
    // Property is currently booked
    const checkOutDate = new Date(activeBooking.checkOut);
    return {
      available: false,
      availableAfter: activeBooking.checkOut,
    };
  }
  
  // Property is available
  return {
    available: true,
    availableAfter: undefined,
  };
};

// Properties API
export const getProperties = async (): Promise<Property[]> => {
  // TODO: Replace with actual API call
  // return fetch(`${BASE_URL}/properties`).then(res => res.json());
  
  // Calculate availability for each property based on bookings
  const propertiesWithAvailability = mockProperties.map(property => {
    const availability = calculatePropertyAvailability(property.id);
    return {
      ...property,
      ...availability,
    };
  });
  
  return Promise.resolve(propertiesWithAvailability);
};

export const getPropertyById = async (id: string): Promise<Property | undefined> => {
  // TODO: Replace with actual API call
  // return fetch(`${BASE_URL}/properties/${id}`).then(res => res.json());
  
  const property = mockProperties.find(p => p.id === id);
  
  if (property) {
    const availability = calculatePropertyAvailability(property.id);
    return Promise.resolve({
      ...property,
      ...availability,
    });
  }
  
  return Promise.resolve(undefined);
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
  const { storageService } = await import('./storage');
  return storageService.getCustomers();
};

export const createCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
  const { storageService } = await import('./storage');
  const newCustomer = {
    ...customer,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  return storageService.createCustomer(newCustomer);
};

export const updateCustomer = async (id: string, customer: Partial<Customer>): Promise<Customer> => {
  const { storageService } = await import('./storage');
  return storageService.updateCustomer(id, customer);
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const { storageService } = await import('./storage');
  return storageService.deleteCustomer(id);
};

// Bookings API
export const getBookings = async (): Promise<Booking[]> => {
  const { storageService } = await import('./storage');
  return storageService.getBookings();
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
  const { storageService } = await import('./storage');
  const newBooking = {
    ...booking,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  return storageService.createBooking(newBooking);
};

export const updateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<Booking> => {
  const { storageService } = await import('./storage');
  return storageService.updateBooking(id, { status });
};

// Payments API
export const getPayments = async (): Promise<Payment[]> => {
  const { storageService } = await import('./storage');
  return storageService.getPayments();
};

export const createPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
  const { storageService } = await import('./storage');
  const newPayment = { ...payment, id: Date.now().toString() };
  return storageService.createPayment(newPayment);
};

// Authentication API
export const login = async (email: string, password: string): Promise<User> => {
  // TODO: Replace with actual API call to your authentication system
  // return fetch(`${BASE_URL}/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) }).then(res => res.json());\\n  
  // Dynamic import to avoid circular dependency
  const { storageService } = await import('./storage');
  
  // Check against app_users using storage service
  const appUsers = await storageService.getAppUsers();
  
  console.log('Login attempt for:', email);
  console.log('Available users:', appUsers.map((u: any) => ({ email: u.email, role: u.role })));
  
  // Find user with matching email and password
  const user = appUsers.find((u: any) => u.email === email && u.password === password);
  
  if (user) {
    console.log('Login successful for:', email, 'Role:', user.role);
    return Promise.resolve({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }
  
  console.error('Login failed - Invalid credentials for:', email);
  // If not found, throw error
  throw new Error('Invalid email or password');
};

export const register = async (email: string, password: string, name: string, phone: string): Promise<User> => {
  // TODO: Replace with actual API call to your authentication system
  // return fetch(`${BASE_URL}/auth/register`, { method: 'POST', body: JSON.stringify({ email, password, name, phone }) }).then(res => res.json());
  
  // Dynamic import to avoid circular dependency
  const { storageService } = await import('./storage');
  
  // Check if user already exists in app_users
  const appUsers = await storageService.getAppUsers();
  
  // Check for existing email in app_users
  if (appUsers.some((u: any) => u.email === email)) {
    throw new Error('User with this email already exists');
  }
  
  // Create new customer record using storage service
  const customerId = Date.now().toString();
  const newCustomer = await storageService.createCustomer({
    id: customerId,
    name,
    email,
    phone,
    address: '',
    createdAt: new Date().toISOString(),
  });
  
  // Create app user with customer role
  const newAppUser = {
    id: newCustomer.id,
    name,
    email,
    phone,
    password, // In production, this should be hashed
    role: 'customer',
    createdAt: new Date().toISOString(),
  };
  
  // Save to app_users using storage service (handles both local and remote)
  await storageService.createAppUser(newAppUser);
  
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

// Menu Pages API
export const getMenuPages = async (): Promise<MenuPage[]> => {
  // TODO: Replace with actual API call
  return Promise.resolve(mockMenuPages);
};

export const getMenuPageById = async (id: string): Promise<MenuPage | undefined> => {
  // TODO: Replace with actual API call
  return Promise.resolve(mockMenuPages.find(p => p.id === id));
};

export const createMenuPage = async (menuPage: Omit<MenuPage, 'id'>): Promise<MenuPage> => {
  // TODO: Replace with actual API call
  const newMenuPage = { ...menuPage, id: Date.now().toString() };
  mockMenuPages.push(newMenuPage);
  return Promise.resolve(newMenuPage);
};

export const updateMenuPage = async (id: string, menuPage: Partial<MenuPage>): Promise<MenuPage> => {
  // TODO: Replace with actual API call
  const index = mockMenuPages.findIndex(p => p.id === id);
  if (index !== -1) {
    mockMenuPages[index] = { ...mockMenuPages[index], ...menuPage };
    return Promise.resolve(mockMenuPages[index]);
  }
  throw new Error('Menu page not found');
};

export const deleteMenuPage = async (id: string): Promise<void> => {
  // TODO: Replace with actual API call
  const index = mockMenuPages.findIndex(p => p.id === id);
  if (index !== -1) {
    mockMenuPages.splice(index, 1);
  }
  return Promise.resolve();
};

// Categories API
export const getCategories = async (): Promise<Category[]> => {
  // TODO: Replace with actual API call
  return Promise.resolve(mockCategories);
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  // TODO: Replace with actual API call
  const newCategory = { ...category, id: Date.now().toString() };
  mockCategories.push(newCategory);
  return Promise.resolve(newCategory);
};

export const updateCategory = async (id: string, category: Partial<Category>): Promise<Category> => {
  // TODO: Replace with actual API call
  const index = mockCategories.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCategories[index] = { ...mockCategories[index], ...category };
    return Promise.resolve(mockCategories[index]);
  }
  throw new Error('Category not found');
};

export const deleteCategory = async (id: string): Promise<void> => {
  // TODO: Replace with actual API call
  const index = mockCategories.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCategories.splice(index, 1);
  }
  return Promise.resolve();
};

// Locations API
export const getLocations = async (): Promise<Location[]> => {
  // TODO: Replace with actual API call
  return Promise.resolve(mockLocations);
};

export const createLocation = async (location: Omit<Location, 'id'>): Promise<Location> => {
  // TODO: Replace with actual API call
  const newLocation = { ...location, id: Date.now().toString() };
  mockLocations.push(newLocation);
  return Promise.resolve(newLocation);
};

export const updateLocation = async (id: string, location: Partial<Location>): Promise<Location> => {
  // TODO: Replace with actual API call
  const index = mockLocations.findIndex(l => l.id === id);
  if (index !== -1) {
    mockLocations[index] = { ...mockLocations[index], ...location };
    return Promise.resolve(mockLocations[index]);
  }
  throw new Error('Location not found');
};

export const deleteLocation = async (id: string): Promise<void> => {
  // TODO: Replace with actual API call
  const index = mockLocations.findIndex(l => l.id === id);
  if (index !== -1) {
    mockLocations.splice(index, 1);
  }
  return Promise.resolve();
};

// Settings API
export const getSettings = async (): Promise<Settings> => {
  // TODO: Replace with actual API call
  return Promise.resolve(mockSettings);
};

export const updateSettings = async (settings: Partial<Settings>): Promise<Settings> => {
  // TODO: Replace with actual API call
  const newSettings = { ...mockSettings, ...settings };
  return Promise.resolve(newSettings);
};