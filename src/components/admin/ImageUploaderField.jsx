import React from 'react';
import Button from '../ui/Button';

const ImageUploaderField = ({ label, value, isUploading, isRemoving, onUpload, onClear }) => {
  const isLoading = isUploading || isRemoving;

  const pickImage = () => {
    if (isLoading) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      await onUpload(file);
    };
    input.click();
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">{label}</label>
      {value ? (
        <div className="relative rounded-xl border border-slate-200 p-3 bg-white space-y-2">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/80">
              <svg className="h-5 w-5 animate-spin text-slate-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-xs text-slate-500">{isRemoving ? 'Removing…' : 'Uploading…'}</span>
            </div>
          )}
          <img src={value} alt="Uploaded" className="h-32 w-full object-cover rounded-lg border border-slate-100" />
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={pickImage} isLoading={isUploading} disabled={isLoading}>Replace</Button>
            <Button type="button" size="sm" variant="ghost" onClick={onClear} isLoading={isRemoving} disabled={isLoading}>Remove</Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-4 bg-slate-50">
          <Button type="button" variant="outline" onClick={pickImage} isLoading={isUploading}>Upload Image</Button>
        </div>
      )}
      <p className="text-xs text-slate-500">Uploads to Cloudinary (max 5MB image).</p>
    </div>
  );
};

export default ImageUploaderField;
