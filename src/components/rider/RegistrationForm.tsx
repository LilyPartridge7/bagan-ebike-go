import React, { useState } from 'react';
import { Bike, Language, MessagingApp } from '../../types';
import { translations } from '../../i18n/translations';
import { 
  User, 
  Phone, 
  MessageSquare, 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';

export interface RiderFormData {
  fullName: string;
  phoneNumber: string;
  messagingApp: MessagingApp;
  hotelOrId: string;
  emergencyContact: string;
  safetyRulesAgreed: boolean;
}

interface RegistrationFormProps {
  bike: Bike;
  lang: Language;
  initialData?: Partial<RiderFormData>;
  onSubmit: (data: RiderFormData) => void;
  onBack: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  bike,
  lang,
  initialData,
  onSubmit,
  onBack,
}) => {
  const t = translations[lang];

  const [formData, setFormData] = useState<RiderFormData>({
    fullName: initialData?.fullName || '',
    phoneNumber: initialData?.phoneNumber || '',
    messagingApp: initialData?.messagingApp || 'whatsapp',
    hotelOrId: initialData?.hotelOrId || '',
    emergencyContact: initialData?.emergencyContact || '',
    safetyRulesAgreed: initialData?.safetyRulesAgreed ?? false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
    }
    if (!formData.hotelOrId.trim()) {
      newErrors.hotelOrId = 'Hotel name or Passport / NRC is required.';
    }
    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency contact is required.';
    }
    if (!formData.safetyRulesAgreed) {
      newErrors.safetyRulesAgreed = 'You must agree to the Bagan safety rules.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleFillDemoTourist = () => {
    setFormData({
      fullName: 'Emma Watson',
      phoneNumber: '+44 7700 900123',
      messagingApp: 'whatsapp',
      hotelOrId: 'Bagan Thande Hotel (Old Bagan)',
      emergencyContact: 'David Watson (+44 7700 900124)',
      safetyRulesAgreed: true,
    });
    setErrors({});
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white/85 dark:bg-stone-900/85 backdrop-blur-md border border-amber-200/50 dark:border-amber-900/40 rounded-2xl p-5 sm:p-7 shadow-2xl text-stone-900 dark:text-stone-100 transition-all">
        {/* Step Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/60 dark:border-stone-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Renting {bike.id} • {bike.model}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
              {t.step1Header}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {t.step1Notice}
            </p>
          </div>
          {/* Fill Demo Data Button */}
          <button
            type="button"
            onClick={handleFillDemoTourist}
            className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition flex items-center gap-1 shrink-0"
            title="Auto-fill sample tourist data"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Auto-Fill Demo</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              {t.fullName} *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder={t.fullNamePlaceholder}
                className="w-full px-3.5 py-2.5 pl-9 rounded-xl text-xs sm:text-sm bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Phone Number + Messaging App */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {t.phoneNumber} *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder={t.phonePlaceholder}
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl text-xs sm:text-sm bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
              {errors.phoneNumber && (
                <p className="text-[11px] text-red-500 mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Messaging App Selector (WhatsApp / Telegram / Viber) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {t.messagingApp}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['whatsapp', 'telegram', 'viber'] as MessagingApp[]).map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setFormData({ ...formData, messagingApp: app })}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border capitalize transition flex items-center justify-center gap-1 ${
                      formData.messagingApp === app
                        ? app === 'whatsapp'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                          : app === 'telegram'
                          ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                          : 'bg-purple-600 text-white border-purple-500 shadow-sm'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>{app}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bagan Hotel / Guesthouse Name or Passport/NRC */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              {t.hotelOrId} *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.hotelOrId}
                onChange={(e) => setFormData({ ...formData, hotelOrId: e.target.value })}
                placeholder={t.hotelPlaceholder}
                className="w-full px-3.5 py-2.5 pl-9 rounded-xl text-xs sm:text-sm bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
              />
              <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
            {errors.hotelOrId && (
              <p className="text-[11px] text-red-500 mt-1">{errors.hotelOrId}</p>
            )}
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              {t.emergencyContact} *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder={t.emergencyPlaceholder}
                className="w-full px-3.5 py-2.5 pl-9 rounded-xl text-xs sm:text-sm bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
              />
              <ShieldCheck className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
            {errors.emergencyContact && (
              <p className="text-[11px] text-red-500 mt-1">{errors.emergencyContact}</p>
            )}
          </div>

          {/* Bagan Archaeological Zone Safety Rules Box */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25">
            <div className="flex items-center gap-2 mb-2 font-bold text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{t.safetyRulesTitle}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 list-disc list-inside pl-1">
              <li>{t.safetyRule1}</li>
              <li>{t.safetyRule2}</li>
              <li>{t.safetyRule3}</li>
              <li>{t.safetyRule4}</li>
            </ul>

            {/* Checkbox */}
            <label className="flex items-start gap-2.5 mt-3 pt-3 border-t border-amber-500/20 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.safetyRulesAgreed}
                onChange={(e) => setFormData({ ...formData, safetyRulesAgreed: e.target.checked })}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4 accent-amber-500"
              />
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                {t.safetyCheckbox} *
              </span>
            </label>
            {errors.safetyRulesAgreed && (
              <p className="text-[11px] text-red-500 mt-1 font-bold pl-6">
                {errors.safetyRulesAgreed}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.back}</span>
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-stone-950 shadow-lg hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <span>{t.nextToPayment}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
