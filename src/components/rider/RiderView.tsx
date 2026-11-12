import React, { useState } from 'react';
import { Bike, Rental, Language } from '../../types';
import { QRScannerSection } from './QRScannerSection';
import { RegistrationForm, RiderFormData } from './RegistrationForm';
import { CheckoutStep } from './CheckoutStep';
import { ActiveRideScreen } from './ActiveRideScreen';
import { HowItWorksShowcase } from '../HowItWorksShowcase';
import { storageService } from '../../services/storageService';

interface RiderViewProps {
  bikes: Bike[];
  activeRental: Rental | null;
  lang: Language;
}

export const RiderView: React.FC<RiderViewProps> = ({ bikes, activeRental, lang }) => {
  const [selectedBike, setSelectedBike] = useState<Bike | null>(() => {
    // If active rental exists, pre-select that bike
    if (activeRental) {
      return bikes.find((b) => b.id === activeRental.bikeId) || null;
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const bikeParam = params.get('bike');
      if (bikeParam) {
        return bikes.find((b) => b.id.toUpperCase() === bikeParam.toUpperCase()) || null;
      }
    }
    return null;
  });

  const [step, setStep] = useState<'scan' | 'register' | 'checkout'>(() => {
    return activeRental ? 'scan' : 'scan';
  });

  const [riderData, setRiderData] = useState<RiderFormData | null>(null);

  // If there's an active rental, render the ActiveRideScreen immediately
  if (activeRental && selectedBike) {
    return (
      <ActiveRideScreen
        rental={activeRental}
        bike={selectedBike}
        lang={lang}
        onEndRide={() => {
          storageService.returnBike(activeRental.bikeId);
          setSelectedBike(null);
          setStep('scan');
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {step === 'scan' && (
        <>
          <QRScannerSection
            lang={lang}
            selectedBike={selectedBike}
            onBikeSelect={(bike) => setSelectedBike(bike)}
            onProceedToRegister={() => setStep('register')}
          />
          <HowItWorksShowcase lang={lang} />
        </>
      )}

      {step === 'register' && selectedBike && (
        <RegistrationForm
          bike={selectedBike}
          lang={lang}
          initialData={riderData || undefined}
          onSubmit={(data) => {
            setRiderData(data);
            setStep('checkout');
          }}
          onBack={() => setStep('scan')}
        />
      )}

      {step === 'checkout' && selectedBike && riderData && (
        <CheckoutStep
          bike={selectedBike}
          riderData={riderData}
          lang={lang}
          onConfirmRental={(rentalData) => {
            storageService.startRental({
              bikeId: selectedBike.id,
              riderName: riderData.fullName,
              riderPhone: riderData.phoneNumber,
              messagingApp: riderData.messagingApp,
              hotelOrId: riderData.hotelOrId,
              emergencyContact: riderData.emergencyContact,
              safetyRulesAgreed: riderData.safetyRulesAgreed,
              packageType: rentalData.packageType,
              rateMMK: rentalData.rateMMK,
              allocatedHours: rentalData.allocatedHours,
              paymentMethod: rentalData.paymentMethod,
              walletType: rentalData.walletType,
              transactionId: rentalData.transactionId,
              receiptImage: rentalData.receiptImage,
              paymentStatus: rentalData.paymentStatus,
              totalCostMMK: rentalData.rateMMK,
              lastLocation: {
                lat: selectedBike.lat,
                lng: selectedBike.lng,
                accuracy: 5,
                timestamp: new Date().toISOString(),
              },
            });
            // State will update via storageService event
          }}
          onBack={() => setStep('register')}
        />
      )}
    </div>
  );
};
