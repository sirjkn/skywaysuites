import { migrateLocalStorageToSupabase } from './migrations';
import { toast } from 'sonner';

let syncInterval: NodeJS.Timeout | null = null;

export interface SyncStatus {
  syncing: boolean;
  lastSyncTime: Date | null;
  autoSyncEnabled: boolean;
}

/**
 * Manually sync data to Supabase
 */
export const syncNow = async (): Promise<{ success: boolean; message: string; details?: any }> => {
  try {
    console.log('🔄 Starting sync: localStorage → Supabase...');
    
    // Log what's in localStorage before sync
    const propertiesCount = JSON.parse(localStorage.getItem('properties') || '[]').length;
    const bookingsCount = JSON.parse(localStorage.getItem('bookings') || '[]').length;
    const customersCount = JSON.parse(localStorage.getItem('customers') || '[]').length;
    
    console.log('📊 Data to sync:', {
      properties: propertiesCount,
      bookings: bookingsCount,
      customers: customersCount
    });
    
    const result = await migrateLocalStorageToSupabase();
    
    if (result.success && result.details) {
      const counts = result.details;
      const totalItems = Object.values(counts).reduce((sum: number, val: any) => 
        sum + (typeof val === 'number' ? val : 0), 0
      );
      
      console.log('✅ Sync completed:', {
        properties: counts.properties || 0,
        features: counts.features || 0,
        customers: counts.customers || 0,
        bookings: counts.bookings || 0,
        payments: counts.payments || 0,
        menuPages: counts.menuPages || 0,
        appUsers: counts.appUsers || 0,
        settings: (counts.generalSettings || 0) + (counts.whatsappSettings || 0) + (counts.sliderSettings || 0),
        total: totalItems
      });
      
      // Log property status details if available
      const properties = JSON.parse(localStorage.getItem('properties') || '[]');
      if (properties.length > 0) {
        const availableCount = properties.filter((p: any) => p.available).length;
        const unavailableCount = properties.filter((p: any) => !p.available).length;
        console.log('🏠 Property Status:', {
          total: properties.length,
          available: availableCount,
          unavailable: unavailableCount
        });
      }
      
      // Log bookings details if available
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      if (bookings.length > 0) {
        const pendingCount = bookings.filter((b: any) => b.status === 'pending').length;
        const confirmedCount = bookings.filter((b: any) => b.status === 'confirmed').length;
        const cancelledCount = bookings.filter((b: any) => b.status === 'cancelled').length;
        console.log('📅 Bookings Status:', {
          total: bookings.length,
          pending: pendingCount,
          confirmed: confirmedCount,
          cancelled: cancelledCount
        });
      }
    }
    
    return {
      success: result.success,
      message: result.message,
      details: result.details
    };
  } catch (error) {
    console.error('❌ Sync error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Sync failed'
    };
  }
};

/**
 * Start auto-sync every 10 seconds
 */
export const startAutoSync = (onSync: (lastSyncTime: Date) => void) => {
  if (syncInterval) {
    clearInterval(syncInterval);
  }

  // Initial sync
  syncNow().then(() => {
    onSync(new Date());
  });

  // Set up 10-second interval
  syncInterval = setInterval(async () => {
    const result = await syncNow();
    if (result.success) {
      onSync(new Date());
      console.log('✅ Auto-sync completed:', new Date().toLocaleTimeString());
    } else {
      console.error('❌ Auto-sync failed:', result.message);
    }
  }, 10000); // 10 seconds

  return syncInterval;
};

/**
 * Stop auto-sync
 */
export const stopAutoSync = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
};

/**
 * Check if auto-sync is running
 */
export const isAutoSyncRunning = (): boolean => {
  return syncInterval !== null;
};