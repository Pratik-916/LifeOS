import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePublicBlogPost } from '../hooks/useBlogPost';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function BlogPostView() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = usePublicBlogPost(slug || null);

  useEffect(() => {
    // Basic SEO fallback if Helmet isn't used globally
    if (post) {
      document.title = post.seoTitle || post.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', post.seoDescription || post.excerpt);
      }
      
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical && post.canonicalUrl) {
        canonical.setAttribute('href', post.canonicalUrl);
      }
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-secondary">
        <p className="text-xl mb-4">Post not found.</p>
        <Link to="/blog" className="text-accent hover:underline">Return to Blog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Link to="/blog" className="inline-flex items-center gap-2 text-secondary hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
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
            <span>By {post.authorName}</span>
            <span>•</span>
            <time>
              {post.publishedAt ? format(parseISO(post.publishedAt), 'MMMM do, yyyy') : ''}
            </time>
            <span>•</span>
            <span>{post.readingTime} min read</span>
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
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
        </div>
      </article>
    </div>
  );
}
