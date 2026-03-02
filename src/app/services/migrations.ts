import { getSupabaseClient } from './supabase';
import type { Property, Feature, Customer, Booking, Payment, MenuPage } from './api';

/**
 * Database Migration Utilities
 * Creates tables and migrates localStorage data to Supabase
 */

export interface MigrationResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Create all necessary tables in Supabase
 */
export const createTables = async (): Promise<MigrationResult> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, message: 'Supabase not connected' };
  }

  try {
    // Note: In a real Supabase setup, you would use SQL migrations
    // For now, we'll check if tables exist by trying to query them
    
    const tables = [
      'properties',
      'features', 
      'customers',
      'bookings',
      'payments',
      'menu_pages',
      'general_settings',
      'theme_settings',
      'sms_settings',
      'payment_settings',
      'whatsapp_settings',
      'slider_settings',
    ];

    const results = await Promise.all(
      tables.map(async (table) => {
        try {
          await supabase.from(table).select('count').limit(1);
          return { table, exists: true };
        } catch (error) {
          return { table, exists: false };
        }
      })
    );

    const missingTables = results.filter(r => !r.exists).map(r => r.table);
    
    if (missingTables.length > 0) {
      return {
        success: false,
        message: 'Some tables are missing',
        details: {
          missingTables,
          instruction: 'Please create these tables in your Supabase project'
        }
      };
    }

    return {
      success: true,
      message: 'All tables verified successfully',
    };
  } catch (error) {
    console.error('Error checking tables:', error);
    return {
      success: false,
      message: 'Failed to verify tables',
      details: error
    };
  }
};

/**
 * Get SQL statements for table creation
 */
export const getTableCreationSQL = (): string => {
  return `
-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  location TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  area NUMERIC NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  available BOOLEAN DEFAULT true,
  "availableAfter" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Features Table
CREATE TABLE IF NOT EXISTS features (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  photo TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  "propertyId" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "checkIn" TEXT NOT NULL,
  "checkOut" TEXT NOT NULL,
  "totalPrice" NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  "paymentMethod" TEXT,
  "transactionId" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  "bookingId" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  method TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  date TEXT NOT NULL
);

-- Menu Pages Table
CREATE TABLE IF NOT EXISTS menu_pages (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  path TEXT NOT NULL,
  type TEXT DEFAULT 'link',
  "order" INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  content TEXT
);

-- General Settings Table
CREATE TABLE IF NOT EXISTS general_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  currency TEXT DEFAULT 'Ksh',
  "currencySymbol" TEXT DEFAULT 'Ksh',
  timezone TEXT DEFAULT 'Africa/Nairobi',
  "companyName" TEXT DEFAULT 'Skyway Suites',
  "companyEmail" TEXT,
  "companyPhone" TEXT,
  "companyAddress" TEXT,
  "companyWebsite" TEXT,
  logo TEXT,
  "maintenanceMode" BOOLEAN DEFAULT false,
  "maintenanceMessage" TEXT,
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Theme Settings Table
CREATE TABLE IF NOT EXISTS theme_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  "primaryColor" TEXT DEFAULT '#6B7F39',
  "secondaryColor" TEXT DEFAULT '#F5E6D3',
  "darkMode" BOOLEAN DEFAULT false,
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- SMS Settings Table
CREATE TABLE IF NOT EXISTS sms_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  provider TEXT DEFAULT 'twilio',
  "apiKey" TEXT,
  "apiSecret" TEXT,
  "senderName" TEXT DEFAULT 'Skyway Suites',
  enabled BOOLEAN DEFAULT false,
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Payment Settings Table
CREATE TABLE IF NOT EXISTS payment_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  mpesa JSONB DEFAULT '{"enabled": true, "tillNumber": "", "apiKey": ""}',
  stripe JSONB DEFAULT '{"enabled": false, "publicKey": "", "secretKey": ""}',
  paypal JSONB DEFAULT '{"enabled": false, "clientId": "", "secret": ""}',
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- WhatsApp Settings Table
CREATE TABLE IF NOT EXISTS whatsapp_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  enabled BOOLEAN DEFAULT true,
  "phoneNumber" TEXT DEFAULT '+254 700 000 000',
  email TEXT DEFAULT 'info@skywaysuites.com',
  message TEXT DEFAULT 'Hello! I would like to inquire about your properties.',
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Slider Settings Table
CREATE TABLE IF NOT EXISTS slider_settings (
  id TEXT PRIMARY KEY,
  image TEXT,
  title TEXT,
  subtitle TEXT,
  "order" INTEGER DEFAULT 0,
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- App Users Table (for authentication and role management)
CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE slider_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (adjust based on your needs)
CREATE POLICY "Allow public read access" ON properties FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON properties FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON properties FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON properties FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON features FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON features FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON features FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON features FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON customers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON customers FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON bookings FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON payments FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON payments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON payments FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON menu_pages FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON menu_pages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON menu_pages FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON menu_pages FOR DELETE USING (true);

CREATE POLICY "Allow public access" ON general_settings FOR ALL USING (true);
CREATE POLICY "Allow public access" ON theme_settings FOR ALL USING (true);
CREATE POLICY "Allow public access" ON sms_settings FOR ALL USING (true);
CREATE POLICY "Allow public access" ON payment_settings FOR ALL USING (true);
CREATE POLICY "Allow public access" ON whatsapp_settings FOR ALL USING (true);
CREATE POLICY "Allow public access" ON slider_settings FOR ALL USING (true);

CREATE POLICY "Allow public read access" ON app_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON app_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON app_users FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON app_users FOR DELETE USING (true);
  `.trim();
};

/**
 * Migrate all localStorage data to Supabase
 * Optimized for faster sync with parallel batch operations
 */
export const migrateLocalStorageToSupabase = async (): Promise<MigrationResult> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, message: 'Supabase not connected' };
  }

  try {
    const results: any = {
      properties: 0,
      features: 0,
      customers: 0,
      bookings: 0,
      payments: 0,
      menuPages: 0,
      appUsers: 0,
      generalSettings: 0,
      themeSettings: 0,
      smsSettings: 0,
      paymentSettings: 0,
      whatsappSettings: 0,
      sliderSettings: 0,
    };

    // Use Promise.all for parallel execution - much faster
    const migrations = [];

    // Migrate Properties
    const propertiesData = localStorage.getItem('properties');
    if (propertiesData) {
      const properties: Property[] = JSON.parse(propertiesData);
      if (properties.length > 0) {
        migrations.push(
          supabase.from('properties').upsert(properties, { onConflict: 'id' }).then(({ error, count }) => {
            if (!error) {
              results.properties = properties.length;
              console.log(`✅ Synced ${properties.length} properties`);
            } else {
              console.error('❌ Properties sync error:', error);
            }
          })
        );
      }
    }

    // Migrate Features
    const featuresData = localStorage.getItem('features');
    if (featuresData) {
      const features: Feature[] = JSON.parse(featuresData);
      if (features.length > 0) {
        migrations.push(
          supabase.from('features').upsert(features, { onConflict: 'id' }).then(({ error }) => {
            if (!error) results.features = features.length;
          })
        );
      }
    }

    // Migrate Customers
    const customersData = localStorage.getItem('customers');
    if (customersData) {
      const customers: Customer[] = JSON.parse(customersData);
      if (customers.length > 0) {
        migrations.push(
          supabase.from('customers').upsert(customers, { onConflict: 'id' }).then(({ error }) => {
            if (!error) results.customers = customers.length;
          })
        );
      }
    }

    // Migrate Bookings - CRITICAL for booking functionality
    const bookingsData = localStorage.getItem('bookings');
    if (bookingsData) {
      const bookings: Booking[] = JSON.parse(bookingsData);
      if (bookings.length > 0) {
        migrations.push(
          supabase.from('bookings').upsert(bookings, { onConflict: 'id' }).then(({ error }) => {
            if (!error) {
              results.bookings = bookings.length;
              console.log(`✅ Synced ${bookings.length} bookings`);
            } else {
              console.error('❌ Bookings sync error:', error);
            }
          })
        );
      }
    }

    // Migrate Payments
    const paymentsData = localStorage.getItem('payments');
    if (paymentsData) {
      const payments: Payment[] = JSON.parse(paymentsData);
      if (payments.length > 0) {
        migrations.push(
          supabase.from('payments').upsert(payments, { onConflict: 'id' }).then(({ error }) => {
            if (!error) results.payments = payments.length;
          })
        );
      }
    }

    // Migrate Menu Pages
    const menuPagesData = localStorage.getItem('menuPages');
    if (menuPagesData) {
      const menuPages: MenuPage[] = JSON.parse(menuPagesData);
      if (menuPages.length > 0) {
        migrations.push(
          supabase.from('menu_pages').upsert(menuPages, { onConflict: 'id' }).then(({ error }) => {
            if (!error) results.menuPages = menuPages.length;
          })
        );
      }
    }

    // Migrate App Users
    const appUsersData = localStorage.getItem('appUsers');
    if (appUsersData) {
      const appUsers = JSON.parse(appUsersData);
      if (appUsers.length > 0) {
        migrations.push(
          supabase.from('app_users').upsert(appUsers, { onConflict: 'id' }).then(({ error }) => {
            if (!error) results.appUsers = appUsers.length;
          })
        );
      }
    }

    // Migrate General Settings
    const generalSettingsData = localStorage.getItem('generalSettings');
    if (generalSettingsData) {
      const generalSettings = JSON.parse(generalSettingsData);
      migrations.push(
        supabase.from('general_settings').upsert({
          id: 'default',
          ...generalSettings,
        }, { onConflict: 'id' }).then(({ error }) => {
          if (!error) results.generalSettings = 1;
        })
      );
    }

    // Migrate Theme Settings
    const themeSettingsData = localStorage.getItem('themeSettings');
    if (themeSettingsData) {
      const themeSettings = JSON.parse(themeSettingsData);
      migrations.push(
        supabase.from('theme_settings').upsert({
          id: 'default',
          ...themeSettings,
        }, { onConflict: 'id' }).then(({ error }) => {
          if (!error) results.themeSettings = 1;
        })
      );
    }

    // Migrate SMS Settings
    const smsSettingsData = localStorage.getItem('smsSettings');
    if (smsSettingsData) {
      const smsSettings = JSON.parse(smsSettingsData);
      migrations.push(
        supabase.from('sms_settings').upsert({
          id: 'default',
          ...smsSettings,
        }, { onConflict: 'id' }).then(({ error }) => {
          if (!error) results.smsSettings = 1;
        })
      );
    }

    // Migrate Payment Settings
    const paymentSettingsData = localStorage.getItem('paymentSettings');
    if (paymentSettingsData) {
      const paymentSettings = JSON.parse(paymentSettingsData);
      migrations.push(
        supabase.from('payment_settings').upsert({
          id: 'default',
          ...paymentSettings,
        }, { onConflict: 'id' }).then(({ error }) => {
          if (!error) results.paymentSettings = 1;
        })
      );
    }

    // Migrate WhatsApp Settings
    const whatsappSettingsData = localStorage.getItem('contactDetailsSettings');
    if (whatsappSettingsData) {
      const whatsappSettings = JSON.parse(whatsappSettingsData);
      migrations.push(
        supabase.from('whatsapp_settings').upsert({
          id: 'default',
          ...whatsappSettings,
        }, { onConflict: 'id' }).then(({ error }) => {
          if (!error) results.whatsappSettings = 1;
        })
      );
    }

    // Migrate Slider Settings
    const sliderSettingsData = localStorage.getItem('heroSlides');
    if (sliderSettingsData) {
      const sliderSettings = JSON.parse(sliderSettingsData);
      if (sliderSettings.length > 0) {
        const slides = sliderSettings.map((slide: any, index: number) => ({
          ...slide,
          order: index,
        }));
        migrations.push(
          supabase.from('slider_settings').upsert(slides, { onConflict: 'id' }).then(({ error }) => {
            if (!error) results.sliderSettings = slides.length;
          })
        );
      }
    }

    // Execute all migrations in parallel
    await Promise.all(migrations);

    return {
      success: true,
      message: 'Data migration completed successfully',
      details: results,
    };
  } catch (error) {
    console.error('Migration error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to migrate data',
      details: error,
    };
  }
};

/**
 * Sync data from Supabase to localStorage (for offline access)
 * OPTIMIZED: Uses parallel queries with specific limits and error handling
 */
export const syncSupabaseToLocalStorage = async (): Promise<MigrationResult> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { 
      success: false, 
      message: 'Supabase client not initialized. Check database settings in Admin > Settings > Database.',
      details: { errorCode: 'SUPABASE_NOT_CONNECTED', timestamp: new Date().toISOString() }
    };
  }

  try {
    console.log('🔄 Starting optimized parallel data sync from Supabase...');
    const startTime = performance.now();
    
    // Execute all queries in parallel with optimized limits for faster loading
    // Only fetch what's needed, avoid massive data transfers
    const [
      propertiesResult,
      featuresResult,
      customersResult,
      bookingsResult,
      paymentsResult,
      menuPagesResult,
      appUsersResult,
      generalSettingsResult,
      whatsappSettingsResult,
      sliderSettingsResult,
    ] = await Promise.all([
      supabase.from('properties').select('*').limit(1000), // Limit to prevent huge transfers
      supabase.from('features').select('*').limit(500),
      supabase.from('customers').select('*').limit(1000),
      supabase.from('bookings').select('*').limit(1000),
      supabase.from('payments').select('*').limit(1000),
      supabase.from('menu_pages').select('*').limit(100),
      supabase.from('app_users').select('*').limit(100),
      supabase.from('general_settings').select('*').eq('id', 'default').maybeSingle(),
      supabase.from('whatsapp_settings').select('*').eq('id', 'default').maybeSingle(),
      supabase.from('slider_settings').select('*').order('order').limit(20),
    ]);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Process results and update localStorage with specific error messages
    if (propertiesResult.error) {
      errorCount++;
      const errorMsg = `Properties sync failed: ${propertiesResult.error.message} (Code: ${propertiesResult.error.code || 'UNKNOWN'})`;
      console.warn('⚠️', errorMsg);
      errors.push(errorMsg);
    } else if (propertiesResult.data) {
      localStorage.setItem('properties', JSON.stringify(propertiesResult.data));
      console.log(`✅ Synced ${propertiesResult.data.length} properties`);
      successCount++;
    }

    if (featuresResult.error) {
      errorCount++;
      const errorMsg = `Features sync failed: ${featuresResult.error.message} (Code: ${featuresResult.error.code || 'UNKNOWN'})`;
      console.warn('⚠️', errorMsg);
      errors.push(errorMsg);
    } else if (featuresResult.data) {
      localStorage.setItem('features', JSON.stringify(featuresResult.data));
      console.log(`✅ Synced ${featuresResult.data.length} features`);
      successCount++;
    }

    if (customersResult.error) {
      errorCount++;
      const errorMsg = `Customers sync failed: ${customersResult.error.message} (Code: ${customersResult.error.code || 'UNKNOWN'})`;
      console.warn('⚠️', errorMsg);
      errors.push(errorMsg);
    } else if (customersResult.data) {
      localStorage.setItem('customers', JSON.stringify(customersResult.data));
      console.log(`✅ Synced ${customersResult.data.length} customers`);
      successCount++;
    }

    if (bookingsResult.error) {
      errorCount++;
      const errorMsg = `Bookings sync failed: ${bookingsResult.error.message} (Code: ${bookingsResult.error.code || 'UNKNOWN'})`;
      console.warn('⚠️', errorMsg);
      errors.push(errorMsg);
    } else if (bookingsResult.data) {
      localStorage.setItem('bookings', JSON.stringify(bookingsResult.data));
      console.log(`✅ Synced ${bookingsResult.data.length} bookings`);
      successCount++;
    }

    if (paymentsResult.error) {
      errorCount++;
      const errorMsg = `Payments sync failed: ${paymentsResult.error.message} (Code: ${paymentsResult.error.code || 'UNKNOWN'})`;
      console.warn('⚠️', errorMsg);
      errors.push(errorMsg);
    } else if (paymentsResult.data) {
      localStorage.setItem('payments', JSON.stringify(paymentsResult.data));
      console.log(`✅ Synced ${paymentsResult.data.length} payments`);
      successCount++;
    }

    if (menuPagesResult.error) {
      errorCount++;
      const errorMsg = `Menu pages sync failed: ${menuPagesResult.error.message} (Code: ${menuPagesResult.error.code || 'UNKNOWN'})`;
      console.warn('⚠️', errorMsg);
      errors.push(errorMsg);
    } else if (menuPagesResult.data) {
      localStorage.setItem('menuPages', JSON.stringify(menuPagesResult.data));
      console.log(`✅ Synced ${menuPagesResult.data.length} menu pages`);
      successCount++;
    }

    if (appUsersResult.error) {
      errorCount++;
      const errorMsg = `App users sync failed: ${appUsersResult.error.message} (Code: ${appUsersResult.error.code || 'UNKNOWN'})`;
      console.warn('⚠️', errorMsg);
      errors.push(errorMsg);
    } else if (appUsersResult.data) {
      localStorage.setItem('appUsers', JSON.stringify(appUsersResult.data));
      console.log(`✅ Synced ${appUsersResult.data.length} app users`);
      successCount++;
    }

    if (generalSettingsResult.error) {
      errorCount++;
      const errorMsg = `General settings sync failed: ${generalSettingsResult.error.message} (Code: ${generalSettingsResult.error.code || 'UNKNOWN'})`;
      console.warn('⚠️', errorMsg);
      errors.push(errorMsg);
    } else if (generalSettingsResult.data) {
      localStorage.setItem('generalSettings', JSON.stringify(generalSettingsResult.data));
      console.log('✅ Synced general settings');
      successCount++;
    }

    if (whatsappSettingsResult.error) {
      errorCount++;
      const errorMsg = `WhatsApp settings sync failed: ${whatsappSettingsResult.error.message} (Code: ${whatsappSettingsResult.error.code || 'UNKNOWN'})`;
      console.warn('⚠️', errorMsg);
      errors.push(errorMsg);
    } else if (whatsappSettingsResult.data) {
      localStorage.setItem('contactDetailsSettings', JSON.stringify(whatsappSettingsResult.data));
      console.log('✅ Synced WhatsApp settings');
      successCount++;
    }

    if (sliderSettingsResult.error) {
      errorCount++;
      const errorMsg = `Slider settings sync failed: ${sliderSettingsResult.error.message} (Code: ${sliderSettingsResult.error.code || 'UNKNOWN'})`;
      console.warn('⚠️', errorMsg);
      errors.push(errorMsg);
    } else if (sliderSettingsResult.data) {
      localStorage.setItem('heroSlides', JSON.stringify(sliderSettingsResult.data));
      console.log(`✅ Synced ${sliderSettingsResult.data.length} slider settings`);
      successCount++;
    }

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    console.log(`✅ Parallel sync completed successfully in ${duration} ms`);
    return {
      success: true,
      message: 'Data synced from Supabase to localStorage',
      details: {
        successCount,
        errorCount,
        errors,
        duration: `${duration} ms`,
      },
    };
  } catch (error) {
    console.error('Sync error:', error);
    return {
      success: false,
      message: 'Failed to sync data',
      details: error,
    };
  }
};