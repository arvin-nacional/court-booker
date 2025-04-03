"use client";

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
import { useState } from "react";
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
import { CalendarIcon, Clock, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  court: string | null;
  date: Date | undefined;
  time: number | null;
  onAddBooking?: (
    booking: {
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
    },
    isRecurring: boolean,
    recurringWeeks: number
  ) => void;
  pricePerHour?: number;
}

export function BookingDialog({
  open,
  onOpenChange,
  court,
  date,
  time,
  onAddBooking,
  pricePerHour = 15,
}: BookingDialogProps) {
  const [renterName, setRenterName] = useState("");
  const [phone, setPhone] = useState("");
  const [duration, setDuration] = useState("1");
  const [loading, setLoading] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringWeeks, setRecurringWeeks] = useState("4");

  const handleBooking = () => {
    if (!renterName.trim()) {
      toast("Name Required", {
        description: "Please enter your name to complete the booking.",
        // variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Create the new booking object
    const newBooking = {
      court: court || "",
      date: date || new Date(),
      time: time || 0,
      duration: Number.parseFloat(duration),
      renter: renterName,
      paid: false,
      email: `${renterName.toLowerCase().replace(/\s+/g, ".")}@example.com`, // Generate a placeholder email
      phone: phone,
      amount: Math.round(Number.parseFloat(duration) * pricePerHour),
      recurring: isRecurring,
    };

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);

      // Call the onAddBooking callback if provided
      if (onAddBooking) {
        onAddBooking(newBooking, isRecurring, Number.parseInt(recurringWeeks));
      }

      // Reset form fields
      setRenterName("");
      setPhone("");
      setDuration("1");
      setIsRecurring(false);
      setRecurringWeeks("4");

      // Format time for display
      const startHour = Math.floor(time || 0);
      const startMinute = ((time || 0) % 1) * 60;
      const startTimeStr = `${startHour}:${
        startMinute === 0 ? "00" : startMinute
      }`;

      toast("Court Booked Successfully", {
        description: `${renterName} has booked ${court} on ${
          date ? format(date, "PPP") : ""
        } at ${startTimeStr} for ${
          duration === "0.5"
            ? "30 minutes"
            : duration === "1"
            ? "1 hour"
            : `${duration} hours`
        }${isRecurring ? `, recurring for ${recurringWeeks} weeks` : ""}.`,
      });
    }, 1500);
  };

  if (!court || !date || time === null) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] max-w-[95vw] rounded-lg">
          <DialogHeader>
            <DialogTitle>Book a Court</DialogTitle>
            <DialogDescription>
              Enter your details to book this court
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* Booking details summary */}
            <div className="bg-muted/50 p-3 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {format(date, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {Math.floor(time || 0)}:
                  {((time || 0) % 1) * 60 === 0 ? "00" : "30"} -{" "}
                  {Math.floor((time || 0) + Number.parseFloat(duration))}:
                  {(((time || 0) + Number.parseFloat(duration)) % 1) * 60 === 0
                    ? "00"
                    : "30"}
                </span>
              </div>
              <div className="font-medium">{court}</div>
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

            <div className="grid grid-cols-2 gap-4">
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

              <div>
                <Label htmlFor="duration" className="text-sm font-medium">
                  Duration
                </Label>
                <Select
                  value={duration}
                  onValueChange={setDuration}
                  // className="mt-1.5"
                >
                  <SelectTrigger id="duration">
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
                  This will book the same court at the same time for{" "}
                  {recurringWeeks} consecutive weeks.
                </p>
              )}
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Price:</span>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    $
                    {Number.parseFloat(duration) *
                      pricePerHour *
                      (isRecurring ? Number.parseInt(recurringWeeks) : 1)}
                    .00
                  </div>
                  {isRecurring && (
                    <div className="text-xs text-muted-foreground">
                      ${Number.parseFloat(duration) * pricePerHour}.00 ×{" "}
                      {recurringWeeks} weeks
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
