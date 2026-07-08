import React from 'react';
import { motion } from 'framer-motion';

export const AuthCard: React.FC<{ children: React.ReactNode; title: string; subtitle?: string }> = ({ children, title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md p-8 bg-surface border border-border/20 rounded-2xl shadow-xl"
    >
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-primary mb-2">{title}</h1>
        {subtitle && <p className="text-sm text-secondary">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
};
