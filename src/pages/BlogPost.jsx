import React from 'react';
import { useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { useBlogPost } from '../features/blog/hooks';

const BlogPost = () => {
  const { slug } = useParams();
  const { data, isLoading } = useBlogPost(slug);
  const post = data?.data;

  if (isLoading) {
    return (
      <div className="container px-4 py-16">
        <p className="text-slate-400">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container px-4 py-16">
        <p className="text-slate-500">Article not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <Seo
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        image={post.ogImage || post.coverImage}
        url={post.canonicalUrl || `/blog/${post.slug}`}
        robots={post.robotsDirective}
      />
      <div className="container px-4 py-12 max-w-4xl mx-auto">
        <p className="text-xs uppercase text-slate-400 tracking-wide mb-4">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}</p>
        <h1 className="text-4xl font-semibold text-primary mb-6">{post.title}</h1>
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }} />
      </div>
    </div>
  );
};

export default BlogPost;
