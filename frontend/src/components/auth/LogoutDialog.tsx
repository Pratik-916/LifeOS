import React from 'react';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutDialog: React.FC<LogoutDialogProps> = ({ isOpen, onClose }) => {
  const { logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onCancel={onClose}
      onConfirm={handleLogout}
      title="Log out"
      message="Are you sure you want to log out of your account? You will need to log back in to access your data."
      confirmLabel={isLoading ? "Logging out..." : "Log out"}
      cancelLabel="Cancel"
      isDestructive
    />
  );
};
