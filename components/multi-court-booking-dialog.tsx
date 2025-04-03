"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  CalendarIcon,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface MultiCourtBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date?: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  existingBookings: any[];
  totalCourts: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddBookings: (bookings: any[]) => void;
  pricePerHour?: number;
  openingTime?: number;
  closingTime?: number;
}

export function MultiCourtBookingDialog({
  open,
  onOpenChange,
  date: initialDate,
  existingBookings,
  totalCourts,
  onAddBookings,
  pricePerHour = 15,
  openingTime = 9,
  closingTime = 21,
}: MultiCourtBookingDialogProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [time, setTime] = useState<string>("18");
  const [duration, setDuration] = useState("1");
  const [numberOfCourts, setNumberOfCourts] = useState("1");
  const [renterName, setRenterName] = useState("");
  const [phone, setPhone] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringWeeks, setRecurringWeeks] = useState("4");
  const [loading, setLoading] = useState(false);
  const [availableCourts, setAvailableCourts] = useState<string[]>([]);
  const [selectedCourts, setSelectedCourts] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  // Generate time options from opening to closing time with half-hour intervals
  const timeOptions = [];
  for (let time = openingTime; time < closingTime; time += 0.5) {
    const hour = Math.floor(time);
    const minute = (time % 1) * 60;
    timeOptions.push({
      value: time.toString(),
      label: `${hour}:${minute === 0 ? "00" : minute}`,
    });
  }

  // Generate court number options from 1 to totalCourts
  const courtNumberOptions = Array.from(
    { length: totalCourts },
    (_, i) => i + 1
  ).map((num) => ({
    value: num.toString(),
    label: num === 1 ? "1 court" : `${num} courts`,
  }));

  // Find available courts whenever date, time, or duration changes
  useEffect(() => {
    if (!date) return;

    // Convert time to number
    const timeNum = Number.parseFloat(time);
    const durationNum = Number.parseFloat(duration);

    // Check which courts are available at the selected time
    const available: string[] = [];

    for (let i = 1; i <= totalCourts; i++) {
      const courtName = `Court ${i}`;
      let isAvailable = true;

      // Check if the court is available for the entire duration
      for (
        let timeSlot = timeNum;
        timeSlot < timeNum + durationNum;
        timeSlot += 0.5
      ) {
        const isBooked = existingBookings.some(
          (booking) =>
            booking.court === courtName &&
            booking.date.toDateString() === date.toDateString() &&
            ((booking.time <= timeSlot &&
              timeSlot < booking.time + booking.duration) ||
              (timeSlot <= booking.time &&
                booking.time < timeSlot + durationNum))
        );

        if (isBooked) {
          isAvailable = false;
          break;
        }
      }

      if (isAvailable) {
        available.push(courtName);
      }
    }

    setAvailableCourts(available);

    // Auto-select courts up to the requested number
    const numCourtsRequested = Number.parseInt(numberOfCourts);
    const autoSelected = available.slice(0, numCourtsRequested);
    setSelectedCourts(autoSelected);
  }, [date, time, duration, numberOfCourts, existingBookings, totalCourts]);

  const handleNextStep = () => {
    if (step === 1) {
      if (!date) {
        toast("Date Required", {
          description: "Please select a date for your booking.",
        });
        return;
      }

      if (selectedCourts.length === 0) {
        toast("No Courts Available", {
          description:
            "There are no courts available at the selected time. Please choose a different time or date.",
        });
        return;
      }

      if (selectedCourts.length < Number.parseInt(numberOfCourts)) {
        toast("Not Enough Courts", {
          description: `Only ${selectedCourts.length} courts are available at this time. Would you like to proceed with booking these?`,
          action: (
            <Button
              variant="outline"
              onClick={() => {
                setStep(2);
                toast("Proceeding with available courts", {
                  description: `Booking ${selectedCourts.length} available courts.`,
                });
              }}
            >
              Proceed
            </Button>
          ),
        });
        return;
      }

      setStep(2);
    } else if (step === 2) {
      handleBooking();
    }
  };

  const handleBooking = () => {
    if (!renterName.trim()) {
      toast("Name Required", {
        description: "Please enter your name to complete the booking.",
      });
      return;
    }

    if (!date) {
      toast("Date Required", {
        description: "Please select a date for your booking.",
      });
      return;
    }

    setLoading(true);

    // Create bookings for each selected court
    const timeNum = Number.parseFloat(time);
    const durationNum = Number.parseFloat(duration);

    const bookings: {
      court: string;
      date: Date;
      time: number;
      duration: number;
      renter: string;
      paid: boolean;
      email: string;
      phone: string;
      amount: number;
      recurring: boolean;
    }[] = [];

    for (const court of selectedCourts) {
      const newBooking = {
        court: court,
        date: date,
        time: timeNum,
        duration: durationNum,
        renter: renterName,
        paid: false,
        email: `${renterName.toLowerCase().replace(/\s+/g, ".")}@example.com`, // Generate a placeholder email
        phone: phone,
        amount: Math.round(durationNum * pricePerHour),
        recurring: isRecurring,
      };

      bookings.push(newBooking);
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);

      // Call the onAddBookings callback
      onAddBookings(bookings);

      // Reset form fields
      setRenterName("");
      setPhone("");
      setDuration("1");
      setNumberOfCourts("1");
      setIsRecurring(false);
      setRecurringWeeks("4");
      setStep(1);

      // Format time for display
      const startHour = Math.floor(timeNum);
      const startMinute = (timeNum % 1) * 60;
      const startTimeStr = `${startHour}:${
        startMinute === 0 ? "00" : startMinute
      }`;

      toast("Courts Booked Successfully", {
        description: `${renterName} has booked ${
          selectedCourts.length
        } court(s) on ${date ? format(date, "PPP") : ""} at ${startTimeStr}${
          isRecurring ? `, recurring for ${recurringWeeks} weeks` : ""
        }.`,
      });
    }, 1500);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          // Reset to step 1 when closing
          setStep(1);
        }
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] rounded-lg">
        <DialogHeader>
          <DialogTitle>Book Multiple Courts</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Select date, time and number of courts to book"
              : "Enter your details to complete the booking"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md"
                  initialFocus
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="time">Start Time</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger id="time" className="mt-1.5">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger id="duration" className="mt-1.5">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">30 minutes</SelectItem>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="1.5">1.5 hours</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="2.5">2.5 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="numberOfCourts">Number of Courts</Label>
                  <Select
                    value={numberOfCourts}
                    onValueChange={setNumberOfCourts}
                  >
                    <SelectTrigger id="numberOfCourts" className="mt-1.5">
                      <SelectValue placeholder="Select number of courts" />
                    </SelectTrigger>
                    <SelectContent>
                      {courtNumberOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Card className="mt-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Available Courts:
                      </span>
                      <Badge
                        variant={
                          availableCourts.length > 0 ? "outline" : "destructive"
                        }
                      >
                        {availableCourts.length} / {totalCourts}
                      </Badge>
                    </div>

                    <div className="mt-2">
                      {availableCourts.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {availableCourts.map((court) => (
                            <Badge
                              key={court}
                              variant="outline"
                              className="bg-green-50 border-green-200 text-green-700"
                            >
                              {court}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-red-500">
                          <AlertCircle className="h-4 w-4" />
                          <span>No courts available at this time</span>
                        </div>
                      )}
                    </div>

                    <Separator className="my-3" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Selected Courts:
                      </span>
                      <Badge>
                        {selectedCourts.length} / {numberOfCourts}
                      </Badge>
                    </div>

                    <div className="mt-2">
                      {selectedCourts.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedCourts.map((court) => (
                            <Badge key={court} className="bg-primary">
                              {court}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>No courts selected</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 py-4">
            {/* Booking details summary */}
            <div className="bg-muted/50 p-3 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {date ? format(date, "EEEE, MMMM d, yyyy") : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {Math.floor(Number.parseFloat(time))}:
                  {(Number.parseFloat(time) % 1) * 60 === 0 ? "00" : "30"} -{" "}
                  {Math.floor(
                    Number.parseFloat(time) + Number.parseFloat(duration)
                  )}
                  :
                  {((Number.parseFloat(time) + Number.parseFloat(duration)) %
                    1) *
                    60 ===
                  0
                    ? "00"
                    : "30"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">
                  {selectedCourts.length} court
                  {selectedCourts.length !== 1 ? "s" : ""} selected:{" "}
                  {selectedCourts.join(", ")}
                </span>
              </div>
            </div>

            <Separator />

            {/* User details */}
            <div>
              <Label htmlFor="renterName" className="text-sm font-medium">
                Your Name
              </Label>
              <div className="flex mt-1.5">
                <div className="relative flex-grow">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="renterName"
                    value={renterName}
                    onChange={(e) => setRenterName(e.target.value)}
                    placeholder="Enter your name"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="555-123-4567"
                className="mt-1.5"
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring"
                    checked={isRecurring}
                    onCheckedChange={setIsRecurring}
                  />
                  <Label htmlFor="recurring" className="text-sm font-medium">
                    Recurring booking
                  </Label>
                </div>

                {isRecurring && (
                  <Select
                    value={recurringWeeks}
                    onValueChange={setRecurringWeeks}
                    // className="w-24"
                  >
                    <SelectTrigger id="recurringWeeks" className="h-8">
                      <SelectValue placeholder="Weeks" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 weeks</SelectItem>
                      <SelectItem value="4">4 weeks</SelectItem>
                      <SelectItem value="8">8 weeks</SelectItem>
                      <SelectItem value="12">12 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {isRecurring && (
                <p className="text-xs text-muted-foreground mt-2">
                  This will book the same courts at the same time for{" "}
                  {recurringWeeks} consecutive weeks.
                </p>
              )}
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Price:</span>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    $
                    {Math.round(
                      Number.parseFloat(duration) *
                        pricePerHour *
                        selectedCourts.length *
                        (isRecurring ? Number.parseInt(recurringWeeks) : 1)
                    )}
                    .00
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${Math.round(Number.parseFloat(duration) * pricePerHour)}{" "}
                    per court × {selectedCourts.length} courts
                    {isRecurring ? ` × ${recurringWeeks} weeks` : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {step === 1 ? (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={loading || availableCourts.length === 0}
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto"
              >
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
