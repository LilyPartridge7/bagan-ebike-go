import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Bike, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { storageService } from '../../services/storageService';
import { 
  Camera, 
  CameraOff, 
  Search, 
  Zap, 
  Battery, 
  MapPin, 
  Gauge, 
  Users, 
  Sparkles, 
  ArrowRight,
  AlertCircle 
} from 'lucide-react';

interface QRScannerSectionProps {
  lang: Language;
  onBikeSelect: (bike: Bike) => void;
  selectedBike: Bike | null;
  onProceedToRegister: () => void;
}

export const QRScannerSection: React.FC<QRScannerSectionProps> = ({
  lang,
  onBikeSelect,
  selectedBike,
  onProceedToRegister,
}) => {
  const t = translations[lang];
  const [manualId, setManualId] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'bagan-qr-reader';

  // Read URL param ?bike=BGN-004 on mount once safely
  const initializedParamRef = useRef(false);
  useEffect(() => {
    if (initializedParamRef.current) return;
    initializedParamRef.current = true;
    const params = new URLSearchParams(window.location.search);
    const bikeParam = params.get('bike');
    if (bikeParam && (!selectedBike || selectedBike.id.toUpperCase() !== bikeParam.toUpperCase())) {
      const bike = storageService.getBikeById(bikeParam);
      if (bike) {
        onBikeSelect(bike);
      }
    }
  }, [onBikeSelect, selectedBike]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerContainerId);
      }
      setIsCameraActive(true);
      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
        },
        (decodedText) => {
          handleScannedText(decodedText);
          stopCamera();
        },
        () => {
          // scanning frame tick
        }
      );
    } catch (err: unknown) {
      console.warn('Camera start error:', err);
      setIsCameraActive(false);
      setCameraError(
        'Camera access not available or permission denied. Please use the manual input or simulation button below.'
      );
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && isCameraActive) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.warn('Camera stop error:', e);
      }
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleScannedText = (text: string) => {
    // Extract BGN-XXX or raw text
    const match = text.match(/BGN-\d{3}/i) || text.match(/\b\d{3}\b/);
    const candidate = match ? (match[0].toUpperCase().startsWith('BGN-') ? match[0].toUpperCase() : `BGN-${match[0]}`) : text.trim().toUpperCase();
    
    const bike = storageService.getBikeById(candidate);
    if (bike) {
      setInputError(null);
      onBikeSelect(bike);
    } else {
      setInputError(t.bikeNotFound);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    const formatted = manualId.trim().toUpperCase().startsWith('BGN-')
      ? manualId.trim().toUpperCase()
      : `BGN-${manualId.trim().padStart(3, '0')}`;

    const bike = storageService.getBikeById(formatted);
    if (bike) {
      setInputError(null);
      onBikeSelect(bike);
    } else {
      setInputError(t.bikeNotFound);
    }
  };

  const handleSimulateScan = () => {
    const bike = storageService.getBikeById('BGN-004');
    if (bike) {
      setInputError(null);
      onBikeSelect(bike);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Viewfinder Glassmorphic Card */}
      <div className="bg-white/85 dark:bg-stone-900/85 backdrop-blur-md border border-amber-200/50 dark:border-amber-900/40 rounded-2xl p-5 sm:p-6 shadow-2xl text-stone-900 dark:text-stone-100 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100">
                {t.scanTitle}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {t.scanSubtitle}
              </p>
            </div>
          </div>
          {/* Camera Toggle Button */}
          <button
            onClick={isCameraActive ? stopCamera : startCamera}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
              isCameraActive
                ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                : 'bg-amber-500 text-stone-950 hover:bg-amber-400 font-bold'
            }`}
          >
            {isCameraActive ? (
              <>
                <CameraOff className="w-3.5 h-3.5" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5" />
                <span>Camera</span>
              </>
            )}
          </button>
        </div>

        {/* Viewfinder Frame */}
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] mx-auto aspect-square rounded-2xl overflow-hidden bg-stone-950 border-2 border-dashed border-amber-500/50 shadow-inner flex flex-col items-center justify-center my-3 group">
          {/* HTML5 QR Code Mount */}
          <div id={scannerContainerId} className="w-full h-full overflow-hidden" />

          {/* Viewfinder Overlay Graphics */}
          {!isCameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-stone-950/80 backdrop-blur-sm z-10">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
                <Camera className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-xs font-semibold text-stone-200">
                {cameraError || 'Rear Camera Viewfinder'}
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Tap "Camera" above or use the quick simulation button below
              </p>
            </div>
          )}

          {/* Animated Scanning Laser Line */}
          {isCameraActive && (
            <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-laser z-20 pointer-events-none" />
          )}

          {/* Corner Guides */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400 z-10 pointer-events-none" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400 z-10 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400 z-10 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400 z-10 pointer-events-none" />
        </div>

        {/* Quick Simulation Debug Button (as requested in spec: "Simulate Scan: BGN-004") */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4 pt-3 border-t border-amber-200/40 dark:border-amber-900/40">
          <button
            onClick={handleSimulateScan}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-stone-950 shadow-md hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>{t.simulateBgn4}</span>
          </button>
        </div>

        {/* Manual Input Fallback */}
        <div className="mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-800">
          <p className="text-xs font-semibold text-stone-600 dark:text-stone-400 mb-2">
            {t.orManual}
          </p>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={manualId}
                onChange={(e) => {
                  setManualId(e.target.value);
                  setInputError(null);
                }}
                placeholder={t.bikeIdPlaceholder}
                className="w-full px-3.5 py-2 pl-9 rounded-xl text-xs sm:text-sm bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 uppercase font-mono font-bold"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-amber-400 border border-amber-500/30 transition shrink-0"
            >
              {t.submitBikeId}
            </button>
          </form>
          {inputError && (
            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-2 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{inputError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Bike Status Card */}
      {selectedBike && (
        <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl transition-all animate-fadeIn">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tracking-wider">
                  {selectedBike.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    selectedBike.status === 'available'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      : selectedBike.status === 'in_use'
                      ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                      : selectedBike.status === 'sos'
                      ? 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30 animate-pulse'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {selectedBike.status === 'available'
                    ? t.statusAvailable
                    : selectedBike.status === 'in_use'
                    ? t.statusInUse
                    : selectedBike.status === 'sos'
                    ? t.statusSos
                    : t.statusLowBattery}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
                {selectedBike.model}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/80 px-2.5 py-1 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-[11px] truncate max-w-[140px] sm:max-w-none">
                {selectedBike.station}
              </span>
            </div>
          </div>

          {/* Animated Battery & Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            {/* Battery Gauge */}
            <div className="bg-amber-50/70 dark:bg-stone-800/60 p-3 rounded-xl border border-amber-200/50 dark:border-stone-700">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                <span>{t.batteryGauge}</span>
                <Battery className={`w-3.5 h-3.5 ${selectedBike.battery > 30 ? 'text-emerald-500' : 'text-amber-500'}`} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-stone-900 dark:text-stone-100">
                  {selectedBike.battery}%
                </span>
              </div>
              {/* Animated Progress Bar */}
              <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 rounded-full ${
                    selectedBike.battery > 50
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                      : selectedBike.battery > 20
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-red-500 to-rose-400'
                  }`}
                  style={{ width: `${selectedBike.battery}%` }}
                />
              </div>
            </div>

            {/* Estimated Range */}
            <div className="bg-amber-50/70 dark:bg-stone-800/60 p-3 rounded-xl border border-amber-200/50 dark:border-stone-700">
              <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                {t.estimatedRange}
              </div>
              <div className="text-xl font-black text-amber-600 dark:text-amber-400">
                ~{selectedBike.rangeKm} <span className="text-xs font-normal text-stone-400">km</span>
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Full temple loop</p>
            </div>

            {/* Max Speed */}
            <div className="bg-amber-50/70 dark:bg-stone-800/60 p-3 rounded-xl border border-amber-200/50 dark:border-stone-700">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                <span>{t.maxSpeed}</span>
                <Gauge className="w-3.5 h-3.5 text-stone-400" />
              </div>
              <div className="text-xl font-black text-stone-900 dark:text-stone-100">
                {selectedBike.maxSpeedKmH} <span className="text-xs font-normal text-stone-400">km/h</span>
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Zone speed limit</p>
            </div>

            {/* Seating */}
            <div className="bg-amber-50/70 dark:bg-stone-800/60 p-3 rounded-xl border border-amber-200/50 dark:border-stone-700">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                <span>{t.seating}</span>
                <Users className="w-3.5 h-3.5 text-stone-400" />
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">
                {selectedBike.twoSeater ? t.twoSeater : t.singleSeater}
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Helmet included</p>
            </div>
          </div>

          {/* Action Button */}
          {selectedBike.status === 'available' ? (
            <button
              onClick={onProceedToRegister}
              className="w-full py-3 px-4 rounded-xl font-black text-sm sm:text-base bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-stone-950 shadow-lg hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <span>{t.proceedToRegister}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 text-center font-medium">
              {t.bikeNotAvailable}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
