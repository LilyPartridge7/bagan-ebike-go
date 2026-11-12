import { Bike, Rental, SOSAlert, SOSReason } from '../types';
import { INITIAL_BIKES } from '../data/seedBikes';

const BIKES_KEY = 'bagan_ebike_fleet_v1';
const RENTALS_KEY = 'bagan_ebike_rentals_v1';
const ACTIVE_RENTAL_KEY = 'bagan_ebike_active_rental_id';
const OFFLINE_QUEUE_KEY = 'bagan_ebike_offline_queue';

export interface StorageState {
  bikes: Bike[];
  rentals: Rental[];
  activeRental: Rental | null;
  offlineQueueCount: number;
}

// Seed sample rentals for BGN-006 and BGN-009 (SOS)
const INITIAL_RENTALS: Rental[] = [
  {
    id: 'RENT-001',
    bikeId: 'BGN-006',
    riderName: 'Sophie Miller',
    riderPhone: '+44 7911 123456',
    messagingApp: 'whatsapp',
    hotelOrId: 'Aureum Palace Hotel & Resort Bagan',
    emergencyContact: 'Mark Miller (+44 7911 123457)',
    safetyRulesAgreed: true,
    packageType: 'half_day',
    rateMMK: 4000,
    paymentMethod: 'mmqr',
    walletType: 'kbzpay',
    transactionId: 'KBZ202611129981',
    paymentStatus: 'paid',
    startTime: new Date(Date.now() - 1000 * 60 * 75).toISOString(), // 1 hr 15m ago
    allocatedHours: 4,
    totalCostMMK: 4000,
    status: 'active',
    lastLocation: {
      lat: 21.1820,
      lng: 94.8850,
      accuracy: 8,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'RENT-002',
    bikeId: 'BGN-009',
    riderName: 'Ko Than Htike',
    riderPhone: '+95 9 450 123 789',
    messagingApp: 'telegram',
    hotelOrId: 'NRC 12/LAMATA(N)098123',
    emergencyContact: 'Ma Sandar (+95 9 450 123 790)',
    safetyRulesAgreed: true,
    packageType: 'hourly',
    rateMMK: 1500,
    paymentMethod: 'cash',
    paymentStatus: 'pending_verification',
    startTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    allocatedHours: 1,
    totalCostMMK: 1500,
    status: 'active',
    lastLocation: {
      lat: 21.1645,
      lng: 94.8812,
      accuracy: 12,
      timestamp: new Date().toISOString(),
    },
    sosAlert: {
      active: true,
      reason: 'flat_tire',
      message: 'Rear tire got punctured on sandy trail near Sulamani temple',
      lat: 21.1645,
      lng: 94.8812,
      googleMapsUrl: 'https://maps.google.com/?q=21.1645,94.8812',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      resolved: false,
    },
  },
];

class StorageService {
  constructor() {
    this.initStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.flushOfflineQueue());
    }
  }

  private initStorage() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(BIKES_KEY)) {
      localStorage.setItem(BIKES_KEY, JSON.stringify(INITIAL_BIKES));
    }
    if (!localStorage.getItem(RENTALS_KEY)) {
      localStorage.setItem(RENTALS_KEY, JSON.stringify(INITIAL_RENTALS));
    }
    if (!localStorage.getItem(OFFLINE_QUEUE_KEY)) {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([]));
    }
  }

  private notify() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bagan_storage_update'));
    }
  }

  public getBikes(): Bike[] {
    if (typeof window === 'undefined') return INITIAL_BIKES;
    try {
      const data = localStorage.getItem(BIKES_KEY);
      return data ? JSON.parse(data) : INITIAL_BIKES;
    } catch {
      return INITIAL_BIKES;
    }
  }

  public getBikeById(id: string): Bike | undefined {
    return this.getBikes().find((b) => b.id.toUpperCase() === id.toUpperCase());
  }

  public getRentals(): Rental[] {
    if (typeof window === 'undefined') return INITIAL_RENTALS;
    try {
      const data = localStorage.getItem(RENTALS_KEY);
      return data ? JSON.parse(data) : INITIAL_RENTALS;
    } catch {
      return INITIAL_RENTALS;
    }
  }

  public getActiveRental(): Rental | null {
    if (typeof window === 'undefined') return null;
    const activeId = localStorage.getItem(ACTIVE_RENTAL_KEY);
    if (!activeId) return null;
    const rentals = this.getRentals();
    return rentals.find((r) => r.id === activeId && r.status === 'active') || null;
  }

  public getOfflineQueueCount(): number {
    if (typeof window === 'undefined') return 0;
    try {
      const q = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return q ? JSON.parse(q).length : 0;
    } catch {
      return 0;
    }
  }

  public startRental(newRental: Omit<Rental, 'id' | 'startTime' | 'status'>): Rental {
    const bikes = this.getBikes();
    const rentals = this.getRentals();
    const rentalId = 'RENT-' + Date.now().toString().slice(-6);

    const rental: Rental = {
      ...newRental,
      id: rentalId,
      startTime: new Date().toISOString(),
      status: 'active',
    };

    // Update bike status
    const updatedBikes = bikes.map((b) => {
      if (b.id === rental.bikeId) {
        return {
          ...b,
          status: 'in_use' as const,
          currentRentalId: rentalId,
          lastPing: new Date().toISOString(),
          lat: rental.lastLocation.lat,
          lng: rental.lastLocation.lng,
        };
      }
      return b;
    });

    rentals.unshift(rental);

    localStorage.setItem(BIKES_KEY, JSON.stringify(updatedBikes));
    localStorage.setItem(RENTALS_KEY, JSON.stringify(rentals));
    localStorage.setItem(ACTIVE_RENTAL_KEY, rentalId);

    this.queueOfflineAction('START_RENTAL', rental);
    this.notify();
    return rental;
  }

  public updateRentalLocation(rentalId: string, lat: number, lng: number, accuracy = 5) {
    const rentals = this.getRentals();
    const bikes = this.getBikes();
    let updated = false;

    const updatedRentals = rentals.map((r) => {
      if (r.id === rentalId) {
        updated = true;
        return {
          ...r,
          lastLocation: {
            lat,
            lng,
            accuracy,
            timestamp: new Date().toISOString(),
          },
        };
      }
      return r;
    });

    if (updated) {
      const rental = updatedRentals.find((r) => r.id === rentalId);
      const updatedBikes = bikes.map((b) => {
        if (rental && b.id === rental.bikeId) {
          return {
            ...b,
            lat,
            lng,
            lastPing: new Date().toISOString(),
          };
        }
        return b;
      });

      localStorage.setItem(RENTALS_KEY, JSON.stringify(updatedRentals));
      localStorage.setItem(BIKES_KEY, JSON.stringify(updatedBikes));
      this.notify();
    }
  }

  public triggerSOS(rentalId: string, reason: SOSReason, message?: string, lat?: number, lng?: number): Rental | null {
    const rentals = this.getRentals();
    const bikes = this.getBikes();
    let updatedRental: Rental | null = null;

    const currentRental = rentals.find((r) => r.id === rentalId);
    if (!currentRental) return null;

    const sosLat = lat || currentRental.lastLocation.lat || 21.1717;
    const sosLng = lng || currentRental.lastLocation.lng || 94.8585;

    const sosAlert: SOSAlert = {
      active: true,
      reason,
      message,
      lat: sosLat,
      lng: sosLng,
      googleMapsUrl: `https://maps.google.com/?q=${sosLat.toFixed(5)},${sosLng.toFixed(5)}`,
      timestamp: new Date().toISOString(),
      resolved: false,
    };

    const updatedRentals = rentals.map((r) => {
      if (r.id === rentalId) {
        const u = { ...r, sosAlert };
        updatedRental = u;
        return u;
      }
      return r;
    });

    const updatedBikes = bikes.map((b) => {
      if (b.id === currentRental.bikeId) {
        return {
          ...b,
          status: 'sos' as const,
          lat: sosLat,
          lng: sosLng,
          lastPing: new Date().toISOString(),
        };
      }
      return b;
    });

    localStorage.setItem(RENTALS_KEY, JSON.stringify(updatedRentals));
    localStorage.setItem(BIKES_KEY, JSON.stringify(updatedBikes));
    this.queueOfflineAction('TRIGGER_SOS', { rentalId, sosAlert });
    this.notify();
    return updatedRental;
  }

  public resolveSOS(rentalId: string) {
    const rentals = this.getRentals();
    const bikes = this.getBikes();

    const currentRental = rentals.find((r) => r.id === rentalId);
    if (!currentRental) return;

    const updatedRentals = rentals.map((r) => {
      if (r.id === rentalId && r.sosAlert) {
        return {
          ...r,
          sosAlert: { ...r.sosAlert, active: false, resolved: true },
        };
      }
      return r;
    });

    const updatedBikes = bikes.map((b) => {
      if (b.id === currentRental.bikeId) {
        return {
          ...b,
          status: 'in_use' as const,
        };
      }
      return b;
    });

    localStorage.setItem(RENTALS_KEY, JSON.stringify(updatedRentals));
    localStorage.setItem(BIKES_KEY, JSON.stringify(updatedBikes));
    this.notify();
  }

  public approvePayment(rentalId: string) {
    const rentals = this.getRentals();
    const updated = rentals.map((r) => {
      if (r.id === rentalId) {
        return { ...r, paymentStatus: 'paid' as const };
      }
      return r;
    });
    localStorage.setItem(RENTALS_KEY, JSON.stringify(updated));
    this.notify();
  }

  public returnBike(bikeId: string): { overtimeMMK: number; totalCostMMK: number } {
    const bikes = this.getBikes();
    const rentals = this.getRentals();
    let overtimeMMK = 0;
    let totalCostMMK = 0;

    const bike = bikes.find((b) => b.id === bikeId);
    if (!bike) return { overtimeMMK: 0, totalCostMMK: 0 };

    const rental = rentals.find((r) => r.bikeId === bikeId && r.status === 'active');
    if (rental) {
      const now = new Date();
      const start = new Date(rental.startTime);
      const diffHours = (now.getTime() - start.getTime()) / (1000 * 60 * 60);

      if (diffHours > rental.allocatedHours) {
        const extraHours = Math.ceil(diffHours - rental.allocatedHours);
        overtimeMMK = extraHours * 1500; // 1500 MMK/hr overtime
      }
      totalCostMMK = rental.rateMMK + overtimeMMK;

      const updatedRentals = rentals.map((r) => {
        if (r.id === rental.id) {
          return {
            ...r,
            endTime: now.toISOString(),
            status: 'completed' as const,
            overtimeFeeMMK: overtimeMMK,
            totalCostMMK,
          };
        }
        return r;
      });
      localStorage.setItem(RENTALS_KEY, JSON.stringify(updatedRentals));
    }

    // Reset bike
    const updatedBikes = bikes.map((b) => {
      if (b.id === bikeId) {
        return {
          ...b,
          status: 'available' as const,
          currentRentalId: undefined,
          battery: Math.max(30, b.battery - 10), // simulated usage
        };
      }
      return b;
    });
    localStorage.setItem(BIKES_KEY, JSON.stringify(updatedBikes));

    if (localStorage.getItem(ACTIVE_RENTAL_KEY) === rental?.id) {
      localStorage.removeItem(ACTIVE_RENTAL_KEY);
    }

    this.notify();
    return { overtimeMMK, totalCostMMK };
  }

  public updateBikeImei(bikeId: string, newImei: string) {
    const bikes = this.getBikes();
    const updatedBikes = bikes.map((b) => {
      if (b.id === bikeId) {
        return { ...b, gpsImei: newImei };
      }
      return b;
    });
    localStorage.setItem(BIKES_KEY, JSON.stringify(updatedBikes));
    this.notify();
  }

  public clearActiveRental() {
    localStorage.removeItem(ACTIVE_RENTAL_KEY);
    this.notify();
  }

  private queueOfflineAction(action: string, payload: unknown) {
    if (typeof window === 'undefined') return;
    if (!navigator.onLine) {
      try {
        const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
        const q = raw ? JSON.parse(raw) : [];
        q.push({ action, payload, timestamp: new Date().toISOString() });
        localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(q));
      } catch (e) {
        console.error('Failed to queue offline action', e);
      }
    }
  }

  public flushOfflineQueue() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
      if (raw) {
        const q = JSON.parse(raw);
        if (q.length > 0) {
          console.log(`[Bagan Sync] Successfully synchronized ${q.length} queued offline actions.`);
          localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([]));
          this.notify();
        }
      }
    } catch (e) {
      console.error('Failed to flush offline queue', e);
    }
  }

  public resetAllToDefault() {
    localStorage.setItem(BIKES_KEY, JSON.stringify(INITIAL_BIKES));
    localStorage.setItem(RENTALS_KEY, JSON.stringify(INITIAL_RENTALS));
    localStorage.removeItem(ACTIVE_RENTAL_KEY);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([]));
    this.notify();
  }
}

export const storageService = new StorageService();
