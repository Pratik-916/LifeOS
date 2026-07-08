import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../../components/auth/AuthCard';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { SocialLoginPlaceholder } from '../../components/auth/SocialLoginPlaceholder';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please enter both email and password.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Enter your credentials to access your account">
      {(error || validationError) && (
        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div className="text-sm text-danger">
            {validationError || error?.message || 'An error occurred during login.'}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-primary">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className={cn(
              "w-full bg-surfaceHighlight border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 transition-all text-primary placeholder:text-secondary/50",
              (error || validationError) ? "border-danger focus:ring-danger focus:border-danger" : "border-border/20 focus:ring-accent focus:border-accent"
            )}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-sm font-medium text-primary">Password</label>
            <Link to="/forgot-password" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            error={!!error || !!validationError}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4 rounded border-border/20 text-accent focus:ring-accent bg-surfaceHighlight cursor-pointer"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-secondary cursor-pointer">
            Remember me
          </label>
        </div>

        <Button type="submit" variant="primary" className="w-full justify-center" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <SocialLoginPlaceholder />

      <p className="mt-8 text-center text-sm text-secondary">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-accent hover:text-accent/80 transition-colors">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
};
