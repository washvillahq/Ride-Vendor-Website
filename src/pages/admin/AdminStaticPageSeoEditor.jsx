import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import RichTextEditor from '../../components/ui/RichTextEditor';
import { useCmsPage, useUpdatePage, useUploadCmsImage } from '../../features/cms/hooks';
import PageSeoSidebar from './components/PageSeoSidebar';
import ImageUploaderField from '../../components/admin/ImageUploaderField';

const AdminStaticPageSeoEditor = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data: pageData } = useCmsPage(slug);
  const page = pageData?.data;
  const { mutateAsync: updatePage, isLoading } = useUpdatePage();
  const { mutateAsync: uploadCmsImage, isLoading: isUploadingImage } = useUploadCmsImage();

  const isContentManaged = page?.contentLocked === false;

  const { register, handleSubmit, reset, setValue, control } = useForm({
    defaultValues: {
      title: '',
      contentHtml: '',
      metaTitle: '',
      metaDescription: '',
      focusKeyword: '',
      canonicalUrl: '',
      ogImage: '',
      robotsDirective: 'index,follow',
      status: 'published',
    },
  });

  useEffect(() => {
    if (!page) return;
    reset({
      title: page.title || '',
      contentHtml: page.contentHtml || '',
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      focusKeyword: page.focusKeyword || '',
      canonicalUrl: page.canonicalUrl || `/${page.slug}`,
      ogImage: page.ogImage || '',
      robotsDirective: page.robotsDirective || 'index,follow',
      status: page.status || 'published',
    });
  }, [page, reset]);

  const values = useWatch({ control });

  const handleUploadOgImage = async (file) => {
    try {
      const response = await uploadCmsImage(file);
      const imageUrl = response?.data?.url;
      if (imageUrl) {
        setValue('ogImage', imageUrl, { shouldDirty: true });
        toast.success('Social image uploaded');
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
        title: formValues.title,
        metaTitle: formValues.metaTitle,
        metaDescription: formValues.metaDescription,
        focusKeyword: formValues.focusKeyword,
        canonicalUrl: formValues.canonicalUrl,
        ogImage: formValues.ogImage,
        robotsDirective: formValues.robotsDirective,
        status: formValues.status,
      };

      if (isContentManaged) {
        payload.contentHtml = formValues.contentHtml;
      }

      await updatePage({
        id: page._id,
        data: payload,
      });
      toast.success('Page updated');
      navigate('/admin/pages');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update page');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <section>
        <h1 className="text-3xl font-medium text-slate-900">
          {isContentManaged ? 'Edit Static Page' : 'Edit Static Page SEO'}
        </h1>
        <p className="text-slate-500 mt-1">
          {isContentManaged
            ? 'Edit page content and SEO settings.'
            : 'This is a system page. Content is locked; SEO can be edited.'}
        </p>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          {!isContentManaged && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              System page: content editing is disabled for static pages.
            </div>
          )}

          {/* Hidden inputs to ensure RHF registers fields set only via setValue */}
          <input type="hidden" {...register('ogImage')} />
          <input type="hidden" {...register('contentHtml')} />

          <Input label="Page Name" {...register('title')} />

          {isContentManaged && (
            <RichTextEditor
              label="Page Content"
              value={values?.contentHtml || ''}
              onChange={(content) => setValue('contentHtml', content, { shouldDirty: true })}
              onUploadImage={handleEditorImageUpload}
            />
          )}

          <Input label="SEO Title" {...register('metaTitle')} />
          <Textarea label="Meta Description" rows={4} {...register('metaDescription')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Focus Keyword" {...register('focusKeyword')} />
            <Input label="Canonical URL" {...register('canonicalUrl')} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploaderField
              label="Social Image"
              value={values?.ogImage || ''}
              isUploading={isUploadingImage}
              onUpload={handleUploadOgImage}
              onClear={() => setValue('ogImage', '', { shouldDirty: true })}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Robots</label>
              <select className="h-10 px-3 rounded-md border border-slate-200 text-sm w-full" {...register('robotsDirective')}>
                <option value="index,follow">Index and follow</option>
                <option value="noindex,follow">Noindex, follow</option>
                <option value="noindex,nofollow">Noindex, nofollow</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/pages')}>
              Back
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {isContentManaged ? 'Save Page' : 'Save SEO'}
            </Button>
          </div>
        </div>

        <PageSeoSidebar
          slug={slug}
          metaTitle={values?.metaTitle}
          metaDescription={values?.metaDescription}
          ogImage={values?.ogImage}
          focusKeyword={values?.focusKeyword}
        />
      </form>
    </div>
  );
};

export default AdminStaticPageSeoEditor;
