import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background text-primary">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-secondary mb-8 max-w-md text-lg">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        </p>
        <Link 
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
