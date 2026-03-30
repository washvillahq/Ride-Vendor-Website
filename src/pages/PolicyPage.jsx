import React from 'react';
import Seo from '../components/Seo';
import { useCmsPage } from '../features/cms/hooks';

const DEFAULT_CONTENT = `
<p class="text-gray-600">No content available. Please contact support.</p>
`;

const PolicyPage = ({ slug }) => {
  const { data: pageData, isLoading } = useCmsPage(slug);
  const page = pageData?.data;

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen pb-20">
        <div className="container px-4 py-12 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-slate-200 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="bg-white min-h-screen pb-20">
        <Seo 
          title="Page Not Found"
          description="The requested page could not be found."
        />
        <div className="container px-4 py-12 max-w-4xl mx-auto">
          <h1 className="text-4xl font-semibold text-primary mb-8">Page Not Found</h1>
          <p className="text-gray-600">The requested page could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <Seo 
        title={page?.title || 'Page'}
        metaTitle={page?.metaTitle}
        description={page?.metaDescription || ''}
        image={page?.ogImage}
        url={page?.canonicalUrl || `/${slug}`}
        robots={page?.robotsDirective}
      />
      <div className="container px-4 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-primary mb-8">{page?.title}</h1>

        <div className="prose prose-lg max-w-none">
          {page?.contentHtml ? (
            <div dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: DEFAULT_CONTENT }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
