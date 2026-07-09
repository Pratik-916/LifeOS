import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogPost } from '../hooks/useBlogPost';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function BlogPreview() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useBlogPost(id || null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-danger">
        Error loading preview.
      </div>
    );
  }

  // Use identical layout to Public BlogPostView but add CMS warning banner
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-between">
        <span className="text-yellow-600 font-medium text-sm">
          CMS Preview Mode (Status: {post.status})
        </span>
        <Link 
          to={`/blog/admin/edit/${post.id}`}
          className="flex items-center gap-2 text-sm text-yellow-700 hover:text-yellow-800 font-semibold"
        >
          <Edit2 className="w-4 h-4" />
          Edit Post
        </Link>
      </div>

      <Link to="/blog/admin" className="inline-flex items-center gap-2 text-secondary hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to CMS
      </Link>

      <article>
        <header className="mb-12">
          {post.category && (
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-6">
              {post.category.name}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 tracking-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-secondary text-sm">
            <span>By {post.authorId || 'Author'}</span>
            <span>•</span>
            <time>
              {post.publishedAt ? format(parseISO(post.publishedAt), 'MMMM do, yyyy') : 'Unpublished Draft'}
            </time>
          </div>
        </header>

        {post.featuredImage && (
          <img 
            src={post.featuredImage} 
            alt={post.title} 
            className="w-full h-auto rounded-2xl mb-12 shadow-md object-cover max-h-[500px]"
          />
        )}

        <div className="prose prose-invert prose-lg max-w-none text-primary">
          {/* Note: In a real app we'd use a markdown renderer here like ReactMarkdown */}
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') || '<p class="text-secondary italic">Empty content</p>' }} />
        </div>
      </article>
    </div>
  );
}
