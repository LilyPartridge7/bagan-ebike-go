import React, { useState, useEffect } from 'react';
import { UserRole, Language } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';
import { 
  Zap, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Shield, 
  QrCode, 
  Home, 
  Compass, 
  Menu, 
  X,
  CreditCard,
  MapPin
} from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ role, onRoleChange, lang, onLangChange }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [queueCount, setQueueCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      storageService.flushOfflineQueue();
      setQueueCount(storageService.getOfflineQueueCount());
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const checkQueue = () => setQueueCount(storageService.getOfflineQueueCount());
    window.addEventListener('bagan_storage_update', checkQueue);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('bagan_storage_update', checkQueue);
    };
  }, []);

  const handleAnchorClick = (anchorId: string) => {
    setMobileMenuOpen(false);
    if (role !== 'landing') {
      onRoleChange('landing');
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(anchorId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-900/40 bg-stone-950/85 backdrop-blur-xl transition-all">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand / Logo (clicking switches to landing view) */}
        <button
          onClick={() => onRoleChange('landing')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                {t.appTitle}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Bagan
              </span>
            </div>
            <p className="text-[10px] text-stone-400 hidden sm:block truncate max-w-[200px]">
              {t.tagline}
            </p>
          </div>
        </button>

        {/* Center: Anchor Links (visible on md screens) */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-stone-300">
          <button
            onClick={() => handleAnchorClick('how-it-works')}
            className="hover:text-amber-400 transition"
          >
            {t.navHowItWorks}
          </button>
          <button
            onClick={() => handleAnchorClick('rates-fleet')}
            className="hover:text-amber-400 transition"
          >
            {t.navRates}
          </button>
          <button
            onClick={() => handleAnchorClick('stations')}
            className="hover:text-amber-400 transition"
          >
            {t.navStations}
          </button>
        </nav>

        {/* Right Controls: View Switcher & Bilingual Toggle */}
        <div className="flex items-center gap-2">
          {/* Offline / Online Badge */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
              isOnline
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-950/50 border-amber-500/40 text-amber-300 animate-pulse'
            }`}
            title={isOnline ? t.online : t.offline}
          >
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="hidden xl:inline">{isOnline ? t.online : t.offline}</span>
            {queueCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-stone-950 rounded-full text-[9px] font-bold">
                {queueCount}
              </span>
            )}
          </div>

          {/* Bilingual Switcher */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-lg p-0.5 flex items-center">
            <button
              onClick={() => onLangChange('en')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                lang === 'en'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLangChange('my')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all font-burmese ${
                lang === 'my'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              မြန်မာ
            </button>
          </div>

          {/* Core View Switcher: Home vs Scan & Ride vs Admin */}
          <div className="hidden sm:flex bg-stone-900/90 border border-stone-800 rounded-lg p-0.5 items-center">
            {/* Home / Landing */}
            <button
              onClick={() => onRoleChange('landing')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                role === 'landing'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 shadow font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t.navHome}</span>
            </button>

            {/* Scan & Ride */}
            <button
              onClick={() => onRoleChange('rider')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                role === 'rider'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 shadow font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{t.navScanRide}</span>
            </button>

            {/* Shop Owner / Admin */}
            <button
              onClick={() => onRoleChange('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 shadow font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t.adminView}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1.5 text-stone-300 hover:text-amber-400 bg-stone-900 border border-stone-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Demo Reset button */}
          <button
            onClick={() => {
              if (confirm('Reset demo bikes, rentals & location to default?')) {
                storageService.resetAllToDefault();
                window.location.reload();
              }
            }}
            className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-900 rounded-lg border border-transparent hover:border-stone-800 transition"
            title="Reset Seed Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-stone-800 bg-stone-950 px-4 py-3 space-y-2 animate-fadeIn">
          <div className="grid grid-cols-3 gap-1 pb-2 border-b border-stone-800 text-xs font-bold">
            <button
              onClick={() => {
                onRoleChange('landing');
                setMobileMenuOpen(false);
              }}
              className={`py-2 px-2 rounded-lg flex flex-col items-center gap-1 ${
                role === 'landing' ? 'bg-amber-500 text-stone-950 font-black' : 'text-stone-300 bg-stone-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => {
                onRoleChange('rider');
                setMobileMenuOpen(false);
              }}
              className={`py-2 px-2 rounded-lg flex flex-col items-center gap-1 ${
                role === 'rider' ? 'bg-amber-500 text-stone-950 font-black' : 'text-stone-300 bg-stone-900'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Scan & Ride</span>
            </button>
            <button
              onClick={() => {
                onRoleChange('admin');
                setMobileMenuOpen(false);
              }}
              className={`py-2 px-2 rounded-lg flex flex-col items-center gap-1 ${
                role === 'admin' ? 'bg-amber-500 text-stone-950 font-black' : 'text-stone-300 bg-stone-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          <div className="flex flex-col space-y-1.5 pt-1 text-xs font-bold text-stone-300">
            <button
              onClick={() => handleAnchorClick('how-it-works')}
              className="py-1.5 text-left hover:text-amber-400"
            >
              • {t.navHowItWorks}
            </button>
            <button
              onClick={() => handleAnchorClick('rates-fleet')}
              className="py-1.5 text-left hover:text-amber-400"
            >
              • {t.navRates}
            </button>
            <button
              onClick={() => handleAnchorClick('stations')}
              className="py-1.5 text-left hover:text-amber-400"
            >
              • {t.navStations}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
