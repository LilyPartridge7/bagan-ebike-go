import React, { useState, useEffect, useRef } from 'react';
import { Rental, Bike, Language, SOSReason } from '../../types';
import { translations } from '../../i18n/translations';
import { storageService } from '../../services/storageService';
import { 
  Timer, 
  MapPin, 
  Radio, 
  AlertOctagon, 
  PhoneCall, 
  Battery, 
  ShieldAlert, 
  ExternalLink, 
  CheckCircle, 
  X, 
  Compass, 
  Navigation,
  Sparkles,
  Bike as BikeIcon
} from 'lucide-react';

interface ActiveRideScreenProps {
  rental: Rental;
  bike: Bike;
  lang: Language;
  onEndRide: () => void;
}

export const ActiveRideScreen: React.FC<ActiveRideScreenProps> = ({
  rental,
  bike,
  lang,
  onEndRide,
}) => {
  const t = translations[lang];

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [currentCost, setCurrentCost] = useState<number>(rental.rateMMK);
  const [currentLocation, setCurrentLocation] = useState(rental.lastLocation);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [sosReason, setSosReason] = useState<SOSReason>('flat_tire');
  const [sosNotes, setSosNotes] = useState('');
  const [isSosActive, setIsSosActive] = useState(!!rental.sosAlert?.active);
  const [activeAlert, setActiveAlert] = useState(rental.sosAlert);

  // Timer interval
  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(rental.startTime).getTime();
      const now = Date.now();
      const diffSec = Math.max(0, Math.floor((now - start) / 1000));
      setElapsedSeconds(diffSec);

      // Check overtime: allocatedHours in seconds
      const allocatedSec = rental.allocatedHours * 3600;
      if (diffSec > allocatedSec) {
        const extraHours = Math.ceil((diffSec - allocatedSec) / 3600);
        setCurrentCost(rental.rateMMK + extraHours * 1500);
      } else {
        setCurrentCost(rental.rateMMK);
      }
    };

    calculateTime();
    const timerId = setInterval(calculateTime, 1000);
    return () => clearInterval(timerId);
  }, [rental]);

  // Geolocation watchPosition + Simulated movement through Bagan pagodas
  useEffect(() => {
    let watchId: number | null = null;

    if ('geolocation' in navigator) {
      try {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const accuracy = pos.coords.accuracy;
            setCurrentLocation({
              lat,
              lng,
              accuracy,
              timestamp: new Date().toISOString(),
            });
            storageService.updateRentalLocation(rental.id, lat, lng, accuracy);
          },
          (err) => {
            console.warn('Geolocation error or denied:', err);
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
        );
      } catch (e) {
        console.warn('watchPosition failed:', e);
      }
    }

    // Gentle mock GPS simulation every 6 seconds so the marker moves realistically across Bagan trails on map
    const simInterval = setInterval(() => {
      setCurrentLocation((prev) => {
        // Small step ~0.0001 degrees (~10 meters) wandering southeast towards Sulamani/Dhammayangyi
        const jitterLat = (Math.random() - 0.48) * 0.0003;
        const jitterLng = (Math.random() - 0.48) * 0.0003;
        const newLat = Number((prev.lat + jitterLat).toFixed(5));
        const newLng = Number((prev.lng + jitterLng).toFixed(5));
        storageService.updateRentalLocation(rental.id, newLat, newLng, 6);
        return {
          lat: newLat,
          lng: newLng,
          accuracy: 6,
          timestamp: new Date().toISOString(),
        };
      });
    }, 6000);

    return () => {
      if (watchId !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
      clearInterval(simInterval);
    };
  }, [rental.id]);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendSOS = () => {
    const updated = storageService.triggerSOS(
      rental.id,
      sosReason,
      sosNotes.trim() || undefined,
      currentLocation.lat,
      currentLocation.lng
    );
    if (updated && updated.sosAlert) {
      setIsSosActive(true);
      setActiveAlert(updated.sosAlert);
    }
    setIsSosModalOpen(false);
  };

  const handleCancelSOS = () => {
    storageService.resolveSOS(rental.id);
    setIsSosActive(false);
    setActiveAlert(undefined);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* High-Contrast Daylight Active Ride Card */}
      <div className="bg-stone-900 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-7 shadow-2xl text-stone-100 transition-all">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <BikeIcon className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-black text-amber-400">
                  {bike.id}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {t.rideRunning}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {bike.model} • Rider: {rental.riderName}
              </p>
            </div>
          </div>
          {/* Battery Status */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-bold text-stone-200">
            <Battery className="w-4 h-4 text-emerald-400" />
            <span>{bike.battery}%</span>
          </div>
        </div>

        {/* Live Running Timer & Cost Grid */}
        <div className="grid grid-cols-2 gap-3 my-5">
          {/* Running Timer */}
          <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
              <Timer className="w-4 h-4 text-amber-400" />
              <span>{t.timeElapsed}</span>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-black text-amber-300 tracking-wider">
              {formatTimer(elapsedSeconds)}
            </div>
            <p className="text-[10px] text-stone-500 mt-1">
              {t.includedDuration}: {rental.allocatedHours} hr(s)
            </p>
          </div>

          {/* Current Cost */}
          <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 text-center flex flex-col items-center justify-center">
            <div className="text-xs text-stone-400 mb-1">
              {t.currentCost}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              {currentCost.toLocaleString()}{' '}
              <span className="text-xs font-normal text-stone-400">MMK</span>
            </div>
            <p className="text-[10px] text-stone-500 mt-1">
              {rental.paymentStatus === 'paid' ? 'Paid via ' + (rental.walletType || rental.paymentMethod).toUpperCase() : 'Pending Counter Cash'}
            </p>
          </div>
        </div>

        {/* Location Beacon Bar */}
        <div className="p-3.5 rounded-2xl bg-stone-950/90 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="font-bold text-emerald-400">
                {t.gpsBeaconActive}
              </span>
            </div>
            <span className="font-mono text-[11px] text-stone-400">
              {currentLocation.lat.toFixed(4)}° N, {currentLocation.lng.toFixed(4)}° E
            </span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            {t.gpsBeaconDesc}
          </p>
          <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-800/60">
            <span>Accuracy: ±{currentLocation.accuracy || 8}m</span>
            <span>Station: {bike.station}</span>
          </div>
        </div>

        {/* Prominent Bagan Rescue SOS Section */}
        <div className="mt-5">
          {!isSosActive ? (
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-base sm:text-lg shadow-xl shadow-red-950/50 hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-3 animate-sos-pulse"
            >
              <AlertOctagon className="w-6 h-6 animate-spin text-white" />
              <span>{t.sosButton}</span>
            </button>
          ) : (
            // SOS Active Banner
            <div className="p-4 rounded-2xl bg-red-950/80 border-2 border-red-500 text-red-100 space-y-3 animate-pulse">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
                  <div>
                    <h4 className="font-black text-sm text-red-200">
                      {t.sosSentSuccess}
                    </h4>
                    <p className="text-xs text-red-300 capitalize">
                      Issue: {activeAlert?.reason.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancelSOS}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-800/80 hover:bg-red-700 text-white transition shrink-0"
                >
                  {t.cancelSos}
                </button>
              </div>

              {activeAlert?.googleMapsUrl && (
                <a
                  href={activeAlert.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-300 underline font-semibold"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Maps GPS Pin ({currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)})</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <div className="pt-2 border-t border-red-800/60 flex items-center justify-between text-xs font-bold text-red-200">
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>{t.callHelpline}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* End Ride / Return Bike Note */}
        <div className="mt-5 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p className="text-center sm:text-left text-[11px]">
            {t.endRideNotice}
          </p>
          <button
            onClick={onEndRide}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition shrink-0"
          >
            End / Return Bike Demo
          </button>
        </div>
      </div>

      {/* Bagan Rescue SOS Modal */}
      {isSosModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-red-500/50 rounded-2xl max-w-md w-full p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-6 h-6 text-red-500" />
                <h3 className="font-extrabold text-lg text-red-200">
                  {t.sosModalTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsSosModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {t.sosModalDesc}
            </p>

            {/* GPS Link Preview */}
            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Navigation className="w-4 h-4" />
                <span>GPS Pin Ready: {currentLocation.lat.toFixed(5)}°, {currentLocation.lng.toFixed(5)}°</span>
              </div>
            </div>

            {/* Reason Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-2">
                {t.selectSosReason}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'flat_tire', label: t.sosFlatTire },
                  { id: 'low_battery', label: t.sosLowBattery },
                  { id: 'mechanical', label: t.sosMechanical },
                  { id: 'lost', label: t.sosLost },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSosReason(item.id as SOSReason)}
                    className={`p-3 rounded-xl border text-left font-semibold transition ${
                      sosReason === item.id
                        ? 'bg-red-500/20 border-red-500 text-red-200'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                {t.sosNotes}
              </label>
              <textarea
                value={sosNotes}
                onChange={(e) => setSosNotes(e.target.value)}
                placeholder={t.sosNotesPlaceholder}
                rows={2}
                className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSosModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
              >
                {t.close}
              </button>
              <button
                type="button"
                onClick={handleSendSOS}
                className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/40 transition flex items-center justify-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>{t.sendSosAlert}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
