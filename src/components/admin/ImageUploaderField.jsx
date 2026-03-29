import React from 'react';
import Button from '../ui/Button';

const ImageUploaderField = ({ label, value, isUploading, onUpload, onClear }) => {
  const pickImage = () => {
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
        <div className="rounded-xl border border-slate-200 p-3 bg-white space-y-2">
          <img src={value} alt="Uploaded" className="h-32 w-full object-cover rounded-lg border border-slate-100" />
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={pickImage} isLoading={isUploading}>Replace</Button>
            <Button type="button" size="sm" variant="ghost" onClick={onClear}>Remove</Button>
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
