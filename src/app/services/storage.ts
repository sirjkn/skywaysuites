import { getSupabaseClient } from './supabase';
import type { Property, Feature, Customer, Booking, Payment, MenuPage } from './api';

export type StorageType = 'local' | 'remote';

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
 * Get current storage type from settings
 */
export const getStorageType = (): StorageType => {
  const settings = localStorage.getItem('databaseSettings');
  if (settings) {
    try {
      const parsed = JSON.parse(settings);
      return parsed.storageType || 'local';
    } catch (error) {
      console.error('Error parsing database settings:', error);
    }
  }
  return 'local';
};

/**
 * Storage interface for consistent API across local and remote storage
 */
export class StorageService {
  private storageType: StorageType;

  constructor() {
    this.storageType = getStorageType();
    
    // Listen for storage type changes
    window.addEventListener('databaseSettingsChanged', () => {
      this.storageType = getStorageType();
    });
  }

  // Properties
  async getProperties(): Promise<Property[]> {
    if (this.storageType === 'remote') {
      return this.getPropertiesRemote();
    }
    return this.getPropertiesLocal();
  }

  async getPropertyById(id: string): Promise<Property | null> {
    if (this.storageType === 'remote') {
      return this.getPropertyByIdRemote(id);
    }
    return this.getPropertyByIdLocal(id);
  }

  async createProperty(property: Property): Promise<Property> {
    if (this.storageType === 'remote') {
      return this.createPropertyRemote(property);
    }
    return this.createPropertyLocal(property);
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<Property> {
    if (this.storageType === 'remote') {
      return this.updatePropertyRemote(id, property);
    }
    return this.updatePropertyLocal(id, property);
  }

  async deleteProperty(id: string): Promise<void> {
    if (this.storageType === 'remote') {
      return this.deletePropertyRemote(id);
    }
    return this.deletePropertyLocal(id);
  }

  // Features
  async getFeatures(): Promise<Feature[]> {
    if (this.storageType === 'remote') {
      return this.getFeaturesRemote();
    }
    return this.getFeaturesLocal();
  }

  async createFeature(feature: Feature): Promise<Feature> {
    if (this.storageType === 'remote') {
      return this.createFeatureRemote(feature);
    }
    return this.createFeatureLocal(feature);
  }

  async updateFeature(id: string, feature: Partial<Feature>): Promise<Feature> {
    if (this.storageType === 'remote') {
      return this.updateFeatureRemote(id, feature);
    }
    return this.updateFeatureLocal(id, feature);
  }

  async deleteFeature(id: string): Promise<void> {
    if (this.storageType === 'remote') {
      return this.deleteFeatureRemote(id);
    }
    return this.deleteFeatureLocal(id);
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    if (this.storageType === 'remote') {
      return this.getCustomersRemote();
    }
    return this.getCustomersLocal();
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    if (this.storageType === 'remote') {
      return this.createCustomerRemote(customer);
    }
    return this.createCustomerLocal(customer);
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    if (this.storageType === 'remote') {
      return this.updateCustomerRemote(id, customer);
    }
    return this.updateCustomerLocal(id, customer);
  }

  async deleteCustomer(id: string): Promise<void> {
    if (this.storageType === 'remote') {
      return this.deleteCustomerRemote(id);
    }
    return this.deleteCustomerLocal(id);
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    if (this.storageType === 'remote') {
      return this.getBookingsRemote();
    }
    return this.getBookingsLocal();
  }

  async createBooking(booking: Booking): Promise<Booking> {
    if (this.storageType === 'remote') {
      return this.createBookingRemote(booking);
    }
    return this.createBookingLocal(booking);
  }

  async updateBooking(id: string, booking: Partial<Booking>): Promise<Booking> {
    if (this.storageType === 'remote') {
      return this.updateBookingRemote(id, booking);
    }
    return this.updateBookingLocal(id, booking);
  }

  async deleteBooking(id: string): Promise<void> {
    if (this.storageType === 'remote') {
      return this.deleteBookingRemote(id);
    }
    return this.deleteBookingLocal(id);
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    if (this.storageType === 'remote') {
      return this.getPaymentsRemote();
    }
    return this.getPaymentsLocal();
  }

  // Menu Pages
  async getMenuPages(): Promise<MenuPage[]> {
    if (this.storageType === 'remote') {
      return this.getMenuPagesRemote();
    }
    return this.getMenuPagesLocal();
  }

  async createMenuPage(page: MenuPage): Promise<MenuPage> {
    if (this.storageType === 'remote') {
      return this.createMenuPageRemote(page);
    }
    return this.createMenuPageLocal(page);
  }

  async updateMenuPage(id: string, page: Partial<MenuPage>): Promise<MenuPage> {
    if (this.storageType === 'remote') {
      return this.updateMenuPageRemote(id, page);
    }
    return this.updateMenuPageLocal(id, page);
  }

  async deleteMenuPage(id: string): Promise<void> {
    if (this.storageType === 'remote') {
      return this.deleteMenuPageRemote(id);
    }
    return this.deleteMenuPageLocal(id);
  }

  // Settings
  async getGeneralSettings(): Promise<any> {
    if (this.storageType === 'remote') {
      return this.getGeneralSettingsRemote();
    }
    return this.getGeneralSettingsLocal();
  }

  async saveGeneralSettings(settings: any): Promise<void> {
    if (this.storageType === 'remote') {
      return this.saveGeneralSettingsRemote(settings);
    }
    return this.saveGeneralSettingsLocal(settings);
  }

  async getWhatsAppSettings(): Promise<any> {
    if (this.storageType === 'remote') {
      return this.getWhatsAppSettingsRemote();
    }
    return this.getWhatsAppSettingsLocal();
  }

  async saveWhatsAppSettings(settings: any): Promise<void> {
    if (this.storageType === 'remote') {
      return this.saveWhatsAppSettingsRemote(settings);
    }
    return this.saveWhatsAppSettingsLocal(settings);
  }

  async getSliderSettings(): Promise<any[]> {
    if (this.storageType === 'remote') {
      return this.getSliderSettingsRemote();
    }
    return this.getSliderSettingsLocal();
  }

  async saveSliderSettings(settings: any[]): Promise<void> {
    if (this.storageType === 'remote') {
      return this.saveSliderSettingsRemote(settings);
    }
    return this.saveSliderSettingsLocal(settings);
  }

  // App Users
  async getAppUsers(): Promise<AppUser[]> {
    if (this.storageType === 'remote') {
      return this.getAppUsersRemote();
    }
    return this.getAppUsersLocal();
  }

  async createAppUser(user: AppUser): Promise<AppUser> {
    // Always save to local first
    const localUser = this.createAppUserLocal(user);
    
    // Then sync to remote if connected
    if (this.storageType === 'remote') {
      try {
        await this.createAppUserRemote(user);
      } catch (error) {
        console.error('Error syncing app user to remote:', error);
        // Continue even if remote sync fails
      }
    }
    return localUser;
  }

  async updateAppUser(id: string, user: Partial<AppUser>): Promise<AppUser> {
    // Always update local first
    const localUser = this.updateAppUserLocal(id, user);
    
    // Then sync to remote if connected
    if (this.storageType === 'remote') {
      try {
        await this.updateAppUserRemote(id, user);
      } catch (error) {
        console.error('Error syncing app user update to remote:', error);
        // Continue even if remote sync fails
      }
    }
    return localUser;
  }

  async deleteAppUser(id: string): Promise<void> {
    // Always delete from local first
    this.deleteAppUserLocal(id);
    
    // Then sync to remote if connected
    if (this.storageType === 'remote') {
      try {
        await this.deleteAppUserRemote(id);
      } catch (error) {
        console.error('Error syncing app user deletion to remote:', error);
        // Continue even if remote sync fails
      }
    }
  }

  // ========== LOCAL STORAGE IMPLEMENTATIONS ==========

  private getPropertiesLocal(): Property[] {
    const stored = localStorage.getItem('properties');
    return stored ? JSON.parse(stored) : [];
  }

  private getPropertyByIdLocal(id: string): Property | null {
    const properties = this.getPropertiesLocal();
    return properties.find(p => p.id === id) || null;
  }

  private createPropertyLocal(property: Property): Property {
    const properties = this.getPropertiesLocal();
    properties.push(property);
    localStorage.setItem('properties', JSON.stringify(properties));
    return property;
  }

  private updatePropertyLocal(id: string, updates: Partial<Property>): Property {
    const properties = this.getPropertiesLocal();
    const index = properties.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Property not found');
    
    properties[index] = { ...properties[index], ...updates };
    localStorage.setItem('properties', JSON.stringify(properties));
    return properties[index];
  }

  private deletePropertyLocal(id: string): void {
    const properties = this.getPropertiesLocal();
    const filtered = properties.filter(p => p.id !== id);
    localStorage.setItem('properties', JSON.stringify(filtered));
  }

  private getFeaturesLocal(): Feature[] {
    const stored = localStorage.getItem('features');
    return stored ? JSON.parse(stored) : [];
  }

  private createFeatureLocal(feature: Feature): Feature {
    const features = this.getFeaturesLocal();
    features.push(feature);
    localStorage.setItem('features', JSON.stringify(features));
    return feature;
  }

  private updateFeatureLocal(id: string, updates: Partial<Feature>): Feature {
    const features = this.getFeaturesLocal();
    const index = features.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Feature not found');
    
    features[index] = { ...features[index], ...updates };
    localStorage.setItem('features', JSON.stringify(features));
    return features[index];
  }

  private deleteFeatureLocal(id: string): void {
    const features = this.getFeaturesLocal();
    const filtered = features.filter(f => f.id !== id);
    localStorage.setItem('features', JSON.stringify(filtered));
  }

  private getCustomersLocal(): Customer[] {
    const stored = localStorage.getItem('customers');
    return stored ? JSON.parse(stored) : [];
  }

  private createCustomerLocal(customer: Customer): Customer {
    const customers = this.getCustomersLocal();
    customers.push(customer);
    localStorage.setItem('customers', JSON.stringify(customers));
    return customer;
  }

  private updateCustomerLocal(id: string, updates: Partial<Customer>): Customer {
    const customers = this.getCustomersLocal();
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    
    customers[index] = { ...customers[index], ...updates };
    localStorage.setItem('customers', JSON.stringify(customers));
    return customers[index];
  }

  private deleteCustomerLocal(id: string): void {
    const customers = this.getCustomersLocal();
    const filtered = customers.filter(c => c.id !== id);
    localStorage.setItem('customers', JSON.stringify(filtered));
  }

  private getBookingsLocal(): Booking[] {
    const stored = localStorage.getItem('bookings');
    return stored ? JSON.parse(stored) : [];
  }

  private createBookingLocal(booking: Booking): Booking {
    const bookings = this.getBookingsLocal();
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    return booking;
  }

  private updateBookingLocal(id: string, updates: Partial<Booking>): Booking {
    const bookings = this.getBookingsLocal();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    
    bookings[index] = { ...bookings[index], ...updates };
    localStorage.setItem('bookings', JSON.stringify(bookings));
    return bookings[index];
  }

  private deleteBookingLocal(id: string): void {
    const bookings = this.getBookingsLocal();
    const filtered = bookings.filter(b => b.id !== id);
    localStorage.setItem('bookings', JSON.stringify(filtered));
  }

  private getPaymentsLocal(): Payment[] {
    const stored = localStorage.getItem('payments');
    return stored ? JSON.parse(stored) : [];
  }

  private getMenuPagesLocal(): MenuPage[] {
    const stored = localStorage.getItem('menuPages');
    return stored ? JSON.parse(stored) : [];
  }

  private createMenuPageLocal(page: MenuPage): MenuPage {
    const pages = this.getMenuPagesLocal();
    pages.push(page);
    localStorage.setItem('menuPages', JSON.stringify(pages));
    return page;
  }

  private updateMenuPageLocal(id: string, updates: Partial<MenuPage>): MenuPage {
    const pages = this.getMenuPagesLocal();
    const index = pages.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Menu page not found');
    
    pages[index] = { ...pages[index], ...updates };
    localStorage.setItem('menuPages', JSON.stringify(pages));
    return pages[index];
  }

  private deleteMenuPageLocal(id: string): void {
    const pages = this.getMenuPagesLocal();
    const filtered = pages.filter(p => p.id !== id);
    localStorage.setItem('menuPages', JSON.stringify(filtered));
  }

  private getGeneralSettingsLocal(): any {
    const stored = localStorage.getItem('generalSettings');
    return stored ? JSON.parse(stored) : {};
  }

  private saveGeneralSettingsLocal(settings: any): void {
    localStorage.setItem('generalSettings', JSON.stringify(settings));
  }

  private getWhatsAppSettingsLocal(): any {
    const stored = localStorage.getItem('whatsappSettings');
    return stored ? JSON.parse(stored) : {};
  }

  private saveWhatsAppSettingsLocal(settings: any): void {
    localStorage.setItem('whatsappSettings', JSON.stringify(settings));
  }

  private getSliderSettingsLocal(): any[] {
    const stored = localStorage.getItem('sliderSettings');
    return stored ? JSON.parse(stored) : [];
  }

  private saveSliderSettingsLocal(settings: any[]): void {
    localStorage.setItem('sliderSettings', JSON.stringify(settings));
  }

  private getAppUsersLocal(): AppUser[] {
    const stored = localStorage.getItem('appUsers');
    return stored ? JSON.parse(stored) : [];
  }

  private createAppUserLocal(user: AppUser): AppUser {
    const users = this.getAppUsersLocal();
    users.push(user);
    localStorage.setItem('appUsers', JSON.stringify(users));
    return user;
  }

  private updateAppUserLocal(id: string, updates: Partial<AppUser>): AppUser {
    const users = this.getAppUsersLocal();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('App user not found');
    
    users[index] = { ...users[index], ...updates };
    localStorage.setItem('appUsers', JSON.stringify(users));
    return users[index];
  }

  private deleteAppUserLocal(id: string): void {
    const users = this.getAppUsersLocal();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem('appUsers', JSON.stringify(filtered));
  }

  // ========== REMOTE STORAGE IMPLEMENTATIONS (SUPABASE) ==========

  private async getPropertiesRemote(): Promise<Property[]> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('properties').select('*');
    if (error) throw error;
    return data || [];
  }

  private async getPropertyByIdRemote(id: string): Promise<Property | null> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  private async createPropertyRemote(property: Property): Promise<Property> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('properties').insert(property).select().single();
    if (error) throw error;
    return data;
  }

  private async updatePropertyRemote(id: string, updates: Partial<Property>): Promise<Property> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('properties').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  private async deletePropertyRemote(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) throw error;
  }

  private async getFeaturesRemote(): Promise<Feature[]> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('features').select('*');
    if (error) throw error;
    return data || [];
  }

  private async createFeatureRemote(feature: Feature): Promise<Feature> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('features').insert(feature).select().single();
    if (error) throw error;
    return data;
  }

  private async updateFeatureRemote(id: string, updates: Partial<Feature>): Promise<Feature> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('features').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  private async deleteFeatureRemote(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { error } = await supabase.from('features').delete().eq('id', id);
    if (error) throw error;
  }

  private async getCustomersRemote(): Promise<Customer[]> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('customers').select('*');
    if (error) throw error;
    return data || [];
  }

  private async createCustomerRemote(customer: Customer): Promise<Customer> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('customers').insert(customer).select().single();
    if (error) throw error;
    return data;
  }

  private async updateCustomerRemote(id: string, updates: Partial<Customer>): Promise<Customer> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('customers').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  private async deleteCustomerRemote(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) throw error;
  }

  private async getBookingsRemote(): Promise<Booking[]> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('bookings').select('*');
    if (error) throw error;
    return data || [];
  }

  private async createBookingRemote(booking: Booking): Promise<Booking> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('bookings').insert(booking).select().single();
    if (error) throw error;
    return data;
  }

  private async updateBookingRemote(id: string, updates: Partial<Booking>): Promise<Booking> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('bookings').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  private async deleteBookingRemote(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) throw error;
  }

  private async getPaymentsRemote(): Promise<Payment[]> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('payments').select('*');
    if (error) throw error;
    return data || [];
  }

  private async getMenuPagesRemote(): Promise<MenuPage[]> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('menu_pages').select('*');
    if (error) throw error;
    return data || [];
  }

  private async createMenuPageRemote(page: MenuPage): Promise<MenuPage> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('menu_pages').insert(page).select().single();
    if (error) throw error;
    return data;
  }

  private async updateMenuPageRemote(id: string, updates: Partial<MenuPage>): Promise<MenuPage> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('menu_pages').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  private async deleteMenuPageRemote(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { error } = await supabase.from('menu_pages').delete().eq('id', id);
    if (error) throw error;
  }

  private async getGeneralSettingsRemote(): Promise<any> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('settings').select('*').eq('key', 'generalSettings').single();
    if (error) throw error;
    return data ? JSON.parse(data.value) : {};
  }

  private async saveGeneralSettingsRemote(settings: any): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { error } = await supabase.from('settings').upsert({ key: 'generalSettings', value: JSON.stringify(settings) });
    if (error) throw error;
  }

  private async getWhatsAppSettingsRemote(): Promise<any> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('settings').select('*').eq('key', 'whatsappSettings').single();
    if (error) throw error;
    return data ? JSON.parse(data.value) : {};
  }

  private async saveWhatsAppSettingsRemote(settings: any): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { error } = await supabase.from('settings').upsert({ key: 'whatsappSettings', value: JSON.stringify(settings) });
    if (error) throw error;
  }

  private async getSliderSettingsRemote(): Promise<any[]> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('settings').select('*').eq('key', 'sliderSettings').single();
    if (error) throw error;
    return data ? JSON.parse(data.value) : [];
  }

  private async saveSliderSettingsRemote(settings: any[]): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { error } = await supabase.from('settings').upsert({ key: 'sliderSettings', value: JSON.stringify(settings) });
    if (error) throw error;
  }

  private async getAppUsersRemote(): Promise<AppUser[]> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('app_users').select('*');
    if (error) throw error;
    return data || [];
  }

  private async createAppUserRemote(user: AppUser): Promise<AppUser> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('app_users').insert(user).select().single();
    if (error) throw error;
    return data;
  }

  private async updateAppUserRemote(id: string, updates: Partial<AppUser>): Promise<AppUser> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { data, error } = await supabase.from('app_users').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  private async deleteAppUserRemote(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not connected');

    const { error } = await supabase.from('app_users').delete().eq('id', id);
    if (error) throw error;
  }
}

// Export singleton instance
export const storageService = new StorageService();