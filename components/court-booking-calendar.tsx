"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "./booking-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDetailsDialog } from "./booking-details-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { addWeeks, format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

// Update the interface for the booking type
interface Booking {
  id: number;
  court: string;
  date: Date;
  time: number;
  duration: number;
  renter: string;
  paid: boolean;
  email: string;
  phone: string;
  amount: number;
  status?: string;
  recurring?: boolean;
  recurringGroupId?: string;
}

// Update the mock data for existing bookings to include half-hour intervals
const initialBookings = [
  {
    id: 1,
    court: "Court 1",
    date: new Date(2025, 2, 30),
    time: 10,
    duration: 1,
    renter: "John Smith",
    paid: true,
    email: "john.smith@example.com",
    phone: "555-123-4567",
    amount: 15,
    status: "confirmed",
  },
  {
    id: 2,
    court: "Court 2",
    date: new Date(2025, 2, 30),
    time: 11.5, // 11:30
    duration: 1.5, // 1.5 hours
    renter: "Emma Johnson",
    paid: false,
    email: "emma.j@example.com",
    phone: "555-987-6543",
    amount: 30,
    status: "confirmed",
  },
  {
    id: 3,
    court: "Court 3",
    date: new Date(2025, 2, 30),
    time: 14.5, // 14:30
    duration: 2.5, // 2.5 hours
    renter: "Michael Brown",
    paid: true,
    email: "mbrown@example.com",
    phone: "555-456-7890",
    amount: 45,
    status: "confirmed",
  },
  {
    id: 4,
    court: "Court 1",
    date: new Date(2025, 2, 30),
    time: 18.5, // 18:30
    duration: 0.5, // 30 minutes
    renter: "Sarah Davis",
    paid: false,
    email: "sarah.d@example.com",
    phone: "555-789-0123",
    amount: 15,
    status: "confirmed",
  },
];

// Update the props interface to include the new configuration options
interface CourtBookingCalendarProps {
  totalCourts: number;
  onBookingsUpdate?: (bookings: Booking[]) => void;
  openingTime?: number;
  closingTime?: number;
  pricePerHour?: number;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CourtBookingCalendar = forwardRef<any, CourtBookingCalendarProps>(
  (
    {
      totalCourts,
      onBookingsUpdate,
      openingTime = 9,
      closingTime = 21,
      pricePerHour = 15,
    },
    ref
  ) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      new Date()
    );
    const [showBookingDialog, setShowBookingDialog] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<number | null>(null);
    const [courtAvailability, setCourtAvailability] = useState<
      Record<string, number[]>
    >({});
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
      null
    );
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [visibleCourtIndex, setVisibleCourtIndex] = useState(0);
    const [isMobileView, setIsMobileView] = useState(false);
    const [existingBookings, setExistingBookings] =
      useState<Booking[]>(initialBookings);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addMultipleBookings: (bookings: any[]) => {
        handleAddMultipleBookings(bookings);
      },
      getCurrentBookings: () => existingBookings,
    }));

    // Update parent component with bookings when they change
    useEffect(() => {
      if (onBookingsUpdate) {
        onBookingsUpdate(existingBookings);
      }
    }, [existingBookings, onBookingsUpdate]);

    // Check if we're in mobile view
    useEffect(() => {
      const checkMobileView = () => {
        setIsMobileView(window.innerWidth < 768);
      };

      checkMobileView();
      window.addEventListener("resize", checkMobileView);

      return () => {
        window.removeEventListener("resize", checkMobileView);
      };
    }, []);

    // Generate court availability based on totalCourts and operating hours
    useEffect(() => {
      const newCourtAvailability: Record<string, number[]> = {};

      for (let i = 1; i <= totalCourts; i++) {
        // Generate time slots from opening to closing time with half-hour intervals
        const timeSlots = [];
        for (let time = openingTime; time < closingTime; time += 0.5) {
          timeSlots.push(time);
        }
        newCourtAvailability[`Court ${i}`] = timeSlots;
      }

      setCourtAvailability(newCourtAvailability);
    }, [totalCourts, openingTime, closingTime]);

    // Handle deleting a booking
    const handleDeleteBooking = (id: number, deleteAllRecurring = false) => {
      const bookingToDelete = existingBookings.find(
        (booking) => booking.id === id
      );

      if (!bookingToDelete) return;

      if (
        deleteAllRecurring &&
        bookingToDelete.recurring &&
        bookingToDelete.recurringGroupId
      ) {
        // Delete this booking and all future recurring bookings in the same group
        const currentDate = bookingToDelete.date;
        const recurringGroupId = bookingToDelete.recurringGroupId;

        setExistingBookings((prevBookings) =>
          prevBookings.filter(
            (booking) =>
              !(
                booking.recurringGroupId === recurringGroupId &&
                booking.date >= currentDate
              )
          )
        );
      } else {
        // Delete just this booking
        setExistingBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== id)
        );
      }
    };

    // Handle marking a booking as no-show
    const handleMarkNoShow = (id: number) => {
      setExistingBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id ? { ...booking, status: "no-show" } : booking
        )
      );
    };

    // Handle marking a booking as paid
    const handleMarkAsPaid = (id: number) => {
      setExistingBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id ? { ...booking, paid: true } : booking
        )
      );
    };

    // Handle toggling recurring status
    const handleToggleRecurring = (id: number, isRecurring: boolean) => {
      const bookingToUpdate = existingBookings.find(
        (booking) => booking.id === id
      );

      if (!bookingToUpdate) return;

      if (isRecurring) {
        // Make this booking recurring (add future bookings)
        const recurringGroupId = uuidv4();
        const futureBookings: Booking[] = [];

        // Create 4 future bookings (for the next 4 weeks)
        for (let i = 1; i <= 4; i++) {
          const futureDate = addWeeks(bookingToUpdate.date, i);

          futureBookings.push({
            ...bookingToUpdate,
            id: Math.max(...existingBookings.map((b) => b.id), 0) + i,
            date: futureDate,
            recurring: true,
            recurringGroupId,
          });
        }

        // Update the current booking to be recurring
        setExistingBookings((prevBookings) =>
          prevBookings
            .map((booking) =>
              booking.id === id
                ? { ...booking, recurring: true, recurringGroupId }
                : booking
            )
            .concat(futureBookings)
        );
      } else {
        // Remove recurring status and delete future bookings
        if (bookingToUpdate.recurringGroupId) {
          const currentDate = bookingToUpdate.date;
          const recurringGroupId = bookingToUpdate.recurringGroupId;

          // Remove future recurring bookings and update this booking
          setExistingBookings((prevBookings) =>
            prevBookings
              .filter(
                (booking) =>
                  !(
                    booking.recurringGroupId === recurringGroupId &&
                    booking.date > currentDate
                  )
              )
              .map((booking) =>
                booking.id === id
                  ? {
                      ...booking,
                      recurring: false,
                      recurringGroupId: undefined,
                    }
                  : booking
              )
          );
        }
      }
    };

    // Handle adding multiple bookings at once
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAddMultipleBookings = (newBookings: any[]) => {
      const baseId = Math.max(...existingBookings.map((b) => b.id), 0) + 1;
      const processedBookings: Booking[] = [];

      newBookings.forEach((booking, index) => {
        if (booking.recurring) {
          const recurringGroupId = uuidv4();
          const recurringWeeks = Number.parseInt(booking.recurringWeeks || "4");

          // Create the initial booking and future recurring bookings
          for (let i = 0; i < recurringWeeks; i++) {
            const bookingDate =
              i === 0 ? booking.date : addWeeks(booking.date, i);

            processedBookings.push({
              ...booking,
              id: baseId + processedBookings.length,
              date: bookingDate,
              recurring: true,
              recurringGroupId,
            });
          }
        } else {
          // Add a single booking
          processedBookings.push({
            ...booking,
            id: baseId + index,
          });
        }
      });

      setExistingBookings((prev) => [...prev, ...processedBookings]);

      toast("Multiple Courts Booked", {
        description: `Successfully booked ${newBookings.length} court(s)`,
      });
    };

    // Check if a time slot is booked and return the booking if it is
    const getBookingForTimeSlot = (
      court: string,
      timeValue: number
    ): Booking | false => {
      if (!selectedDate) return false;

      // Check if there's a booking that starts at this time
      const directBooking = existingBookings.find(
        (booking) =>
          booking.court === court &&
          booking.time === timeValue &&
          booking.date.toDateString() === selectedDate.toDateString()
      );

      if (directBooking) return directBooking;

      // Check if there's a multi-hour booking that covers this time slot
      const coveringBooking = existingBookings.find(
        (booking) =>
          booking.court === court &&
          booking.date.toDateString() === selectedDate.toDateString() &&
          timeValue > booking.time &&
          timeValue < booking.time + booking.duration
      );

      return coveringBooking || false;
    };

    // Check if this is the first time slot of a booking
    const isFirstHourOfBooking = (
      court: string,
      timeValue: number
    ): boolean => {
      if (!selectedDate) return false;

      const booking = existingBookings.find(
        (booking) =>
          booking.court === court &&
          booking.time === timeValue &&
          booking.date.toDateString() === selectedDate.toDateString()
      );

      return booking ? true : false;
    };

    // Handle time slot click
    const handleTimeSlotClick = (court: string, time: number) => {
      const booking = getBookingForTimeSlot(court, time);

      if (booking && typeof booking !== "boolean") {
        // Show booking details if the court is already booked
        setSelectedBooking(booking);
        setShowDetailsDialog(true);
        return;
      }

      // Otherwise, proceed with booking
      setSelectedCourt(court);
      setSelectedTime(time);
      setShowBookingDialog(true);
    };

    // Add a new booking
    const handleAddBooking = (
      newBooking: Omit<Booking, "id">,
      isRecurring: boolean,
      recurringWeeks: number
    ) => {
      const baseId = Math.max(...existingBookings.map((b) => b.id), 0) + 1;

      if (isRecurring) {
        const recurringGroupId = uuidv4();
        const allBookings: Booking[] = [];

        // Create the initial booking and future recurring bookings
        for (let i = 0; i < recurringWeeks; i++) {
          const bookingDate =
            i === 0 ? newBooking.date : addWeeks(newBooking.date, i);

          allBookings.push({
            ...newBooking,
            id: baseId + i,
            date: bookingDate,
            recurring: true,
            recurringGroupId,
          });
        }

        setExistingBookings((prev) => [...prev, ...allBookings]);

        toast("Recurring Booking Confirmed", {
          description: `${newBooking.renter} has booked ${
            newBooking.court
          } on ${format(newBooking.date, "PPP")} at ${
            newBooking.time
          }:00 and for the next ${recurringWeeks - 1} weeks.`,
        });
      } else {
        // Add a single booking
        setExistingBookings((prev) => [
          ...prev,
          {
            ...newBooking,
            id: baseId,
          },
        ]);

        toast("Booking Confirmed", {
          description: `${newBooking.renter} has booked ${
            newBooking.court
          } on ${format(newBooking.date, "PPP")} at ${newBooking.time}:00.`,
        });
      }
    };

    // Group courts into pages for better display
    const courtGroups = Object.keys(courtAvailability).reduce(
      (acc, court, index) => {
        const groupIndex = Math.floor(index / (isMobileView ? 1 : 6));
        if (!acc[groupIndex]) {
          acc[groupIndex] = [];
        }
        acc[groupIndex].push(court);
        return acc;
      },
      [] as string[][]
    );

    // For mobile view, show one court at a time
    const visibleCourts = isMobileView
      ? [Object.keys(courtAvailability)[visibleCourtIndex]]
      : Object.keys(courtAvailability);

    // Navigate between courts in mobile view
    const navigateCourt = (direction: "prev" | "next") => {
      if (direction === "prev") {
        setVisibleCourtIndex((prev) =>
          prev > 0 ? prev - 1 : Object.keys(courtAvailability).length - 1
        );
      } else {
        setVisibleCourtIndex((prev) =>
          prev < Object.keys(courtAvailability).length - 1 ? prev + 1 : 0
        );
      }
    };

    // Render a time slot cell for mobile view
    const renderMobileTimeSlot = (timeValue: number, court: string) => {
      const booking = getBookingForTimeSlot(court, timeValue);
      const isFirstHour = isFirstHourOfBooking(court, timeValue);

      // If it's not the first time slot of a booking and it's part of a multi-hour booking, don't render anything
      if (!isFirstHour && booking && typeof booking !== "boolean") {
        return null;
      }

      // Format the time display
      const startHour = Math.floor(timeValue);
      const startMinute = (timeValue % 1) * 60;
      const endHour = Math.floor(timeValue + 0.5);
      const endMinute = ((timeValue + 0.5) % 1) * 60;

      const startTimeStr = `${startHour}:${
        startMinute === 0 ? "00" : startMinute
      }`;
      const endTimeStr = `${endHour}:${endMinute === 0 ? "00" : endMinute}`;

      return (
        <div
          key={`${court}-${timeValue}`}
          className={`
            p-2 border-b relative
            ${booking && typeof booking !== "boolean" ? "bg-muted/30" : ""}
            ${
              booking &&
              typeof booking !== "boolean" &&
              booking.status === "no-show"
                ? "bg-red-50"
                : ""
            }
          `}
          style={
            booking &&
            typeof booking !== "boolean" &&
            isFirstHour &&
            booking.duration > 0.5
              ? { height: `${booking.duration * 60}px` }
              : {}
          }
        >
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">
              {startTimeStr} - {endTimeStr}
            </div>
            {booking && typeof booking !== "boolean" ? (
              <div className="flex gap-1">
                {booking.status === "no-show" ? (
                  <Badge variant="destructive">No-Show</Badge>
                ) : (
                  <Badge
                    variant={booking.paid ? "outline" : "secondary"}
                    className={`
                      ${
                        !booking.paid
                          ? "border-amber-500 text-amber-700"
                          : "border-green-500 text-green-700"
                      }
                    `}
                  >
                    {booking.paid ? "Paid" : "Unpaid"}
                  </Badge>
                )}
                {booking.recurring && (
                  <Badge
                    variant="outline"
                    className="border-purple-500 text-purple-700"
                  >
                    R
                  </Badge>
                )}
              </div>
            ) : (
              <Badge
                variant="outline"
                className="bg-primary text-primary-foreground"
              >
                Available
              </Badge>
            )}
          </div>

          {booking && typeof booking !== "boolean" ? (
            <div
              className="mt-2 cursor-pointer"
              onClick={() => handleTimeSlotClick(court, timeValue)}
            >
              <div className="text-sm font-medium truncate">
                {booking.renter}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <span
                  className={`h-2 w-2 rounded-full ${
                    booking.paid ? "bg-green-500" : "bg-amber-500"
                  }`}
                ></span>
                <span>
                  {booking.duration > 1
                    ? `${booking.duration} hours`
                    : booking.duration === 1
                    ? "1 hour"
                    : "30 min"}
                </span>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-start p-0 h-auto hover:bg-transparent"
              onClick={() => handleTimeSlotClick(court, timeValue)}
            >
              <span className="text-primary underline text-sm">
                Book this slot
              </span>
            </Button>
          )}
        </div>
      );
    };

    // Render a time slot row for the desktop view
    const renderTimeSlotRow = (timeValue: number, courts: string[]) => {
      // Format the time display
      const startHour = Math.floor(timeValue);
      const startMinute = (timeValue % 1) * 60;
      const endHour = Math.floor(timeValue + 0.5);
      const endMinute = ((timeValue + 0.5) % 1) * 60;

      const startTimeStr = `${startHour}:${
        startMinute === 0 ? "00" : startMinute
      }`;
      const endTimeStr = `${endHour}:${endMinute === 0 ? "00" : endMinute}`;

      return (
        <div key={timeValue} className="flex items-center">
          <div className="w-24 text-sm">
            {startTimeStr} - {endTimeStr}
          </div>
          {courts.map((court) => {
            const booking = getBookingForTimeSlot(court, timeValue);
            const isFirstHour = isFirstHourOfBooking(court, timeValue);

            // If it's not the first time slot of a booking and it's part of a multi-hour booking, render an empty cell
            if (!isFirstHour && booking && typeof booking !== "boolean") {
              return (
                <div key={`${court}-${timeValue}`} className="flex-1"></div>
              );
            }

            // Calculate how many cells this booking should span
            const cellSpan =
              booking && typeof booking !== "boolean" && isFirstHour
                ? booking.duration / 0.5
                : 1;

            return (
              <div
                key={`${court}-${timeValue}`}
                className="flex-1 text-center"
                style={cellSpan > 1 ? { gridRow: `span ${cellSpan}` } : {}}
              >
                <Button
                  variant={
                    booking && typeof booking !== "boolean"
                      ? booking.status === "no-show"
                        ? "destructive"
                        : booking.paid
                        ? "outline"
                        : "secondary"
                      : "default"
                  }
                  size="sm"
                  className={`
                    ${
                      booking
                        ? "cursor-pointer w-[90%] max-w-[100px]"
                        : "w-[90%] max-w-[100px]"
                    }
                    ${
                      booking &&
                      typeof booking !== "boolean" &&
                      !booking.paid &&
                      booking.status !== "no-show"
                        ? "border-amber-500 text-amber-700"
                        : ""
                    }
                    ${
                      booking &&
                      typeof booking !== "boolean" &&
                      booking.paid &&
                      booking.status !== "no-show"
                        ? "border-green-500 text-green-700"
                        : ""
                    }
                    ${
                      booking &&
                      typeof booking !== "boolean" &&
                      booking.duration > 0.5
                        ? "h-auto py-2"
                        : ""
                    }
                  `}
                  onClick={() => handleTimeSlotClick(court, timeValue)}
                  title={
                    booking && typeof booking !== "boolean"
                      ? `Booked by ${booking.renter} (${
                          booking.paid ? "Paid" : "Unpaid"
                        }) for ${booking.duration} hour${
                          booking.duration > 1
                            ? "s"
                            : booking.duration === 1
                            ? ""
                            : "s"
                        }`
                      : "Available"
                  }
                >
                  {booking && typeof booking !== "boolean" ? (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="truncate block w-full max-w-full text-xs">
                        {booking.renter.length > 12
                          ? `${booking.renter.substring(0, 10)}...`
                          : booking.renter}
                      </span>
                      <div className="flex items-center gap-1">
                        {booking.status === "no-show" ? (
                          <span className="text-xs">No-Show</span>
                        ) : (
                          <>
                            {booking.paid ? (
                              <span
                                className="h-2 w-2 rounded-full bg-green-500"
                                title="Paid"
                              ></span>
                            ) : (
                              <span
                                className="h-2 w-2 rounded-full bg-amber-500"
                                title="Unpaid"
                              ></span>
                            )}
                            {booking.duration > 0.5 && (
                              <span className="text-xs">
                                {booking.duration}h
                              </span>
                            )}
                            {booking.recurring && (
                              <span className="text-xs ml-1">↻</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    "Available"
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      );
    };

    // Render the mobile view
    const renderMobileView = () => {
      const court = visibleCourts[0];
      // Generate time slots from 9:00 to 20:30 with half-hour intervals
      const timeSlots = Array.from({ length: 24 }, (_, i) => i * 0.5 + 9);

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateCourt("prev")}
              aria-label="Previous court"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <h3 className="text-base font-medium">{court}</h3>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateCourt("next")}
              aria-label="Next court"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[500px] rounded-md border">
            <div className="p-2">
              {timeSlots.map((timeValue) =>
                renderMobileTimeSlot(timeValue, court)
              )}
            </div>
          </ScrollArea>
        </div>
      );
    };

    // Render the desktop view
    const renderDesktopView = () => {
      // Generate time slots from 9:00 to 20:30 with half-hour intervals
      const timeSlots = Array.from({ length: 24 }, (_, i) => i * 0.5 + 9);

      return totalCourts > 6 ? (
        <Tabs defaultValue="0" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Courts</h3>
            <TabsList>
              {courtGroups.map((_, index) => (
                <TabsTrigger key={index} value={index.toString()}>
                  {index * 6 + 1}-{Math.min((index + 1) * 6, totalCourts)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {courtGroups.map((courts, groupIndex) => (
            <TabsContent
              key={groupIndex}
              value={groupIndex.toString()}
              className="mt-0"
            >
              <div className="grid gap-6">
                <div className="flex items-center">
                  <div className="w-24 font-medium">Time</div>
                  {courts.map((court) => (
                    <div key={court} className="flex-1 text-center font-medium">
                      {court}
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="grid gap-2">
                  {timeSlots.map((timeValue) =>
                    renderTimeSlotRow(timeValue, courts)
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        // Original layout for 6 or fewer courts
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="w-24 font-medium">Time</div>
            {Object.keys(courtAvailability).map((court) => (
              <div key={court} className="flex-1 text-center font-medium">
                {court}
              </div>
            ))}
          </div>
          <Separator />
          <div className="grid gap-2">
            {timeSlots.map((timeValue) => (
              <div
                key={timeValue}
                className="flex items-center justify-between"
              >
                <div className="w-24 text-sm">
                  {Math.floor(timeValue)}:
                  {(timeValue % 1) * 60 === 0 ? "00" : "30"} -{" "}
                  {Math.floor(timeValue + 0.5)}:
                  {((timeValue + 0.5) % 1) * 60 === 0 ? "00" : "30"}
                </div>
                {Object.keys(courtAvailability).map((court) => {
                  const booking = getBookingForTimeSlot(court, timeValue);
                  const isFirstHour = isFirstHourOfBooking(court, timeValue);

                  // If it's not the first time slot of a booking and it's part of a multi-hour booking, render an empty cell
                  if (!isFirstHour && booking && typeof booking !== "boolean") {
                    return (
                      <div
                        key={`${court}-${timeValue}`}
                        className="flex-1"
                      ></div>
                    );
                  }

                  return (
                    <div
                      key={`${court}-${timeValue}`}
                      className="flex-1 text-center"
                    >
                      <Button
                        variant={
                          booking && typeof booking !== "boolean"
                            ? booking.status === "no-show"
                              ? "destructive"
                              : booking.paid
                              ? "outline"
                              : "secondary"
                            : "default"
                        }
                        size="sm"
                        className={`
                          ${booking ? "cursor-pointer" : ""}
                          ${
                            booking &&
                            typeof booking !== "boolean" &&
                            !booking.paid &&
                            booking.status !== "no-show"
                              ? "border-amber-500 text-amber-700"
                              : ""
                          }
                          ${
                            booking &&
                            typeof booking !== "boolean" &&
                            booking.paid &&
                            booking.status !== "no-show"
                              ? "border-green-500 text-green-700"
                              : ""
                          }
                          ${
                            booking &&
                            typeof booking !== "boolean" &&
                            booking.duration > 0.5
                              ? "h-auto py-2"
                              : ""
                          }
                        `}
                        onClick={() => handleTimeSlotClick(court, timeValue)}
                        title={
                          booking && typeof booking !== "boolean"
                            ? `Booked by ${booking.renter} (${
                                booking.paid ? "Paid" : "Unpaid"
                              }) for ${booking.duration} hour${
                                booking.duration > 1
                                  ? "s"
                                  : booking.duration === 1
                                  ? ""
                                  : "s"
                              }`
                            : "Available"
                        }
                      >
                        {booking && typeof booking !== "boolean" ? (
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="truncate block w-full max-w-full text-xs">
                              {booking.renter.length > 12
                                ? `${booking.renter.substring(0, 10)}...`
                                : booking.renter}
                            </span>
                            <div className="flex items-center gap-1">
                              {booking.status === "no-show" ? (
                                <span className="text-xs">No-Show</span>
                              ) : (
                                <>
                                  {booking.paid ? (
                                    <span
                                      className="h-2 w-2 rounded-full bg-green-500"
                                      title="Paid"
                                    ></span>
                                  ) : (
                                    <span
                                      className="h-2 w-2 rounded-full bg-amber-500"
                                      title="Unpaid"
                                    ></span>
                                  )}
                                  {booking.duration > 0.5 && (
                                    <span className="text-xs">
                                      {booking.duration}h
                                    </span>
                                  )}
                                  {booking.recurring && (
                                    <span className="text-xs ml-1">↻</span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          "Available"
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="grid gap-4 md:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Court Availability</CardTitle>
              <CardDescription>
                Select a time slot to book a court
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {isMobileView ? renderMobileView() : renderDesktopView()}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-primary text-primary-foreground"
                >
                  Available
                </Badge>
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-700"
                >
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>{" "}
                  Paid
                </Badge>
                <Badge
                  variant="outline"
                  className="border-amber-500 text-amber-700"
                >
                  <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>{" "}
                  Unpaid
                </Badge>
                <Badge variant="destructive">No-Show</Badge>
                <Badge
                  variant="outline"
                  className="border-purple-500 text-purple-700"
                >
                  <span className="mr-1">↻</span> Recurring
                </Badge>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
              <CardDescription>
                Choose a date to view availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (date) {
                    // Update the parent component's selected date
                    if (onBookingsUpdate) {
                      onBookingsUpdate(existingBookings);
                    }
                  }
                }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="md:block hidden">
            <CardHeader>
              <CardTitle>Court Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Opening Hours:
                </span>
                <span className="text-sm">
                  {Math.floor(openingTime)}:
                  {(openingTime % 1) * 60 === 0 ? "00" : "30"} -
                  {Math.floor(closingTime)}:
                  {(closingTime % 1) * 60 === 0 ? "00" : "30"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Courts Available:
                </span>
                <span className="text-sm">{totalCourts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Price per hour:
                </span>
                <span className="text-sm">${pricePerHour.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="text-sm text-muted-foreground">
                All courts include standard equipment and changing facilities.
              </div>
            </CardContent>
          </Card>
        </div>

        <BookingDialog
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          court={selectedCourt}
          date={selectedDate}
          time={selectedTime}
          onAddBooking={handleAddBooking}
        />
        <BookingDetailsDialog
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          booking={selectedBooking}
          onDeleteBooking={handleDeleteBooking}
          onMarkNoShow={handleMarkNoShow}
          onMarkAsPaid={handleMarkAsPaid}
          onToggleRecurring={handleToggleRecurring}
        />
      </div>
    );
  }
);

CourtBookingCalendar.displayName = "CourtBookingCalendar";
