import { storageService } from './storage';
import { initializeSupabase } from './supabase';
import { syncSupabaseToLocalStorage, type MigrationResult } from './migrations';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'manager' | 'customer';
  createdAt: string;
}

export interface InitializationProgress {
  step: string;
  status: 'pending' | 'loading' | 'complete' | 'error';
  message?: string;
}

export type ProgressCallback = (progress: InitializationProgress) => void;

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
export const initializeApp = async (progressCallback?: ProgressCallback): Promise<void> => {
  const updateProgress = (step: string, status: 'pending' | 'loading' | 'complete' | 'error', message?: string) => {
    if (progressCallback) {
      progressCallback({ step, status, message });
    }
  };

  try {
    updateProgress('Initializing WhatsApp settings', 'loading');
    // Initialize default WhatsApp settings if not present
    const whatsappSettings = localStorage.getItem('contactDetailsSettings');
    if (!whatsappSettings) {
      const defaultWhatsAppSettings = {
        enabled: true,
        phoneNumber: '+254712345678',
        email: 'info@skywaysuites.com',
        message: 'Hello! I would like to inquire about your properties.',
      };
      localStorage.setItem('contactDetailsSettings', JSON.stringify(defaultWhatsAppSettings));
      updateProgress('Initializing WhatsApp settings', 'complete', '✅ Default WhatsApp settings initialized');
    } else {
      updateProgress('Initializing WhatsApp settings', 'complete', '✅ WhatsApp settings already initialized');
    }

    updateProgress('Initializing Supabase', 'loading');
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
          updateProgress('Initializing Supabase', 'complete', '🔄 Using saved Supabase credentials...');
        } else {
          // Save default credentials if none exist
          updateProgress('Initializing Supabase', 'complete', '🔄 Using default Supabase credentials...');
          localStorage.setItem('databaseSettings', JSON.stringify({
            supabaseUrl: DEFAULT_SUPABASE_CONFIG.url,
            supabaseAnonKey: DEFAULT_SUPABASE_CONFIG.anonKey,
          }));
        }
      } catch (error) {
        updateProgress('Initializing Supabase', 'error', `⚠️ Error reading saved credentials, using defaults: ${error}`);
        // Save default credentials
        localStorage.setItem('databaseSettings', JSON.stringify({
          supabaseUrl: DEFAULT_SUPABASE_CONFIG.url,
          supabaseAnonKey: DEFAULT_SUPABASE_CONFIG.anonKey,
        }));
      }
    } else {
      // No saved credentials, save and use defaults
      updateProgress('Initializing Supabase', 'complete', '🔄 No saved credentials found, using defaults...');
      localStorage.setItem('databaseSettings', JSON.stringify({
        supabaseUrl: DEFAULT_SUPABASE_CONFIG.url,
        supabaseAnonKey: DEFAULT_SUPABASE_CONFIG.anonKey,
      }));
    }
    
    // Connect to Supabase
    updateProgress('Connecting to Supabase', 'loading');
    initializeSupabase(supabaseConfig);
    updateProgress('Connecting to Supabase', 'complete', '✅ Supabase connected successfully');
    
    // Pull data from Supabase to localStorage (non-blocking)
    updateProgress('Pulling data from Supabase', 'loading');
    try {
      const syncResult = await Promise.race([
        syncSupabaseToLocalStorage(),
        new Promise<MigrationResult>((resolve) => 
          setTimeout(() => resolve({ success: false, message: 'Sync timeout after 30 seconds' }), 30000)
        )
      ]);
      
      if (syncResult.success) {
        updateProgress('Pulling data from Supabase', 'complete', '✅ Data synced from Supabase to localStorage');
      } else {
        updateProgress('Pulling data from Supabase', 'error', `⚠️ Failed to sync from Supabase (app will continue with local data): ${syncResult.message}`);
      }
    } catch (syncError) {
      updateProgress('Pulling data from Supabase', 'error', `⚠️ Error during sync (app will continue with local data): ${syncError}`);
    }

    // Get existing app users
    const users = await storageService.getAppUsers();
    
    // Check if default admin exists
    const adminExists = users.some((u: AppUser) => u.id === 'admin-default');
    
    if (!adminExists) {
      updateProgress('Creating default admin user', 'loading');
      await storageService.createAppUser(DEFAULT_ADMIN);
      updateProgress('Creating default admin user', 'complete', 'Default admin user created successfully');
    }
  } catch (error) {
    updateProgress('Initializing app', 'error', `Error initializing app (app will continue): ${error}`);
    // Try to create default admin even if there's an error
    try {
      const users = await storageService.getAppUsers();
      const adminExists = users.some((u: AppUser) => u.id === 'admin-default');
      if (!adminExists) {
        await storageService.createAppUser(DEFAULT_ADMIN);
      }
    } catch (createError) {
      updateProgress('Creating default admin user', 'error', `Failed to create default admin (app will continue): ${createError}`);
    }
  }
};