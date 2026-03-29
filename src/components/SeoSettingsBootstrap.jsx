import { useEffect } from 'react';
import { getGlobalSeoSettings } from '../features/cms/api';
import { setRuntimeSeoConfig } from '../config/seo';

const SeoSettingsBootstrap = () => {
  useEffect(() => {
    let isMounted = true;

    const loadSeoSettings = async () => {
      try {
        const response = await getGlobalSeoSettings();
        const settings = response?.data;

        if (isMounted && settings) {
          setRuntimeSeoConfig(settings);
        }
      } catch {
        // Keep default config if request fails.
      }
    };

    loadSeoSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
};

export default SeoSettingsBootstrap;
