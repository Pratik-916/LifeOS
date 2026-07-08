import React from 'react';
import { Link } from 'react-router-dom';
import { AuthCard } from '../../components/auth/AuthCard';
import { Mail } from 'lucide-react';
import { Button } from '../../components/Button';

export const VerifyEmail: React.FC = () => {
  return (
    <AuthCard title="Verify your email" subtitle="We've sent you a verification link">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
          <Mail className="w-8 h-8 text-accent" />
        </div>
        <p className="text-secondary mb-8">
          Please check your inbox and click the link to verify your account and get started with LifeOS.
        </p>
        <Button variant="secondary" className="w-full justify-center">
          Resend verification email
        </Button>
        <Link to="/login" className="mt-6 font-medium text-accent hover:text-accent/80 transition-colors">
          Return to login
        </Link>
      </div>
    </AuthCard>
  );
};
