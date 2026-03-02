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
  category?: 'Living Room' | 'Bedroom' | 'Dining' | 'Kitchen' | 'Bathroom' | 'Amenities';
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
  phone?: string;
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
  paymentMethod?: string;
  transactionId?: string;
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
const mockProperties: Property[] = [];

const mockFeatures: Feature[] = [];

const mockBookings: Booking[] = [];

const mockPayments: Payment[] = [];

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
const calculatePropertyAvailability = (propertyId: string, bookings: Booking[]): { available: boolean; availableAfter?: string } => {
  // Handle edge case where bookings might be undefined or null
  if (!bookings || !Array.isArray(bookings)) {
    return {
      available: true,
      availableAfter: undefined,
    };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate date comparison
  
  // Get all confirmed bookings for this property
  const propertyBookings = bookings.filter(
    booking => booking && booking.propertyId === propertyId && booking.status === 'confirmed'
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
  try {
    const { storageService } = await import('./storage');
    const properties = await storageService.getProperties();
    
    // Calculate availability for each property based on bookings
    const bookings = await storageService.getBookings();
    
    const propertiesWithAvailability = properties.map(property => {
      const availability = calculatePropertyAvailability(property.id, bookings);
      return {
        ...property,
        ...availability,
      };
    });
    
    return propertiesWithAvailability;
  } catch (error) {
    console.error('Error in getProperties:', error);
    return [];
  }
};

export const getPropertyById = async (id: string): Promise<Property | undefined> => {
  try {
    const { storageService } = await import('./storage');
    const property = await storageService.getPropertyById(id);
    
    if (property) {
      const bookings = await storageService.getBookings();
      const availability = calculatePropertyAvailability(property.id, bookings);
      return {
        ...property,
        ...availability,
      };
    }
    
    return undefined;
  } catch (error) {
    console.error('Error in getPropertyById:', error);
    return undefined;
  }
};

export const createProperty = async (property: Omit<Property, 'id' | 'createdAt'>): Promise<Property> => {
  try {
    const { storageService } = await import('./storage');
    const newProperty = {
      ...property,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    } as Property;
    
    return await storageService.createProperty(newProperty);
  } catch (error) {
    console.error('Error in createProperty:', error);
    throw error;
  }
};

export const updateProperty = async (id: string, property: Partial<Property>): Promise<Property> => {
  try {
    const { storageService } = await import('./storage');
    return await storageService.updateProperty(id, property);
  } catch (error) {
    console.error('Error in updateProperty:', error);
    throw error;
  }
};

export const deleteProperty = async (id: string): Promise<void> => {
  const { storageService } = await import('./storage');
  return await storageService.deleteProperty(id);
};

// Features API
export const getFeatures = async (): Promise<Feature[]> => {
  const { storageService } = await import('./storage');
  return await storageService.getFeatures();
};

export const createFeature = async (feature: Omit<Feature, 'id'>): Promise<Feature> => {
  const { storageService } = await import('./storage');
  const newFeature = { 
    ...feature, 
    id: Date.now().toString() 
  } as Feature;
  return await storageService.createFeature(newFeature);
};

export const updateFeature = async (id: string, feature: Partial<Feature>): Promise<Feature> => {
  const { storageService } = await import('./storage');
  return await storageService.updateFeature(id, feature);
};

export const deleteFeature = async (id: string): Promise<void> => {
  const { storageService } = await import('./storage');
  return await storageService.deleteFeature(id);
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
  
  // Find user with matching email (case-insensitive) and password
  const user = appUsers.find((u: any) => 
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
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
  
  // Check for existing email in app_users (case-insensitive)
  if (appUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('This email is already registered. Please use a different email or login.');
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