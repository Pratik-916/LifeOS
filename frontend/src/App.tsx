import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthInitializer } from './components/auth/AuthInitializer';
import { NotificationService } from './services/notificationService';

// Initialize React Query
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      NotificationService.error('Data Error', (error as any).message || 'Failed to fetch data');
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      NotificationService.error('Action Failed', (error as any).message || 'Something went wrong');
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Planner from './features/planner/pages/Planner';
import Journal from './pages/Journal';
import Blog from './pages/Blog';
import Journey from './pages/Journey';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Habits from './pages/Habits';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { AuthLayout } from './components/layouts/AuthLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { VerifyEmail } from './pages/auth/VerifyEmail';

const ProtectedLayout = () => (
  <ProtectedRoute>
    <Layout>
      <Outlet />
    </Layout>
  </ProtectedRoute>
);

function App() {
  const resetDailyHabits = useAppStore(state => state.resetDailyHabits);
  const settings = useAppStore(state => state.settings);

  useEffect(() => {
    // Reset daily habits if a new day has started
    resetDailyHabits();
    
    // Set up an interval to check for new days while app is running
    const interval = setInterval(() => {
      resetDailyHabits();
    }, 60000 * 60); // Check every hour
    
    return () => clearInterval(interval);
  }, [resetDailyHabits]);

  useEffect(() => {
    const root = document.documentElement;
    
    // Theme
    if (settings?.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else if (settings?.theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      // System
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.remove('light', 'dark');
      root.classList.add(isSystemDark ? 'dark' : 'light');
    }

    // Font Size
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    if (settings?.fontSize) {
      root.classList.add(`font-size-${settings.fontSize}`);
    }

    // Compact Mode
    if (settings?.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }

    // Animations
    if (settings?.animations === false) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }

    // Privacy Mode
    if (settings?.privacyMode) {
      root.classList.add('privacy-mode');
    } else {
      root.classList.remove('privacy-mode');
    }

    // Accent Color (Custom CSS Variable)
    if (settings?.accentColor) {
      const hex = settings.accentColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      root.style.setProperty('--color-accent', `${r} ${g} ${b}`);
    }
  }, [settings?.theme, settings?.compactMode, settings?.animations, settings?.accentColor, settings?.fontSize, settings?.privacyMode]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <MotionConfig reducedMotion={settings?.animations === false ? "always" : "user"}>
          <AuthProvider>
            <AuthInitializer>
              <Router>
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public Auth Routes */}
                  <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                  </Route>

                  {/* Protected Application Routes */}
                  <Route element={<ProtectedLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/planner" element={<Planner />} />
                    <Route path="/habits" element={<Habits />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/journey" element={<Journey />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                </Routes>
              </AnimatePresence>
            </Router>
          </AuthInitializer>
        </AuthProvider>
      </MotionConfig>
      <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
