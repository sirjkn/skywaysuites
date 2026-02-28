import { storageService } from './storage';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'manager' | 'customer';
  createdAt: string;
}

const DEFAULT_ADMIN: AppUser = {
  id: 'admin-default',
  name: 'Administrator',
  email: 'admin@123.com',
  phone: '+254 700 000 000',
  password: '123',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

/**
 * Initialize the application with default data
 * This ensures the default admin user exists
 */
export const initializeApp = async (): Promise<void> => {
  try {
    // Get existing app users
    const users = await storageService.getAppUsers();
    
    // Check if default admin exists
    const adminExists = users.some((u: AppUser) => u.id === 'admin-default');
    
    if (!adminExists) {
      console.log('Creating default admin user...');
      await storageService.createAppUser(DEFAULT_ADMIN);
      console.log('Default admin user created successfully');
    }
  } catch (error) {
    console.error('Error initializing app:', error);
    // Try to create default admin even if there's an error
    try {
      await storageService.createAppUser(DEFAULT_ADMIN);
    } catch (createError) {
      console.error('Failed to create default admin:', createError);
    }
  }
};
