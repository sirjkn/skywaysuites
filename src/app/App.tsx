import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';
import { initializeApp } from './services/initialization';

export default function App() {
  useEffect(() => {
    // Initialize app with default data (non-blocking)
    initializeApp().catch((error) => {
      console.error('Failed to initialize app:', error);
      // App will continue even if initialization fails
    });
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}