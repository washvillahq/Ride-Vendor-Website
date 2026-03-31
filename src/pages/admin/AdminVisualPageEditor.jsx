import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Puck, createUsePuck } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import { toast } from 'react-hot-toast';
import { X, Settings } from 'lucide-react';
import puckConfig from '../../features/cms/puck-config';
import { useCmsPage, useUpdatePage, useUploadCmsImage } from '../../features/cms/hooks';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import ImageUploaderField from '../../components/admin/ImageUploaderField';
import PageSeoSidebar from './components/PageSeoSidebar';

const usePuck = createUsePuck();

const EMPTY_DATA = { content: [], root: { props: {} }, zones: {} };

const buildSeoFromPage = (page) => ({
  title: page?.title || '',
  metaTitle: page?.metaTitle || '',
  metaDescription: page?.metaDescription || '',
  focusKeyword: page?.focusKeyword || '',
  canonicalUrl: page?.canonicalUrl || (page?.slug ? `/${page.slug}` : ''),
  ogImage: page?.ogImage || '',
  robotsDirective: page?.robotsDirective || 'index,follow',
  status: page?.status || 'published',
});

const IframeWrapper = ({ children, document: iframeDoc }) => {
  useEffect(() => {
    if (iframeDoc) {
      const link = iframeDoc.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@3/dist/tailwind.min.css';
      iframeDoc.head.appendChild(link);
    }
  }, [iframeDoc]);

  return <>{children}</>;
};

const SeoModal = ({ page, isOpen, onClose, onSave, isSaving }) => {
  const initialSeo = useMemo(() => buildSeoFromPage(page), [page]);
  const [seo, setSeo] = useState(initialSeo);
  const { mutateAsync: uploadCmsImage, isLoading: isUploadingImage } = useUploadCmsImage();

  // Reset seo state when the initial values change (page refetch)
  useEffect(() => {
    setSeo(initialSeo);
  }, [initialSeo]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setSeo((prev) => ({ ...prev, [field]: value }));
  };

  const handleUploadOgImage = async (file) => {
    try {
      const response = await uploadCmsImage(file);
      const imageUrl = response?.data?.url;
      if (imageUrl) {
        handleChange('ogImage', imageUrl);
        toast.success('Social image uploaded');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Image upload failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">SEO Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
          <div className="xl:col-span-2 space-y-4">
            <Input
              label="Page Title"
              value={seo.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <Input
              label="SEO Title"
              value={seo.metaTitle}
              onChange={(e) => handleChange('metaTitle', e.target.value)}
            />
            <Textarea
              label="Meta Description"
              rows={3}
              value={seo.metaDescription}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Focus Keyword"
                value={seo.focusKeyword}
                onChange={(e) => handleChange('focusKeyword', e.target.value)}
              />
              <Input
                label="Canonical URL"
                value={seo.canonicalUrl}
                onChange={(e) => handleChange('canonicalUrl', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploaderField
                label="Social Image"
                value={seo.ogImage}
                isUploading={isUploadingImage}
                onUpload={handleUploadOgImage}
                onClear={() => handleChange('ogImage', '')}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Robots</label>
                <select
                  className="h-10 px-3 rounded-md border border-slate-200 text-sm w-full"
                  value={seo.robotsDirective}
                  onChange={(e) => handleChange('robotsDirective', e.target.value)}
                >
                  <option value="index,follow">Index and follow</option>
                  <option value="noindex,follow">Noindex, follow</option>
                  <option value="noindex,nofollow">Noindex, nofollow</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Status</label>
              <select
                className="h-10 px-3 rounded-md border border-slate-200 text-sm w-full"
                value={seo.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" isLoading={isSaving} onClick={() => onSave(seo)}>
                Save SEO
              </Button>
            </div>
          </div>

          <PageSeoSidebar
            slug={page?.slug}
            metaTitle={seo.metaTitle}
            metaDescription={seo.metaDescription}
            ogImage={seo.ogImage}
            focusKeyword={seo.focusKeyword}
          />
        </div>
      </div>
    </div>
  );
};

// Custom Publish button that reads editor data via usePuck
const PublishButton = ({ onPublish, isSaving }) => {
  const appState = usePuck((s) => s.appState);

  return (
    <button
      disabled={isSaving}
      onClick={() => onPublish(appState.data)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 20px',
        fontSize: 14,
        fontWeight: 600,
        border: 'none',
        borderRadius: 8,
        background: isSaving ? '#94a3b8' : '#0f172a',
        cursor: isSaving ? 'not-allowed' : 'pointer',
        color: '#fff',
      }}
    >
      {isSaving ? 'Publishing…' : 'Publish'}
    </button>
  );
};

const AdminVisualPageEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: pageData, isLoading: isPageLoading } = useCmsPage(slug);
  const page = pageData?.data;
  const { mutateAsync: updatePage, isLoading: isSaving } = useUpdatePage();

  const [showSeoModal, setShowSeoModal] = useState(false);
  const initialData = useMemo(() => {
    if (!page) return null;
    return page.contentJson || EMPTY_DATA;
  }, [page]);

  const handlePublish = useCallback(
    async (data) => {
      if (!page) return;
      try {
        await updatePage({
          id: page._id,
          data: { contentJson: data },
        });
        toast.success('Page content saved');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to save page');
      }
    },
    [page, updatePage]
  );

  const handleSeoSave = async (seoData) => {
    if (!page) return;
    try {
      await updatePage({
        id: page._id,
        data: seoData,
      });
      toast.success('SEO settings saved');
      setShowSeoModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save SEO');
    }
  };

  if (isPageLoading || !initialData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Puck
        config={puckConfig}
        data={initialData}
        onPublish={handlePublish}
        overrides={{
          headerActions: () => (
            <>
              <button
                onClick={() => setShowSeoModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: 500,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  background: '#fff',
                  cursor: 'pointer',
                  color: '#334155',
                }}
              >
                <Settings size={14} />
                SEO Settings
              </button>
              <button
                onClick={() => navigate('/admin/pages')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: 500,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  background: '#fff',
                  cursor: 'pointer',
                  color: '#334155',
                }}
              >
                Back to Pages
              </button>
              <PublishButton onPublish={handlePublish} isSaving={isSaving} />
            </>
          ),
          iframe: IframeWrapper,
        }}
      />

      <SeoModal
        page={page}
        isOpen={showSeoModal}
        onClose={() => setShowSeoModal(false)}
        onSave={handleSeoSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default AdminVisualPageEditor;
