import React, { useState } from 'react';
import { Bike, Rental, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { LiveFleetMap } from './LiveFleetMap';
import { VerificationQueue } from './VerificationQueue';
import { FleetManagement } from './FleetManagement';
import { 
  Map, 
  CheckSquare, 
  SlidersHorizontal, 
  Bike as BikeIcon, 
  AlertTriangle, 
  CreditCard, 
  ShieldCheck, 
  Radio,
  LifeBuoy
} from 'lucide-react';

interface AdminDashboardProps {
  bikes: Bike[];
  rentals: Rental[];
  lang: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ bikes, rentals, lang }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'map' | 'queue' | 'fleet'>('map');

  const inUseCount = bikes.filter((b) => b.status === 'in_use').length;
  const sosCount = bikes.filter((b) => b.status === 'sos').length;
  const readyCount = bikes.filter((b) => b.status === 'available').length;
  const totalRevenue = rentals.reduce((acc, r) => acc + (r.paymentStatus === 'paid' ? r.totalCostMMK || r.rateMMK : 0), 0);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5 animate-fadeIn">
      {/* Top Banner & KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Active Riders */}
        <div className="bg-stone-900/90 backdrop-blur-md p-4 rounded-2xl border border-stone-800 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold shrink-0">
            <BikeIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 font-semibold">{t.activeRentalsCount}</p>
            <p className="text-xl sm:text-2xl font-black text-stone-100">{inUseCount}</p>
          </div>
        </div>

        {/* SOS Alerts */}
        <div className={`p-4 rounded-2xl border shadow-lg flex items-center gap-3 transition-all ${
          sosCount > 0 
            ? 'bg-red-950/80 border-red-500 text-red-200 animate-pulse' 
            : 'bg-stone-900/90 backdrop-blur-md border-stone-800'
        }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
            sosCount > 0 ? 'bg-red-500 text-white' : 'bg-red-500/15 text-red-400'
          }`}>
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 font-semibold">{t.sosAlertsCount}</p>
            <p className={`text-xl sm:text-2xl font-black ${sosCount > 0 ? 'text-red-400' : 'text-stone-100'}`}>
              {sosCount}
            </p>
          </div>
        </div>

        {/* Fleet Ready */}
        <div className="bg-stone-900/90 backdrop-blur-md p-4 rounded-2xl border border-stone-800 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 font-semibold">{t.fleetReady}</p>
            <p className="text-xl sm:text-2xl font-black text-stone-100">{readyCount} / {bikes.length}</p>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-stone-900/90 backdrop-blur-md p-4 rounded-2xl border border-stone-800 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 font-semibold">{t.revenueToday}</p>
            <p className="text-xl sm:text-2xl font-black text-amber-400">
              {totalRevenue.toLocaleString()} <span className="text-xs font-normal text-stone-400">MMK</span>
            </p>
          </div>
        </div>
      </div>

      {/* SOS Alert Notification Bar if any SOS is active */}
      {sosCount > 0 && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950 via-rose-950 to-red-950 border-2 border-red-500 text-red-100 flex items-center justify-between shadow-xl animate-bounce">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="text-xs sm:text-sm font-extrabold">
              URGENT RESCUE ALERT: {sosCount} E-Bike(s) reported emergency in Bagan plains!
            </span>
          </div>
          <button
            onClick={() => setActiveTab('map')}
            className="px-3 py-1 rounded-xl text-xs font-black bg-red-600 hover:bg-red-500 text-white shadow transition"
          >
            View on Map
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition ${
            activeTab === 'map'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>{t.tabFleetMap}</span>
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition relative ${
            activeTab === 'queue'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>{t.tabVerification}</span>
          {rentals.some((r) => r.paymentStatus === 'pending_verification') && (
            <span className="w-2 h-2 rounded-full bg-red-500 absolute -top-0.5 -right-0.5" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition ${
            activeTab === 'fleet'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{t.tabManagement}</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'map' && <LiveFleetMap bikes={bikes} rentals={rentals} lang={lang} />}
      {activeTab === 'queue' && <VerificationQueue rentals={rentals} bikes={bikes} lang={lang} />}
      {activeTab === 'fleet' && <FleetManagement bikes={bikes} lang={lang} />}
    </div>
  );
};
