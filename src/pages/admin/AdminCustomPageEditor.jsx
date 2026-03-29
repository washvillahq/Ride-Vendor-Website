import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import RichTextEditor from '../../components/ui/RichTextEditor';
import { useAdminPageById, useCreatePage, useUpdatePage } from '../../features/cms/hooks';
import PageSeoSidebar from './components/PageSeoSidebar';

const AdminCustomPageEditor = () => {
  const navigate = useNavigate();
  const { pageId } = useParams();
  const isEdit = Boolean(pageId);

  const { data: pageResponse, isLoading: isPageLoading } = useAdminPageById(pageId);
  const page = pageResponse?.data;

  const { mutateAsync: createPage, isLoading: isCreating } = useCreatePage();
  const { mutateAsync: updatePage, isLoading: isUpdating } = useUpdatePage();

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
              <Input label="URL Slug" placeholder="fleet-leasing" {...register('slug')} />
            </div>

            <RichTextEditor
              label="Page Content"
              value={values?.contentHtml || ''}
              onChange={(content) => setValue('contentHtml', content, { shouldDirty: true })}
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

          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900">SEO Settings</h2>
            <Input label="SEO Title" placeholder="Fleet Leasing in Ilorin" {...register('metaTitle')} />
            <Textarea label="Meta Description" rows={4} {...register('metaDescription')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Focus Keyword" {...register('focusKeyword')} />
              <Input label="Canonical URL" placeholder="/fleet-leasing" {...register('canonicalUrl')} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="OG Image URL" placeholder="https://..." {...register('ogImage')} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Robots</label>
                <select className="h-10 px-3 rounded-md border border-slate-200 text-sm w-full" {...register('robotsDirective')}>
                  <option value="index,follow">Index and follow</option>
                  <option value="noindex,follow">Noindex, follow</option>
                  <option value="noindex,nofollow">Noindex, nofollow</option>
                </select>
              </div>
            </div>
          </div>
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
