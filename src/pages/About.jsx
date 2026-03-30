import React from 'react';
import Seo from '../components/Seo';
import { useCmsPage } from '../features/cms/hooks';

const DEFAULT_CONTENT = `
<p class="text-xl text-gray-600 mb-8">
  RideVendor is your trusted partner for car hire, car sales, and auto services in Ilorin, Kwara State.
  Since 2012, we have been providing reliable vehicle solutions for individuals and businesses.
</p>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
  <div class="bg-slate-50 p-8 rounded-[2rem]">
    <h3 class="text-xl font-semibold text-primary mb-4">Our Mission</h3>
    <p class="text-gray-600">
      To provide reliable, affordable, and professional vehicle rental and sales services
      that exceed customer expectations.
    </p>
  </div>
  <div class="bg-slate-50 p-8 rounded-[2rem]">
    <h3 class="text-xl font-semibold text-primary mb-4">Our Vision</h3>
    <p class="text-gray-600">
      To be the leading vehicle solutions provider in Nigeria, known for quality service
      and customer satisfaction.
    </p>
  </div>
</div>

<h2 class="text-2xl font-semibold text-primary mb-4">Why Choose Us?</h2>
<ul class="space-y-4 mb-12">
  <li class="flex items-start gap-3">
    <span class="text-accent text-xl">✓</span>
    <span class="text-gray-600">Verified and inspected vehicles</span>
  </li>
  <li class="flex items-start gap-3">
    <span class="text-accent text-xl">✓</span>
    <span class="text-gray-600">Professional and experienced drivers</span>
  </li>
  <li class="flex items-start gap-3">
    <span class="text-accent text-xl">✓</span>
    <span class="text-gray-600">24/7 customer support</span>
  </li>
  <li class="flex items-start gap-3">
    <span class="text-accent text-xl">✓</span>
    <span class="text-gray-600">Competitive pricing</span>
  </li>
  <li class="flex items-start gap-3">
    <span class="text-accent text-xl">✓</span>
    <span class="text-gray-600">Flexible rental terms</span>
  </li>
</ul>

<h2 class="text-2xl font-semibold text-primary mb-4">Our Services</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
  <div class="border border-slate-200 p-6 rounded-2xl">
    <h3 class="font-semibold text-primary mb-2">Car Rental</h3>
    <p class="text-gray-600 text-sm">Daily, weekly, and monthly car hire options with free delivery in Ilorin.</p>
  </div>
  <div class="border border-slate-200 p-6 rounded-2xl">
    <h3 class="font-semibold text-primary mb-2">Car Sales</h3>
    <p class="text-gray-600 text-sm">Buy quality vehicles with verified inspection reports and transparent pricing.</p>
  </div>
  <div class="border border-slate-200 p-6 rounded-2xl">
    <h3 class="font-semibold text-primary mb-2">Auto Services</h3>
    <p class="text-gray-600 text-sm">Car washing, vehicle tracking, and comprehensive auto solutions.</p>
  </div>
</div>

<h2 class="text-2xl font-semibold text-primary mb-4">Contact Us</h2>
<div class="bg-slate-50 p-8 rounded-[2rem]">
  <p class="text-gray-600 mb-4">
    <strong>Address:</strong><br />
    Oniyangi Complex, OFFA GARAGE RAILWAY LINE,<br />
    off Asa-Dam Road, Ilorin 240101, Kwara
  </p>
  <p class="text-gray-600 mb-4">
    <strong>Phone:</strong> +2348144123316
  </p>
  <p class="text-gray-600">
    <strong>Email:</strong> info@ridevendor.com
  </p>
</div>
`;

const AboutPage = () => {
  const { data: pageData } = useCmsPage('about');
  const page = pageData?.data;

  return (
    <div className="bg-white min-h-screen pb-20">
      <Seo 
        title={page?.title || 'About Us'}
        metaTitle={page?.metaTitle}
        description={page?.metaDescription || 'Learn more about RideVendor - your trusted partner for car hire, car sales, and auto services in Ilorin, Kwara State, Nigeria since 2012.'}
        image={page?.ogImage}
        url={page?.canonicalUrl || '/about'}
        robots={page?.robotsDirective}
      />
      <div className="container px-4 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-primary mb-8">{page?.title || 'About RideVendor'}</h1>

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

export default AboutPage;
