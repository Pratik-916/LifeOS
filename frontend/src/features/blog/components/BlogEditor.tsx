import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { Save, AlertTriangle, RefreshCw, WifiOff, Check, Image as ImageIcon } from 'lucide-react';
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
          }
        });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
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
    switch (saveStatus) {
      case 'saving':
        return <span className="flex items-center gap-2 text-secondary text-sm"><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</span>;
      case 'saved':
        return <span className="flex items-center gap-2 text-accent text-sm"><Check className="w-4 h-4" /> Saved</span>;
      case 'unsaved':
        return <span className="flex items-center gap-2 text-secondary text-sm"><Save className="w-4 h-4" /> Unsaved changes</span>;
      case 'offline':
        return <span className="flex items-center gap-2 text-orange-400 text-sm"><WifiOff className="w-4 h-4" /> Offline (waiting)</span>;
      case 'error':
        return <span className="flex items-center gap-2 text-danger text-sm"><AlertTriangle className="w-4 h-4" /> Sync error</span>;
      case 'conflict':
        return <span className="flex items-center gap-2 text-danger text-sm"><AlertTriangle className="w-4 h-4" /> Version conflict</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface border border-border/10 rounded-2xl overflow-hidden shadow-sm relative">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/10 bg-surfaceHighlight/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={localPost.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Post Title..."
            className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-primary placeholder:text-secondary/50 w-full min-w-[300px]"
          />
        </div>
        <div className="flex items-center gap-4">
          {renderSaveStatus()}
          <select 
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

      {/* Excerpt */}
      <div className="p-4 border-b border-border/5">
        <textarea
          value={localPost.excerpt}
          onChange={(e) => handleChange('excerpt', e.target.value)}
          placeholder="Brief excerpt (used for SEO and previews)..."
          className="w-full h-16 bg-transparent resize-none focus:outline-none text-sm text-secondary"
        />
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
