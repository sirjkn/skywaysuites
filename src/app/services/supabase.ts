import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;
let currentConfig: SupabaseConfig | null = null;

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Initialize Supabase client with provided credentials
 * Only creates a new client if credentials have changed
 */
export const initializeSupabase = (config: SupabaseConfig): SupabaseClient => {
  // Check if we already have a client with the same credentials
  if (supabaseClient && currentConfig) {
    if (currentConfig.url === config.url && currentConfig.anonKey === config.anonKey) {
      console.log('♻️ Reusing existing Supabase client');
      return supabaseClient;
    }
  }
  
  // Create new client only if credentials changed or no client exists
  console.log('🆕 Creating new Supabase client');
  supabaseClient = createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: 'skyway-suites-auth', // Unique storage key to avoid conflicts
    }
  });
  currentConfig = { ...config };
  return supabaseClient;
};

/**
 * Get the current Supabase client instance
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  return supabaseClient;
};

/**
 * Check if Supabase is connected
 */
export const isSupabaseConnected = (): boolean => {
  return supabaseClient !== null;
};

/**
 * Disconnect Supabase client
 */
export const disconnectSupabase = (): void => {
  supabaseClient = null;
  currentConfig = null;
};

/**
 * Test Supabase connection
 */
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!supabaseClient) return false;
  
  try {
    const { error } = await supabaseClient.from('properties').select('count').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
};