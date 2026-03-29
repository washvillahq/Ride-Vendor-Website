import api from '../../lib/axios';

export const getPageBySlug = async (slug) => api.get(`/cms/pages/${slug}`);

export const getPages = async (params = {}) => api.get('/cms/pages', { params });

export const createPage = async (data) => api.post('/cms/pages', data);

export const updatePage = async ({ id, data }) => api.patch(`/cms/pages/id/${id}`, data);

export const deletePage = async (id) => api.delete(`/cms/pages/id/${id}`);

export const submitContact = async (data) => api.post('/cms/contact', data);

export const getContactSubmissions = async (params = {}) => api.get('/cms/contact', { params });

export const updateContactSubmission = async ({ id, data }) => api.patch(`/cms/contact/${id}`, data);

export const getGlobalSeoSettings = async () => api.get('/cms/seo-settings');

export const updateGlobalSeoSettings = async (data) => api.patch('/cms/seo-settings', data);
