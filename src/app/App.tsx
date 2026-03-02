import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useEffect, useState } from 'react';
import { initializeApp, type InitializationProgress } from './services/initialization';
import { AppPreloader, type LoadingStep } from './components/AppPreloader';

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([
    { id: 'whatsapp', label: 'Initializing WhatsApp settings', status: 'pending' },
    { id: 'supabase-init', label: 'Initializing Supabase', status: 'pending' },
    { id: 'supabase-connect', label: 'Connecting to Supabase', status: 'pending' },
    { id: 'data-pull', label: 'Pulling data from Supabase', status: 'pending' },
    { id: 'admin', label: 'Verifying admin user', status: 'pending' },
  ]);

  useEffect(() => {
    // Initialize app with progress tracking
    const handleProgress = (progress: InitializationProgress) => {
      setLoadingSteps(prevSteps => {
        const stepMap: Record<string, string> = {
          'Initializing WhatsApp settings': 'whatsapp',
          'Initializing Supabase': 'supabase-init',
          'Connecting to Supabase': 'supabase-connect',
          'Pulling data from Supabase': 'data-pull',
          'Creating default admin user': 'admin',
          'Initializing app': 'admin',
        };

        const stepId = stepMap[progress.step];
        if (!stepId) return prevSteps;

        return prevSteps.map(step => {
          if (step.id === stepId) {
            return {
              ...step,
              status: progress.status,
              message: progress.message,
            };
          }
          return step;
        });
      });
    };

    initializeApp(handleProgress)
      .then(() => {
        // Mark all as complete
        setLoadingSteps(steps => steps.map(step => ({
          ...step,
          status: step.status === 'error' ? 'error' : 'complete'
        })));
        // Wait a bit to show completion state, then hide preloader
        setTimeout(() => {
          setIsInitializing(false);
        }, 800);
      })
      .catch((error) => {
        console.error('Failed to initialize app:', error);
        // Even on error, hide preloader after a delay
        setTimeout(() => {
          setIsInitializing(false);
        }, 1000);
      });
  }, []);

  return (
    <>
      <AppPreloader isLoading={isInitializing} steps={loadingSteps} />
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}