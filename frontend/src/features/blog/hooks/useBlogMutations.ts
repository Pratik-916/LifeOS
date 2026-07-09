import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../api/blog';
import { blogKeys } from '../api/blog.keys';
import { NotificationService as toast } from '../../../services/notificationService';
import type { UpdateBlogPostPayload } from '../api/blog.types';

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: blogApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      toast.success('Post Created', 'New draft has been created successfully.');
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBlogPostPayload }) => blogApi.updatePost(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      // Don't toast on every autosave, components should handle autosave toasts
    },
  });
};

export const usePublishPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => blogApi.publishPost(id),
    onSuccess: (_, _id) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all }); // Invalidate everything since it affects public lists
      toast.success('Post Published', 'Your post is now live.');
    },
  });
};

export const useFeaturePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) => blogApi.featurePost(id, featured),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.featured() });
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};

// Optimistic Delete/Restore pattern similar to Planner/Goals
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => blogApi.deletePost(id),
    onMutate: async (_deletedId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: blogKeys.lists() });
      
      // Snapshot the previous value
      const previousLists = queryClient.getQueriesData({ queryKey: blogKeys.lists() });
      
      toast.success('Post Deleted', 'Post has been moved to trash.');
      
      return { previousLists };
    },
    onError: (err, deletedId, context: any) => {
      // Rollback
      if (context?.previousLists) {
        context.previousLists.forEach(([key, data]: any) => {
          queryClient.setQueryData(key, data);
        });
      }
      toast.error('Delete Failed', 'Could not delete the post.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.statistics() });
    },
  });
};

export const useRestorePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => blogApi.restorePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.statistics() });
      toast.success('Post Restored', 'The post was successfully restored.');
    },
  });
};
