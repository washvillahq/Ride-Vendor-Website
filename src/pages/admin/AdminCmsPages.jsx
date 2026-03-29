import React, { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useAdminPages, useCreatePage, useDeletePage, useUpdatePage } from '../../features/cms/hooks';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 160;

const pageSchema = z.object({
  slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers, and hyphens only'),
  title: z.string().min(2, 'Page title is required'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  focusKeyword: z.string().optional(),
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
  robotsDirective: z.enum(['index,follow', 'noindex,follow', 'noindex,nofollow']),
  isPublished: z.boolean().default(false),
});

const getSeoHealth = (values) => {
  let score = 100;
  const issues = [];

  const seoTitle = (values.metaTitle || values.title || '').trim();
  const seoDescription = (values.metaDescription || '').trim();
  const canonical = (values.canonicalUrl || '').trim();

  if (!seoTitle) {
    score -= 35;
    issues.push('Add an SEO title so Google knows your page topic.');
  } else if (seoTitle.length < TITLE_MIN || seoTitle.length > TITLE_MAX) {
    score -= 15;
    issues.push(`Keep SEO title between ${TITLE_MIN}-${TITLE_MAX} characters for best visibility.`);
  }

  if (!seoDescription) {
    score -= 25;
    issues.push('Add a meta description to improve click-through rates.');
  } else if (seoDescription.length < DESC_MIN || seoDescription.length > DESC_MAX) {
    score -= 10;
    issues.push(`Keep meta description between ${DESC_MIN}-${DESC_MAX} characters.`);
  }

  if (!values.ogImage) {
    score -= 10;
    issues.push('Add a social image to improve sharing previews.');
  }

  if (canonical && !canonical.startsWith('/')) {
    try {
      new URL(canonical);
    } catch {
      score -= 10;
      issues.push('Canonical URL must be a full URL (https://...) or path (/about).');
    }
  }

  if (!values.focusKeyword) {
    score -= 10;
    issues.push('Add a focus keyword to guide your page optimization.');
  }

  return {
    score: Math.max(0, score),
    issues,
  };
};

const CounterHint = ({ current, min, max }) => {
  const isGood = current >= min && current <= max;
  return (
    <p className={`text-xs mt-1 ${isGood ? 'text-emerald-600' : 'text-amber-600'}`}>
      {current} chars (recommended {min}-{max})
    </p>
  );
};

const AdminCmsPages = () => {
  const { data, isLoading } = useAdminPages({ sort: '-updatedAt' });
  const pages = data?.data?.pages || [];

  const [editingPage, setEditingPage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutateAsync: createPage, isLoading: isCreating } = useCreatePage();
  const { mutateAsync: updatePage, isLoading: isUpdating } = useUpdatePage();
  const { mutateAsync: deletePage } = useDeletePage();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      slug: '',
      title: '',
      metaTitle: '',
      metaDescription: '',
      focusKeyword: '',
      canonicalUrl: '',
      ogImage: '',
      robotsDirective: 'index,follow',
      isPublished: false,
    },
  });

  const formValues = useWatch({ control });
  const seoTitle = (formValues?.metaTitle || formValues?.title || '').trim();
  const seoDescription = (formValues?.metaDescription || '').trim();
  const seoHealth = useMemo(() => getSeoHealth(formValues || {}), [formValues]);
  const submitLabel = isCreating || isUpdating ? 'Saving...' : editingPage ? 'Save Changes' : 'Create Page';

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        slug: values.slug.toLowerCase().trim(),
      };

      if (editingPage) {
        await updatePage({ id: editingPage._id, data: payload });
        toast.success('Page updated');
      } else {
        await createPage(payload);
        toast.success('Page created');
      }

      setIsModalOpen(false);
      setEditingPage(null);
      reset();
    } catch (error) {
      toast.error(error.message || 'Unable to save page');
    }
  };

  const openCreate = () => {
    setEditingPage(null);
    reset({
      slug: '',
      title: '',
      metaTitle: '',
      metaDescription: '',
      focusKeyword: '',
      canonicalUrl: '',
      ogImage: '',
      robotsDirective: 'index,follow',
      isPublished: false,
    });
    setIsModalOpen(true);
  };

  const openEdit = (page) => {
    setEditingPage(page);
    reset({
      slug: page.slug || '',
      title: page.title || '',
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      focusKeyword: page.focusKeyword || '',
      canonicalUrl: page.canonicalUrl || '',
      ogImage: page.ogImage || '',
      robotsDirective: page.robotsDirective || 'index,follow',
      isPublished: Boolean(page.isPublished),
    });
    setIsModalOpen(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this page?')) return;
    try {
      await deletePage(id);
      toast.success('Page deleted');
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-slate-900">SEO Control Center</h1>
          <p className="text-slate-500 mt-1">Edit page SEO without code, preview instantly, then publish.</p>
        </div>
        <Button onClick={openCreate} className="rounded-xl">
          <Plus size={16} className="mr-2" />
          New SEO Page
        </Button>
      </section>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page URL</TableHead>
              <TableHead>SEO Title</TableHead>
              <TableHead>Keyword</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page._id}>
                <TableCell className="font-mono text-xs">/{page.slug}</TableCell>
                <TableCell className="max-w-[260px] truncate">{page.metaTitle || page.title}</TableCell>
                <TableCell>{page.focusKeyword || '—'}</TableCell>
                <TableCell>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${page.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {page.isPublished ? 'Published' : 'Draft'}
                  </span>
                </TableCell>
                <TableCell>{new Date(page.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <button onClick={() => openEdit(page)} className="p-2 text-slate-500 hover:text-black">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => onDelete(page._id)} className="p-2 text-slate-500 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && pages.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-slate-400">
                  No pages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPage ? 'Edit SEO Page' : 'Create SEO Page'}
        maxWidth="6xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-3">
          <div className="space-y-4">
            <div>
              <Input label="Page slug" placeholder="about" {...register('slug')} error={errors.slug} />
              <p className="text-xs text-slate-500 mt-1">Example: about-us</p>
            </div>
            <div>
              <Input label="Page heading" placeholder="About RideVendor" {...register('title')} error={errors.title} />
              <p className="text-xs text-slate-500 mt-1">Main title shown in page content.</p>
            </div>
            <div>
              <Input label="SEO title" placeholder="About Us - RideVendor" {...register('metaTitle')} error={errors.metaTitle} />
              <p className="text-xs text-slate-500 mt-1">Headline shown on Google results.</p>
            </div>
            <CounterHint current={seoTitle.length} min={TITLE_MIN} max={TITLE_MAX} />

            <div>
              <Textarea
                label="SEO description"
                placeholder="Reliable car hire and auto services in Ilorin..."
                rows={4}
                {...register('metaDescription')}
                error={errors.metaDescription}
              />
              <p className="text-xs text-slate-500 mt-1">Summary shown below your title on Google.</p>
            </div>
            <CounterHint current={seoDescription.length} min={DESC_MIN} max={DESC_MAX} />

            <div>
              <Input
                label="Focus keyword"
                placeholder="car hire in ilorin"
                {...register('focusKeyword')}
                error={errors.focusKeyword}
              />
              <p className="text-xs text-slate-500 mt-1">Main search phrase this page should rank for.</p>
            </div>

            <div>
              <Input
                label="Canonical URL"
                placeholder="/about"
                {...register('canonicalUrl')}
                error={errors.canonicalUrl}
              />
              <p className="text-xs text-slate-500 mt-1">Use /page-slug or full URL like https://ridevendor.com/page-slug.</p>
            </div>

            <div>
              <Input
                label="Social image URL"
                placeholder="https://..."
                {...register('ogImage')}
                error={errors.ogImage}
              />
              <p className="text-xs text-slate-500 mt-1">Image used when this page is shared on social media.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Search engine indexing</label>
              <select
                className="w-full rounded-md border border-slate-200 h-10 px-3 text-sm"
                {...register('robotsDirective')}
              >
                <option value="index,follow">Index this page (recommended)</option>
                <option value="noindex,follow">Do not index, but follow links</option>
                <option value="noindex,nofollow">Do not index and do not follow links</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('isPublished')} />
              Publish immediately
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isCreating || isUpdating}>
                {submitLabel}
              </Button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">SEO Health</h3>
                <span className={`text-sm font-bold ${seoHealth.score >= 85 ? 'text-emerald-600' : seoHealth.score >= 65 ? 'text-amber-600' : 'text-red-600'}`}>
                  {seoHealth.score}/100
                </span>
              </div>
              {seoHealth.issues.length === 0 ? (
                <p className="text-sm text-emerald-700 mt-3">Looks great. This page is ready to publish.</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {seoHealth.issues.map((issue) => (
                    <li key={issue}>- {issue}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 bg-white">
              <h3 className="text-sm font-semibold text-slate-900">Google preview</h3>
              <p className="text-xs text-slate-400 mt-1">How your page may appear in search results.</p>
              <div className="mt-4">
                <p className="text-[#1a0dab] text-[20px] leading-snug line-clamp-2">{seoTitle || 'Your SEO title will appear here'}</p>
                <p className="text-[#006621] text-sm mt-1">ridevendor.com/{formValues?.slug || 'page-slug'}</p>
                <p className="text-[#545454] text-sm mt-2 line-clamp-3">
                  {seoDescription || 'Your meta description will appear here once you write one.'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 bg-white">
              <h3 className="text-sm font-semibold text-slate-900">Social preview</h3>
              <p className="text-xs text-slate-400 mt-1">How shared links may look on social media.</p>
              <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 h-32 flex items-center justify-center text-xs text-slate-400">
                  {formValues?.ogImage ? 'Custom social image set' : 'No social image added'}
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase text-slate-400">ridevendor.com</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1 line-clamp-2">{seoTitle || 'Your social title preview'}</p>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                    {seoDescription || 'Your social description preview'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCmsPages;
