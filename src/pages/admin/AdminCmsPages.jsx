import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, SearchCheck } from 'lucide-react';
import { useAdminPages } from '../../features/cms/hooks';
import Button from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

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
  const { data, isLoading } = useAdminPages({ sort: '-updatedAt', limit: 100 });
  const pages = data?.data?.pages || [];

  const filteredPages = useMemo(() => {
    if (activeTab === 'static') return pages.filter((p) => p.pageType === 'static');
    if (activeTab === 'custom') return pages.filter((p) => p.pageType === 'custom');
    return pages;
  }, [activeTab, pages]);

  const seoRows = useMemo(() => {
    return pages.map((page) => ({ page, ...scorePage(page) })).sort((a, b) => a.score - b.score);
  }, [pages]);

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
                    {page.contentLocked && <p className="text-xs text-amber-700 mt-1">System page - content locked</p>}
                  </TableCell>
                  <TableCell className="font-mono text-xs">/{page.slug}</TableCell>
                  <TableCell className="capitalize">{page.pageType}</TableCell>
                  <TableCell className="capitalize">{page.status || (page.isPublished ? 'published' : 'draft')}</TableCell>
                  <TableCell>{new Date(page.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Link to={page.pageType === 'static' ? `/admin/pages/static/${page.slug}/seo` : `/admin/pages/${page._id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Pencil size={14} className="mr-1" />
                        {page.pageType === 'static' ? 'Edit SEO' : 'Edit'}
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
