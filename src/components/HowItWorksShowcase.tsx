import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { 
  QrCode, 
  CreditCard, 
  LifeBuoy, 
  Info, 
  Sparkles, 
  BatteryCharging, 
  Compass, 
  MapPin, 
  Zap,
  CheckCircle2
} from 'lucide-react';

interface HowItWorksShowcaseProps {
  lang: Language;
}

export const HowItWorksShowcase: React.FC<HowItWorksShowcaseProps> = ({ lang }) => {
  const t = translations[lang];
  const [imgError, setImgError] = useState(false);

  return (
    <section className="w-full mt-6">
      <div className="bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-stone-100 transition-all">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Bagan E-Bike Fleet & Roadside Rescue</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              {t.howItWorksTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              {t.howItWorksSubtitle}
            </p>
          </div>
        </div>

        {/* Featured Photo: /bagan-ebike-fleet.jpg (E-Bikes beside brick pagoda & bougainvillea) */}
        <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden mb-6 border border-amber-500/30 shadow-xl group">
          {!imgError ? (
            <img
              src="/bagan-ebike-fleet.jpg"
              alt="Bagan E-Bike Fleet parked beside brick pagoda and bougainvillea"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            // Clean SVG Placeholder Fallback
            <div className="w-full h-full bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 flex flex-col items-center justify-center p-4 relative">
              <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 400 160" preserveAspectRatio="none">
                <path d="M20 160 L40 100 L45 80 L50 100 L70 160 Z" fill="#b45309" />
                <path d="M120 160 L140 70 L145 45 L150 70 L170 160 Z" fill="#92400e" />
                <path d="M260 160 L280 90 L285 70 L290 90 L310 160 Z" fill="#78350f" />
                <circle cx="145" cy="40" r="14" fill="#fbbf24" opacity="0.7" />
              </svg>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-2 shadow-lg">
                  <Compass className="w-6 h-6 text-amber-300" />
                </div>
                <p className="text-amber-200 font-bold text-sm tracking-wide">
                  BAGAN E-BIKE GO • FLEET STATION
                </p>
                <p className="text-stone-300 text-xs mt-0.5">
                  Ananda Temple • New Bagan • Nyaung-U Market
                </p>
              </div>
            </div>
          )}

          {/* Scrim gradient on the image footer for crisp text overlay */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent pointer-events-none" />

          {/* Badges on Image */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="bg-stone-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-bold text-emerald-300">
                15 Fleet E-Bikes Ready
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-stone-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-stone-700/60 text-[11px] text-stone-300">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>Old Bagan • New Bagan • Nyaung-U</span>
            </div>
          </div>

          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-lg border border-amber-300/40">
            From 1,500 MMK/hr
          </div>
        </div>

        {/* 3-Step Visual Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Step 1 */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-amber-400/50 transition">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold mb-3 border border-amber-500/25">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm sm:text-base bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent flex items-center gap-1.5">
                {t.step1Title}
              </h3>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-300 font-medium pt-2.5 border-t border-stone-800">
              <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
              <span>Range: 45–55 km per charge</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-amber-400/50 transition">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold mb-3 border border-emerald-500/25">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm sm:text-base bg-gradient-to-r from-emerald-200 to-teal-300 bg-clip-text text-transparent flex items-center gap-1.5">
                {t.step2Title}
              </h3>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium pt-2.5 border-t border-stone-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>KBZPay • WavePay • Station Cash</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-amber-400/50 transition">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center font-bold mb-3 border border-red-500/25">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm sm:text-base bg-gradient-to-r from-red-200 to-rose-300 bg-clip-text text-transparent flex items-center gap-1.5">
                {t.step3Title}
              </h3>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-red-300 font-medium pt-2.5 border-t border-stone-800">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>Bagan Rescue Helpline: 24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Bagan Archaeology Notice */}
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{t.baganZoneNotice}</span>
        </div>
      </div>
    </section>
  );
};
