import api from '../../lib/axios';

export const getBlogPosts = async (params = {}) => api.get('/blog/posts', { params });

export const getBlogPostBySlug = async (slug) => api.get(`/blog/posts/${slug}`);

export const getAdminBlogPosts = async (params = {}) => api.get('/blog/admin/posts', { params });

export const createBlogPost = async (data) => api.post('/blog/posts', data);

export const updateBlogPost = async ({ id, data }) => api.patch(`/blog/posts/id/${id}`, data);

export const deleteBlogPost = async (id) => api.delete(`/blog/posts/id/${id}`);
