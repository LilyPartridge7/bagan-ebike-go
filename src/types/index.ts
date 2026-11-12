export type BikeStatus = 'available' | 'in_use' | 'sos' | 'low_battery' | 'maintenance';

export type BikeModel = 
  | 'Single-Seater Classic Moped' 
  | 'Two-Seater Touring E-Bike' 
  | 'All-Terrain Fat-Tire E-Bike';

export type BaganStation = 
  | 'Old Bagan Station (Ananda)' 
  | 'New Bagan Station (Riverside)' 
  | 'Nyaung-U Main Hub (Market)' 
  | 'Dhammayangyi Outpost';

export interface Bike {
  id: string; // e.g., 'BGN-001'
  model: BikeModel;
  battery: number; // 0 - 100
  rangeKm: number;
  status: BikeStatus;
  station: BaganStation;
  lat: number;
  lng: number;
  gpsImei: string; // 15-digit IMEI for hardware tracker
  lastPing: string; // ISO string
  currentRentalId?: string;
  maxSpeedKmH: number;
  twoSeater: boolean;
}

export type PackageType = 'hourly' | 'half_day' | 'full_day';

export interface RentalPackage {
  id: PackageType;
  name: string;
  nameMm: string;
  durationHours: number;
  priceMMK: number;
  description: string;
  descriptionMm: string;
  popular?: boolean;
}

export type PaymentMethodType = 'mmqr' | 'cash' | 'card';
export type LocalWalletType = 'kbzpay' | 'wavepay' | 'ayapay' | 'cbpay';

export type PaymentStatus = 'pending_verification' | 'paid' | 'overtime_due';

export type MessagingApp = 'whatsapp' | 'telegram' | 'viber';

export type SOSReason = 'low_battery' | 'flat_tire' | 'mechanical' | 'lost';

export interface SOSAlert {
  active: boolean;
  reason: SOSReason;
  message?: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
  timestamp: string;
  resolved: boolean;
}

export interface Rental {
  id: string;
  bikeId: string;
  riderName: string;
  riderPhone: string;
  messagingApp: MessagingApp;
  hotelOrId: string; // Bagan hotel name or NRC/Passport
  emergencyContact: string;
  safetyRulesAgreed: boolean;
  packageType: PackageType;
  rateMMK: number;
  paymentMethod: PaymentMethodType;
  walletType?: LocalWalletType;
  transactionId?: string;
  receiptImage?: string;
  paymentStatus: PaymentStatus;
  startTime: string; // ISO timestamp
  endTime?: string;
  allocatedHours: number;
  totalCostMMK: number;
  overtimeFeeMMK?: number;
  status: 'active' | 'completed' | 'cancelled';
  lastLocation: {
    lat: number;
    lng: number;
    accuracy?: number;
    timestamp: string;
  };
  sosAlert?: SOSAlert;
}

export type UserRole = 'landing' | 'rider' | 'admin';
export type Language = 'en' | 'my';
