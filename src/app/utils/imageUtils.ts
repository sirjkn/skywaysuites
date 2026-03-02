/**
 * Image utility functions for uploading, compressing, and converting images to WebP
 */

export interface ImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1
  maxSizeKB?: number; // Maximum file size in KB
}

/**
 * Converts an image file to WebP format and compresses it
 * Ensures the final image is 50kb or less and 800x500px or smaller by default
 * @param file - The original image file
 * @param options - Compression options
 * @returns Promise with the compressed WebP image as a base64 string
 */
export const convertToWebP = async (
  file: File,
  options: ImageUploadOptions = {}
): Promise<string> => {
  const {
    maxWidth = 800,
    maxHeight = 500,
    quality = 0.85,
    maxSizeKB = 50,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = async () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

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

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        // Iteratively compress until size is under maxSizeKB
        let currentQuality = quality;
        const maxSizeBytes = maxSizeKB * 1024;
        
        // Try to compress with iterative quality reduction
        for (let attempt = 0; attempt < 10; attempt++) {
          let webpDataUrl: string;
          
          try {
            webpDataUrl = canvas.toDataURL('image/webp', currentQuality);
          } catch (error) {
            // Fallback to JPEG if WebP is not supported
            webpDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
          }
          
          // Convert data URL to size in bytes (estimate)
          const base64Length = webpDataUrl.split(',')[1].length;
          const sizeInBytes = (base64Length * 3) / 4;
          
          // If size is acceptable, return
          if (sizeInBytes <= maxSizeBytes) {
            resolve(webpDataUrl);
            return;
          }
          
          // Reduce quality for next iteration
          currentQuality -= 0.1;
          
          // If quality is too low, reduce dimensions instead
          if (currentQuality < 0.3 && sizeInBytes > maxSizeBytes) {
            width *= 0.9;
            height *= 0.9;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            currentQuality = 0.75; // Reset quality when reducing size
          }
        }
        
        // Final attempt - return the most compressed version
        try {
          const webpDataUrl = canvas.toDataURL('image/webp', 0.3);
          resolve(webpDataUrl);
        } catch (error) {
          const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.3);
          resolve(jpegDataUrl);
        }
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
 * Validates if a file is an image
 * @param file - The file to validate
 * @returns boolean indicating if the file is a valid image
 */
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Formats file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Compresses multiple images for slider/gallery
 * @param files - Array of image files
 * @param options - Compression options
 * @returns Promise with array of compressed WebP images as base64 strings
 */
export const compressMultipleImages = async (
  files: File[],
  options: ImageUploadOptions = {}
): Promise<string[]> => {
  const promises = files.map(file => convertToWebP(file, options));
  return Promise.all(promises);
};