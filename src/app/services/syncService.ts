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
export const syncNow = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await migrateLocalStorageToSupabase();
    return {
      success: result.success,
      message: result.message
    };
  } catch (error) {
    console.error('Sync error:', error);
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
