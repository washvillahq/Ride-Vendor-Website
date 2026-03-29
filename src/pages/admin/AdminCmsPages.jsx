import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { useAdminPages, useCreatePage, useDeletePage, useUpdatePage } from '../../features/cms/hooks';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

const pageSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
  isPublished: z.boolean().default(false),
});

const AdminCmsPages = () => {
  const { data, isLoading } = useAdminPages();
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      slug: '',
      title: '',
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      ogImage: '',
      isPublished: false,
    },
  });

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
      canonicalUrl: '',
      ogImage: '',
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
      canonicalUrl: page.canonicalUrl || '',
      ogImage: page.ogImage || '',
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

  const submitting = isCreating || isUpdating;

  return (
    <div className="space-y-8 pb-20">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-slate-900">CMS Pages</h1>
          <p className="text-slate-500 mt-1">Manage static page content and SEO fields.</p>
        </div>
        <Button onClick={openCreate} className="rounded-xl">
          <Plus size={16} className="mr-2" />
          New Page
        </Button>
      </section>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slug</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page._id}>
                <TableCell className="font-mono text-xs">/{page.slug}</TableCell>
                <TableCell>{page.title}</TableCell>
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
                <TableCell colSpan={5} className="py-10 text-center text-slate-400">
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
        title={editingPage ? 'Edit Page' : 'Create Page'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <Input label="Slug" placeholder="about" {...register('slug')} error={errors.slug} />
          <Input label="Title" placeholder="About RideVendor" {...register('title')} error={errors.title} />
          <Input label="SEO Title" placeholder="About Us" {...register('metaTitle')} error={errors.metaTitle} />
          <div className="space-y-1">
            <label className="text-sm font-medium">Meta Description</label>
            <textarea className="w-full min-h-[90px] rounded-xl border border-slate-200 p-3 text-sm" {...register('metaDescription')} />
          </div>
          <Input label="Canonical URL" placeholder="/about" {...register('canonicalUrl')} error={errors.canonicalUrl} />
          <Input label="OG Image URL" placeholder="https://..." {...register('ogImage')} error={errors.ogImage} />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('isPublished')} />
            Publish immediately
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingPage ? 'Update Page' : 'Create Page'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCmsPages;
