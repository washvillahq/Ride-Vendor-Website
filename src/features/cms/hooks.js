import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as cmsApi from './api';

const CMS_KEYS = {
  pages: ['cms', 'pages'],
  page: (slug) => ['cms', 'page', slug],
  contact: ['cms', 'contact'],
  seoSettings: ['cms', 'seo-settings'],
};

export const useCmsPage = (slug) => {
  return useQuery({
    queryKey: CMS_KEYS.page(slug),
    queryFn: () => cmsApi.getPageBySlug(slug),
    enabled: Boolean(slug),
    retry: false,
  });
};

export const useAdminPages = (params = {}) => {
  return useQuery({
    queryKey: [...CMS_KEYS.pages, params],
    queryFn: () => cmsApi.getAdminPages(params),
  });
};

export const useAdminPageById = (id) => {
  return useQuery({
    queryKey: [...CMS_KEYS.pages, 'id', id],
    queryFn: async () => {
      const adminResponse = await cmsApi.getAdminPages({ _id: id, limit: 1 });
      return {
        ...adminResponse,
        data: adminResponse?.data?.pages?.[0] || null,
      };
    },
    enabled: Boolean(id),
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cmsApi.createPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_KEYS.pages });
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cmsApi.updatePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_KEYS.pages });
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cmsApi.deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_KEYS.pages });
    },
  });
};

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: cmsApi.submitContact,
  });
};

export const useContactSubmissions = (params = {}) => {
  return useQuery({
    queryKey: [...CMS_KEYS.contact, params],
    queryFn: () => cmsApi.getContactSubmissions(params),
  });
};

export const useUpdateContactSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cmsApi.updateContactSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_KEYS.contact });
    },
  });
};

export const useGlobalSeoSettings = () => {
  return useQuery({
    queryKey: CMS_KEYS.seoSettings,
    queryFn: cmsApi.getGlobalSeoSettings,
  });
};

export const useUpdateGlobalSeoSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cmsApi.updateGlobalSeoSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_KEYS.seoSettings });
    },
  });
};

export const useUploadCmsImage = () => {
  return useMutation({
    mutationFn: cmsApi.uploadCmsImage,
  });
};

export const useCreateStaticSeoTarget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cmsApi.createStaticSeoTarget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_KEYS.pages });
    },
  });
};
