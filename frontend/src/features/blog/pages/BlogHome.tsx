import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePublicBlogPosts, useFeaturedPosts } from '../hooks/useBlogPosts';
import { useCategories } from '../hooks/useCategories';
import { BlogCard } from '../components/BlogCard';
import { PageHeader } from '../../../components/ui/PageHeader';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Search, Hash } from 'lucide-react';
import { useDebounce } from '../../../hooks/useDebounce';

export default function BlogHome() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || undefined;
  const searchParam = searchParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: postsData, isLoading: isLoadingPosts } = usePublicBlogPosts({ 
    category: categoryParam,
    search: debouncedSearchTerm
  });
  
  const { data: featuredPosts, isLoading: isLoadingFeatured } = useFeaturedPosts();
  const { data: categories } = useCategories();

  // Update URL search params cleanly without losing other params
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      params.set('search', debouncedSearchTerm);
    } else {
      params.delete('search');
    }
    setSearchParams(params, { replace: true });
  }, [debouncedSearchTerm, searchParams, setSearchParams]);

  const setCategory = (slug?: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.delete('search'); // Clear search when changing categories
    setSearchTerm('');
    setSearchParams(params);
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-8 overflow-y-auto no-scrollbar pb-12">
      <PageHeader 
        title="Blog" 
        description="Insights, tutorials, and thoughts."
      />

      {/* Featured Section (Hide when filtering) */}
      {!categoryParam && !debouncedSearchTerm && featuredPosts && featuredPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-primary mb-6">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPosts.map(post => (
              <BlogCard key={post.id} post={post} featured />
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Main Content */}
        <div className="flex-1 w-full space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-primary">
              {categoryParam ? `Category: ${categoryParam}` : debouncedSearchTerm ? 'Search Results' : 'Latest Posts'}
            </h2>
          </div>

          {isLoadingPosts ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : !postsData?.results || postsData.results.length === 0 ? (
            <div className="py-20 text-center text-secondary">
              <p>No posts found matching your criteria.</p>
              {(categoryParam || debouncedSearchTerm) && (
                <button onClick={() => setCategory()} className="mt-4 text-accent hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {postsData.results.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8 sticky top-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts..."
              className="w-full bg-surfaceElevated border border-border/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent text-primary transition-colors"
            />
          </div>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
                Categories
              </h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setCategory()}
                    className={`text-sm hover:text-accent transition-colors ${!categoryParam ? 'text-accent font-medium' : 'text-primary'}`}
                  >
                    All Posts
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => setCategory(cat.slug)}
                      className={`text-sm hover:text-accent transition-colors flex items-center gap-2 ${categoryParam === cat.slug ? 'text-accent font-medium' : 'text-primary'}`}
                    >
                      <Hash className="w-3 h-3 opacity-50" />
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
