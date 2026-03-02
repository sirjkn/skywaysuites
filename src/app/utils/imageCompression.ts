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
 * Ensures the final image is 50kb or less and 800x500px or smaller
 * @param file - The image file to compress
 * @param maxSizeKB - Maximum file size in KB (default: 50)
 * @param quality - Initial image quality 0-1 (default: 0.85)
 * @param maxWidth - Maximum width in pixels (default: 800)
 * @param maxHeight - Maximum height in pixels (default: 500)
 * @returns Promise with compressed image data
 */
export const compressAndConvertToWebP = async (
  file: File,
  maxSizeKB: number = 50,
  quality: number = 0.85,
  maxWidth: number = 800,
  maxHeight: number = 500
): Promise<CompressionResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = async () => {
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
        
        // Iteratively compress until size is under maxSizeKB
        let currentQuality = quality;
        let blob: Blob | null = null;
        const maxSizeBytes = maxSizeKB * 1024;
        
        // Try to compress with iterative quality reduction
        for (let attempt = 0; attempt < 10; attempt++) {
          blob = await new Promise<Blob | null>((resolveBlob) => {
            canvas.toBlob(
              (b) => resolveBlob(b),
              'image/webp',
              currentQuality
            );
          });
          
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          
          // If size is acceptable, break
          if (blob.size <= maxSizeBytes) {
            break;
          }
          
          // Reduce quality for next iteration
          currentQuality -= 0.1;
          
          // If quality is too low, reduce dimensions instead
          if (currentQuality < 0.3 && blob.size > maxSizeBytes) {
            width *= 0.9;
            height *= 0.9;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            currentQuality = 0.75; // Reset quality when reducing size
          }
        }
        
        if (!blob || blob.size > maxSizeBytes) {
          reject(new Error(`Unable to compress image below ${maxSizeKB}KB. Final size: ${(blob!.size / 1024).toFixed(2)}KB`));
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
          const compressedSize = blob!.size;
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
export const validateImageFile = (file: File, maxSizeMB: number = 10): string | null => {
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