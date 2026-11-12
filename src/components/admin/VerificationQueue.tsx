import React, { useState } from 'react';
import { Bike, Rental, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { storageService } from '../../services/storageService';
import { 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Check, 
  RotateCcw, 
  Image as ImageIcon,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface VerificationQueueProps {
  rentals: Rental[];
  bikes: Bike[];
  lang: Language;
}

export const VerificationQueue: React.FC<VerificationQueueProps> = ({ rentals, bikes, lang }) => {
  const t = translations[lang];
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [returnNotice, setReturnNotice] = useState<{ bikeId: string; overtimeMMK: number; totalCostMMK: number } | null>(null);

  // Active rentals
  const activeRentals = rentals.filter((r) => r.status === 'active');
  const pendingPayments = rentals.filter((r) => r.paymentStatus === 'pending_verification');

  const handleApprove = (rentalId: string) => {
    storageService.approvePayment(rentalId);
  };

  const handleReturnBike = (bikeId: string) => {
    const res = storageService.returnBike(bikeId);
    setReturnNotice({ bikeId, overtimeMMK: res.overtimeMMK, totalCostMMK: res.totalCostMMK });
    setTimeout(() => setReturnNotice(null), 6000);
  };

  const calculateCurrentDuration = (startTime: string) => {
    const diffMs = Date.now() - new Date(startTime).getTime();
    const hrs = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Return Success Notice */}
      {returnNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-emerald-100">
                Bike {returnNotice.bikeId} Successfully Returned & Reset!
              </h4>
              <p className="text-xs text-emerald-300">
                Total Collected: {returnNotice.totalCostMMK.toLocaleString()} MMK{' '}
                {returnNotice.overtimeMMK > 0 && `(Includes ${returnNotice.overtimeMMK.toLocaleString()} MMK Overtime Fee)`}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-500/20 px-2.5 py-1 rounded-lg">
            Status: AVAILABLE
          </span>
        </div>
      )}

      {/* 1. Pending Payments Queue */}
      <div className="bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-800 p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-100">
                Payment Verification Queue
              </h3>
              <p className="text-xs text-stone-400">
                Pending MMQR transaction receipts and station cash collections
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            {pendingPayments.length} Pending
          </span>
        </div>

        {pendingPayments.length === 0 ? (
          <p className="text-xs text-stone-500 py-4 text-center italic">
            All payments are verified. No pending approvals in queue.
          </p>
        ) : (
          <div className="space-y-3">
            {pendingPayments.map((rental) => (
              <div
                key={rental.id}
                className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {rental.bikeId}
                    </span>
                    <span className="text-xs font-bold text-stone-200">
                      {rental.riderName} ({rental.riderPhone})
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {rental.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Amount: <strong className="text-emerald-400">{rental.rateMMK.toLocaleString()} MMK</strong> • Hotel: {rental.hotelOrId}
                  </p>
                  {rental.transactionId && (
                    <p className="text-[11px] font-mono text-stone-500 mt-0.5">
                      Tx Ref: {rental.transactionId}
                    </p>
                  )}
                  {rental.receiptImage && (
                    <button
                      type="button"
                      onClick={() => setPreviewImage(rental.receiptImage || null)}
                      className="mt-1 text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      View Uploaded Receipt Screenshot
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleApprove(rental.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Active Rides & Return Check-In Queue */}
      <div className="bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-800 p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-100">
                Active Rides & Return Check-In
              </h3>
              <p className="text-xs text-stone-400">
                Check in returning e-bikes, stop running timers, and calculate overtime fees
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
            {activeRentals.length} Active On Road
          </span>
        </div>

        {activeRentals.length === 0 ? (
          <p className="text-xs text-stone-500 py-4 text-center italic">
            No active rides currently on road.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeRentals.map((rental) => {
              const start = new Date(rental.startTime);
              const diffHours = (Date.now() - start.getTime()) / (1000 * 60 * 60);
              const isOvertime = diffHours > rental.allocatedHours;
              const overtimeHours = isOvertime ? Math.ceil(diffHours - rental.allocatedHours) : 0;
              const overtimeFee = overtimeHours * 1500;

              return (
                <div
                  key={rental.id}
                  className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-black text-amber-400">
                          {rental.bikeId}
                        </span>
                        <span className="text-xs font-bold text-stone-200">
                          {rental.riderName}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-stone-400">
                        {calculateCurrentDuration(rental.startTime)}
                      </span>
                    </div>

                    <p className="text-xs text-stone-400">
                      Package: {rental.packageType.toUpperCase()} ({rental.allocatedHours} hrs) • Rate: {rental.rateMMK.toLocaleString()} MMK
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Contact: {rental.riderPhone} ({rental.messagingApp})
                    </p>

                    {/* Overtime warning if exceeded */}
                    {isOvertime && (
                      <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center justify-between">
                        <span>Overtime: +{overtimeHours} hour(s)</span>
                        <strong className="text-amber-400">+{overtimeFee.toLocaleString()} MMK Due</strong>
                      </div>
                    )}
                  </div>

                  {/* Return Bike Button */}
                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      GPS: {rental.lastLocation.lat.toFixed(4)}, {rental.lastLocation.lng.toFixed(4)}
                    </span>
                    <button
                      onClick={() => handleReturnBike(rental.bikeId)}
                      className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-600 to-amber-500 hover:brightness-110 text-stone-950 shadow transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.returnAndCheckIn}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-4 text-center">
            <h4 className="font-bold text-sm text-stone-200 mb-3">
              Payment Receipt Screenshot
            </h4>
            <div className="max-h-96 overflow-auto rounded-xl border border-stone-800 mb-4 bg-stone-950">
              <img src={previewImage} alt="Receipt Full" className="w-full object-contain" />
            </div>
            <button
              onClick={() => setPreviewImage(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 transition"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
