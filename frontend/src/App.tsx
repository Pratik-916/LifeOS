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
import { Dashboard } from './features/dashboard/pages/Dashboard';
import Planner from './features/planner/pages/Planner';
import Journal from './pages/Journal';
import Journey from './pages/Journey';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Habits from './pages/Habits';
import BlogHome from './features/blog/pages/BlogHome';
import BlogPostView from './features/blog/pages/BlogPostView';
import BlogAdmin from './features/blog/pages/BlogAdmin';
import BlogAdminEdit from './features/blog/pages/BlogAdminEdit';
import BlogPreview from './features/blog/pages/BlogPreview';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { FeatureErrorBoundary } from './components/ui/FeatureErrorBoundary';
import { Toaster } from './components/ui/Toaster';
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

const PublicLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  const settings = useAppStore(state => state.settings);

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
                    <Route path="/planner" element={
                      <FeatureErrorBoundary featureName="Planner">
                        <Planner />
                      </FeatureErrorBoundary>
                    } />
                    <Route path="/habits" element={<Habits />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/blog/admin" element={
                      <FeatureErrorBoundary featureName="Blog CMS">
                        <BlogAdmin />
                      </FeatureErrorBoundary>
                    } />
                    <Route path="/blog/admin/edit/:id" element={
                      <FeatureErrorBoundary featureName="Blog Editor">
                        <BlogAdminEdit />
                      </FeatureErrorBoundary>
                    } />
                    <Route path="/blog/preview/:id" element={
                      <FeatureErrorBoundary featureName="Blog Preview">
                        <BlogPreview />
                      </FeatureErrorBoundary>
                    } />
                    <Route path="/journey" element={<Journey />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>

                  {/* Public Blog Routes */}
                  <Route element={<PublicLayout />}>
                    <Route path="/blog" element={
                      <FeatureErrorBoundary featureName="Blog Public">
                        <BlogHome />
                      </FeatureErrorBoundary>
                    } />
                    <Route path="/blog/post/:slug" element={
                      <FeatureErrorBoundary featureName="Blog Post">
                        <BlogPostView />
                      </FeatureErrorBoundary>
                    } />
                  </Route>
                </Routes>
              </AnimatePresence>
            </Router>
          </AuthInitializer>
        </AuthProvider>
      </MotionConfig>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
