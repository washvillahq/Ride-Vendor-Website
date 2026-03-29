import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import RichTextEditor from '../../components/ui/RichTextEditor';
import PageSeoSidebar from './components/PageSeoSidebar';
import { useAdminBlogPosts, useCreateBlogPost, useUpdateBlogPost, useUploadBlogImage } from '../../features/blog/hooks';
import SlugField from '../../components/admin/SlugField';
import ImageUploaderField from '../../components/admin/ImageUploaderField';
import { useAutoSlug } from '../../hooks/useAutoSlug';
import SeoFieldsSection from '../../components/admin/SeoFieldsSection';

const AdminBlogEditor = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const isEdit = Boolean(postId);

  const { data } = useAdminBlogPosts({ _id: postId, limit: 1 });
  const post = data?.data?.posts?.[0];

  const { mutateAsync: createPost, isLoading: isCreating } = useCreateBlogPost();
  const { mutateAsync: updatePost, isLoading: isUpdating } = useUpdateBlogPost();
  const { mutateAsync: uploadBlogImage, isLoading: isUploadingImage } = useUploadBlogImage();

  const { register, handleSubmit, setValue, reset, control } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      contentHtml: '',
      coverImage: '',
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      ogImage: '',
      robotsDirective: 'index,follow',
      status: 'draft',
    },
  });

  useEffect(() => {
    if (!post) return;
    reset({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      contentHtml: post.contentHtml || '',
      coverImage: post.coverImage || '',
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      canonicalUrl: post.canonicalUrl || `/blog/${post.slug}`,
      ogImage: post.ogImage || '',
      robotsDirective: post.robotsDirective || 'index,follow',
      status: post.status || 'draft',
    });
  }, [post, reset]);

  const values = useWatch({ control });

  const { slugTouched, onSlugChange, resetSlugFromTitle } = useAutoSlug({
    title: values?.title,
    slug: values?.slug,
    setValue,
    isEdit,
  });

  const handleUploadCoverImage = async (file) => {
    try {
      const response = await uploadBlogImage(file);
      const imageUrl = response?.data?.url;
      if (imageUrl) {
        setValue('coverImage', imageUrl, { shouldDirty: true });
        toast.success('Cover image uploaded');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Image upload failed');
    }
  };

  const handleUploadOgImage = async (file) => {
    try {
      const response = await uploadBlogImage(file);
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
    const response = await uploadBlogImage(file);
    return { url: response?.data?.url };
  };

  const onSubmit = async (formValues) => {
    try {
      if (isEdit) {
        await updatePost({ id: postId, data: formValues });
        toast.success('Blog post updated');
      } else {
        await createPost(formValues);
        toast.success('Blog post created');
      }
      navigate('/admin/blog');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save blog post');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <section>
        <h1 className="text-3xl font-medium text-slate-900">{isEdit ? 'Edit Blog Post' : 'Create Blog Post'}</h1>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Post Title" {...register('title')} />
              <SlugField
                value={values?.slug || ''}
                onChange={onSlugChange}
                onResetFromTitle={resetSlugFromTitle}
                touched={slugTouched}
              />
            </div>
            <Textarea label="Excerpt" rows={3} {...register('excerpt')} />
            <ImageUploaderField
              label="Cover Image"
              value={values?.coverImage || ''}
              isUploading={isUploadingImage}
              onUpload={handleUploadCoverImage}
              onClear={() => setValue('coverImage', '', { shouldDirty: true })}
            />

            <RichTextEditor
              label="Post Content"
              value={values?.contentHtml || ''}
              onChange={(content) => setValue('contentHtml', content, { shouldDirty: true })}
              onUploadImage={handleEditorImageUpload}
            />

            <div className="flex items-center justify-between pt-2">
              <select className="h-10 px-3 rounded-md border border-slate-200 text-sm" {...register('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/blog')}>Cancel</Button>
                <Button type="submit" isLoading={isCreating || isUpdating}>{isEdit ? 'Save Post' : 'Create Post'}</Button>
              </div>
            </div>
          </div>

          <SeoFieldsSection
            register={register}
            values={values}
            setValue={setValue}
            isUploadingImage={isUploadingImage}
            onUploadOgImage={handleUploadOgImage}
            includeFocusKeyword={false}
            canonicalPlaceholder="/blog/post-slug"
          />
        </div>

        <PageSeoSidebar
          slug={`blog/${values?.slug || ''}`}
          metaTitle={values?.metaTitle}
          metaDescription={values?.metaDescription}
          ogImage={values?.ogImage}
          focusKeyword={''}
        />
      </form>
    </div>
  );
};

export default AdminBlogEditor;
