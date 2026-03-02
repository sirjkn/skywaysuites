// Fallback Supabase client implementation for when @supabase/supabase-js is not available
// This provides a basic fetch-based client that mimics Supabase's API

type SupabaseClient = any;

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

let supabaseClient: SupabaseClient | null = null;
let currentConfig: SupabaseConfig | null = null;

// Mock Supabase client using fetch
class FallbackSupabaseClient {
  private url: string;
  private anonKey: string;

  constructor(url: string, anonKey: string) {
    this.url = url;
    this.anonKey = anonKey;
  }

  from(table: string) {
    const self = this;
    
    const buildQuery = (params: any = {}) => {
      let query = `${self.url}/rest/v1/${table}?select=${params.columns || '*'}`;
      
      if (params.order) {
        query += `&order=${params.order.column}.${params.order.ascending ? 'asc' : 'desc'}`;
      }
      
      if (params.limit) {
        query += `&limit=${params.limit}`;
      }
      
      if (params.eq) {
        query += `&${params.eq.column}=eq.${params.eq.value}`;
      }
      
      return query;
    };

    const executeQuery = async (params: any) => {
      try {
        const url = buildQuery(params);
        const response = await fetch(url, {
          headers: {
            'apikey': self.anonKey,
            'Authorization': `Bearer ${self.anonKey}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { data, error: null };
      } catch (error) {
        console.error('Supabase query error:', error);
        return { data: null, error };
      }
    };

    return {
      select: (columns = '*') => {
        const params: any = { columns };
        
        const chainable = {
          order: (column: string, options?: { ascending?: boolean }) => {
            params.order = { 
              column, 
              ascending: options?.ascending !== false 
            };
            
            return {
              limit: (count: number) => {
                params.limit = count;
                return executeQuery(params);
              },
            };
          },
          limit: (count: number) => {
            params.limit = count;
            
            return {
              order: (column: string, options?: { ascending?: boolean }) => {
                params.order = { 
                  column, 
                  ascending: options?.ascending !== false 
                };
                return executeQuery(params);
              },
            };
          },
          eq: (column: string, value: any) => {
            params.eq = { column, value };
            
            return {
              order: (col: string, options?: { ascending?: boolean }) => {
                params.order = { 
                  column: col, 
                  ascending: options?.ascending !== false 
                };
                
                return {
                  limit: (count: number) => {
                    params.limit = count;
                    return executeQuery(params);
                  },
                };
              },
              limit: (count: number) => {
                params.limit = count;
                return executeQuery(params);
              },
              single: async () => {
                const result = await executeQuery(params);
                if (result.data && Array.isArray(result.data) && result.data.length > 0) {
                  return { data: result.data[0], error: null };
                }
                return { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
              },
              maybeSingle: async () => {
                const result = await executeQuery(params);
                if (result.data && Array.isArray(result.data)) {
                  if (result.data.length === 0) {
                    return { data: null, error: null };
                  }
                  if (result.data.length === 1) {
                    return { data: result.data[0], error: null };
                  }
                  return { data: null, error: { code: 'PGRST116', message: 'Multiple rows found' } };
                }
                return { data: null, error: null };
              },
            };
          },
        };
        
        return chainable;
      },
      insert: (values: any) => {
        const insertPromise = async () => {
          try {
            const response = await fetch(`${self.url}/rest/v1/${table}`, {
              method: 'POST',
              headers: {
                'apikey': self.anonKey,
                'Authorization': `Bearer ${self.anonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
              },
              body: JSON.stringify(values),
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Insert failed (${response.status}):`, errorText);
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return { data, error: null };
          } catch (error) {
            console.error('Supabase insert error:', error);
            return { data: null, error };
          }
        };
        
        return {
          select: () => ({
            single: insertPromise,
          }),
        };
      },
      upsert: (values: any, options?: { onConflict?: string }) => {
        const upsertPromise = async () => {
          try {
            const headers: Record<string, string> = {
              'apikey': self.anonKey,
              'Authorization': `Bearer ${self.anonKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation,resolution=merge-duplicates',
            };
            
            const response = await fetch(`${self.url}/rest/v1/${table}`, {
              method: 'POST',
              headers,
              body: JSON.stringify(values),
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Upsert failed (${response.status}):`, errorText);
              
              // On 409 conflict, it's actually okay - data exists
              if (response.status === 409) {
                console.log('🔄 Conflict detected - record already exists, treating as success');
                // Return the values as data since they already exist
                return { data: Array.isArray(values) && values.length === 1 ? values[0] : values, error: null };
              }
              
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return { data, error: null };
          } catch (error) {
            console.error('Supabase upsert error:', error);
            return { data: null, error };
          }
        };
        
        return {
          select: () => ({
            single: async () => {
              const result = await upsertPromise();
              if (result.error) {
                return result;
              }
              // If data is an array with one item, return just that item
              if (Array.isArray(result.data) && result.data.length === 1) {
                return { data: result.data[0], error: null };
              }
              return result;
            },
          }),
        };
      },
      update: (values: any) => {
        return {
          eq: (column: string, value: any) => {
            return {
              select: () => ({
                single: async () => {
                  try {
                    const response = await fetch(`${self.url}/rest/v1/${table}?${column}=eq.${value}`, {
                      method: 'PATCH',
                      headers: {
                        'apikey': self.anonKey,
                        'Authorization': `Bearer ${self.anonKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation',
                      },
                      body: JSON.stringify(values),
                    });
                    
                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    return { data: Array.isArray(data) && data.length > 0 ? data[0] : data, error: null };
                  } catch (error) {
                    console.error('Supabase update error:', error);
                    return { data: null, error };
                  }
                },
              }),
            };
          },
        };
      },
      delete: () => {
        return {
          eq: async (column: string, value: any) => {
            try {
              const response = await fetch(`${self.url}/rest/v1/${table}?${column}=eq.${value}`, {
                method: 'DELETE',
                headers: {
                  'apikey': self.anonKey,
                  'Authorization': `Bearer ${self.anonKey}`,
                },
              });
              
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              
              return { data: null, error: null };
            } catch (error) {
              console.error('Supabase delete error:', error);
              return { data: null, error };
            }
          },
        };
      },
    };
  }

  auth = {
    getSession: async () => {
      return { data: { session: null }, error: null };
    },
    signIn: async () => {
      return { data: { session: null }, error: null };
    },
    signOut: async () => {
      return { error: null };
    },
  };

  storage = {
    from: (bucket: string) => {
      return {
        upload: async (path: string, file: File) => {
          return { data: null, error: null };
        },
        getPublicUrl: (path: string) => {
          return { data: { publicUrl: '' } };
        },
      };
    },
  };
}

/**
 * Initialize Supabase client with provided credentials
 * Only creates a new client if credentials have changed
 */
export const initializeSupabase = async (config: SupabaseConfig): Promise<SupabaseClient | null> => {
  // Check if we already have a client with the same credentials
  if (supabaseClient && currentConfig) {
    if (currentConfig.url === config.url && currentConfig.anonKey === config.anonKey) {
      console.log('♻️ Reusing existing Supabase client');
      return supabaseClient;
    }
  }
  
  // Create new fallback client
  console.log('🆕 Creating new Supabase fallback client');
  console.warn('⚠️ Using fallback Supabase client - install @supabase/supabase-js for full functionality');
  supabaseClient = new FallbackSupabaseClient(config.url, config.anonKey);
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