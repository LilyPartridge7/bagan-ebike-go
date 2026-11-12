import React, { useState, useEffect } from 'react';
import { UserRole, Language, Bike, Rental } from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { BaganParallaxBackground } from './components/BaganParallaxBackground';
import { LandingPage } from './components/landing/LandingPage';
import { RiderView } from './components/rider/RiderView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PhoneCall } from 'lucide-react';

export function App() {
  // If ?bike= query param is present, jump directly to Rider view; otherwise default to Landing Page
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('bike')) {
        return 'rider';
      }
    }
    return 'landing';
  });

  const [lang, setLang] = useState<Language>('en');
  const [bikes, setBikes] = useState<Bike[]>(() => storageService.getBikes());
  const [rentals, setRentals] = useState<Rental[]>(() => storageService.getRentals());
  const [activeRental, setActiveRental] = useState<Rental | null>(() => storageService.getActiveRental());

  // Listen to storage update events
  useEffect(() => {
    const syncData = () => {
      setBikes(storageService.getBikes());
      setRentals(storageService.getRentals());
      setActiveRental(storageService.getActiveRental());
    };

    window.addEventListener('bagan_storage_update', syncData);
    return () => window.removeEventListener('bagan_storage_update', syncData);
  }, []);

  // Listen to URL changes for ?bike= param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('bike')) {
        setRole('rider');
      }
    }
  }, []);

  const isDaylightMode = role === 'rider' && !!activeRental;

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-700 ${
      isDaylightMode ? 'bg-stone-950 text-stone-100' : 'text-stone-100'
    }`}>
      {/* Background with video + animated Bagan pagoda parallax */}
      <BaganParallaxBackground isDaylightMode={isDaylightMode} />

      {/* Top Header Navigation */}
      <Header
        role={role}
        onRoleChange={setRole}
        lang={lang}
        onLangChange={setLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 z-10">
        {role === 'landing' ? (
          <LandingPage
            bikes={bikes}
            lang={lang}
            onNavigateToScan={() => setRole('rider')}
          />
        ) : role === 'rider' ? (
          <RiderView
            bikes={bikes}
            activeRental={activeRental}
            lang={lang}
          />
        ) : (
          <AdminDashboard
            bikes={bikes}
            rentals={rentals}
            lang={lang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-stone-800/80 bg-stone-950/85 backdrop-blur-md py-6 text-center text-xs text-stone-400 z-10 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-medium text-stone-300">
            <span className="font-bold text-amber-400">Bagan E-Bike Go (ပုဂံ အီးဘိုက်)</span>
            <span>•</span>
            <span>Archaeological Heritage Zone, Myanmar</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <PhoneCall className="w-3.5 h-3.5" />
              24/7 Rescue Dispatch: +95 9 778 899 000
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
