import React, { useMemo } from 'react';

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 160;

const scoreSeo = ({ title, description, ogImage, canonicalUrl, focusKeyword }) => {
  let score = 100;
  const issues = [];

  if (!title) {
    score -= 35;
    issues.push('Add an SEO title.');
  } else if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
    score -= 15;
    issues.push(`Keep SEO title between ${TITLE_MIN}-${TITLE_MAX} chars.`);
  }

  if (!description) {
    score -= 25;
    issues.push('Add a meta description.');
  } else if (description.length < DESC_MIN || description.length > DESC_MAX) {
    score -= 10;
    issues.push(`Keep meta description between ${DESC_MIN}-${DESC_MAX} chars.`);
  }

  if (!ogImage) {
    score -= 10;
    issues.push('Add a social image.');
  }

  if (!focusKeyword) {
    score -= 10;
    issues.push('Add a focus keyword.');
  }

  if (!canonicalUrl) {
    score -= 10;
    issues.push('Add a canonical URL.');
  }

  return { score: Math.max(0, score), issues };
};

const PageSeoSidebar = ({ slug, metaTitle, metaDescription, ogImage, focusKeyword }) => {
  const health = useMemo(
    () =>
      scoreSeo({
        title: (metaTitle || '').trim(),
        description: (metaDescription || '').trim(),
        ogImage: (ogImage || '').trim(),
        canonicalUrl: slug ? `/${slug}` : '',
        focusKeyword: (focusKeyword || '').trim(),
      }),
    [slug, metaTitle, metaDescription, ogImage, focusKeyword]
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">SEO Health</h3>
          <span className={`text-sm font-bold ${health.score >= 85 ? 'text-emerald-600' : health.score >= 65 ? 'text-amber-600' : 'text-red-600'}`}>
            {health.score}/100
          </span>
        </div>
        {health.issues.length === 0 ? (
          <p className="text-sm text-emerald-700 mt-3">Looks great. Ready to publish.</p>
        ) : (
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            {health.issues.map((issue) => (
              <li key={issue}>- {issue}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <h3 className="text-sm font-semibold text-slate-900">Google preview</h3>
        <div className="mt-4">
          <p className="text-[#1a0dab] text-[20px] leading-snug line-clamp-2">{metaTitle || 'Your SEO title will appear here'}</p>
          <p className="text-[#006621] text-sm mt-1">ridevendor.com/{slug || 'page-slug'}</p>
          <p className="text-[#545454] text-sm mt-2 line-clamp-3">{metaDescription || 'Your meta description will appear here.'}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <h3 className="text-sm font-semibold text-slate-900">Social preview</h3>
        <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-100 h-28 flex items-center justify-center text-xs text-slate-400">
            {ogImage ? 'Social image added' : 'No social image added'}
          </div>
          <div className="p-4">
            <p className="text-xs uppercase text-slate-400">ridevendor.com</p>
            <p className="text-sm font-semibold text-slate-900 mt-1 line-clamp-2">{metaTitle || 'Your social title preview'}</p>
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{metaDescription || 'Your social description preview'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSeoSidebar;
