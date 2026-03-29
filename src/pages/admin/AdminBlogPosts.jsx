import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAdminBlogPosts, useDeleteBlogPost } from '../../features/blog/hooks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

const AdminBlogPosts = () => {
  const [tab, setTab] = useState('all');
  const { data, isLoading } = useAdminBlogPosts({ sort: '-updatedAt', limit: 100 });
  const posts = data?.data?.posts || [];
  const { mutateAsync: deletePost } = useDeleteBlogPost();

  const filtered = tab === 'all' ? posts : posts.filter((p) => p.status === tab);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await deletePost(id);
      toast.success('Blog post deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-slate-900">Blog</h1>
          <p className="text-slate-500 mt-1">Manage blog posts in a WordPress-style flow.</p>
        </div>
        <Link to="/admin/blog/new">
          <Button>
            <Plus size={16} className="mr-2" />
            Add New Post
          </Button>
        </Link>
      </section>

      <div className="flex gap-2">
        {['all', 'draft', 'published'].map((value) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              tab === value ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((post) => (
              <TableRow key={post._id}>
                <TableCell className="font-medium text-slate-900">{post.title}</TableCell>
                <TableCell className="font-mono text-xs">/{post.slug}</TableCell>
                <TableCell className="capitalize">{post.status}</TableCell>
                <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Link to={`/admin/blog/${post._id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil size={14} className="mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(post._id)}>
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-400">No blog posts in this tab.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBlogPosts;
