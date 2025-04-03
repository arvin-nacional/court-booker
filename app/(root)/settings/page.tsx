"use client";

import { AdminSettings } from "@/components/admin-settings";
import React, { useState } from "react";
// Define the configuration type
interface FacilityConfig {
  openingTime: string;
  closingTime: string;
  pricePerHour: number;
  totalCourts: number;
}
const Settings = () => {
  // Check if this is the first visit
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Facility configuration
  const [facilityConfig, setFacilityConfig] = useState<FacilityConfig>({
    openingTime: "09:00",
    closingTime: "21:00",
    pricePerHour: 15,
    totalCourts: 12,
  });

  // const [showAdminSettings, setShowAdminSettings] = useState(false);
  // const [showMultiCourtBooking, setShowMultiCourtBooking] = useState(false);
  // const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // const [existingBookings, setExistingBookings] = useState<any[]>([]);

  // // Check if this is the first visit when the component mounts
  // useEffect(() => {
  //   // In a real app, you would check localStorage or a database
  //   // For this demo, we'll just show the onboarding dialog
  //   setShowOnboarding(true);
  //   setIsFirstVisit(false);
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <AdminSettings
        initialTotalCourts={facilityConfig.totalCourts}
        onTotalCourtsChange={(courts) => {
          setFacilityConfig({ ...facilityConfig, totalCourts: courts });
        }}
        facilityConfig={facilityConfig}
        onConfigChange={setFacilityConfig}
        onShowOnboarding={() => setShowOnboarding(true)}
      />
    </div>
  );
};

export default Settings;
