import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as blogApi from './api';

const BLOG_KEYS = {
  posts: ['blog', 'posts'],
  post: (slug) => ['blog', 'post', slug],
  adminPosts: ['blog', 'admin-posts'],
};

export const useBlogPosts = (params = {}) => {
  return useQuery({
    queryKey: [...BLOG_KEYS.posts, params],
    queryFn: () => blogApi.getBlogPosts(params),
  });
};

export const useBlogPost = (slug) => {
  return useQuery({
    queryKey: BLOG_KEYS.post(slug),
    queryFn: () => blogApi.getBlogPostBySlug(slug),
    enabled: Boolean(slug),
  });
};

export const useAdminBlogPosts = (params = {}) => {
  return useQuery({
    queryKey: [...BLOG_KEYS.adminPosts, params],
    queryFn: () => blogApi.getAdminBlogPosts(params),
  });
};

export const useCreateBlogPost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: blogApi.createBlogPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BLOG_KEYS.adminPosts });
      qc.invalidateQueries({ queryKey: BLOG_KEYS.posts });
    },
  });
};

export const useUpdateBlogPost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: blogApi.updateBlogPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BLOG_KEYS.adminPosts });
      qc.invalidateQueries({ queryKey: BLOG_KEYS.posts });
    },
  });
};

export const useDeleteBlogPost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: blogApi.deleteBlogPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BLOG_KEYS.adminPosts });
      qc.invalidateQueries({ queryKey: BLOG_KEYS.posts });
    },
  });
};

export const useUploadBlogImage = () => {
  return useMutation({
    mutationFn: blogApi.uploadBlogImage,
  });
};
