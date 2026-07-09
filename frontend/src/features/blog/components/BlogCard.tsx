import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BlogPostPublicModel } from '../api/blog.types';
import { format, parseISO } from 'date-fns';

interface BlogCardProps {
  post: BlogPostPublicModel;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  const displayDate = post.publishedAt 
    ? format(parseISO(post.publishedAt), 'MMM do, yyyy')
    : 'Draft';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative bg-surfaceElevated border border-border/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col ${featured ? 'md:flex-row md:col-span-2' : ''}`}
    >
      <Link to={`/blog/post/${post.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Read {post.title}</span>
      </Link>
      
      {/* Image */}
      <div className={`relative overflow-hidden bg-surfaceHighlight ${featured ? 'md:w-1/2 md:h-full' : 'w-full h-48'}`}>
        {post.featuredImage ? (
          <img 
            src={post.featuredImage} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary/30 font-medium">
            No Image
          </div>
        )}
        {post.category && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 bg-surface/80 backdrop-blur-md border border-border/10 rounded-full text-xs font-semibold text-primary">
              {post.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col p-6 ${featured ? 'md:w-1/2' : ''}`}>
        <div className="flex items-center gap-4 text-xs text-secondary mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {displayDate}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime} min read
          </div>
        </div>

        <h3 className={`font-bold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors ${featured ? 'text-2xl' : 'text-lg'}`}>
          {post.title}
        </h3>
        
        <p className="text-sm text-secondary line-clamp-3 mb-6 flex-1">
          {post.excerpt || post.content.substring(0, 150) + '...'}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
              {post.authorName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-primary">{post.authorName}</span>
          </div>
          
          <div className="flex items-center text-accent text-sm font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            Read more <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
