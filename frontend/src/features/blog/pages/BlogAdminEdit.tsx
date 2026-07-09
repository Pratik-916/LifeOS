import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogPost } from '../hooks/useBlogPost';
import { BlogEditor } from '../components/BlogEditor';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '../../../components/Button';

export default function BlogAdminEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useBlogPost(id || null);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-danger">
        <p>Error loading post.</p>
        <Link to="/blog/admin" className="mt-4 text-accent hover:underline">Back to CMS</Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Link 
          to="/blog/admin" 
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CMS
        </Link>
        <Link to={`/blog/preview/${post.id}`}>
          <Button variant="ghost" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Preview
          </Button>
        </Link>
      </div>
      
      <div className="flex-1 min-h-[500px]">
        <BlogEditor post={post} />
      </div>
    </div>
  );
}
