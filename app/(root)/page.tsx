// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { CalendarDateRangePicker } from "@/components/date-range-picker";

import { CourtBookingCalendar } from "@/components/court-booking-calendar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingStats } from "@/components/booking-stats";
import { RecentBookings } from "@/components/recent-bookings";
import { AdminSettings } from "@/components/admin-settings";

import { MultiCourtBookingDialog } from "@/components/multi-court-booking-dialog";
import { OnboardingDialog } from "@/components/onboarding-dialog";

// Define the configuration type
interface FacilityConfig {
  openingTime: string;
  closingTime: string;
  pricePerHour: number;
  totalCourts: number;
}

export default function DashboardPage() {
  // Check if this is the first visit
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Facility configuration
  const [facilityConfig, setFacilityConfig] = useState<FacilityConfig>({
    openingTime: "09:00",
    closingTime: "23:00",
    pricePerHour: 15,
    totalCourts: 12,
  });

  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [showMultiCourtBooking, setShowMultiCourtBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [existingBookings, setExistingBookings] = useState<any[]>([]);

  // Check if this is the first visit when the component mounts
  useEffect(() => {
    // In a real app, you would check localStorage or a database
    // For this demo, we'll just show the onboarding dialog
    setShowOnboarding(true);
    setIsFirstVisit(false);
  }, []);

  // Handler to receive bookings from the calendar component
  const handleBookingsUpdate = (bookings: any[]) => {
    setExistingBookings(bookings);
  };

  // Handler to add multiple bookings
  const handleAddMultipleBookings = (bookings: any[]) => {
    // Pass the bookings to the calendar component
    if (calendarRef.current) {
      calendarRef.current.addMultipleBookings(bookings);
    }
  };

  // Handler for completing the onboarding
  const handleOnboardingComplete = (config: FacilityConfig) => {
    setFacilityConfig(config);
    setShowOnboarding(false);
  };

  // Create a ref to access the calendar component methods
  const calendarRef = React.useRef<any>(null);

  // Convert time string to hours for the calendar component
  const getTimeInHours = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours + minutes / 60;
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="py-4">
                  <MainNav className="flex flex-col space-y-4 items-start" />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <MainNav className="mx-6 hidden md:flex" />
          <div className="ml-auto flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAdminSettings(!showAdminSettings)}
              className="relative"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <UserNav />
          </div>
        </div>
      </div> */}
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 mt-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Badminton Court Booking
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <CalendarDateRangePicker />
            <Button
              className="w-full sm:w-auto"
              onClick={() => setShowMultiCourtBooking(true)}
            >
              Book Court
            </Button>
          </div>
        </div>

        {showAdminSettings ? (
          <AdminSettings
            initialTotalCourts={facilityConfig.totalCourts}
            onTotalCourtsChange={(courts) => {
              setFacilityConfig({ ...facilityConfig, totalCourts: courts });
            }}
            facilityConfig={facilityConfig}
            onConfigChange={setFacilityConfig}
            onShowOnboarding={() => setShowOnboarding(true)}
          />
        ) : (
          <Tabs defaultValue="calendar" className="space-y-4">
            <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar" className="space-y-4">
              <CourtBookingCalendar
                totalCourts={facilityConfig.totalCourts}
                ref={calendarRef}
                onBookingsUpdate={handleBookingsUpdate}
                openingTime={getTimeInHours(facilityConfig.openingTime)}
                closingTime={getTimeInHours(facilityConfig.closingTime)}
                pricePerHour={facilityConfig.pricePerHour}
              />
            </TabsContent>
            <TabsContent value="bookings" className="space-y-4">
              <RecentBookings />
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <BookingStats totalCourts={facilityConfig.totalCourts} />
            </TabsContent>
          </Tabs>
        )}
      </div>

      <MultiCourtBookingDialog
        open={showMultiCourtBooking}
        onOpenChange={setShowMultiCourtBooking}
        date={selectedDate}
        existingBookings={existingBookings}
        totalCourts={facilityConfig.totalCourts}
        onAddBookings={handleAddMultipleBookings}
        pricePerHour={facilityConfig.pricePerHour}
        openingTime={getTimeInHours(facilityConfig.openingTime)}
        closingTime={getTimeInHours(facilityConfig.closingTime)}
      />

      <OnboardingDialog
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onComplete={handleOnboardingComplete}
        defaultValues={facilityConfig}
      />
    </div>
  );
}
