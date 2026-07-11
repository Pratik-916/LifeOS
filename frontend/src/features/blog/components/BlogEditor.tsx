import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { Save, AlertTriangle, RefreshCw, WifiOff, Check, Image as ImageIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { BlogPostModel } from '../api/blog.types';
import { cn } from '../../../lib/utils';
import { useUpdatePost } from '../hooks/useBlogMutations';
import { useOfflineStatus } from '../../../hooks/useOfflineStatus';

// Lazy load the rich text editor to improve initial bundle size
const RichTextEditor = lazy(() => import('./RichTextEditor'));

interface BlogEditorProps {
  post: BlogPostModel;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({ post }) => {
  const [localPost, setLocalPost] = useState<BlogPostModel>(post);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'unsaved' | 'offline' | 'error' | 'conflict'>('idle');
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveQueueRef = useRef<Promise<any>>(Promise.resolve());
  
  const isOffline = useOfflineStatus();
  const { mutateAsync: updatePostAsync } = useUpdatePost();

  // Monitor offline status
  useEffect(() => {
    if (isOffline && saveStatus !== 'idle' && saveStatus !== 'saved') {
      setSaveStatus('offline');
    } else if (!isOffline && saveStatus === 'offline') {
      setSaveStatus('unsaved');
      handleDebouncedSave(localPost);
    }
  }, [isOffline]);

  const handleDebouncedSave = useCallback((latestData: BlogPostModel) => {
    if (isOffline) {
      setSaveStatus('offline');
      return;
    }

    setSaveStatus('saving');

    saveQueueRef.current = saveQueueRef.current.then(async () => {
      try {
        await updatePostAsync({
          id: latestData.id,
          payload: {
            title: latestData.title,
            content: latestData.content,
            excerpt: latestData.excerpt,
            status: latestData.status,
            visibility: latestData.visibility,
            featured: latestData.featured,
            featured_image: latestData.featuredImage,
          }
        });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(prev => prev === 'saved' ? 'idle' : prev), 3000);
      } catch (err: any) {
        if (err.response?.status === 409) {
          setSaveStatus('conflict');
        } else {
          setSaveStatus('error');
        }
      }
    });
  }, [isOffline, updatePostAsync]);

  const handleChange = (field: keyof BlogPostModel, value: any) => {
    setSaveStatus('unsaved');
    const updated = { ...localPost, [field]: value };
    setLocalPost(updated);
    
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleDebouncedSave(updated);
    }, 1000); // 1000ms debounce
  };

  const renderSaveStatus = () => {
    let content = null;
    switch (saveStatus) {
      case 'saving':
        content = <motion.span key="saving" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="flex items-center gap-2 text-secondary text-sm"><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</motion.span>;
        break;
      case 'saved':
        content = <motion.span key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2, filter: 'blur(4px)' }} transition={{ duration: 0.3 }} className="flex items-center gap-2 text-accent text-sm font-medium bg-accent/10 px-2 py-1 rounded-md"><Check className="w-4 h-4" /> Saved</motion.span>;
        break;
      case 'unsaved':
        content = <motion.span key="unsaved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-secondary text-sm"><Save className="w-4 h-4" /> Unsaved changes</motion.span>;
        break;
      case 'offline':
        content = <motion.span key="offline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-orange-400 text-sm"><WifiOff className="w-4 h-4" /> Offline (waiting)</motion.span>;
        break;
      case 'error':
        content = <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-danger text-sm"><AlertTriangle className="w-4 h-4" /> Sync error</motion.span>;
        break;
      case 'conflict':
        content = <motion.span key="conflict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-danger text-sm"><AlertTriangle className="w-4 h-4" /> Version conflict</motion.span>;
        break;
    }
    return (
      <div className="relative flex items-center justify-end min-w-[140px]">
        <AnimatePresence mode="wait">{content}</AnimatePresence>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-surface border border-border/10 rounded-2xl overflow-hidden shadow-sm relative">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/10 bg-surfaceHighlight/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <label htmlFor="title" className="sr-only">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={localPost.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Post Title..."
            className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-primary placeholder:text-secondary/50 w-full min-w-[300px]"
          />
        </div>
        <div className="flex items-center gap-4">
          {renderSaveStatus()}
          
          <label htmlFor="visibility" className="sr-only">Visibility</label>
          <select
            id="visibility"
            name="visibility"
            value={localPost.visibility}
            onChange={(e) => handleChange('visibility', e.target.value)}
            className="bg-surfaceElevated border border-border/20 rounded-lg px-3 py-1.5 text-sm text-primary focus:outline-none focus:border-accent"
          >
            <option value="public">Public</option>
            <option value="unlisted">Unlisted</option>
            <option value="private">Private</option>
          </select>

          <label htmlFor="status" className="sr-only">Status</label>
          <select 
            id="status"
            name="status"
            value={localPost.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="bg-surfaceElevated border border-border/20 rounded-lg px-3 py-1.5 text-sm text-primary focus:outline-none focus:border-accent"
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Excerpt and Cover Image */}
      <div className="p-4 border-b border-border/5 space-y-4">
        <div>
          <label htmlFor="excerpt" className="sr-only">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={localPost.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            placeholder="Brief excerpt (used for SEO and previews)..."
            className="w-full h-16 bg-transparent resize-none focus:outline-none text-sm text-secondary"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="featured_image" className="text-xs font-semibold text-secondary uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-3 h-3" /> Cover Image URL
          </label>
          <input
            id="featured_image"
            name="featured_image"
            type="url"
            value={localPost.featuredImage || ''}
            onChange={(e) => handleChange('featuredImage', e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-surfaceElevated border border-border/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-accent"
          />
          {localPost.featuredImage && (
            <div className="mt-2 rounded-xl overflow-hidden h-32 w-full max-w-sm border border-border/10">
              <img 
                src={localPost.featuredImage} 
                alt="Cover Preview" 
                className="w-full h-full object-cover" 
                onError={(e) => (e.currentTarget.style.display = 'none')} 
                onLoad={(e) => (e.currentTarget.style.display = 'block')} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        <Suspense fallback={<div className="flex items-center justify-center h-full text-secondary"><RefreshCw className="w-6 h-6 animate-spin" /></div>}>
          <RichTextEditor 
            value={localPost.content}
            onChange={(value) => handleChange('content', value)}
          />
        </Suspense>
      </div>
    </div>
  );
};
