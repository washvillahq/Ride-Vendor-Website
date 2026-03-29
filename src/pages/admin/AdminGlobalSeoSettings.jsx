import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { useGlobalSeoSettings, useUpdateGlobalSeoSettings } from '../../features/cms/hooks';
import { setRuntimeSeoConfig } from '../../config/seo';

const AdminGlobalSeoSettings = () => {
  const { data, isLoading } = useGlobalSeoSettings();
  const { mutateAsync: updateSeoSettings, isLoading: isSaving } = useUpdateGlobalSeoSettings();

  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      siteName: '',
      titleSuffix: '',
      siteDescription: '',
      siteUrl: '',
      defaultImage: '',
      twitterHandle: '',
      locale: '',
      country: '',
      organizationName: '',
      organizationPhone: '',
      organizationEmail: '',
    },
  });

  useEffect(() => {
    if (!data?.data) return;
    reset({
      siteName: data.data.siteName || '',
      titleSuffix: data.data.titleSuffix || '',
      siteDescription: data.data.siteDescription || '',
      siteUrl: data.data.siteUrl || '',
      defaultImage: data.data.defaultImage || '',
      twitterHandle: data.data.twitterHandle || '',
      locale: data.data.locale || '',
      country: data.data.country || '',
      organizationName: data.data.organizationName || '',
      organizationPhone: data.data.organizationPhone || '',
      organizationEmail: data.data.organizationEmail || '',
    });
  }, [data, reset]);

  const values = watch();

  const onSubmit = async (formValues) => {
    try {
      const response = await updateSeoSettings(formValues);
      setRuntimeSeoConfig(response?.data || formValues);
      toast.success('Global SEO settings updated');
    } catch (error) {
      toast.error(error.message || 'Failed to update global SEO settings');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <section>
        <h1 className="text-3xl font-medium text-slate-900">Global SEO Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage site-wide SEO defaults used across the app when a page has no custom value.
        </p>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Site Name" placeholder="RideVendor" {...register('siteName')} />
            <Input label="Title Suffix" placeholder="RideVendor" {...register('titleSuffix')} />
          </div>

          <Textarea
            label="Default Description"
            placeholder="Default SEO description for pages without custom description"
            rows={4}
            {...register('siteDescription')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Site URL" placeholder="https://ridevendor.com" {...register('siteUrl')} />
            <Input label="Default Social Image" placeholder="/og-default.png" {...register('defaultImage')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Twitter Handle" placeholder="@ridevendor" {...register('twitterHandle')} />
            <Input label="Locale" placeholder="en_US" {...register('locale')} />
            <Input label="Country" placeholder="NG" {...register('country')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Organization Name" placeholder="RideVendor" {...register('organizationName')} />
            <Input label="Organization Phone" placeholder="+2348144123316" {...register('organizationPhone')} />
            <Input label="Organization Email" placeholder="info@ridevendor.com" {...register('organizationEmail')} />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={isSaving || isLoading}>
              Save Global SEO Settings
            </Button>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Preview</h2>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-[#1a0dab] text-[18px] leading-snug line-clamp-2">
              Homepage | {values.titleSuffix || values.siteName || 'Site Name'}
            </p>
            <p className="text-[#006621] text-sm mt-1">{values.siteUrl || 'https://ridevendor.com'}</p>
            <p className="text-[#545454] text-sm mt-2 line-clamp-3">
              {values.siteDescription || 'Default description preview'}
            </p>
          </div>
          <p className="text-xs text-slate-500">
            These defaults apply automatically when a page does not provide custom SEO values.
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminGlobalSeoSettings;
