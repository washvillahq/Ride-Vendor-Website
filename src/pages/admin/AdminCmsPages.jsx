import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, SearchCheck, X } from 'lucide-react';
import { useAdminPages, useCreateStaticSeoTarget } from '../../features/cms/hooks';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { toast } from 'react-hot-toast';

const TABS = [
  { id: 'all', label: 'All Pages' },
  { id: 'static', label: 'Static Pages' },
  { id: 'custom', label: 'Custom Pages' },
  { id: 'seo', label: 'SEO Control Center' },
];

const scorePage = (page) => {
  let score = 100;
  const issues = [];
  if (!page.metaTitle) {
    score -= 30;
    issues.push('Missing SEO title');
  }
  if (!page.metaDescription) {
    score -= 25;
    issues.push('Missing meta description');
  }
  if (!page.ogImage) {
    score -= 20;
    issues.push('Missing social image');
  }
  if (!page.focusKeyword) {
    score -= 15;
    issues.push('Missing focus keyword');
  }
  if (!page.canonicalUrl) {
    score -= 10;
    issues.push('Missing canonical URL');
  }
  return { score: Math.max(0, score), issues };
};

const AdminCmsPages = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showAddTarget, setShowAddTarget] = useState(false);
  const [newTarget, setNewTarget] = useState({ slug: '', title: '' });
  const { data, isLoading } = useAdminPages({ sort: '-updatedAt', limit: 100 });
  const { mutateAsync: createStaticSeoTarget, isLoading: isCreating } = useCreateStaticSeoTarget();
  const pages = data?.data?.pages || [];

  const filteredPages = useMemo(() => {
    if (activeTab === 'static') return pages.filter((p) => p.pageType === 'static');
    if (activeTab === 'custom') return pages.filter((p) => p.pageType === 'custom');
    return pages;
  }, [activeTab, pages]);

  const seoRows = useMemo(() => {
    return pages.map((page) => ({ page, ...scorePage(page) })).sort((a, b) => a.score - b.score);
  }, [pages]);

  const handleAddTarget = async (e) => {
    e.preventDefault();
    if (!newTarget.slug || !newTarget.title) {
      toast.error('Please fill in both slug and title');
      return;
    }
    try {
      await createStaticSeoTarget(newTarget);
      toast.success('Static SEO target created');
      setShowAddTarget(false);
      setNewTarget({ slug: '', title: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create target');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-slate-900">Pages</h1>
          <p className="text-slate-500 mt-1">Manage static and custom pages with a WordPress-style workflow.</p>
        </div>
        <Link to="/admin/pages/new">
          <Button>
            <Plus size={16} className="mr-2" />
            Add New Page
          </Button>
        </Link>
      </section>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        {activeTab === 'seo' && (
          <Button variant="outline" onClick={() => setShowAddTarget(true)}>
            <Plus size={16} className="mr-2" />
            Add Static SEO Target
          </Button>
        )}
        {activeTab !== 'seo' && <div />}
      </div>

      {showAddTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Static SEO Target</h3>
              <button onClick={() => setShowAddTarget(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTarget} className="space-y-4">
              <Input
                label="Slug"
                placeholder="e.g. my-page"
                value={newTarget.slug}
                onChange={(e) => setNewTarget({ ...newTarget, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              />
              <Input
                label="Page Title"
                placeholder="e.g. My Page"
                value={newTarget.title}
                onChange={(e) => setNewTarget({ ...newTarget, title: e.target.value })}
              />
              <p className="text-xs text-slate-500">This will create a static page entry that can be edited for SEO from the Admin Pages list.</p>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddTarget(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" isLoading={isCreating} className="flex-1">
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'seo' ? (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SEO Score</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seoRows.map(({ page, score, issues }) => (
                <TableRow key={page._id}>
                  <TableCell>
                    <p className="font-medium text-slate-900">{page.title}</p>
                    <p className="font-mono text-xs text-slate-500">/{page.slug}</p>
                  </TableCell>
                  <TableCell className="capitalize">{page.pageType}</TableCell>
                  <TableCell className="capitalize">{page.status || (page.isPublished ? 'published' : 'draft')}</TableCell>
                  <TableCell>
                    <span className={`text-sm font-semibold ${score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {score}/100
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{issues[0] || 'No major issues'}</TableCell>
                  <TableCell className="text-right">
                    <Link to={page.pageType === 'static' ? `/admin/pages/static/${page.slug}/seo` : `/admin/pages/${page._id}/edit`}>
                      <Button variant="outline" size="sm">
                        <SearchCheck size={14} className="mr-1" />
                        Fix SEO
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map((page) => (
                <TableRow key={page._id}>
                  <TableCell>
                    <p className="font-medium text-slate-900">{page.title}</p>
                    {page.contentLocked === false && <p className="text-xs text-emerald-700 mt-1">Content managed</p>}
                    {page.contentLocked === true && <p className="text-xs text-amber-700 mt-1">System page - content locked</p>}
                  </TableCell>
                  <TableCell className="font-mono text-xs">/{page.slug}</TableCell>
                  <TableCell className="capitalize">{page.pageType}</TableCell>
                  <TableCell className="capitalize">{page.status || (page.isPublished ? 'published' : 'draft')}</TableCell>
                  <TableCell>{new Date(page.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Link to={
                      page.pageType === 'static'
                        ? (page.contentLocked === false
                          ? `/admin/pages/visual/${page.slug}/edit`
                          : `/admin/pages/static/${page.slug}/seo`)
                        : `/admin/pages/${page._id}/edit`
                    }>
                      <Button variant="outline" size="sm">
                        <Pencil size={14} className="mr-1" />
                        {page.pageType === 'static' ? (page.contentLocked === false ? 'Edit' : 'Edit SEO') : 'Edit'}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && filteredPages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                    No pages in this tab.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminCmsPages;
