import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Database, Loader2 } from 'lucide-react';

export interface LoadingStep {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'complete' | 'error';
  message?: string;
}

interface AppPreloaderProps {
  isLoading: boolean;
  steps: LoadingStep[];
}

export function AppPreloader({ isLoading, steps }: AppPreloaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      return;
    }

    const completedSteps = steps.filter(s => s.status === 'complete').length;
    const totalSteps = steps.length;
    const calculatedProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
    setProgress(calculatedProgress);
  }, [steps, isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#36454F] via-[#4a5a66] to-[#36454F]"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 35px,
                rgba(255, 255, 255, 0.05) 35px,
                rgba(255, 255, 255, 0.05) 70px
              )`
            }} />
          </div>

          {/* Main Content */}
          <div className="relative z-10 w-full max-w-md px-6">
            {/* Logo/Title */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <Database className="w-16 h-16 mx-auto mb-4 text-[#F5F5DC]" />
              <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                Skyway Suites
              </h1>
              <p className="text-[#F5F5DC]/80 text-sm">Loading your data...</p>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#808000] to-[#9acd32]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
              <div className="mt-2 text-center">
                <span className="text-white/80 text-sm font-medium">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* Loading Steps */}
            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    step.status === 'complete' 
                      ? 'bg-[#808000]/20 border border-[#808000]/30' 
                      : step.status === 'loading'
                      ? 'bg-white/10 border border-white/20'
                      : step.status === 'error'
                      ? 'bg-red-500/20 border border-red-500/30'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {step.status === 'complete' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <Check className="w-5 h-5 text-[#9acd32]" />
                      </motion.div>
                    )}
                    {step.status === 'loading' && (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    )}
                    {step.status === 'pending' && (
                      <div className="w-5 h-5 rounded-full border-2 border-white/30" />
                    )}
                    {step.status === 'error' && (
                      <div className="w-5 h-5 rounded-full bg-red-500/50 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    )}
                  </div>

                  {/* Label & Message */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      step.status === 'complete' ? 'text-[#F5F5DC]' : 'text-white/80'
                    }`}>
                      {step.label}
                    </p>
                    {step.message && (
                      <p className="text-xs text-white/50 mt-0.5 truncate">
                        {step.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center text-white/40 text-xs"
            >
              Please wait while we prepare your experience...
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
