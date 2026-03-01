import { storageService } from './storage';
import { initializeSupabase } from './supabase';
import { syncSupabaseToLocalStorage } from './migrations';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'manager' | 'customer';
  createdAt: string;
}

const DEFAULT_ADMIN: AppUser = {
  id: 'admin-default',
  name: 'Administrator',
  email: 'admin@123.com',
  phone: '+254 700 000 000',
  password: '123',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

/**
 * Default Supabase credentials
 * Users can override these in Settings > Database
 */
const DEFAULT_SUPABASE_CONFIG = {
  url: 'https://kxsavebrzaczjscyroth.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4c2F2ZWJyemFjempzY3lyb3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNTgyODksImV4cCI6MjA4NzkzNDI4OX0.DacfUFOOnZX0l5lv3keyPcjRGT7phS28l-4AZlIjFVM'
};

/**
 * Initialize the application with default data
 * This ensures the default admin user exists and Supabase is connected
 */
export const initializeApp = async (): Promise<void> => {
  try {
    // Initialize Supabase - check for saved credentials first, otherwise use defaults
    const databaseSettings = localStorage.getItem('databaseSettings');
    let supabaseConfig = DEFAULT_SUPABASE_CONFIG;
    
    if (databaseSettings) {
      try {
        const settings = JSON.parse(databaseSettings);
        if (settings.supabaseUrl && settings.supabaseAnonKey) {
          // Use saved credentials
          supabaseConfig = {
            url: settings.supabaseUrl,
            anonKey: settings.supabaseAnonKey,
          };
          console.log('🔄 Using saved Supabase credentials...');
        } else {
          // Save default credentials if none exist
          console.log('🔄 Using default Supabase credentials...');
          localStorage.setItem('databaseSettings', JSON.stringify({
            supabaseUrl: DEFAULT_SUPABASE_CONFIG.url,
            supabaseAnonKey: DEFAULT_SUPABASE_CONFIG.anonKey,
          }));
        }
      } catch (error) {
        console.warn('⚠️ Error reading saved credentials, using defaults:', error);
        // Save default credentials
        localStorage.setItem('databaseSettings', JSON.stringify({
          supabaseUrl: DEFAULT_SUPABASE_CONFIG.url,
          supabaseAnonKey: DEFAULT_SUPABASE_CONFIG.anonKey,
        }));
      }
    } else {
      // No saved credentials, save and use defaults
      console.log('🔄 No saved credentials found, using defaults...');
      localStorage.setItem('databaseSettings', JSON.stringify({
        supabaseUrl: DEFAULT_SUPABASE_CONFIG.url,
        supabaseAnonKey: DEFAULT_SUPABASE_CONFIG.anonKey,
      }));
    }
    
    // Connect to Supabase
    console.log('🔄 Connecting to Supabase...');
    initializeSupabase(supabaseConfig);
    console.log('✅ Supabase connected successfully');
    
    // Pull data from Supabase to localStorage
    console.log('🔄 Pulling latest data from Supabase...');
    const syncResult = await syncSupabaseToLocalStorage();
    if (syncResult.success) {
      console.log('✅ Data synced from Supabase to localStorage');
    } else {
      console.warn('⚠️ Failed to sync from Supabase:', syncResult.message);
    }

    // Get existing app users
    const users = await storageService.getAppUsers();
    
    // Check if default admin exists
    const adminExists = users.some((u: AppUser) => u.id === 'admin-default');
    
    if (!adminExists) {
      console.log('Creating default admin user...');
      await storageService.createAppUser(DEFAULT_ADMIN);
      console.log('Default admin user created successfully');
    }
  } catch (error) {
    console.error('Error initializing app:', error);
    // Try to create default admin even if there's an error
    try {
      await storageService.createAppUser(DEFAULT_ADMIN);
    } catch (createError) {
      console.error('Failed to create default admin:', createError);
    }
  }
};