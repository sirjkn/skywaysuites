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

    // Use Promise.allSettled for parallel execution with error handling
    const migrations = [];

    // Migrate Properties
    const propertiesData = localStorage.getItem('properties');
    if (propertiesData) {
      const properties: Property[] = JSON.parse(propertiesData);
      if (properties.length > 0) {
        migrations.push(
          supabase.from('properties').upsert(properties).then(({ error, count }) => {
            if (!error) {
              results.properties = properties.length;
              console.log(`✅ Synced ${properties.length} properties (including status: available/availableAfter)`);
            } else {
              console.error('❌ Properties sync error:', error);
              console.error('❌ Error details:', JSON.stringify(error, null, 2));
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
          supabase.from('features').upsert(features).then(({ error }) => {
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
          supabase.from('customers').upsert(customers).then(({ error }) => {
            if (!error) results.customers = customers.length;
          })
        );
      }
    }

    // Migrate Bookings
    const bookingsData = localStorage.getItem('bookings');
    if (bookingsData) {
      const bookings: Booking[] = JSON.parse(bookingsData);
      if (bookings.length > 0) {
        migrations.push(
          supabase.from('bookings').upsert(bookings).then(({ error }) => {
            if (!error) {
              results.bookings = bookings.length;
              console.log(`✅ Synced ${bookings.length} bookings (including all statuses: pending/confirmed/cancelled)`);
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
          supabase.from('payments').upsert(payments).then(({ error }) => {
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
          supabase.from('menu_pages').upsert(menuPages).then(({ error }) => {
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
          supabase.from('app_users').upsert(appUsers).then(({ error }) => {
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
        }).then(({ error }) => {
          if (!error) results.generalSettings = 1;
        })
      );
    }

    // Migrate Theme Settings (if exists)
    const themeSettingsData = localStorage.getItem('themeSettings');
    if (themeSettingsData) {
      const themeSettings = JSON.parse(themeSettingsData);
      migrations.push(
        supabase.from('theme_settings').upsert({
          id: 'default',
          ...themeSettings,
        }).then(({ error }) => {
          if (!error) results.themeSettings = 1;
        })
      );
    }

    // Migrate SMS Settings (if exists)
    const smsSettingsData = localStorage.getItem('smsSettings');
    if (smsSettingsData) {
      const smsSettings = JSON.parse(smsSettingsData);
      migrations.push(
        supabase.from('sms_settings').upsert({
          id: 'default',
          ...smsSettings,
        }).then(({ error }) => {
          if (!error) results.smsSettings = 1;
        })
      );
    }

    // Migrate Payment Settings (if exists)
    const paymentSettingsData = localStorage.getItem('paymentSettings');
    if (paymentSettingsData) {
      const paymentSettings = JSON.parse(paymentSettingsData);
      migrations.push(
        supabase.from('payment_settings').upsert({
          id: 'default',
          ...paymentSettings,
        }).then(({ error }) => {
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
        }).then(({ error }) => {
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
          supabase.from('slider_settings').upsert(slides).then(({ error }) => {
            if (!error) results.sliderSettings = slides.length;
          })
        );
      }
    }

    // Execute all migrations in parallel with 30 second timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Migration timeout after 30 seconds')), 30000)
    );

    await Promise.race([
      Promise.allSettled(migrations),
      timeoutPromise
    ]);

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
 */
export const syncSupabaseToLocalStorage = async (): Promise<MigrationResult> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, message: 'Supabase not connected' };
  }

  try {
    // Sync Properties
    const { data: properties, error: propsError } = await supabase.from('properties').select('*');
    if (propsError) {
      console.warn('Error syncing properties from Supabase:', propsError);
    } else if (properties) {
      localStorage.setItem('properties', JSON.stringify(properties));
    }

    // Sync Features
    const { data: features, error: featuresError } = await supabase.from('features').select('*');
    if (featuresError) {
      console.warn('Error syncing features from Supabase:', featuresError);
    } else if (features) {
      localStorage.setItem('features', JSON.stringify(features));
    }

    // Sync Customers
    const { data: customers, error: customersError } = await supabase.from('customers').select('*');
    if (customersError) {
      console.warn('Error syncing customers from Supabase:', customersError);
    } else if (customers) {
      localStorage.setItem('customers', JSON.stringify(customers));
    }

    // Sync Bookings
    const { data: bookings, error: bookingsError } = await supabase.from('bookings').select('*');
    if (bookingsError) {
      console.warn('Error syncing bookings from Supabase:', bookingsError);
    } else if (bookings) {
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }

    // Sync Payments
    const { data: payments, error: paymentsError } = await supabase.from('payments').select('*');
    if (paymentsError) {
      console.warn('Error syncing payments from Supabase:', paymentsError);
    } else if (payments) {
      localStorage.setItem('payments', JSON.stringify(payments));
    }

    // Sync Menu Pages
    const { data: menuPages, error: menuPagesError } = await supabase.from('menu_pages').select('*');
    if (menuPagesError) {
      console.warn('Error syncing menu pages from Supabase:', menuPagesError);
    } else if (menuPages) {
      localStorage.setItem('menuPages', JSON.stringify(menuPages));
    }

    // Sync App Users
    const { data: appUsers, error: appUsersError } = await supabase.from('app_users').select('*');
    if (appUsersError) {
      console.warn('Error syncing app users from Supabase:', appUsersError);
    } else if (appUsers) {
      localStorage.setItem('appUsers', JSON.stringify(appUsers));
    }

    // Sync General Settings
    const { data: generalSettings, error: generalSettingsError } = await supabase.from('general_settings').select('*').eq('id', 'default').maybeSingle();
    if (generalSettingsError) {
      console.warn('Error syncing general settings from Supabase:', generalSettingsError);
    } else if (generalSettings) {
      localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
    }

    // Sync WhatsApp Settings
    const { data: whatsappSettings, error: whatsappSettingsError } = await supabase.from('whatsapp_settings').select('*').eq('id', 'default').maybeSingle();
    if (whatsappSettingsError) {
      console.warn('Error syncing WhatsApp settings from Supabase:', whatsappSettingsError);
    } else if (whatsappSettings) {
      localStorage.setItem('contactDetailsSettings', JSON.stringify(whatsappSettings));
    }

    // Sync Slider Settings
    const { data: sliderSettings, error: sliderSettingsError } = await supabase.from('slider_settings').select('*').order('order');
    if (sliderSettingsError) {
      console.warn('Error syncing slider settings from Supabase:', sliderSettingsError);
    } else if (sliderSettings) {
      localStorage.setItem('heroSlides', JSON.stringify(sliderSettings));
    }

    return {
      success: true,
      message: 'Data synced from Supabase to localStorage',
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