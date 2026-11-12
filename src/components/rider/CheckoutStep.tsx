import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { 
  Bike, 
  Language, 
  PackageType, 
  PaymentMethodType, 
  LocalWalletType 
} from '../../types';
import { RENTAL_PACKAGES } from '../../data/seedBikes';
import { translations } from '../../i18n/translations';
import { RiderFormData } from './RegistrationForm';
import { 
  CreditCard, 
  QrCode, 
  Banknote, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon,
  Check,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface CheckoutStepProps {
  bike: Bike;
  riderData: RiderFormData;
  lang: Language;
  onConfirmRental: (rentalData: {
    packageType: PackageType;
    rateMMK: number;
    allocatedHours: number;
    paymentMethod: PaymentMethodType;
    walletType?: LocalWalletType;
    transactionId?: string;
    receiptImage?: string;
    paymentStatus: 'pending_verification' | 'paid';
  }) => void;
  onBack: () => void;
}

export const CheckoutStep: React.FC<CheckoutStepProps> = ({
  bike,
  riderData,
  lang,
  onConfirmRental,
  onBack,
}) => {
  const t = translations[lang];

  const [selectedPackage, setSelectedPackage] = useState<PackageType>('half_day');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('mmqr');
  const [selectedWallet, setSelectedWallet] = useState<LocalWalletType>('kbzpay');
  const [transactionId, setTransactionId] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  const currentPkg = RENTAL_PACKAGES.find((p) => p.id === selectedPackage) || RENTAL_PACKAGES[1];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    // If MMQR, transaction ID is encouraged or auto-filled for ease of testing
    if (paymentMethod === 'mmqr' && !transactionId.trim()) {
      // auto-fill dummy transaction ID if rider hasn't entered one, or validate
      const mockTx = `${selectedWallet.toUpperCase()}${Date.now().toString().slice(-8)}`;
      setTransactionId(mockTx);
    }

    setIsSubmitting(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#fbbf24'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      onConfirmRental({
        packageType: selectedPackage,
        rateMMK: currentPkg.priceMMK,
        allocatedHours: currentPkg.durationHours,
        paymentMethod,
        walletType: paymentMethod === 'mmqr' ? selectedWallet : undefined,
        transactionId: paymentMethod === 'mmqr' ? (transactionId || `TX-${Date.now().toString().slice(-6)}`) : undefined,
        receiptImage,
        paymentStatus: paymentMethod === 'cash' ? 'pending_verification' : 'paid',
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="bg-white/85 dark:bg-stone-900/85 backdrop-blur-md border border-amber-200/50 dark:border-amber-900/40 rounded-2xl p-5 sm:p-7 shadow-2xl text-stone-900 dark:text-stone-100 transition-all">
        {/* Step Header */}
        <div className="pb-4 border-b border-stone-200/60 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Rider: {riderData.fullName} ({riderData.phoneNumber})
            </span>
            <span className="text-xs font-mono font-extrabold bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
              {bike.id}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
            {t.step2Header}
          </h2>
        </div>

        {/* 1. Select Rental Package */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
            {t.choosePackage}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {RENTAL_PACKAGES.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/30'
                      : 'bg-white/60 dark:bg-stone-950/60 border-stone-200 dark:border-stone-800 hover:border-amber-300'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2 right-2 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                      Popular
                    </span>
                  )}
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                      {lang === 'my' ? pkg.nameMm : pkg.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">
                      {lang === 'my' ? pkg.descriptionMm : pkg.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-stone-200/50 dark:border-stone-800 flex items-baseline justify-between">
                    <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                      {pkg.priceMMK.toLocaleString()} <span className="text-[10px] font-bold text-stone-400">MMK</span>
                    </span>
                    <span className="text-[10px] text-stone-500">
                      {pkg.durationHours} hr{pkg.durationHours > 1 ? 's' : ''}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Select Payment Method */}
        <div className="mt-6 pt-5 border-t border-stone-200/60 dark:border-stone-800">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
            {t.selectPaymentMethod}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* MMQR Local Wallet */}
            <button
              type="button"
              onClick={() => setPaymentMethod('mmqr')}
              className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                paymentMethod === 'mmqr'
                  ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-white/60 dark:bg-stone-950/60 border-stone-200 dark:border-stone-800 hover:border-emerald-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {t.mmqrWallet}
                </p>
                <p className="text-[10px] text-stone-500 truncate max-w-[110px]">
                  KBZPay, WavePay
                </p>
              </div>
            </button>

            {/* Cash at Station */}
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                paymentMethod === 'cash'
                  ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                  : 'bg-white/60 dark:bg-stone-950/60 border-stone-200 dark:border-stone-800 hover:border-amber-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold">
                <Banknote className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {t.cashStation}
                </p>
                <p className="text-[10px] text-stone-500">
                  MMK or USD
                </p>
              </div>
            </button>

            {/* International Card (Mock) */}
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                paymentMethod === 'card'
                  ? 'bg-blue-500/10 border-blue-500 ring-2 ring-blue-500/30'
                  : 'bg-white/60 dark:bg-stone-950/60 border-stone-200 dark:border-stone-800 hover:border-blue-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {t.cardMock}
                </p>
                <p className="text-[10px] text-stone-500">
                  Visa / Mastercard
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Detail Section according to selected method */}
        <div className="mt-4 p-4 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
          {/* Method A: MMQR Local Wallet */}
          {paymentMethod === 'mmqr' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-stone-900 dark:text-stone-100">
                    {t.shopMmqrTitle}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {t.shopMmqrInstruction}{' '}
                    <span className="font-extrabold text-amber-600 dark:text-amber-400">
                      {currentPkg.priceMMK.toLocaleString()} MMK
                    </span>
                  </p>
                </div>
              </div>

              {/* Wallet Selector */}
              <div className="flex items-center gap-2">
                {(['kbzpay', 'wavepay', 'ayapay', 'cbpay'] as LocalWalletType[]).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setSelectedWallet(w)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border uppercase transition ${
                      selectedWallet === w
                        ? w === 'kbzpay'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : w === 'wavepay'
                          ? 'bg-yellow-500 text-stone-950 border-yellow-500'
                          : 'bg-red-600 text-white border-red-600'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>

              {/* Dynamic MMQR Code Display */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
                <div className="p-2 bg-white rounded-xl shadow-md border border-stone-200 shrink-0">
                  <QRCodeSVG
                    value={`MMQR:00020101021226480016MM.GOV.CBM.MMQR0109${selectedWallet.toUpperCase()}5204599953031045404${currentPkg.priceMMK}5802MM5915BAGAN_EBIKE_GO6005BAGAN62150511${bike.id}6304`}
                    size={130}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <div className="text-center sm:text-left text-xs space-y-1">
                  <p className="font-bold text-stone-900 dark:text-stone-100 flex items-center justify-center sm:justify-start gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Bagan E-Bike Go Official Station MMQR
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Account: 09 778 899 000 (U Min Thu - Bagan Hub)
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Note Reference: <span className="font-mono font-bold text-amber-600">{bike.id}</span>
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setTransactionId(`TX${Date.now().toString().slice(-8)}`)}
                      className="text-[10px] text-amber-600 dark:text-amber-400 underline font-semibold"
                    >
                      Click to Auto-fill Demo Transaction ID
                    </button>
                  </div>
                </div>
              </div>

              {/* Transaction ID Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.txIdLabel}
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => {
                    setTransactionId(e.target.value);
                    setTxError(null);
                  }}
                  placeholder={t.txIdPlaceholder}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
                {txError && (
                  <p className="text-[11px] text-red-500 mt-1">{txError}</p>
                )}
              </div>

              {/* Receipt Image Upload Preview */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.uploadReceipt}
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-3 py-2 rounded-xl text-xs font-bold bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 transition flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Screenshot</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {receiptImage && (
                    <div className="flex items-center gap-2">
                      <img
                        src={receiptImage}
                        alt="Receipt preview"
                        className="w-8 h-8 rounded object-cover border border-emerald-500 shadow-sm"
                      />
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Attached
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Method B: Pay Cash at Station */}
          {paymentMethod === 'cash' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
                <Banknote className="w-4 h-4" />
                <span>Pay at Bagan Station Counter</span>
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {t.cashNotice}
              </p>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-200">
                Amount Due: <strong>{currentPkg.priceMMK.toLocaleString()} MMK</strong> (or equivalent <strong>$2 USD</strong>) at {bike.station}.
              </div>
            </div>
          )}

          {/* Method C: International Card */}
          {paymentMethod === 'card' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold">
                <CreditCard className="w-4 h-4" />
                <span>Simulated Tourist Card Checkout</span>
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {t.cardNotice}
              </p>
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-900 dark:text-blue-200 flex items-center justify-between">
                <span>Test Visa / Mastercard **** 4242</span>
                <span className="font-extrabold text-emerald-500">Auto-Authorized</span>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Summary */}
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-bold text-stone-800 dark:text-stone-200">
              {lang === 'my' ? currentPkg.nameMm : currentPkg.name} ({currentPkg.durationHours} hrs)
            </span>
          </div>
          <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
            {currentPkg.priceMMK.toLocaleString()} MMK
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 text-stone-950 shadow-lg hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <CheckCircle2 className="w-4 h-4 text-stone-950" />
            <span>{isSubmitting ? 'Starting Ride...' : t.confirmRental}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
