import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const SlugField = ({ value, onChange, onResetFromTitle, touched }) => {
  return (
    <div className="space-y-1.5">
      <Input
        label="Slug"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="your-slug"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {touched ? 'Manual slug mode: title changes will not overwrite this.' : 'Auto-generated from title.'}
        </p>
        <Button type="button" variant="ghost" size="sm" onClick={onResetFromTitle}>
          Reset from title
        </Button>
      </div>
    </div>
  );
};

export default SlugField;
