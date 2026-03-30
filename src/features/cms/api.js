import api from '../../lib/axios';

export const getPageBySlug = async (slug) => api.get(`/cms/pages/${slug}`);

export const getPages = async (params = {}) => api.get('/cms/pages', { params });

export const getAdminPages = async (params = {}) => api.get('/cms/admin/pages', { params });

export const getPageById = async (id) => api.get('/cms/pages', { params: { _id: id, limit: 1 } });

export const createPage = async (data) => api.post('/cms/pages', data);

export const updatePage = async ({ id, data }) => api.patch(`/cms/pages/id/${id}`, data);

export const deletePage = async (id) => api.delete(`/cms/pages/id/${id}`);

export const submitContact = async (data) => api.post('/cms/contact', data);

export const getContactSubmissions = async (params = {}) => api.get('/cms/contact', { params });

export const updateContactSubmission = async ({ id, data }) => api.patch(`/cms/contact/${id}`, data);

export const getGlobalSeoSettings = async () => api.get('/cms/seo-settings');

export const updateGlobalSeoSettings = async (data) => api.patch('/cms/seo-settings', data);

export const uploadCmsImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/cms/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const createStaticSeoTarget = async (data) => api.post('/cms/static-seo-target', data);
