/**
 * localStorage Storage Manager
 * Utilities to manage localStorage quota and prevent overflow
 */

export interface StorageInfo {
  used: number;
  available: number;
  total: number;
  percentage: number;
  items: {
    key: string;
    size: number;
    sizeFormatted: string;
  }[];
}

/**
 * Get detailed localStorage usage information
 */
export const getStorageInfo = (): StorageInfo => {
  let totalSize = 0;
  const items: { key: string; size: number; sizeFormatted: string }[] = [];

  // Calculate size of each item
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key) || '';
      const size = new Blob([value]).size;
      totalSize += size;
      items.push({
        key,
        size,
        sizeFormatted: formatBytes(size),
      });
    }
  }

  // Sort by size (largest first)
  items.sort((a, b) => b.size - a.size);

  // Most browsers allow 5-10 MB for localStorage
  // We'll use 5 MB as a conservative estimate
  const totalAvailable = 5 * 1024 * 1024; // 5 MB in bytes
  const available = totalAvailable - totalSize;
  const percentage = (totalSize / totalAvailable) * 100;

  return {
    used: totalSize,
    available,
    total: totalAvailable,
    percentage,
    items,
  };
};

/**
 * Format bytes to human-readable string
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if there's enough space for new data
 */
export const hasEnoughSpace = (dataSize: number): boolean => {
  const info = getStorageInfo();
  return info.available >= dataSize;
};

/**
 * Clear old or unnecessary data to free up space
 */
export const cleanupOldData = (): { success: boolean; freedSpace: number; message: string } => {
  const beforeInfo = getStorageInfo();
  let freedSpace = 0;

  try {
    // List of temporary/cache keys that can be safely removed
    const removableKeys = [
      'loglevel',
      'debug',
      '_grecaptcha',
      'amplitude_',
    ];

    // Remove items matching removable patterns
    for (const key of removableKeys) {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const storageKey = localStorage.key(i);
        if (storageKey && storageKey.includes(key)) {
          const value = localStorage.getItem(storageKey) || '';
          const size = new Blob([value]).size;
          localStorage.removeItem(storageKey);
          freedSpace += size;
        }
      }
    }

    const afterInfo = getStorageInfo();
    freedSpace = beforeInfo.used - afterInfo.used;

    return {
      success: true,
      freedSpace,
      message: `Cleaned up ${formatBytes(freedSpace)} of storage`,
    };
  } catch (error) {
    return {
      success: false,
      freedSpace: 0,
      message: `Cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Try to store data with fallback strategies
 */
export const safeSetItem = (key: string, value: string): { success: boolean; message: string } => {
  try {
    // Try direct storage
    localStorage.setItem(key, value);
    return {
      success: true,
      message: 'Data stored successfully',
    };
  } catch (quotaError: any) {
    console.warn('⚠️ localStorage quota exceeded, attempting cleanup...');
    
    // Try cleanup and retry
    const cleanup = cleanupOldData();
    if (cleanup.success && cleanup.freedSpace > 0) {
      try {
        localStorage.setItem(key, value);
        return {
          success: true,
          message: `Data stored after cleanup (freed ${formatBytes(cleanup.freedSpace)})`,
        };
      } catch (retryError) {
        // Cleanup didn't help
      }
    }

    // If it's a JSON array, try storing limited version
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length > 50) {
        const limited = JSON.stringify(parsed.slice(0, 50));
        localStorage.setItem(key, limited);
        return {
          success: true,
          message: `Stored limited data (50/${parsed.length} items) due to quota constraints`,
        };
      }
    } catch (parseError) {
      // Not JSON, can't optimize
    }

    return {
      success: false,
      message: `Failed to store data: ${quotaError.message || 'Quota exceeded'}. Consider clearing browser data or using fewer items.`,
    };
  }
};

/**
 * Get localStorage usage percentage
 */
export const getStoragePercentage = (): number => {
  const info = getStorageInfo();
  return info.percentage;
};

/**
 * Check if storage is critically full (>90%)
 */
export const isStorageCritical = (): boolean => {
  return getStoragePercentage() > 90;
};

/**
 * Get storage warning level
 */
export const getStorageWarningLevel = (): 'safe' | 'warning' | 'critical' | 'full' => {
  const percentage = getStoragePercentage();
  if (percentage < 70) return 'safe';
  if (percentage < 85) return 'warning';
  if (percentage < 95) return 'critical';
  return 'full';
};

/**
 * Log storage status to console
 */
export const logStorageStatus = (): void => {
  const info = getStorageInfo();
  const level = getStorageWarningLevel();
  
  console.group('📊 localStorage Status');
  console.log(`Used: ${formatBytes(info.used)} / ${formatBytes(info.total)} (${info.percentage.toFixed(1)}%)`);
  console.log(`Available: ${formatBytes(info.available)}`);
  console.log(`Warning Level: ${level}`);
  
  if (info.items.length > 0) {
    console.log('\nTop Storage Consumers:');
    info.items.slice(0, 5).forEach((item, index) => {
      console.log(`${index + 1}. ${item.key}: ${item.sizeFormatted}`);
    });
  }
  
  console.groupEnd();
};

/**
 * Optimize properties data before storing
 */
export const optimizePropertiesForStorage = (properties: any[]): any[] => {
  return properties.map(prop => ({
    ...prop,
    // Keep only essential image data (URLs, not base64)
    images: prop.images?.map((img: any) => ({
      id: img.id,
      url: img.url,
      isDefault: img.isDefault,
      category: img.category,
      // Remove any base64 data or blob URLs
    })) || [],
    // Remove any temporary fields
    _temp: undefined,
    _cache: undefined,
  }));
};
