import React from 'react';
import { useParams } from 'react-router-dom';
import { useCmsPage } from '../features/cms/hooks';
import Seo from '../components/Seo';

const CmsCustomPage = () => {
  const { slug } = useParams();
  const { data, isLoading } = useCmsPage(slug);
  const page = data?.data;

  if (isLoading) {
    return (
      <div className="container px-4 py-16">
        <p className="text-slate-400">Loading page...</p>
      </div>
    );
  }

  if (!page || page.pageType !== 'custom') {
    return (
      <div className="container px-4 py-16">
        <p className="text-slate-500">Page not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <Seo
        title={page.title}
        metaTitle={page.metaTitle}
        description={page.metaDescription}
        image={page.ogImage}
        url={page.canonicalUrl || `/${page.slug}`}
        robots={page.robotsDirective}
      />
      <div className="container px-4 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-primary mb-8">{page.title}</h1>
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: page.contentHtml || '' }} />
      </div>
    </div>
  );
};

export default CmsCustomPage;
