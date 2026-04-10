import React, { useState } from 'react';
import {
  Bike,
  Package,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  CheckCircle,
  ArrowRight,
  PhoneCall,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Seo from '../components/Seo';
import { useCmsPage } from '../features/cms/hooks';

const WHATSAPP_NUMBER = '2349069999851';
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello! I'd like to book a delivery in Ilorin, Kwara State. Please assist me."
);
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://ridevendor.com';
const DEFAULT_LOGISTICS_TITLE = 'Bike Delivery in Ilorin, Kwara State';
const DEFAULT_LOGISTICS_META_TITLE = 'Bike Delivery in Ilorin, Kwara | Same-Day Last-Mile Delivery';
const DEFAULT_LOGISTICS_DESCRIPTION = 'Book same-day bike delivery in Ilorin, Kwara State with RideVendor. Fast pickup, secure last-mile delivery, and WhatsApp booking for businesses and individuals.';
const DEFAULT_LOGISTICS_KEYWORDS = 'bike delivery in Ilorin, same day delivery Ilorin, last mile delivery Kwara, dispatch rider Ilorin, logistics in Ilorin, WhatsApp delivery service Ilorin';

const WhatsAppIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const WACta = ({ label = 'Book Your Delivery Now', size = 'lg', note }) => (
  <div className="flex flex-col items-center gap-3">
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 bg-[#25D366] text-white font-bold rounded-full shadow-lg shadow-green-500/25 hover:bg-[#22c35e] hover:shadow-xl hover:shadow-green-500/35 hover:scale-[1.03] transition-all duration-300 active:scale-95 ${size === 'lg'
        ? 'text-base px-10 py-5'
        : 'text-sm px-8 py-4'
        }`}
    >
      <WhatsAppIcon className={size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
      {label}
      <ArrowRight className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
    </a>
    {note && (
      <p className="text-[10px] font-semibold text-gray-medium uppercase tracking-[0.18em]">{note}</p>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 1. HERO — Hook: Bold promise + immediate CTA
// ─────────────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section className="pt-10 pb-16 md:pt-20 md:pb-28 bg-white">
    <div className="container px-4 max-w-4xl mx-auto text-center space-y-8">

      <span className="inline-flex items-center gap-2 bg-accent/20 text-accent-dark text-[10px] font-bold uppercase tracking-[0.22em] px-5 py-2.5 rounded-full animate-in fade-in duration-500">
        <Bike className="w-3.5 h-3.5" />
        Last-Mile Delivery in Ilorin, Kwara
      </span>

      <h1 className="text-4xl md:text-6xl font-bold text-primary leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
        Your Item.{' '}
        <span className="bg-accent px-3 rounded-xl">Delivered</span>{' '}
        <br className="hidden md:block" />
        Same Day.
      </h1>

      <p className="text-gray-medium text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700">
        One WhatsApp message is all it takes. Our riders handle pickups across
        Ilorin, the capital of Kwara State, and deliver directly to your
        recipient — fast, tracked, and affordable.
      </p>

      <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
        <WACta
          label="Book a Delivery Now"
          size="lg"
          note="No app needed · We reply in minutes"
        />
      </div>

      {/* Trust bar */}
      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-4 animate-in fade-in zoom-in duration-700">
        {[
          { value: '500+', label: 'Deliveries Done' },
          { value: 'Same Day', label: 'Turnaround' },
          { value: '7 Days', label: 'A Week' },
        ].map((s, i) => (
          <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl py-4 px-2 text-center">
            <p className="text-primary font-extrabold text-lg leading-none">{s.value}</p>
            <p className="text-[9px] font-semibold text-gray-medium uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. PAIN — Agitate: Name the frustration they already feel
// ─────────────────────────────────────────────────────────────────────────────
const PainSection = () => (
  <section className="py-16 bg-gray-50">
    <div className="container px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-[10px] font-bold text-accent-dark uppercase tracking-[0.25em] mb-3">
          Sound Familiar?
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
          Ilorin Delivery Shouldn't Be This Hard
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            emoji: '😤',
            pain: `"I'll deliver it tomorrow" — three days later, still nothing.`,
          },
          {
            emoji: '😰',
            pain: 'Sending a stranger with your package and hoping for the best.',
          },
          {
            emoji: '💸',
            pain: "Overpriced couriers who don't even cover your area of town.",
          },
          {
            emoji: '📵',
            pain: "The rider goes offline and you can't reach anyone.",
          },
          {
            emoji: '🕐',
            pain: 'Waiting all day for a delivery window that never arrives.',
          },
          {
            emoji: '🚫',
            pain: 'Services that stop at the main road and refuse to go further.',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="text-2xl flex-shrink-0 mt-0.5">{item.emoji}</span>
            <p className="text-sm font-medium text-gray-medium leading-relaxed italic">
              {item.pain}
            </p>
          </div>
        ))}
      </div>

      <p className="text-center text-primary font-bold text-lg mt-10">
        You deserve better. That's exactly why we built this.
      </p>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HOW IT WORKS — Solution: Simple, no friction
// ─────────────────────────────────────────────────────────────────────────────
const HowItWorks = () => (
  <section className="py-20 bg-primary overflow-hidden">
    <div className="container px-4 max-w-5xl mx-auto">
      <div className="text-center mb-14 space-y-3">
        <p className="text-[10px] font-bold text-accent uppercase tracking-[0.25em]">
          No App. No Stress.
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          Your Delivery in 3 Simple Steps
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {[
          {
            step: '01',
            icon: <PhoneCall className="w-7 h-7 text-accent" />,
            title: 'Message Us on WhatsApp',
            desc: "Tell us your pickup address, destination, and what you're sending. That's it — no forms, no sign-up.",
          },
          {
            step: '02',
            icon: <Bike className="w-7 h-7 text-accent" />,
            title: 'Your Rider Is Dispatched',
            desc: "A trusted, verified rider heads to your location immediately. We'll confirm the pickup details with you.",
          },
          {
            step: '03',
            icon: <Package className="w-7 h-7 text-accent" />,
            title: "Delivered. You're Notified.",
            desc: 'Your recipient gets the item and you get a delivery confirmation. Fast, clean, done.',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="relative bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-5 hover:bg-white/10 hover:border-accent/30 transition-all duration-300"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-5xl font-black text-white/5 leading-none select-none">
                {item.step}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">{item.title}</h3>
            <p className="text-sm text-white/60 leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <WACta
          label="Get Started — Message Us Now"
          size="lg"
          note="Available 7 days a week · Across Ilorin, Kwara State"
        />
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 4. BENEFITS — Desire: Feature → Benefit framing
// ─────────────────────────────────────────────────────────────────────────────
const Benefits = () => (
  <section className="py-20 bg-white">
    <div className="container px-4 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div className="space-y-6">
          <p className="text-[10px] font-bold text-accent-dark uppercase tracking-[0.25em]">
            What Makes Us Different
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
            Fast. Reliable. Built for Ilorin, Kwara State.
          </h2>
          <p className="text-gray-medium text-sm leading-relaxed font-medium max-w-md">
            We're not a national courier with a local number. We're an
            Ilorin-first operation — our riders know the city, understand the
            routes, and show up when they say they will.
          </p>

          <ul className="space-y-4 pt-2">
            {[
              { benefit: 'Same-day delivery so your customers never wait overnight' },
              { benefit: 'WhatsApp-first — no apps, no accounts, no friction' },
              { benefit: 'Flat, transparent pricing — no hidden charges after pickup' },
              { benefit: 'Verified riders only, so your items are always safe' },
              { benefit: 'We go into every estate, every street, every gate' },
              { benefit: "Real-time updates so you're never left wondering" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-medium text-primary">
                <CheckCircle className="w-5 h-5 text-[#25D366] flex-shrink-0 mt-0.5" />
                {item.benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: <Zap className="w-6 h-6 text-accent" />,
              title: 'Express Delivery',
              desc: 'Urgent? We dispatch within minutes. Your delivery arrives in hours, not days.',
              bg: 'bg-primary',
              titleColor: 'text-white',
              descColor: 'text-white/60',
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-primary" />,
              title: '100% Verified Riders',
              desc: 'Every rider is screened, trusted, and accountable. Your items are safe.',
              bg: 'bg-accent',
              titleColor: 'text-primary',
              descColor: 'text-primary/70',
            },
            {
              icon: <MapPin className="w-6 h-6 text-primary" />,
              title: 'Across Ilorin, Kwara',
              desc: 'GRA, Tanke, Fate, Offa Garage, Asa Dam, Unity, and Garin Alimi — covered.',
              bg: 'bg-accent',
              titleColor: 'text-primary',
              descColor: 'text-primary/70',
            },
            {
              icon: <Clock className="w-6 h-6 text-accent" />,
              title: '7 Days a Week',
              desc: "Weekends, public holidays, early morning, late evening — we're open.",
              bg: 'bg-primary',
              titleColor: 'text-white',
              descColor: 'text-white/60',
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`${card.bg} rounded-[2rem] p-7 space-y-4 hover:scale-[1.03] transition-transform duration-300`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center">
                {card.icon}
              </div>
              <h3 className={`font-bold text-sm ${card.titleColor}`}>{card.title}</h3>
              <p className={`text-xs leading-relaxed ${card.descColor} font-medium`}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 5. USE CASES — Recognition trigger
// ─────────────────────────────────────────────────────────────────────────────
const UseCases = () => (
  <section className="py-20 bg-gray-50">
    <div className="container px-4 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-[10px] font-bold text-accent-dark uppercase tracking-[0.25em] mb-3">
          Who Uses This Service?
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
          We Deliver Across Ilorin, Kwara State
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {[
          {
            emoji: '🛍️',
            who: 'Online Sellers',
            what: `Send orders to your Ilorin customers same day. No more "I'll bring it tomorrow."`,
          },
          {
            emoji: '🍱',
            who: 'Food Vendors & Restaurants',
            what: 'Hot meals delivered fast before they go cold. Keep your 5-star reviews.',
          },
          {
            emoji: '💼',
            who: 'Businesses & Offices',
            what: 'Documents, contracts, and office supplies moved between locations — same hour.',
          },
          {
            emoji: '💊',
            who: 'Pharmacies & Clinics',
            what: "Medication and supplies that can't wait. We treat urgency as a priority.",
          },
          {
            emoji: '👨‍👩‍👧',
            who: 'Families & Individuals',
            what: "Sending something to a relative across town? We handle it like it's our own.",
          },
          {
            emoji: '🛒',
            who: 'Shoppers & E-commerce Buyers',
            what: 'Picked up from a vendor in Ilorin and straight to your door.',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-[1.5rem] p-6 space-y-3 hover:border-accent hover:shadow-md transition-all duration-300 group"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="text-3xl block group-hover:scale-110 transition-transform duration-300">
              {item.emoji}
            </span>
            <h3 className="font-bold text-primary text-sm">{item.who}</h3>
            <p className="text-xs text-gray-medium leading-relaxed font-medium">{item.what}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 6. FAQ — Objection removal
// ─────────────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'How do I book a delivery?',
    a: "Simply send us a WhatsApp message with your pickup address, delivery address, and a description of what you're sending. We'll confirm the details and dispatch a rider immediately.",
  },
  {
    q: 'How much does a delivery cost?',
    a: 'Pricing depends on distance within Ilorin. We give you a transparent price before any rider is dispatched — no surprises after pickup. Message us for a quick quote.',
  },
  {
    q: 'How fast will my item be delivered?',
    a: 'Most deliveries within Ilorin are completed within 1–3 hours. For urgent orders, we prioritise same-hour dispatch.',
  },
  {
    q: 'What areas do you cover?',
    a: 'We cover major areas across Ilorin — including GRA, Tanke, Fate, Offa Garage, Asa Dam Road, Garin Alimi, and Unity. Nearby Kwara deliveries can also be arranged on request.',
  },
  {
    q: 'What if my item is fragile or valuable?',
    a: "Let us know when you message and we'll handle it with extra care. All our riders are trained to handle items responsibly and are accountable for every delivery.",
  },
  {
    q: 'Do you operate on weekends and public holidays?',
    a: "Yes — we operate 7 days a week. Whether it's a Saturday afternoon or a public holiday, we're available.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container px-4 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] font-bold text-accent-dark uppercase tracking-[0.25em] mb-3">
            Got Questions?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
              >
                <span className="font-semibold text-sm text-primary">{faq.q}</span>
                {open === i ? (
                  <ChevronUp className="w-4 h-4 text-accent flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-medium flex-shrink-0" />
                )}
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-medium leading-relaxed font-medium">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. FINAL CTA — Close: Urgency + frictionless action
// ─────────────────────────────────────────────────────────────────────────────
const BottomCTA = () => (
  <section className="py-20 bg-white">
    <div className="container px-4 max-w-3xl mx-auto">
      <div className="bg-primary rounded-[2.5rem] p-10 md:p-16 text-center space-y-8 relative overflow-hidden">
        {/* Ghost decoration */}
        <div className="absolute right-[-50px] bottom-[-50px] opacity-5">
          <Bike size={300} strokeWidth={0.7} />
        </div>

        <div className="relative z-10 space-y-4">
          <p className="text-[10px] font-bold text-accent uppercase tracking-[0.3em]">
            Your Rider Is Waiting
          </p>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
            Stop Waiting.{' '}
            <span className="text-accent">Start Delivering.</span>
          </h2>
          <p className="text-white/60 text-sm font-medium max-w-sm mx-auto leading-relaxed">
            One message. One rider. Delivered the same day.
            No contracts, no apps, no delays.
          </p>
        </div>

        <div className="relative z-10">
          <WACta
            label="Send a Message Right Now"
            size="lg"
          />
          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest mt-5">
            Available 7 days a week · Across Ilorin, Kwara State
          </p>
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// Page composition
// ─────────────────────────────────────────────────────────────────────────────
const LogisticsPage = () => {
  const { data: pageData } = useCmsPage('logistics');
  const page = pageData?.data;

  const title = page?.title || DEFAULT_LOGISTICS_TITLE;
  const metaTitle = page?.metaTitle || DEFAULT_LOGISTICS_META_TITLE;
  const description = page?.metaDescription || DEFAULT_LOGISTICS_DESCRIPTION;
  const canonicalUrl = page?.canonicalUrl || '/logistics';
  const keywords = page?.focusKeyword || DEFAULT_LOGISTICS_KEYWORDS;
  const absoluteCanonicalUrl = canonicalUrl.startsWith('http') ? canonicalUrl : `${SITE_URL}${canonicalUrl}`;

  const logisticsJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'RideVendor Bike Delivery',
      serviceType: 'Same-day last-mile delivery',
      description,
      url: absoluteCanonicalUrl,
      areaServed: [
        { '@type': 'City', name: 'Ilorin' },
        { '@type': 'AdministrativeArea', name: 'Kwara State' },
        { '@type': 'Country', name: 'Nigeria' },
      ],
      provider: {
        '@type': 'Organization',
        name: 'RideVendor',
        url: SITE_URL,
        telephone: '+2348144123316',
      },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: WHATSAPP_LINK,
        availableLanguage: 'English',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    },
  ];

  return (
    <div className="flex flex-col bg-white w-full">
      <Seo
        title={title}
        metaTitle={metaTitle}
        description={description}
        image={page?.ogImage}
        url={canonicalUrl}
        robots={page?.robotsDirective}
        keywords={keywords}
        jsonLd={logisticsJsonLd}
      />
      <Hero />
      <PainSection />
      <HowItWorks />
      <Benefits />
      <UseCases />
      <FAQ />
      <BottomCTA />
    </div>
  );
};

export default LogisticsPage;
