import React, { useState } from 'react';
import { FieldLabel } from '@puckeditor/core';
import { uploadCmsImage } from '../api';

const ImageUploadField = ({ name, onChange, value, label }) => {
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const response = await uploadCmsImage(file);
        const imageUrl = response?.data?.url;
        if (imageUrl) {
          onChange(imageUrl);
        }
      } catch {
        // Silently fail — user can retry
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  return (
    <FieldLabel label={label || name}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {value ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <img
              src={value}
              alt="Uploaded"
              style={{
                width: '100%',
                height: 120,
                objectFit: 'cover',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={pickImage}
                disabled={isUploading}
                style={{
                  padding: '4px 12px',
                  fontSize: 13,
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                {isUploading ? 'Uploading...' : 'Replace'}
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                style={{
                  padding: '4px 12px',
                  fontSize: 13,
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  background: '#fff',
                  cursor: 'pointer',
                  color: '#ef4444',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={pickImage}
            disabled={isUploading}
            style={{
              padding: '8px 16px',
              fontSize: 13,
              border: '1px dashed #cbd5e1',
              borderRadius: 8,
              background: '#f8fafc',
              cursor: 'pointer',
            }}
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        )}
      </div>
    </FieldLabel>
  );
};

export default ImageUploadField;
