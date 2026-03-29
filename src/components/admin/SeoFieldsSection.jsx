import React from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import ImageUploaderField from './ImageUploaderField';

const SeoFieldsSection = ({
  register,
  values,
  setValue,
  isUploadingImage,
  onUploadOgImage,
  includeFocusKeyword = true,
  canonicalPlaceholder = '/page-slug',
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
      <h2 className="text-base font-semibold text-slate-900">SEO Settings</h2>
      <Input label="SEO Title" {...register('metaTitle')} />
      <Textarea label="Meta Description" rows={4} {...register('metaDescription')} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {includeFocusKeyword ? <Input label="Focus Keyword" {...register('focusKeyword')} /> : <div />}
        <Input label="Canonical URL" placeholder={canonicalPlaceholder} {...register('canonicalUrl')} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageUploaderField
          label="Social Image"
          value={values?.ogImage || ''}
          isUploading={isUploadingImage}
          onUpload={onUploadOgImage}
          onClear={() => setValue('ogImage', '', { shouldDirty: true })}
        />
        <div className="space-y-1.5">
          <label className="text-sm font-medium leading-none">Robots</label>
          <select className="h-10 px-3 rounded-md border border-slate-200 text-sm w-full" {...register('robotsDirective')}>
            <option value="index,follow">Index and follow</option>
            <option value="noindex,follow">Noindex, follow</option>
            <option value="noindex,nofollow">Noindex, nofollow</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SeoFieldsSection;
