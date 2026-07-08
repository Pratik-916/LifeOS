import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../../components/auth/AuthCard';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { SocialLoginPlaceholder } from '../../components/auth/SocialLoginPlaceholder';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [touched, setTouched] = useState(false);
  
  const { signup, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Strong password validation rules
  const rules = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
    { label: 'Special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  const isPasswordValid = rules.every(rule => rule.test(password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setTouched(true);
    setValidationError('');

    if (!name || !email || !password || !confirmPassword) {
      setValidationError('Please fill in all fields.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (!isPasswordValid) {
      setValidationError('Please ensure your password meets all requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    try {
      await signup({ name, email, password });
      navigate('/verify-email');
    } catch (e) {
      // Error handled by context
    }
  };

  return (
    <AuthCard title="Create an account" subtitle="Join LifeOS and start organizing your life">
      {(error || validationError) && (
        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div className="text-sm text-danger">
            {validationError || error?.message || 'An error occurred during signup.'}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-primary">Full Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="w-full bg-surfaceHighlight border border-border/20 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all text-primary placeholder:text-secondary/50"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-primary">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full bg-surfaceHighlight border border-border/20 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all text-primary placeholder:text-secondary/50"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-primary">Password</label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setTouched(true);
            }}
            disabled={isLoading}
            placeholder="Create a strong password"
          />
          
          {/* Password Strength Indicator */}
          {touched && (
            <div className="mt-2 space-y-1 bg-surfaceHighlight/50 p-3 rounded-lg border border-border/50">
              {rules.map((rule, idx) => {
                const passed = rule.test(password);
                return (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    {passed ? <Check className="w-3.5 h-3.5 text-success" /> : <X className="w-3.5 h-3.5 text-secondary/50" />}
                    <span className={passed ? "text-success" : "text-secondary"}>{rule.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-primary">Confirm Password</label>
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Confirm your password"
          />
        </div>

        <Button type="submit" variant="primary" className="w-full justify-center mt-2" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <SocialLoginPlaceholder />

      <p className="mt-8 text-center text-sm text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent hover:text-accent/80 transition-colors">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
};
