/**
 * Image Compression and WebP Conversion Utility
 */

export interface CompressionResult {
  dataUrl: string;
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * Compresses an image and converts it to WebP format
 * @param file - The image file to compress
 * @param maxSizeMB - Maximum file size in MB (default: 5)
 * @param quality - Image quality 0-1 (default: 0.8)
 * @param maxWidth - Maximum width in pixels (default: 1920)
 * @param maxHeight - Maximum height in pixels (default: 1920)
 * @returns Promise with compressed image data
 */
export const compressAndConvertToWebP = async (
  file: File,
  maxSizeMB: number = 5,
  quality: number = 0.8,
  maxWidth: number = 1920,
  maxHeight: number = 1920
): Promise<CompressionResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }
        
        // Create canvas for compression
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP and compress
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            
            // Check if compressed size exceeds max size
            const compressedSizeMB = blob.size / (1024 * 1024);
            if (compressedSizeMB > maxSizeMB) {
              reject(new Error(`Compressed image size (${compressedSizeMB.toFixed(2)}MB) exceeds maximum allowed size (${maxSizeMB}MB)`));
              return;
            }
            
            // Create new File from blob
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            
            // Convert to data URL for preview
            const dataUrlReader = new FileReader();
            dataUrlReader.onload = () => {
              const originalSize = file.size;
              const compressedSize = blob.size;
              const compressionRatio = ((1 - compressedSize / originalSize) * 100);
              
              resolve({
                dataUrl: dataUrlReader.result as string,
                file: webpFile,
                originalSize,
                compressedSize,
                compressionRatio,
              });
            };
            dataUrlReader.readAsDataURL(blob);
          },
          'image/webp',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Validates image file
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB
 * @returns Error message if invalid, null if valid
 */
export const validateImageFile = (file: File, maxSizeMB: number = 5): string | null => {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    return 'Please select a valid image file';
  }
  
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    return `File size (${fileSizeMB.toFixed(2)}MB) exceeds maximum allowed size (${maxSizeMB}MB)`;
  }
  
  return null;
};

/**
 * Formats bytes to human readable format
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
