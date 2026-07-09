# Blog Architecture

## Overview
The Blog module is a production-grade Content Management System (CMS) integrated into LifeOS. It is built strictly following the canonical frontend architecture established in previous modules (Planner, Goals, Habits, Journal, Journey, Analytics).

## Separation of Concerns
The module fundamentally splits into two domains:
1. **Internal CMS (`/blog/admin/*`)**: Authenticated, UUID-based CRUD, debounced auto-saves, draft management, and rich text editing. Protected by `ProtectedRoute`.
2. **Public Blog (`/blog/*`)**: Read-only, SEO-optimized, Slug-based routing. Data is heavily cached and public endpoints only return `published` and `public` visibility posts.

## API Layer & React Query
- **Query Keys**: Structured via `blog.keys.ts` separating lists, details, slugs, featured, searches, and statistics.
- **Cache Strategy**: Public posts, featured content, and statistics cache for 5 minutes (`staleTime: 5 * 60 * 1000`). Categories cache for 10 minutes. The CMS (admin) caches lists for 30 seconds to ensure freshness during editing.
- **Data Transformation**: The backend acts as the single source of truth for all computed stats (word count, reading time, publishing streaks). `blog.mapper.ts` maps `snake_case` Django DTOs strictly into `camelCase` Frontend models.

## Publishing Workflow
The frontend natively supports the backend states: `Draft -> Review -> Scheduled -> Published -> Archived`.
- **Drafts**: Created explicitly or implicitly in the CMS. Edits are auto-saved via debounced `PATCH` requests (1000ms) with visual status indicators (Saving..., Saved, Unsaved).
- **Preview Mode**: Accessible via `/blog/preview/:id`, allows authenticated CMS users to view unpublished drafts exactly as they will look live, without exposing them publicly.
- **Slugs**: Slugs are purely generated and validated by the backend.

## SEO Integration
The frontend reads SEO-specific fields (`seo_title`, `seo_description`, `canonical_url`) from the backend and applies them to the DOM via the `BlogPostView.tsx` component. The frontend does not generate SEO metadata itself, relying entirely on the backend to provide optimized properties.

## Known Limitations & Future Improvements
While the foundation is robust, the following enhancements are planned for future phases (backend support may exist but frontend implementation is deferred):
- **Version History & Revision Diffs**: Ability to rollback to specific prior edits of a post.
- **Collaborative Editing**: Real-time collaborative sessions (requires WebSockets).
- **Scheduled Publishing Queue UI**: Advanced UI to view the timeline of scheduled posts.
- **RSS Feed & Sitemap Generation**: Exposing XML natively.
- **Comment System**: Enabling the underlying `BlogComment` data structure on public posts.
