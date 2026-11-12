import React, { useState } from 'react';
import { Bike, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { storageService } from '../../services/storageService';
import { QrStickerModal } from './QrStickerModal';
import { 
  QrCode, 
  Battery, 
  MapPin, 
  Radio, 
  Save, 
  Search, 
  Check, 
  Edit3,
  Sparkles
} from 'lucide-react';

interface FleetManagementProps {
  bikes: Bike[];
  lang: Language;
}

export const FleetManagement: React.FC<FleetManagementProps> = ({ bikes, lang }) => {
  const t = translations[lang];
  const [search, setSearch] = useState('');
  const [editingImei, setEditingImei] = useState<{ [bikeId: string]: string }>({});
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [selectedStickerBike, setSelectedStickerBike] = useState<Bike | null>(null);

  const filteredBikes = bikes.filter(
    (b) =>
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.station.toLowerCase().includes(search.toLowerCase()) ||
      b.model.toLowerCase().includes(search.toLowerCase())
  );

  const handleImeiChange = (bikeId: string, value: string) => {
    setEditingImei((prev) => ({ ...prev, [bikeId]: value }));
  };

  const handleSaveImei = (bikeId: string) => {
    const newImei = editingImei[bikeId];
    if (newImei && newImei.trim()) {
      storageService.updateBikeImei(bikeId, newImei.trim());
      setSavedSuccess(bikeId);
      setTimeout(() => setSavedSuccess(null), 2500);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Controls */}
      <div className="bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bike ID, model, or station..."
            className="w-full px-3.5 py-2 pl-9 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
        </div>
        <div className="text-xs text-stone-400 font-semibold self-end sm:self-center">
          Total Fleet: <strong className="text-amber-400">{bikes.length} E-Bikes</strong> • 4G GPS Ready
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800 font-bold">
              <tr>
                <th className="py-3 px-4">Bike ID & Model</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Battery</th>
                <th className="py-3 px-4">Station</th>
                <th className="py-3 px-4">{t.hardwareImei} (4G Telematics)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-medium text-stone-200">
              {filteredBikes.map((bike) => {
                const currentImeiValue = editingImei[bike.id] !== undefined ? editingImei[bike.id] : bike.gpsImei;
                const isModified = editingImei[bike.id] !== undefined && editingImei[bike.id] !== bike.gpsImei;
                const isSaved = savedSuccess === bike.id;

                return (
                  <tr key={bike.id} className="hover:bg-stone-850/40 transition">
                    {/* Bike ID */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-black text-amber-400 text-sm">
                        {bike.id}
                      </div>
                      <div className="text-[11px] text-stone-400 font-normal">
                        {bike.model}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          bike.status === 'available'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : bike.status === 'in_use'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : bike.status === 'sos'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse font-black'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {bike.status}
                      </span>
                    </td>

                    {/* Battery */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Battery
                          className={`w-4 h-4 ${
                            bike.battery > 40 ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        />
                        <span>{bike.battery}%</span>
                        <span className="text-[10px] text-stone-500 font-normal">
                          (~{bike.rangeKm}km)
                        </span>
                      </div>
                    </td>

                    {/* Station */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-[11px] text-stone-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate max-w-[130px]">{bike.station}</span>
                      </div>
                    </td>

                    {/* Editable IMEI Field */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={currentImeiValue}
                          onChange={(e) => handleImeiChange(bike.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 w-40"
                        />
                        {isModified ? (
                          <button
                            onClick={() => handleSaveImei(bike.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 text-stone-950 hover:bg-amber-400 transition flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                        ) : isSaved ? (
                          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Saved
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Actions: Print Sticker */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedStickerBike(bike)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-stone-800 hover:bg-stone-750 text-amber-300 border border-amber-500/25 transition inline-flex items-center gap-1.5"
                        title="Generate Printable QR Sticker"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QR Sticker</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Sticker Generator Modal */}
      {selectedStickerBike && (
        <QrStickerModal
          bike={selectedStickerBike}
          lang={lang}
          onClose={() => setSelectedStickerBike(null)}
        />
      )}
    </div>
  );
};
