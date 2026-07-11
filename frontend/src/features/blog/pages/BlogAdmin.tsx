import React, { useState } from 'react';
import { useCreatePost, useDeletePost } from '../hooks/useBlogMutations';
import { useBlogPosts as useFetchPosts } from '../hooks/useBlogPosts';
import { PageHeader } from '../../../components/ui/PageHeader';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Button } from '../../../components/Button';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function BlogAdmin() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFetchPosts({ page });
  const { mutateAsync: createPost } = useCreatePost();
  const { mutate: deletePost } = useDeletePost();
  const navigate = useNavigate();
  const location = useLocation();
  const hasCreatedDraft = React.useRef(false);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'create' && !hasCreatedDraft.current) {
      hasCreatedDraft.current = true;
      // Remove the query param immediately so it doesn't loop on back navigation
      navigate('/blog/admin', { replace: true });
      handleCreateDraft();
    }
  }, [location.search, navigate]);

  const handleCreateDraft = async () => {
    try {
      const newPost = await createPost({
        title: 'New Draft',
        content: '',
        status: 'draft',
      });
      navigate(`/blog/admin/edit/${newPost.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Blog CMS" 
          description="Manage your blog posts, drafts, and categories."
        />
        <Button onClick={handleCreateDraft} className="gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : !data?.results || data.results.length === 0 ? (
          <EmptyState
            icon={Edit2}
            title="No posts yet"
            message="Create your first blog post to get started."
            action={
              <Button onClick={handleCreateDraft}>Create Post</Button>
            }
          />
        ) : (
          <div className="bg-surfaceElevated rounded-2xl border border-border/10 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/10 bg-surfaceHighlight/50">
                  <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Title</th>
                  <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {data.results.map((post) => (
                  <tr key={post.id} className="hover:bg-surfaceHighlight/20 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary line-clamp-1">{post.title}</span>
                        <span className="text-xs text-secondary">{post.slug}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${post.status === 'published' ? 'bg-green-500/10 text-green-500' : 
                          post.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' : 
                          'bg-secondary/10 text-secondary'}`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-sm text-secondary">{post.category?.name || 'Uncategorized'}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-secondary">
                      {post.updatedAt ? format(parseISO(post.updatedAt), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/blog/preview/${post.id}`} title="Preview">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ExternalLink className="w-4 h-4 text-secondary" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/blog/admin/edit/${post.id}`)} className="h-8 w-8 p-0">
                          <Edit2 className="w-4 h-4 text-secondary" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)} className="h-8 w-8 p-0 hover:text-danger hover:bg-danger/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
