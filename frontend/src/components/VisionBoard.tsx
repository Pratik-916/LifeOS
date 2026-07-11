import React from 'react';
import { motion } from 'framer-motion';

const MOCK_PHOTOS = [
  { id: '1', title: 'Health', url: 'https://picsum.photos/seed/health/500/400' },
  { id: '2', title: 'Focus', url: 'https://picsum.photos/seed/focus/500/400' },
  { id: '3', title: 'Travel', url: 'https://picsum.photos/seed/travel/500/400' },
  { id: '4', title: 'Growth', url: 'https://picsum.photos/seed/growth/500/400' }
];

export const VisionBoard: React.FC = () => {
  return (
    <motion.div className="space-y-6 pt-6 border-t border-border/20 mt-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Vision Board</h2>
          <p className="text-sm text-secondary">A visual representation of your dreams.</p>
        </div>
        <span className="px-3 py-1 bg-surfaceHighlight text-secondary text-xs rounded-full border border-border/20">Coming Soon</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-700">
        {MOCK_PHOTOS.map((photo) => (
          <div key={photo.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-not-allowed border border-border/20 shadow-lg">
            <img 
              src={photo.url} 
              alt={photo.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity flex items-end p-4">
              <p className="text-sm font-bold text-secondary tracking-wider uppercase">{photo.title}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
