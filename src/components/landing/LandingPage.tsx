import React, { useState } from 'react';
import { Bike, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { 
  Zap, 
  QrCode, 
  CreditCard, 
  LifeBuoy, 
  BatteryCharging, 
  MapPin, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  PhoneCall, 
  Users, 
  Check, 
  Info, 
  Layers,
  ChevronRight,
  Calculator
} from 'lucide-react';

interface LandingPageProps {
  bikes: Bike[];
  lang: Language;
  onNavigateToScan: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ bikes, lang, onNavigateToScan }) => {
  const t = translations[lang];

  // Live availability count from fleet
  const availableBikesCount = bikes.filter((b) => b.status === 'available').length;

  // State for interactive 3-step selector
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [heroVideoLoaded, setHeroVideoLoaded] = useState(false);

  // State for interactive rate calculator
  const [selectedPackageId, setSelectedPackageId] = useState<'hourly' | 'half_day' | 'full_day'>('half_day');
  const [bikeCount, setBikeCount] = useState<number>(1);
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');

  // Rates definition
  const packages = [
    {
      id: 'hourly' as const,
      name: lang === 'my' ? '၁ နာရီ စီးနင်းခွင့်' : 'Hourly Explorer',
      duration: '1 Hour',
      priceMMK: 1500,
      priceUSD: 0.75,
      desc: lang === 'my' ? 'အနီးနား ဘုရားဖူးခြင်းနှင့် ဈေးဝယ်ခရီးတိုအတွက်' : 'Ideal for a quick sunrise stupa loop or local market ride.',
      badge: null,
    },
    {
      id: 'half_day' as const,
      name: lang === 'my' ? 'နေ့တစ်ဝက် စီးနင်းခွင့် (၄ နာရီ)' : 'Half-Day Bagan Tour',
      duration: '4 Hours',
      priceMMK: 4000,
      priceUSD: 2.0,
      desc: lang === 'my' ? 'မနက်ခင်း နေထွက်ချိန် သို့မဟုတ် ညနေ နေဝင်ချိန် ဘုရားဖူးခရီးစဉ်' : 'The quintessential sunrise or sunset pagoda expedition.',
      badge: 'Most Popular',
    },
    {
      id: 'full_day' as const,
      name: lang === 'my' ? 'တစ်နေကုန် အကန့်အသတ်မဲ့ (၁၂ နာရီ)' : 'Full-Day Sunrise to Sunset',
      duration: '12 Hours',
      priceMMK: 7000,
      priceUSD: 3.5,
      desc: lang === 'my' ? 'ပုဂံဒေသတစ်ခွင် လွတ်လပ်စွာ တစ်နေကုန် လည်ပတ်နိုင်မှု' : 'Unlimited freedom from dawn hot-air balloons to dusk twilight.',
      badge: 'Best Value',
    },
  ];

  const currentPkg = packages.find((p) => p.id === selectedPackageId) || packages[1];
  const totalPriceMMK = currentPkg.priceMMK * bikeCount;
  const totalPriceUSD = Number((currentPkg.priceUSD * bikeCount).toFixed(2));

  // Station counts
  const oldBaganCount = bikes.filter((b) => b.station.includes('Old Bagan') && b.status === 'available').length;
  const newBaganCount = bikes.filter((b) => b.station.includes('New Bagan') && b.status === 'available').length;
  const nyaungUCount = bikes.filter((b) => b.station.includes('Nyaung-U') && b.status === 'available').length;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col space-y-16 sm:space-y-24">
      {/* ─────────────────────────────────────────────────────────────
          1. FULL-SCREEN INTERACTIVE HERO SECTION
         ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center text-center px-4 -mt-6 pt-10 pb-16 overflow-hidden rounded-3xl">
        {/* Background Looping Video - no poster flash, smoothly fades in when ready */}
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/bagan-sunrise.mp4"
          onLoadedData={() => setHeroVideoLoaded(true)}
          onPlaying={() => setHeroVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover -z-20 transition-opacity duration-1000 ${
            heroVideoLoaded ? 'opacity-85' : 'opacity-0'
          }`}
        />

        {/* Warm Dark Scrim Gradient as specified in prompt */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-900/45 to-stone-950/80 -z-10" />

        {/* Built-in Animated SVG sunrise fallback */}
        <div className="absolute inset-0 -z-30 bg-gradient-to-b from-amber-950 via-stone-900 to-stone-950" />

        {/* Hero Content Container */}
        <div className="max-w-3xl mx-auto flex flex-col items-center z-10 space-y-5 animate-fadeIn">
          {/* Live Availability Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-950/80 backdrop-blur-md border border-amber-400/40 shadow-xl text-xs sm:text-sm font-extrabold text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-black">{availableBikesCount}</span>
            <span>{t.heroBadgeSuffix}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-md leading-[1.15]">
            {t.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-stone-200/90 max-w-2xl font-medium leading-relaxed drop-shadow">
            {t.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-3 w-full sm:w-auto">
            <button
              onClick={onNavigateToScan}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-stone-950 shadow-2xl hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2.5"
            >
              <QrCode className="w-5 h-5 text-stone-950" />
              <span>{t.heroCtaScan}</span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </button>

            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-sm sm:text-base bg-stone-900/85 hover:bg-stone-850/95 text-stone-200 backdrop-blur-md border border-stone-700/80 shadow-xl transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.heroCtaRates}</span>
            </button>
          </div>

          {/* Trust & Spec Micro-Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-[11px] font-semibold text-stone-300">
            <span className="px-3 py-1 rounded-full bg-stone-900/70 backdrop-blur-sm border border-stone-800">
              ⚡ Zero Emissions E-Moped
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-900/70 backdrop-blur-sm border border-stone-800">
              🪖 Helmets & Phone Mounts Included
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-900/70 backdrop-blur-sm border border-stone-800">
              🛡️ No Driving License Required
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-900/70 backdrop-blur-sm border border-stone-800">
              📍 24/7 Roadside Rescue
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. TWO-COLUMN EDITORIAL SHOWCASE ("How Our Service Works")
         ───────────────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="w-full bg-stone-900/90 backdrop-blur-md text-stone-100 rounded-3xl p-6 sm:p-10 shadow-2xl border border-stone-800 transition-all"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>How It Works • Bagan Experience</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Explore Bagan by E-Bike in 3 Easy Steps
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2">
              Gliding through thousand-year-old brick pagodas has never been smoother. Zero paper logbooks, instant mobile payments, and roadside GPS dispatch.
            </p>
          </div>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: High-Resolution Fleet Image with Floating Stat Pills */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30 group">
                <img
                  src="/bagan-ebike-fleet.jpg"
                  alt="Bagan E-Bike fleet beside ancient pagoda and bougainvillea"
                  className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold">Bagan Archaeological Heritage Fleet</span>
                  </div>
                  <span className="font-mono text-amber-300 font-bold">100% Electric</span>
                </div>
              </div>

              {/* Floating Stat Pill 1: Top Left */}
              <div className="absolute -top-3 -left-2 sm:-left-4 bg-stone-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-amber-500/40 flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  {t.feat45km}
                </span>
              </div>

              {/* Floating Stat Pill 2: Middle Right */}
              <div className="absolute top-1/2 -right-2 sm:-right-4 -translate-y-1/2 bg-stone-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-amber-500/40 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  {t.feat2Seater}
                </span>
              </div>

              {/* Floating Stat Pill 3: Bottom Left */}
              <div className="absolute -bottom-3 left-6 sm:left-10 bg-stone-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-amber-500/40 flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-red-400" />
                <span className="text-xs font-black bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  {t.featRescue}
                </span>
              </div>
            </div>

            {/* Right: Interactive 3-Step Experience Selector */}
            <div className="lg:col-span-6 space-y-4">
              {[
                {
                  number: '01',
                  title: 'Scan Handlebar QR',
                  titleMm: 'လက်ကိုင်ပေါ်ရှိ QR စကန်ဖတ်ပါ',
                  desc: 'Instant battery level & range check—no app download required. Open camera or enter Bike ID.',
                  descMm: 'အက်ပ်ဒေါင်းရန်မလိုပါ။ ကင်မရာဖြင့် ချက်ချင်းစကန်ဖတ်၍ ဘက်ထရီအားနှင့် မောင်းနှင်နိုင်သော ကီလိုမီတာကို ကြည့်ရှုပါ။',
                  icon: QrCode,
                  color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
                },
                {
                  number: '02',
                  title: '30-Second Digital Check-In & Pay',
                  titleMm: 'စက္ကန့် ၃၀ အတွင်း စာရင်းသွင်းပြီး ငွေပေးချေပါ',
                  desc: 'Quick hotel/contact form + MMQR (KBZPay, WavePay, AYA, CB) or Cash at shop counter.',
                  descMm: 'ဟိုတယ်အမည်နှင့် ဖုန်းနံပါတ် အမြန်ဖြည့်စွက်ပြီး KBZPay, WavePay သို့မဟုတ် ဆိုင်တွင် ငွေသားဖြင့် ပေးချေနိုင်ပါသည်။',
                  icon: CreditCard,
                  color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
                },
                {
                  number: '03',
                  title: 'Ride with Live GPS Rescue',
                  titleMm: 'တိုက်ရိုက် GPS ကယ်ဆယ်ရေးစနစ်ဖြင့် စီးနင်းပါ',
                  desc: 'Explore Old Bagan, New Bagan & Nyaung-U with one-tap SOS roadside support if you ever get a flat tire or low battery.',
                  descMm: 'ပုဂံမြို့ဟောင်း၊ မြို့သစ်နှင့် ညောင်ဦးတစ်ခွင် ဘီးပေါက်ခြင်း သို့မဟုတ် အားကုန်ခြင်းများအတွက် တစ်ချက်နှိပ် SOS စနစ် ပါဝင်သည်။',
                  icon: LifeBuoy,
                  color: 'text-red-400 bg-red-500/15 border-red-500/30',
                },
              ].map((step, idx) => {
                const isSelected = activeStepIndex === idx;
                const IconComponent = step.icon;

                return (
                  <div
                    key={step.number}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-950/80 via-stone-900/95 to-amber-900/40 border-amber-400/90 shadow-2xl ring-2 ring-amber-500/40 scale-[1.01]'
                        : 'bg-stone-950/70 hover:bg-stone-950/90 border-stone-800/80 hover:border-amber-400/40'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border shrink-0 transition-colors ${
                        isSelected 
                          ? 'bg-gradient-to-tr from-amber-500/25 to-yellow-400/15 text-amber-300 border-amber-400/50 shadow-md' 
                          : step.color
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-black bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent uppercase tracking-widest">
                            STEP {step.number}
                          </span>
                          {isSelected && (
                            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                          )}
                        </div>
                        <h3 className={`font-black text-base sm:text-lg mt-0.5 transition-colors ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-sm'
                            : 'text-stone-200 hover:text-amber-300'
                        }`}>
                          {lang === 'my' ? step.titleMm : step.title}
                        </h3>
                        <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                          isSelected ? 'text-stone-200 font-medium' : 'text-stone-400'
                        }`}>
                          {lang === 'my' ? step.descMm : step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Direct Link to Scan */}
              <div className="pt-2">
                <button
                  onClick={onNavigateToScan}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-stone-900 to-amber-950/60 hover:from-stone-850 hover:to-amber-900/70 text-amber-300 border border-amber-500/40 transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Ready? Open QR Scanner</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. INTERACTIVE RENTAL RATE CALCULATOR SECTION
         ───────────────────────────────────────────────────────────── */}
      <section
        id="rates-fleet"
        className="w-full bg-stone-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border border-stone-800 text-stone-100 transition-all"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-2">
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.ratesTitle}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Simple, Honest Bagan Rental Rates
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
                {t.ratesSubtitle}
              </p>
            </div>

            {/* Currency & Bike Count Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Currency Toggle */}
              <div className="bg-stone-950 p-1 rounded-xl border border-stone-800 flex items-center text-xs font-bold">
                <button
                  onClick={() => setCurrency('MMK')}
                  className={`px-3 py-1 rounded-lg transition ${
                    currency === 'MMK'
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  MMK
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-lg transition ${
                    currency === 'USD'
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  USD ($)
                </button>
              </div>

              {/* Bike Count Selector */}
              <div className="bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800 flex items-center gap-2 text-xs">
                <span className="text-stone-400 font-semibold">{t.bikeCountLabel}:</span>
                {[1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => setBikeCount(count)}
                    className={`w-6 h-6 rounded-lg font-bold text-xs transition flex items-center justify-center ${
                      bikeCount === count
                        ? 'bg-amber-500 text-stone-950 font-black'
                        : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {packages.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              const unitPrice = currency === 'MMK' ? `${pkg.priceMMK.toLocaleString()} MMK` : `$${pkg.priceUSD}`;
              const subtotal = currency === 'MMK'
                ? `${(pkg.priceMMK * bikeCount).toLocaleString()} MMK`
                : `$${(pkg.priceUSD * bikeCount).toFixed(2)}`;

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`cursor-pointer rounded-2xl p-6 border transition-all flex flex-col justify-between relative ${
                    isSelected
                      ? 'bg-stone-950 border-amber-500 ring-2 ring-amber-500/30 shadow-2xl scale-[1.02]'
                      : 'bg-stone-950/60 border-stone-800 hover:border-amber-400/50'
                  }`}
                >
                  {pkg.badge && (
                    <span className="absolute -top-3 right-4 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                      {pkg.badge}
                    </span>
                  )}

                  <div>
                    <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">
                      {pkg.duration}
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      {pkg.desc}
                    </p>

                    {/* Price Display */}
                    <div className="mt-5 pt-4 border-t border-stone-800">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-black text-amber-400">
                          {unitPrice}
                        </span>
                        <span className="text-xs text-stone-500">/ bike</span>
                      </div>

                      {bikeCount > 1 && (
                        <p className="text-xs font-bold text-emerald-400 mt-1">
                          Total for {bikeCount} bikes: {subtotal}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="mt-6 pt-4 border-t border-stone-800/80 space-y-2 text-xs text-stone-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Sanitized helmets included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Phone handlebar mount for GPS map</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Free battery swap if low</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>24/7 Bagan Rescue SOS support</span>
                    </div>
                  </div>

                  {/* Select & Rent CTA */}
                  <div className="mt-6 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToScan();
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md'
                          : 'bg-stone-800 hover:bg-stone-750 text-stone-200'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Rent This Package</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calculator Bottom Summary Strip */}
          <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-stone-200 text-sm">
                  {currentPkg.name} • {bikeCount} E-Bike(s)
                </p>
                <p className="text-stone-400">
                  Ready to scan at any station in Old Bagan, New Bagan, or Nyaung-U.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">
                  {t.estimatedTotal}
                </span>
                <span className="text-xl sm:text-2xl font-black text-amber-400">
                  {currency === 'MMK' ? `${totalPriceMMK.toLocaleString()} MMK` : `$${totalPriceUSD}`}
                </span>
              </div>
              <button
                onClick={onNavigateToScan}
                className="py-2.5 px-5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-stone-950 shadow-lg hover:brightness-110 active:scale-95 transition flex items-center gap-2 shrink-0"
              >
                <span>{t.startScanNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. BAGAN STATIONS & PICKUP HUBS SECTION
         ───────────────────────────────────────────────────────────── */}
      <section
        id="stations"
        className="w-full bg-stone-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border border-stone-800 text-stone-100 transition-all"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.stationsTitle}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Pick Up or Drop Off Anywhere in Bagan
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-2">
              {t.stationsSubtitle}
            </p>
          </div>

          {/* 3 Station Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Old Bagan Station */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col justify-between space-y-4 hover:border-amber-400/50 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {oldBaganCount} Bikes Ready
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono font-bold">
                    Sunrise Ready
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">
                  Old Bagan Station (Ananda)
                </h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  Located directly opposite the ancient Tharabar Gate, 200m from Ananda Temple and Archaeological Museum.
                </p>
                <div className="mt-3 text-[11px] text-stone-400 space-y-1">
                  <p>⏰ Open: 05:30 AM – 07:30 PM</p>
                  <p>📍 GPS: 21.1717° N, 94.8585° E</p>
                </div>
              </div>
              <button
                onClick={onNavigateToScan}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-stone-850 hover:bg-stone-800 text-amber-400 border border-stone-700 transition flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{t.startScanNow}</span>
              </button>
            </div>

            {/* 2. Nyaung-U Main Hub */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col justify-between space-y-4 hover:border-amber-400/50 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {nyaungUCount} Bikes Ready
                  </span>
                  <span className="text-[11px] text-sky-400 font-mono font-bold">
                    24/7 Rescue Depot
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">
                  Nyaung-U Main Hub (Market)
                </h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  Near Mani-Sithu Morning Market, highway bus terminal, and restaurant row. Headquarters for Bagan Rescue trucks.
                </p>
                <div className="mt-3 text-[11px] text-stone-400 space-y-1">
                  <p>⏰ Open: 24/7 Fleet & Support Depot</p>
                  <p>📍 GPS: 21.1965° N, 94.9042° E</p>
                </div>
              </div>
              <button
                onClick={onNavigateToScan}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-stone-850 hover:bg-stone-800 text-amber-400 border border-stone-700 transition flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{t.startScanNow}</span>
              </button>
            </div>

            {/* 3. New Bagan Station */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col justify-between space-y-4 hover:border-amber-400/50 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {newBaganCount} Bikes Ready
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono font-bold">
                    Riverside Sunset
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">
                  New Bagan Station (Riverside)
                </h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  In the southern hotel and resort zone near the Ayeyarwady River bank and lacquerware workshops.
                </p>
                <div className="mt-3 text-[11px] text-stone-400 space-y-1">
                  <p>⏰ Open: 06:00 AM – 07:00 PM</p>
                  <p>📍 GPS: 21.1412° N, 94.8595° E</p>
                </div>
              </div>
              <button
                onClick={onNavigateToScan}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-stone-850 hover:bg-stone-800 text-amber-400 border border-stone-700 transition flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{t.startScanNow}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
