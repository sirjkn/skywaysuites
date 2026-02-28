import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Initialize Supabase client with provided credentials
 */
export const initializeSupabase = (config: SupabaseConfig): SupabaseClient => {
  supabaseClient = createClient(config.url, config.anonKey);
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
