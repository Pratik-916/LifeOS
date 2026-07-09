import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardWidget } from './DashboardWidget';
import { useBlogPosts } from '../../blog/hooks';
import { Edit3, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const BlogCard = () => {
  // Use CMS hook to show all statuses for the admin user
  const { data: postsData, isLoading, isError, refetch } = useBlogPosts({ page_size: 4 });
  const navigate = useNavigate();

  const posts = postsData?.results || [];

  return (
    <DashboardWidget
      id="blog"
      title="Recent Blog Posts"
      isLoading={isLoading}
      isError={isError}
      error={postsData instanceof Error ? postsData : null}
      isEmpty={posts.length === 0}
      onRefresh={refetch}
      headerAction={
        <button 
          onClick={() => navigate('/blog/admin')}
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          Blog CMS <ArrowRight className="w-3 h-3" />
        </button>
      }
      emptyState={
        <div className="text-center text-secondary py-4">
          <Edit3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No blog posts yet.</p>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
        {posts.map(post => (
          <div 
            key={post.id} 
            onClick={() => navigate(`/blog/admin/edit/${post.id}`)}
            className="group cursor-pointer bg-surfaceHighlight/30 hover:bg-surfaceHighlight border border-border/5 rounded-xl p-4 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full
                  ${post.status === 'published' ? 'bg-green-500/10 text-green-500' : 
                    post.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' : 
                    'bg-secondary/10 text-secondary'}`}
                >
                  {post.status}
                </span>
                {post.publishedAt && (
                  <span className="text-xs text-secondary font-medium">
                    {format(parseISO(post.publishedAt), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
              <h4 className="font-bold text-primary text-sm line-clamp-2 group-hover:text-accent transition-colors">
                {post.title || 'Untitled Draft'}
              </h4>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-xs text-secondary">
              <span className="truncate max-w-[120px]">{post.category?.name || 'Uncategorized'}</span>
              <span>{post.readingTime}m read</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
};
