import { useEffect, useRef, useState } from 'react';
import { slugify } from '../utils/slugify';

export const useAutoSlug = ({ title, slug, setValue, isEdit }) => {
  const [slugTouched, setSlugTouched] = useState(Boolean(isEdit));
  const previousTitle = useRef(title || '');

  useEffect(() => {
    if (!slugTouched) {
      setValue('slug', slugify(title || ''), { shouldDirty: true });
    }
    previousTitle.current = title || '';
  }, [title, slugTouched, setValue]);

  useEffect(() => {
    if (isEdit) {
      setSlugTouched(true);
    }
  }, [isEdit]);

  const onSlugChange = (value) => {
    if (!slugTouched) setSlugTouched(true);
    setValue('slug', slugify(value), { shouldDirty: true });
  };

  const resetSlugFromTitle = () => {
    setSlugTouched(false);
    setValue('slug', slugify(title || ''), { shouldDirty: true });
  };

  return {
    slugTouched,
    onSlugChange,
    resetSlugFromTitle,
  };
};
