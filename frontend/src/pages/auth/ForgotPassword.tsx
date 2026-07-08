import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthCard } from '../../components/auth/AuthCard';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { forgotPassword, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (!email) {
      setValidationError('Please enter your email address.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    try {
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (e) {
      // Error handled by context
    }
  };

  if (isSuccess) {
    return (
      <AuthCard title="Check your email" subtitle="We've sent you a password reset link">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <p className="text-secondary mb-8">
            We sent an email to <span className="font-medium text-primary">{email}</span> with a link to reset your password.
          </p>
          <Button variant="secondary" className="w-full justify-center" onClick={() => setIsSuccess(false)}>
            Didn't receive the email? Try again
          </Button>
          <Link to="/login" className="mt-6 flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to log in
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Forgot password" subtitle="No worries, we'll send you reset instructions">
      {(error || validationError) && (
        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div className="text-sm text-danger">
            {validationError || error?.message || 'An error occurred.'}
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
          />
        </div>

        <Button type="submit" variant="primary" className="w-full justify-center mt-2" disabled={isLoading}>
          {isLoading ? 'Sending link...' : 'Reset password'}
        </Button>
      </form>

      <div className="mt-8 flex justify-center">
        <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to log in
        </Link>
      </div>
    </AuthCard>
  );
};
