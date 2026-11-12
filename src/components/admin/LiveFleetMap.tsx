import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Bike, Rental, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { storageService } from '../../services/storageService';
import { 
  Phone, 
  MessageSquare, 
  Battery, 
  Clock, 
  AlertOctagon, 
  LifeBuoy, 
  MapPin, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

interface LiveFleetMapProps {
  bikes: Bike[];
  rentals: Rental[];
  lang: Language;
}

// Helper to center or zoom map
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Create custom L.divIcon for high performance and zero missing asset issues
const createBikeIcon = (bike: Bike) => {
  let colorBg = '#10b981'; // Green
  let pulseClass = '';

  if (bike.status === 'sos') {
    colorBg = '#ef4444'; // Flashing Red
    pulseClass = 'animate-sos-pulse';
  } else if (bike.status === 'in_use') {
    colorBg = '#3b82f6'; // Blue
  } else if (bike.status === 'low_battery' || bike.battery <= 20) {
    colorBg = '#f59e0b'; // Amber
  }

  const html = `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
      <div class="${pulseClass}" style="
        width: 32px; 
        height: 32px; 
        background: ${colorBg}; 
        border-radius: 50%; 
        border: 2px solid #ffffff; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.4); 
        display: flex; 
        align-items: center; 
        justify-content: center;
        color: white;
        font-weight: 800;
        font-size: 10px;
        font-family: monospace;
      ">
        ${bike.id.replace('BGN-', '')}
      </div>
      <div style="
        position: absolute; 
        bottom: -4px; 
        width: 8px; 
        height: 8px; 
        background: ${colorBg}; 
        transform: rotate(45deg);
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-bike-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32],
  });
};

export const LiveFleetMap: React.FC<LiveFleetMapProps> = ({ bikes, rentals, lang }) => {
  const t = translations[lang];
  const [filter, setFilter] = useState<'all' | 'available' | 'in_use' | 'sos' | 'low_battery'>('all');
  const [mapCenter, setMapCenter] = useState<[number, number]>([21.1717, 94.8585]); // Bagan center
  const [zoomLevel, setZoomLevel] = useState<number>(13);

  const filteredBikes = bikes.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'low_battery') return b.status === 'low_battery' || b.battery <= 20;
    return b.status === filter;
  });

  const getRentalForBike = (bikeId: string) => {
    return rentals.find((r) => r.bikeId === bikeId && r.status === 'active');
  };

  const handleDispatchRescue = (rentalId: string) => {
    alert('Rescue Pickup Truck dispatched from Nyaung-U Hub! Estimated arrival: 12 minutes.');
  };

  const handleResolveSos = (rentalId: string) => {
    storageService.resolveSOS(rentalId);
  };

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Top Filter and Station Shortcuts Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-900/90 backdrop-blur-md p-3 rounded-2xl border border-stone-800">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              { id: 'all', label: t.allBikes, count: bikes.length },
              { id: 'in_use', label: t.filterInUse, count: bikes.filter((b) => b.status === 'in_use').length, color: 'text-blue-400' },
              { id: 'sos', label: t.filterSos, count: bikes.filter((b) => b.status === 'sos').length, color: 'text-red-400 font-black' },
              { id: 'available', label: t.filterAvailable, count: bikes.filter((b) => b.status === 'available').length, color: 'text-emerald-400' },
              { id: 'low_battery', label: t.filterLowBattery, count: bikes.filter((b) => b.status === 'low_battery' || b.battery <= 20).length, color: 'text-amber-400' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                filter === item.id
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-750'
              }`}
            >
              <span>{item.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] bg-stone-900/40 ${'color' in item ? item.color : ''}`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Station Zoom Buttons */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[11px] text-stone-400 mr-1 hidden sm:inline">Jump to:</span>
          <button
            onClick={() => {
              setMapCenter([21.1717, 94.8585]);
              setZoomLevel(14);
            }}
            className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px]"
          >
            Old Bagan
          </button>
          <button
            onClick={() => {
              setMapCenter([21.1412, 94.8595]);
              setZoomLevel(14);
            }}
            className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px]"
          >
            New Bagan
          </button>
          <button
            onClick={() => {
              setMapCenter([21.1965, 94.9042]);
              setZoomLevel(14);
            }}
            className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px]"
          >
            Nyaung-U
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-stone-800 shadow-2xl relative">
        <MapContainer
          center={mapCenter}
          zoom={zoomLevel}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <MapController center={mapCenter} zoom={zoomLevel} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredBikes.map((bike) => {
            const rental = getRentalForBike(bike.id);
            const isSos = bike.status === 'sos';

            return (
              <Marker
                key={bike.id}
                position={[bike.lat, bike.lng]}
                icon={createBikeIcon(bike)}
              >
                <Popup className="bagan-bike-popup">
                  <div className="p-2 min-w-[240px] text-stone-100 text-xs space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-stone-700">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-amber-400 text-sm">
                          {bike.id}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            isSos
                              ? 'bg-red-500 text-white animate-pulse'
                              : bike.status === 'in_use'
                              ? 'bg-blue-500 text-white'
                              : 'bg-emerald-500 text-stone-950'
                          }`}
                        >
                          {bike.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400">
                        {bike.battery}% Bat
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-300 font-semibold">
                      {bike.model}
                    </p>

                    {/* Active Rental Info if in use */}
                    {rental && (
                      <div className="p-2 rounded-lg bg-stone-900 border border-stone-800 space-y-1 text-[11px]">
                        <p className="font-bold text-stone-200">
                          Rider: {rental.riderName}
                        </p>
                        <p className="text-stone-400">
                          Hotel: {rental.hotelOrId}
                        </p>

                        {/* Direct Contacts */}
                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={`https://wa.me/${rental.riderPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            WhatsApp
                          </a>
                          <a
                            href={`tel:${rental.riderPhone}`}
                            className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-bold flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            Call
                          </a>
                        </div>
                      </div>
                    )}

                    {/* SOS Alert Banner inside popup if active */}
                    {isSos && rental?.sosAlert && (
                      <div className="p-2 rounded-lg bg-red-950/80 border border-red-500 text-[11px] text-red-200 space-y-1.5">
                        <div className="flex items-center gap-1 font-bold text-red-300">
                          <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                          <span>Emergency: {rental.sosAlert.reason.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        {rental.sosAlert.message && (
                          <p className="text-[10px] italic text-red-100">
                            "{rental.sosAlert.message}"
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => handleDispatchRescue(rental.id)}
                            className="flex-1 py-1 px-2 rounded bg-red-600 hover:bg-red-500 text-white font-extrabold text-[10px] flex items-center justify-center gap-1"
                          >
                            <LifeBuoy className="w-3 h-3" />
                            Dispatch Truck
                          </button>
                          <button
                            onClick={() => handleResolveSos(rental.id)}
                            className="py-1 px-2 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px]"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bottom Metadata */}
                    <div className="pt-1 text-[10px] text-stone-400 flex items-center justify-between">
                      <span>Station: {bike.station.split(' ')[0]}</span>
                      <span>IMEI: {bike.gpsImei.slice(-4)}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Quick Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-stone-900/90 backdrop-blur-md p-2.5 rounded-xl border border-stone-800 shadow-lg text-[11px] text-stone-300 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>In Use</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-400 font-bold">SOS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Low Bat</span>
          </div>
        </div>
      </div>
    </div>
  );
};
