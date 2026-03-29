import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import RichTextEditor from '../../components/ui/RichTextEditor';
import { useAdminPageById, useCreatePage, useUpdatePage, useUploadCmsImage } from '../../features/cms/hooks';
import PageSeoSidebar from './components/PageSeoSidebar';
import SlugField from '../../components/admin/SlugField';
import { useAutoSlug } from '../../hooks/useAutoSlug';
import SeoFieldsSection from '../../components/admin/SeoFieldsSection';

const AdminCustomPageEditor = () => {
  const navigate = useNavigate();
  const { pageId } = useParams();
  const isEdit = Boolean(pageId);

  const { data: pageResponse, isLoading: isPageLoading } = useAdminPageById(pageId);
  const page = pageResponse?.data;

  const { mutateAsync: createPage, isLoading: isCreating } = useCreatePage();
  const { mutateAsync: updatePage, isLoading: isUpdating } = useUpdatePage();
  const { mutateAsync: uploadCmsImage, isLoading: isUploadingImage } = useUploadCmsImage();

  const { register, handleSubmit, setValue, reset, control } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      contentHtml: '',
      metaTitle: '',
      metaDescription: '',
      focusKeyword: '',
      canonicalUrl: '',
      ogImage: '',
      robotsDirective: 'index,follow',
      status: 'draft',
    },
  });

  useEffect(() => {
    if (!page) return;
    reset({
      title: page.title || '',
      slug: page.slug || '',
      contentHtml: page.contentHtml || '',
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      focusKeyword: page.focusKeyword || '',
      canonicalUrl: page.canonicalUrl || '',
      ogImage: page.ogImage || '',
      robotsDirective: page.robotsDirective || 'index,follow',
      status: page.status || (page.isPublished ? 'published' : 'draft'),
    });
  }, [page, reset]);

  const values = useWatch({ control });

  const { slugTouched, onSlugChange, resetSlugFromTitle } = useAutoSlug({
    title: values?.title,
    slug: values?.slug,
    setValue,
    isEdit,
  });

  const handleUploadOgImage = async (file) => {
    try {
      const response = await uploadCmsImage(file);
      const imageUrl = response?.data?.url;
      if (imageUrl) {
        setValue('ogImage', imageUrl, { shouldDirty: true });
        toast.success('Image uploaded');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Image upload failed');
    }
  };

  const handleEditorImageUpload = async (file) => {
    const response = await uploadCmsImage(file);
    return { url: response?.data?.url };
  };

  const onSubmit = async (formValues) => {
    try {
      const payload = {
        ...formValues,
        pageType: 'custom',
        contentLocked: false,
      };

      if (isEdit) {
        await updatePage({ id: pageId, data: payload });
        toast.success('Page updated');
      } else {
        await createPage(payload);
        toast.success('Page created');
      }

      navigate('/admin/pages');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to save page');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-slate-900">{isEdit ? 'Edit Custom Page' : 'Create Custom Page'}</h1>
          <p className="text-slate-500 mt-1">Create content with WYSIWYG and manage SEO in one place.</p>
        </div>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Page Title" placeholder="Fleet Leasing" {...register('title')} />
              <SlugField
                value={values?.slug || ''}
                onChange={onSlugChange}
                onResetFromTitle={resetSlugFromTitle}
                touched={slugTouched}
              />
            </div>

            <RichTextEditor
              label="Page Content"
              value={values?.contentHtml || ''}
              onChange={(content) => setValue('contentHtml', content, { shouldDirty: true })}
              onUploadImage={handleEditorImageUpload}
            />

            <div className="flex items-center justify-between gap-3 pt-2">
              <select
                className="h-10 px-3 rounded-md border border-slate-200 text-sm"
                {...register('status')}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/pages')}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isCreating || isUpdating || isPageLoading}>
                  {isEdit ? 'Save Page' : 'Create Page'}
                </Button>
              </div>
            </div>
          </div>

          <SeoFieldsSection
            register={register}
            values={values}
            setValue={setValue}
            isUploadingImage={isUploadingImage}
            onUploadOgImage={handleUploadOgImage}
            includeFocusKeyword
            canonicalPlaceholder="/fleet-leasing"
          />
        </div>

        <PageSeoSidebar
          slug={values?.slug}
          metaTitle={values?.metaTitle}
          metaDescription={values?.metaDescription}
          ogImage={values?.ogImage}
          focusKeyword={values?.focusKeyword}
        />
      </form>
    </div>
  );
};

export default AdminCustomPageEditor;
