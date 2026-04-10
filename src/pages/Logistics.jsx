import React from 'react';
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
} from 'lucide-react';

const WHATSAPP_NUMBER = '2348144123316';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hello! I need a pickup and delivery in Ilorin. Please assist me.'
);
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

// WhatsApp SVG icon
const WhatsAppIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ── Hero / Jumbotron ───────────────────────────────────────────────────────────
const Hero = () => (
  <section className="pt-10 pb-16 md:pt-16 md:pb-24 bg-white">
    <div className="container px-4 max-w-5xl mx-auto text-center space-y-8">
      {/* Badge */}
      <span className="inline-flex items-center gap-2 bg-accent/20 text-accent-dark text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full animate-in fade-in duration-500">
        <Bike className="w-3.5 h-3.5" />
        Last-Mile Delivery · Ilorin / Kwara State
      </span>

      {/* Headline */}
      <h1 className="text-3xl md:text-5xl font-semibold text-primary leading-[1.15] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
        Fast Bike Delivery,{' '}
        <span className="bg-accent px-2 rounded-lg">Anywhere</span>{' '}
        in Ilorin
      </h1>

      {/* Sub-heading */}
      <p className="text-gray-medium text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        Ride Vendor Logistics gets your parcels, documents, food, and goods
        picked up and delivered within Ilorin and across Kwara State — quickly,
        safely, and affordably.
      </p>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#25D366] text-white font-semibold text-sm px-8 py-4 rounded-full shadow-lg shadow-green-500/20 hover:bg-[#22c35e] hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 active:scale-95"
        >
          <WhatsAppIcon />
          Book a Delivery on WhatsApp
          <ArrowRight className="w-4 h-4" />
        </a>
        <p className="text-[10px] font-medium text-gray-medium uppercase tracking-[0.15em]">
          We respond within minutes
        </p>
      </div>

      {/* Floating stats strip */}
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-6 animate-in fade-in zoom-in duration-700 delay-300">
        {[
          { value: 'Same Day', label: 'Delivery' },
          { value: 'Ilorin', label: 'Coverage' },
          { value: '24 / 7', label: 'Available' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-gray-50 border border-gray-100 rounded-2xl py-4 px-3 text-center"
          >
            <p className="text-primary font-bold text-lg leading-none">{stat.value}</p>
            <p className="text-[10px] font-medium text-gray-medium uppercase tracking-widest mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── How It Works ──────────────────────────────────────────────────────────────
const HowItWorks = () => (
  <section className="py-20 bg-primary overflow-hidden">
    <div className="container px-4 max-w-5xl mx-auto">
      <div className="text-center mb-14 space-y-3">
        <p className="text-[10px] font-bold text-accent uppercase tracking-[0.25em]">Simple Process</p>
        <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
          How It Works
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            step: '01',
            icon: <PhoneCall className="w-7 h-7 text-accent" />,
            title: 'Place Your Order',
            desc: 'Chat us on WhatsApp with your pickup location, drop-off address, and item description. No app needed.',
          },
          {
            step: '02',
            icon: <Bike className="w-7 h-7 text-accent" />,
            title: 'Rider Picks Up',
            desc: 'A verified rider arrives at your pickup point swiftly — we confirm details and handle with care.',
          },
          {
            step: '03',
            icon: <Package className="w-7 h-7 text-accent" />,
            title: 'Item Delivered',
            desc: 'Your item reaches its destination fast. We notify you on delivery and keep you informed every step.',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="relative bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-5 hover:bg-white/10 hover:border-accent/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-700"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-5xl font-bold text-white/5 leading-none select-none">
                {item.step}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="text-sm text-white/60 leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Why Choose Us ─────────────────────────────────────────────────────────────
const WhyUs = () => (
  <section className="py-20 bg-white">
    <div className="container px-4 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Left: Text */}
        <div className="space-y-6">
          <p className="text-[10px] font-bold text-accent-dark uppercase tracking-[0.25em]">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-primary leading-tight">
            Built for Ilorin's Last-Mile Reality
          </h2>
          <p className="text-gray-medium text-sm leading-relaxed font-medium max-w-md">
            Big courier companies overlook the streets of Kwara. This service was
            built specifically for Ilorin — our riders know every neighbourhood,
            every shortcut, and every gate.
          </p>

          <ul className="space-y-4 pt-2">
            {[
              'Local riders who know Ilorin inside out',
              'Real-time updates via WhatsApp',
              'Affordable flat-rate pricing, no surprises',
              'Handles parcels, documents, food & more',
              'Operates 7 days a week, morning to night',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-medium text-primary">
                <CheckCircle className="w-5 h-5 text-[#25D366] flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Feature cards */}
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: <Zap className="w-6 h-6 text-accent" />,
              title: 'Express Speed',
              desc: 'Same-day and urgent within-the-hour deliveries available.',
              bg: 'bg-primary',
              textColor: 'text-white',
              subColor: 'text-white/60',
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-primary" />,
              title: 'Safe & Insured',
              desc: 'Your items are handled with care and tracked every step.',
              bg: 'bg-accent',
              textColor: 'text-primary',
              subColor: 'text-primary/70',
            },
            {
              icon: <MapPin className="w-6 h-6 text-primary" />,
              title: 'Ilorin Wide',
              desc: 'GRA, Tanke, Fate, Offa Garage, Asa Dam, Unity — we cover it all.',
              bg: 'bg-accent',
              textColor: 'text-primary',
              subColor: 'text-primary/70',
            },
            {
              icon: <Clock className="w-6 h-6 text-accent" />,
              title: 'Always On',
              desc: 'Morning pickups to late-night drops — 7 days a week.',
              bg: 'bg-primary',
              textColor: 'text-white',
              subColor: 'text-white/60',
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`${card.bg} rounded-[2rem] p-7 space-y-4 hover:scale-[1.03] transition-transform duration-300 animate-in fade-in zoom-in duration-500`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center">
                {card.icon}
              </div>
              <h3 className={`font-semibold text-sm ${card.textColor}`}>{card.title}</h3>
              <p className={`text-xs leading-relaxed ${card.subColor} font-medium`}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── What We Deliver ───────────────────────────────────────────────────────────
const WhatWeDeliver = () => (
  <section className="py-20 bg-gray-50">
    <div className="container px-4 max-w-5xl mx-auto text-center">
      <p className="text-[10px] font-bold text-accent-dark uppercase tracking-[0.25em] mb-3">
        Item Types
      </p>
      <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-12 leading-tight">
        What Can We Deliver?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {[
          { emoji: '📦', label: 'Parcels & Packages' },
          { emoji: '📄', label: 'Documents & Letters' },
          { emoji: '🍱', label: 'Food & Meals' },
          { emoji: '💊', label: 'Medications' },
          { emoji: '🛒', label: 'Online Orders' },
          { emoji: '🔧', label: 'Spare Parts' },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-2xl py-6 px-3 space-y-3 hover:border-accent hover:shadow-md transition-all duration-300 group animate-in fade-in zoom-in duration-500"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="text-3xl block group-hover:scale-110 transition-transform duration-300">
              {item.emoji}
            </span>
            <p className="text-[10px] font-bold text-gray-medium uppercase tracking-widest leading-tight">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Bottom CTA ────────────────────────────────────────────────────────────────
const BottomCTA = () => (
  <section className="py-20 bg-white">
    <div className="container px-4 max-w-3xl mx-auto">
      <div className="bg-primary rounded-[2.5rem] p-10 md:p-16 text-center space-y-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute right-[-40px] bottom-[-40px] opacity-5">
          <Bike size={280} strokeWidth={0.8} />
        </div>

        <div className="relative z-10 space-y-4">
          <p className="text-[10px] font-bold text-accent uppercase tracking-[0.25em]">
            Ready to Send?
          </p>
          <h2 className="text-2xl md:text-4xl font-semibold text-white leading-tight">
            Get Your Delivery Started{' '}
            <span className="text-accent">Right Now</span>
          </h2>
          <p className="text-white/60 text-sm font-medium max-w-md mx-auto leading-relaxed">
            No app. No registration. Just send us a WhatsApp message and your
            rider is on the way.
          </p>
        </div>

        <div className="relative z-10">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white font-semibold text-sm px-10 py-4 rounded-full shadow-lg shadow-green-500/30 hover:bg-[#22c35e] hover:shadow-xl hover:shadow-green-500/40 hover:scale-105 transition-all duration-300 active:scale-95"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Chat Us on WhatsApp
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-white/30 text-[10px] font-medium uppercase tracking-widest mt-4">
            Available 7 days a week · Ilorin, Kwara State
          </p>
        </div>
      </div>
    </div>
  </section>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const LogisticsPage = () => (
  <div className="flex flex-col bg-white w-full">
    <Hero />
    <HowItWorks />
    <WhyUs />
    <WhatWeDeliver />
    <BottomCTA />
  </div>
);

export default LogisticsPage;
