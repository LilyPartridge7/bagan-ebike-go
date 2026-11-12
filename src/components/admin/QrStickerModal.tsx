import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Bike, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { Printer, X, Zap, Shield, Sparkles } from 'lucide-react';

interface QrStickerModalProps {
  bike: Bike;
  lang: Language;
  onClose: () => void;
}

export const QrStickerModal: React.FC<QrStickerModalProps> = ({ bike, lang, onClose }) => {
  const t = translations[lang];

  // The QR code contains the full web app URL with bike query param
  const qrTargetUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?bike=${bike.id}`
    : `https://bagan-ebike.go/?bike=${bike.id}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-amber-500/40 rounded-3xl max-w-sm w-full p-6 text-stone-100 shadow-2xl space-y-4">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base text-stone-100">
              {t.qrStickerTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Handlebar Sticker Preview */}
        <div
          id="printable-sticker"
          className="bg-white text-stone-950 p-6 rounded-2xl border-4 border-amber-500 shadow-xl flex flex-col items-center text-center space-y-3"
        >
          {/* Header on Sticker */}
          <div className="flex items-center gap-1.5 font-black text-amber-700 tracking-tight text-sm uppercase">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
            <span>BAGAN E-BIKE GO</span>
          </div>

          <div className="p-3 bg-stone-50 border-2 border-stone-900 rounded-2xl shadow-inner">
            <QRCodeSVG
              value={qrTargetUrl}
              size={180}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* Prominent Bike ID */}
          <div>
            <span className="font-mono text-2xl font-black tracking-widest text-stone-900 px-3 py-1 bg-amber-200/80 rounded-lg border border-amber-400">
              {bike.id}
            </span>
            <p className="text-[11px] font-bold text-stone-600 mt-2">
              Scan with Phone Camera to Unlock & Ride
            </p>
            <p className="text-[10px] text-stone-500 font-burmese">
              ဖုန်းကင်မရာဖြင့် စကန်ဖတ်၍ ချက်ချင်းစီးနင်းပါ
            </p>
          </div>

          {/* Footer details on sticker */}
          <div className="w-full pt-2 border-t border-stone-300 flex items-center justify-between text-[9px] font-mono font-bold text-stone-500">
            <span>STATION: {bike.station.split(' ')[0]}</span>
            <span>24/7 RESCUE</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          >
            {t.close}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-amber-600 to-amber-500 hover:brightness-110 text-stone-950 shadow transition flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
