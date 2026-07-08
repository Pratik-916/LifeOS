import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthCard } from '../../components/auth/AuthCard';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, CheckCircle2, Check, X } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setValidationError('Invalid or missing reset token.');
    }
  }, [token]);

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

    if (!token) {
      setValidationError('Invalid or missing reset token.');
      return;
    }

    if (!password || !confirmPassword) {
      setValidationError('Please fill in all fields.');
      return;
    }

    if (!isPasswordValid) {
      setValidationError('Please ensure your new password meets all requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    const res = await resetPassword(password, token);
    if (res.success) {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <AuthCard title="Password reset" subtitle="Your password has been successfully reset">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <Button variant="primary" className="w-full justify-center" onClick={() => navigate('/login')}>
            Continue to log in
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Set new password" subtitle="Must be at least 8 characters">
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
          <label htmlFor="password" className="text-sm font-medium text-primary">New Password</label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setTouched(true);
            }}
            disabled={isLoading || !token}
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
          <label htmlFor="confirmPassword" className="text-sm font-medium text-primary">Confirm New Password</label>
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading || !token}
            placeholder="Confirm your new password"
          />
        </div>

        <Button type="submit" variant="primary" className="w-full justify-center mt-2" disabled={isLoading || !token}>
          {isLoading ? 'Resetting password...' : 'Reset password'}
        </Button>
      </form>
    </AuthCard>
  );
};
