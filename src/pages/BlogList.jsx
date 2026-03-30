import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useBlogPosts } from '../features/blog/hooks';
import { useCmsPage } from '../features/cms/hooks';

const BlogList = () => {
  const { data: pageData } = useCmsPage('blog');
  const page = pageData?.data;
  const { data, isLoading } = useBlogPosts({ sort: '-publishedAt', limit: 20 });
  const posts = data?.data?.posts || [];

  return (
    <div className="bg-white min-h-screen pb-20">
      <Seo 
        title={page?.title || 'Blog'}
        metaTitle={page?.metaTitle}
        description={page?.metaDescription || 'Insights, updates, and guides from RideVendor.'}
        image={page?.ogImage}
        url={page?.canonicalUrl || '/blog'}
        robots={page?.robotsDirective}
      />
      <div className="container px-4 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold text-primary mb-3">Blog</h1>
        <p className="text-slate-500 mb-10">Insights and updates from RideVendor.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <article key={post._id} className="border border-slate-200 rounded-2xl p-6 bg-white">
              <p className="text-xs uppercase text-slate-400 tracking-wide">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}</p>
              <h2 className="text-2xl font-semibold text-slate-900 mt-2">{post.title}</h2>
              <p className="text-slate-600 mt-3 line-clamp-3">{post.excerpt || 'No excerpt available.'}</p>
              <Link to={`/blog/${post.slug}`} className="inline-block mt-5 text-sm font-medium text-slate-900 underline">
                Read article
              </Link>
            </article>
          ))}
        </div>

        {!isLoading && posts.length === 0 && <p className="text-slate-400">No blog posts yet.</p>}
      </div>
    </div>
  );
};

export default BlogList;
