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
      throw new Error('Supabase is not connected. Please configure Supabase in Settings.');
    }
    return supabase;
  }

  // Properties
  async getProperties(): Promise<Property[]> {
    try {
      const supabase = this.ensureSupabase();
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) {
        console.error('Error fetching properties from Supabase:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getProperties:', error);
      throw error;
    }
  }

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const supabase = this.ensureSupabase();
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
    } catch (error) {
      console.error('Error in getPropertyById:', error);
      throw error;
    }
  }

  async createProperty(property: Property): Promise<Property> {
    try {
      const supabase = this.ensureSupabase();
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
    } catch (error) {
      console.error('Error in createProperty:', error);
      throw error;
    }
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<Property> {
    try {
      const supabase = this.ensureSupabase();
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
    } catch (error) {
      console.error('Error in updateProperty:', error);
      throw error;
    }
  }

  async deleteProperty(id: string): Promise<void> {
    try {
      const supabase = this.ensureSupabase();
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting property from Supabase:', error);
        throw error;
      }
      
      console.log('✅ Property deleted from Supabase:', id);
    } catch (error) {
      console.error('Error in deleteProperty:', error);
      throw error;
    }
  }

  // Features
  async getFeatures(): Promise<Feature[]> {
    try {
      const supabase = this.ensureSupabase();
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching features from Supabase:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getFeatures:', error);
      throw error;
    }
  }

  async createFeature(feature: Feature): Promise<Feature> {
    try {
      const supabase = this.ensureSupabase();
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
    } catch (error) {
      console.error('Error in createFeature:', error);
      throw error;
    }
  }

  async updateFeature(id: string, feature: Partial<Feature>): Promise<Feature> {
    try {
      const supabase = this.ensureSupabase();
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
    } catch (error) {
      console.error('Error in updateFeature:', error);
      throw error;
    }
  }

  async deleteFeature(id: string): Promise<void> {
    try {
      const supabase = this.ensureSupabase();
      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting feature from Supabase:', error);
        throw error;
      }
      
      console.log('✅ Feature deleted from Supabase:', id);
    } catch (error) {
      console.error('Error in deleteFeature:', error);
      throw error;
    }
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    try {
      const supabase = this.ensureSupabase();
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) {
        console.error('Error fetching customers from Supabase:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getCustomers:', error);
      throw error;
    }
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    try {
      const supabase = this.ensureSupabase();
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
    } catch (error) {
      console.error('Error in createCustomer:', error);
      throw error;
    }
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    try {
      const supabase = this.ensureSupabase();
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
    } catch (error) {
      console.error('Error in updateCustomer:', error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      const supabase = this.ensureSupabase();
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting customer from Supabase:', error);
        throw error;
      }
      
      console.log('✅ Customer deleted from Supabase:', id);
    } catch (error) {
      console.error('Error in deleteCustomer:', error);
      throw error;
    }
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    try {
      const supabase = this.ensureSupabase();
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings from Supabase:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getBookings:', error);
      throw error;
    }
  }

  async createBooking(booking: Booking): Promise<Booking> {
    try {
      const supabase = this.ensureSupabase();
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
    } catch (error) {
      console.error('Error in createBooking:', error);
      throw error;
    }
  }

  async updateBooking(id: string, booking: Partial<Booking>): Promise<Booking> {
    try {
      const supabase = this.ensureSupabase();
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
    } catch (error) {
      console.error('Error in updateBooking:', error);
      throw error;
    }
  }

  async deleteBooking(id: string): Promise<void> {
    try {
      const supabase = this.ensureSupabase();
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting booking from Supabase:', error);
        throw error;
      }
      
      console.log('✅ Booking deleted from Supabase:', id);
    } catch (error) {
      console.error('Error in deleteBooking:', error);
      throw error;
    }
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    try {
      const supabase = this.ensureSupabase();
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching payments from Supabase:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getPayments:', error);
      throw error;
    }
  }

  async createPayment(payment: Payment): Promise<Payment> {
    try {
      const supabase = this.ensureSupabase();
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
    } catch (error) {
      console.error('Error in createPayment:', error);
      throw error;
    }
  }

  async updatePayment(id: string, payment: Partial<Payment>): Promise<Payment> {
    try {
      const supabase = this.ensureSupabase();
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
    } catch (error) {
      console.error('Error in updatePayment:', error);
      throw error;
    }
  }

  async deletePayment(id: string): Promise<void> {
    try {
      const supabase = this.ensureSupabase();
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting payment from Supabase:', error);
        throw error;
      }
      
      console.log('✅ Payment deleted from Supabase:', id);
    } catch (error) {
      console.error('Error in deletePayment:', error);
      throw error;
    }
  }

  // Menu Pages
  async getMenuPages(): Promise<MenuPage[]> {
    try {
      const supabase = this.ensureSupabase();
      const { data, error } = await supabase
        .from('menuPages')
        .select('*')
        .order('order', { ascending: true });
      
      if (error) {
        console.error('Error fetching menu pages from Supabase:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getMenuPages:', error);
      throw error;
    }
  }

  async createMenuPage(menuPage: MenuPage): Promise<MenuPage> {
    try {
      const supabase = this.ensureSupabase();
      const { data, error } = await supabase
        .from('menuPages')
        .insert([menuPage])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating menu page in Supabase:', error);
        throw error;
      }
      
      console.log('✅ Menu page created in Supabase:', data.id);
      return data;
    } catch (error) {
      console.error('Error in createMenuPage:', error);
      throw error;
    }
  }

  async updateMenuPage(id: string, menuPage: Partial<MenuPage>): Promise<MenuPage> {
    try {
      const supabase = this.ensureSupabase();
      const { data, error } = await supabase
        .from('menuPages')
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
    } catch (error) {
      console.error('Error in updateMenuPage:', error);
      throw error;
    }
  }

  async deleteMenuPage(id: string): Promise<void> {
    try {
      const supabase = this.ensureSupabase();
      const { error } = await supabase
        .from('menuPages')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting menu page from Supabase:', error);
        throw error;
      }
      
      console.log('✅ Menu page deleted from Supabase:', id);
    } catch (error) {
      console.error('Error in deleteMenuPage:', error);
      throw error;
    }
  }

  // App Users
  async getAppUsers(): Promise<AppUser[]> {
    try {
      const supabase = this.ensureSupabase();
      const { data, error } = await supabase
        .from('appUsers')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) {
        console.error('Error fetching app users from Supabase:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAppUsers:', error);
      throw error;
    }
  }

  async createAppUser(user: AppUser): Promise<AppUser> {
    try {
      const supabase = this.ensureSupabase();
      const { data, error } = await supabase
        .from('appUsers')
        .insert([user])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating app user in Supabase:', error);
        throw error;
      }
      
      console.log('✅ App user created in Supabase:', data.id);
      return data;
    } catch (error) {
      console.error('Error in createAppUser:', error);
      throw error;
    }
  }

  async updateAppUser(id: string, user: Partial<AppUser>): Promise<AppUser> {
    try {
      const supabase = this.ensureSupabase();
      const { data, error } = await supabase
        .from('appUsers')
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
    } catch (error) {
      console.error('Error in updateAppUser:', error);
      throw error;
    }
  }

  async deleteAppUser(id: string): Promise<void> {
    try {
      const supabase = this.ensureSupabase();
      const { error } = await supabase
        .from('appUsers')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting app user from Supabase:', error);
        throw error;
      }
      
      console.log('✅ App user deleted from Supabase:', id);
    } catch (error) {
      console.error('Error in deleteAppUser:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();