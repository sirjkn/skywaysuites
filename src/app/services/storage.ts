import { getSupabaseClient } from './supabase';
import type { Property, Feature, Customer, Booking, Payment, MenuPage } from './api';

export type StorageType = 'remote'; // Always use remote (Supabase)

// Add AppUser interface
export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  createdAt: string;
}

/**
 * Storage Service - Uses Supabase as primary database
 * All data is stored and retrieved from Supabase instantly
 * Falls back to localStorage if Supabase is not configured
 */
export class StorageService {
  private storageType: StorageType = 'remote';

  constructor() {
    console.log('🚀 StorageService initialized with Supabase as primary database');
  }

  // Helper to ensure Supabase is connected
  private ensureSupabase() {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.warn('⚠️ Supabase is not connected. Falling back to localStorage.');
      return null;
    }
    return supabase;
  }

  // Helper to get from localStorage
  private getFromLocalStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  // Helper to save to localStorage
  private saveToLocalStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  // Properties
  async getProperties(): Promise<Property[]> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('createdAt', { ascending: false });
        
        if (error) {
          console.error('Error fetching properties from Supabase:', error);
          throw error;
        }
        
        return data || [];
      } else {
        return this.getFromLocalStorage<Property[]>('properties', []);
      }
    } catch (error) {
      console.error('Error in getProperties:', error);
      throw error;
    }
  }

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // Not found
            return null;
          }
          console.error('Error fetching property from Supabase:', error);
          throw error;
        }
        
        return data;
      } else {
        const properties = this.getFromLocalStorage<Property[]>('properties', []);
        return properties.find(prop => prop.id === id) || null;
      }
    } catch (error) {
      console.error('Error in getPropertyById:', error);
      throw error;
    }
  }

  async createProperty(property: Property): Promise<Property> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('properties')
          .insert([property])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating property in Supabase:', error);
          throw error;
        }
        
        console.log('✅ Property created in Supabase:', data.id);
        return data;
      } else {
        const properties = this.getFromLocalStorage<Property[]>('properties', []);
        properties.push(property);
        this.saveToLocalStorage('properties', properties);
        console.log('✅ Property created in localStorage:', property.id);
        return property;
      }
    } catch (error) {
      console.error('Error in createProperty:', error);
      throw error;
    }
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<Property> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('properties')
          .update(property)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating property in Supabase:', error);
          throw error;
        }
        
        console.log('✅ Property updated in Supabase:', data.id);
        return data;
      } else {
        const properties = this.getFromLocalStorage<Property[]>('properties', []);
        const index = properties.findIndex(prop => prop.id === id);
        if (index !== -1) {
          properties[index] = { ...properties[index], ...property };
          this.saveToLocalStorage('properties', properties);
          console.log('✅ Property updated in localStorage:', id);
          return properties[index];
        } else {
          throw new Error('Property not found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error in updateProperty:', error);
      throw error;
    }
  }

  async deleteProperty(id: string): Promise<void> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { error } = await supabase
          .from('properties')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting property from Supabase:', error);
          throw error;
        }
        
        console.log('✅ Property deleted from Supabase:', id);
      } else {
        const properties = this.getFromLocalStorage<Property[]>('properties', []);
        const index = properties.findIndex(prop => prop.id === id);
        if (index !== -1) {
          properties.splice(index, 1);
          this.saveToLocalStorage('properties', properties);
          console.log('✅ Property deleted from localStorage:', id);
        } else {
          throw new Error('Property not found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error in deleteProperty:', error);
      throw error;
    }
  }

  // Features
  async getFeatures(): Promise<Feature[]> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('features')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          console.error('Error fetching features from Supabase:', error);
          throw error;
        }
        
        return data || [];
      } else {
        return this.getFromLocalStorage<Feature[]>('features', []);
      }
    } catch (error) {
      console.error('Error in getFeatures:', error);
      throw error;
    }
  }

  async createFeature(feature: Feature): Promise<Feature> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('features')
          .insert([feature])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating feature in Supabase:', error);
          throw error;
        }
        
        console.log('✅ Feature created in Supabase:', data.id);
        return data;
      } else {
        const features = this.getFromLocalStorage<Feature[]>('features', []);
        features.push(feature);
        this.saveToLocalStorage('features', features);
        console.log('✅ Feature created in localStorage:', feature.id);
        return feature;
      }
    } catch (error) {
      console.error('Error in createFeature:', error);
      throw error;
    }
  }

  async updateFeature(id: string, feature: Partial<Feature>): Promise<Feature> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('features')
          .update(feature)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating feature in Supabase:', error);
          throw error;
        }
        
        console.log('✅ Feature updated in Supabase:', data.id);
        return data;
      } else {
        const features = this.getFromLocalStorage<Feature[]>('features', []);
        const index = features.findIndex(feat => feat.id === id);
        if (index !== -1) {
          features[index] = { ...features[index], ...feature };
          this.saveToLocalStorage('features', features);
          console.log('✅ Feature updated in localStorage:', id);
          return features[index];
        } else {
          throw new Error('Feature not found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error in updateFeature:', error);
      throw error;
    }
  }

  async deleteFeature(id: string): Promise<void> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { error } = await supabase
          .from('features')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting feature from Supabase:', error);
          throw error;
        }
        
        console.log('✅ Feature deleted from Supabase:', id);
      } else {
        const features = this.getFromLocalStorage<Feature[]>('features', []);
        const index = features.findIndex(feat => feat.id === id);
        if (index !== -1) {
          features.splice(index, 1);
          this.saveToLocalStorage('features', features);
          console.log('✅ Feature deleted from localStorage:', id);
        } else {
          throw new Error('Feature not found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error in deleteFeature:', error);
      throw error;
    }
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('createdAt', { ascending: false });
        
        if (error) {
          console.error('Error fetching customers from Supabase:', error);
          throw error;
        }
        
        return data || [];
      } else {
        return this.getFromLocalStorage<Customer[]>('customers', []);
      }
    } catch (error) {
      console.error('Error in getCustomers:', error);
      throw error;
    }
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('customers')
          .insert([customer])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating customer in Supabase:', error);
          throw error;
        }
        
        console.log('✅ Customer created in Supabase:', data.id);
        return data;
      } else {
        const customers = this.getFromLocalStorage<Customer[]>('customers', []);
        customers.push(customer);
        this.saveToLocalStorage('customers', customers);
        console.log('✅ Customer created in localStorage:', customer.id);
        return customer;
      }
    } catch (error) {
      console.error('Error in createCustomer:', error);
      throw error;
    }
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('customers')
          .update(customer)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating customer in Supabase:', error);
          throw error;
        }
        
        console.log('✅ Customer updated in Supabase:', data.id);
        return data;
      } else {
        const customers = this.getFromLocalStorage<Customer[]>('customers', []);
        const index = customers.findIndex(cust => cust.id === id);
        if (index !== -1) {
          customers[index] = { ...customers[index], ...customer };
          this.saveToLocalStorage('customers', customers);
          console.log('✅ Customer updated in localStorage:', id);
          return customers[index];
        } else {
          throw new Error('Customer not found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error in updateCustomer:', error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { error } = await supabase
          .from('customers')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting customer from Supabase:', error);
          throw error;
        }
        
        console.log('✅ Customer deleted from Supabase:', id);
      } else {
        const customers = this.getFromLocalStorage<Customer[]>('customers', []);
        const index = customers.findIndex(cust => cust.id === id);
        if (index !== -1) {
          customers.splice(index, 1);
          this.saveToLocalStorage('customers', customers);
          console.log('✅ Customer deleted from localStorage:', id);
        } else {
          throw new Error('Customer not found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error in deleteCustomer:', error);
      throw error;
    }
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('createdAt', { ascending: false });
        
        if (error) {
          console.error('Error fetching bookings from Supabase:', error);
          throw error;
        }
        
        return data || [];
      } else {
        return this.getFromLocalStorage<Booking[]>('bookings', []);
      }
    } catch (error) {
      console.error('Error in getBookings:', error);
      throw error;
    }
  }

  async createBooking(booking: Booking): Promise<Booking> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('bookings')
          .insert([booking])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating booking in Supabase:', error);
          throw error;
        }
        
        console.log('✅ Booking created in Supabase:', data.id);
        return data;
      } else {
        const bookings = this.getFromLocalStorage<Booking[]>('bookings', []);
        bookings.push(booking);
        this.saveToLocalStorage('bookings', bookings);
        console.log('✅ Booking created in localStorage:', booking.id);
        return booking;
      }
    } catch (error) {
      console.error('Error in createBooking:', error);
      throw error;
    }
  }

  async updateBooking(id: string, booking: Partial<Booking>): Promise<Booking> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('bookings')
          .update(booking)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating booking in Supabase:', error);
          throw error;
        }
        
        console.log('✅ Booking updated in Supabase:', data.id);
        return data;
      } else {
        const bookings = this.getFromLocalStorage<Booking[]>('bookings', []);
        const index = bookings.findIndex(book => book.id === id);
        if (index !== -1) {
          bookings[index] = { ...bookings[index], ...booking };
          this.saveToLocalStorage('bookings', bookings);
          console.log('✅ Booking updated in localStorage:', id);
          return bookings[index];
        } else {
          throw new Error('Booking not found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error in updateBooking:', error);
      throw error;
    }
  }

  async deleteBooking(id: string): Promise<void> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { error } = await supabase
          .from('bookings')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting booking from Supabase:', error);
          throw error;
        }
        
        console.log('✅ Booking deleted from Supabase:', id);
      } else {
        const bookings = this.getFromLocalStorage<Booking[]>('bookings', []);
        const index = bookings.findIndex(book => book.id === id);
        if (index !== -1) {
          bookings.splice(index, 1);
          this.saveToLocalStorage('bookings', bookings);
          console.log('✅ Booking deleted from localStorage:', id);
        } else {
          throw new Error('Booking not found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error in deleteBooking:', error);
      throw error;
    }
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) {
          console.error('Error fetching payments from Supabase:', error);
          throw error;
        }
        
        return data || [];
      } else {
        return this.getFromLocalStorage<Payment[]>('payments', []);
      }
    } catch (error) {
      console.error('Error in getPayments:', error);
      throw error;
    }
  }

  async createPayment(payment: Payment): Promise<Payment> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('payments')
          .insert([payment])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating payment in Supabase:', error);
          throw error;
        }
        
        console.log('✅ Payment created in Supabase:', data.id);
        return data;
      } else {
        const payments = this.getFromLocalStorage<Payment[]>('payments', []);
        payments.push(payment);
        this.saveToLocalStorage('payments', payments);
        console.log('✅ Payment created in localStorage:', payment.id);
        return payment;
      }
    } catch (error) {
      console.error('Error in createPayment:', error);
      throw error;
    }
  }

  async updatePayment(id: string, payment: Partial<Payment>): Promise<Payment> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('payments')
          .update(payment)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating payment in Supabase:', error);
          throw error;
        }
        
        console.log('✅ Payment updated in Supabase:', data.id);
        return data;
      } else {
        const payments = this.getFromLocalStorage<Payment[]>('payments', []);
        const index = payments.findIndex(pay => pay.id === id);
        if (index !== -1) {
          payments[index] = { ...payments[index], ...payment };
          this.saveToLocalStorage('payments', payments);
          console.log('✅ Payment updated in localStorage:', id);
          return payments[index];
        } else {
          throw new Error('Payment not found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error in updatePayment:', error);
      throw error;
    }
  }

  async deletePayment(id: string): Promise<void> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { error } = await supabase
          .from('payments')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting payment from Supabase:', error);
          throw error;
        }
        
        console.log('✅ Payment deleted from Supabase:', id);
      } else {
        const payments = this.getFromLocalStorage<Payment[]>('payments', []);
        const index = payments.findIndex(pay => pay.id === id);
        if (index !== -1) {
          payments.splice(index, 1);
          this.saveToLocalStorage('payments', payments);
          console.log('✅ Payment deleted from localStorage:', id);
        } else {
          throw new Error('Payment not found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error in deletePayment:', error);
      throw error;
    }
  }

  // Menu Pages
  async getMenuPages(): Promise<MenuPage[]> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('menu_pages')
          .select('*')
          .order('order', { ascending: true });
        
        if (error) {
          console.error('Error fetching menu pages from Supabase:', error);
          throw error;
        }
        
        return data || [];
      } else {
        return this.getFromLocalStorage<MenuPage[]>('menu_pages', []);
      }
    } catch (error) {
      console.error('Error in getMenuPages:', error);
      throw error;
    }
  }

  async createMenuPage(menuPage: MenuPage): Promise<MenuPage> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('menu_pages')
          .insert([menuPage])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating menu page in Supabase:', error);
          throw error;
        }
        
        console.log('✅ Menu page created in Supabase:', data.id);
        return data;
      } else {
        const menuPages = this.getFromLocalStorage<MenuPage[]>('menu_pages', []);
        menuPages.push(menuPage);
        this.saveToLocalStorage('menu_pages', menuPages);
        console.log('✅ Menu page created in localStorage:', menuPage.id);
        return menuPage;
      }
    } catch (error) {
      console.error('Error in createMenuPage:', error);
      throw error;
    }
  }

  async updateMenuPage(id: string, menuPage: Partial<MenuPage>): Promise<MenuPage> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('menu_pages')
          .update(menuPage)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating menu page in Supabase:', error);
          throw error;
        }
        
        console.log('✅ Menu page updated in Supabase:', data.id);
        return data;
      } else {
        const menuPages = this.getFromLocalStorage<MenuPage[]>('menu_pages', []);
        const index = menuPages.findIndex(page => page.id === id);
        if (index !== -1) {
          menuPages[index] = { ...menuPages[index], ...menuPage };
          this.saveToLocalStorage('menu_pages', menuPages);
          console.log('✅ Menu page updated in localStorage:', id);
          return menuPages[index];
        } else {
          throw new Error('Menu page not found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error in updateMenuPage:', error);
      throw error;
    }
  }

  async deleteMenuPage(id: string): Promise<void> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { error } = await supabase
          .from('menu_pages')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting menu page from Supabase:', error);
          throw error;
        }
        
        console.log('✅ Menu page deleted from Supabase:', id);
      } else {
        const menuPages = this.getFromLocalStorage<MenuPage[]>('menu_pages', []);
        const index = menuPages.findIndex(page => page.id === id);
        if (index !== -1) {
          menuPages.splice(index, 1);
          this.saveToLocalStorage('menu_pages', menuPages);
          console.log('✅ Menu page deleted from localStorage:', id);
        } else {
          throw new Error('Menu page not found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error in deleteMenuPage:', error);
      throw error;
    }
  }

  // App Users
  async getAppUsers(): Promise<AppUser[]> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('app_users')
          .select('*')
          .order('createdAt', { ascending: false });
        
        if (error) {
          console.error('Error fetching app users from Supabase:', error);
          throw error;
        }
        
        return data || [];
      } else {
        return this.getFromLocalStorage<AppUser[]>('app_users', []);
      }
    } catch (error) {
      console.error('Error in getAppUsers:', error);
      throw error;
    }
  }

  async createAppUser(user: AppUser): Promise<AppUser> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('app_users')
          .insert([user])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating app user in Supabase:', error);
          throw error;
        }
        
        console.log('✅ App user created in Supabase:', data.id);
        return data;
      } else {
        const appUsers = this.getFromLocalStorage<AppUser[]>('app_users', []);
        appUsers.push(user);
        this.saveToLocalStorage('app_users', appUsers);
        console.log('✅ App user created in localStorage:', user.id);
        return user;
      }
    } catch (error) {
      console.error('Error in createAppUser:', error);
      throw error;
    }
  }

  async updateAppUser(id: string, user: Partial<AppUser>): Promise<AppUser> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('app_users')
          .update(user)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating app user in Supabase:', error);
          throw error;
        }
        
        console.log('✅ App user updated in Supabase:', data.id);
        return data;
      } else {
        const appUsers = this.getFromLocalStorage<AppUser[]>('app_users', []);
        const index = appUsers.findIndex(appUser => appUser.id === id);
        if (index !== -1) {
          appUsers[index] = { ...appUsers[index], ...user };
          this.saveToLocalStorage('app_users', appUsers);
          console.log('✅ App user updated in localStorage:', id);
          return appUsers[index];
        } else {
          throw new Error('App user not found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error in updateAppUser:', error);
      throw error;
    }
  }

  async deleteAppUser(id: string): Promise<void> {
    try {
      const supabase = this.ensureSupabase();
      if (supabase) {
        const { error } = await supabase
          .from('app_users')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting app user from Supabase:', error);
          throw error;
        }
        
        console.log('✅ App user deleted from Supabase:', id);
      } else {
        const appUsers = this.getFromLocalStorage<AppUser[]>('app_users', []);
        const index = appUsers.findIndex(appUser => appUser.id === id);
        if (index !== -1) {
          appUsers.splice(index, 1);
          this.saveToLocalStorage('app_users', appUsers);
          console.log('✅ App user deleted from localStorage:', id);
        } else {
          throw new Error('App user not found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error in deleteAppUser:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();