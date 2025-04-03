"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ClubIcon, Clock, DollarSign, LayoutGrid } from "lucide-react";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (config: {
    openingTime: string;
    closingTime: string;
    pricePerHour: number;
    totalCourts: number;
  }) => void;
  defaultValues?: {
    openingTime: string;
    closingTime: string;
    pricePerHour: number;
    totalCourts: number;
  };
}

export function OnboardingDialog({
  open,
  onOpenChange,
  onComplete,
  defaultValues = {
    openingTime: "09:00",
    closingTime: "21:00",
    pricePerHour: 15,
    totalCourts: 12,
  },
}: OnboardingDialogProps) {
  const [step, setStep] = useState(1);
  const [openingTime, setOpeningTime] = useState(defaultValues.openingTime);
  const [closingTime, setClosingTime] = useState(defaultValues.closingTime);
  const [pricePerHour, setPricePerHour] = useState(
    defaultValues.pricePerHour.toString()
  );
  const [totalCourts, setTotalCourts] = useState(
    defaultValues.totalCourts.toString()
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    setIsLoading(true);

    // Validate inputs
    if (!openingTime || !closingTime || !pricePerHour || !totalCourts) {
      toast("Missing Information", {
        description: "Please fill in all fields to continue.",
      });
      setIsLoading(false);
      return;
    }

    // Convert time strings to 24-hour format if needed
    const formattedOpeningTime = openingTime.includes(":")
      ? openingTime
      : `${openingTime}:00`;
    const formattedClosingTime = closingTime.includes(":")
      ? closingTime
      : `${closingTime}:00`;

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (
      !timeRegex.test(formattedOpeningTime) ||
      !timeRegex.test(formattedClosingTime)
    ) {
      toast("Invalid Time Format", {
        description: "Please enter times in the format HH:MM (e.g., 09:00).",
      });
      setIsLoading(false);
      return;
    }

    // Validate price and courts
    const priceValue = Number.parseFloat(pricePerHour);
    const courtsValue = Number.parseInt(totalCourts);

    if (isNaN(priceValue) || priceValue <= 0) {
      toast("Invalid Price", {
        description: "Please enter a valid price per hour.",
      });
      setIsLoading(false);
      return;
    }

    if (isNaN(courtsValue) || courtsValue <= 0 || courtsValue > 50) {
      toast("Invalid Number of Courts", {
        description: "Please enter a valid number of courts (1-50).",
      });
      setIsLoading(false);
      return;
    }

    // Simulate saving
    setTimeout(() => {
      setIsLoading(false);
      onComplete({
        openingTime: formattedOpeningTime,
        closingTime: formattedClosingTime,
        pricePerHour: priceValue,
        totalCourts: courtsValue,
      });

      toast("Setup Complete", {
        description: "Your badminton court booking system is ready to use!",
      });
    }, 1000);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 py-4">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <ClubIcon className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center">
              Welcome to Badminton Court Booking
            </h2>
            <p className="text-center text-muted-foreground">
              Let&apos;s set up your facility. We&apos;ll need some basic
              information to get started.
            </p>
            <p className="text-center text-muted-foreground">
              You can always change these settings later.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 py-4">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <Clock className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center">
              Operating Hours
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Set the opening and closing times for your facility.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openingTime">Opening Time</Label>
                <Input
                  id="openingTime"
                  type="time"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  placeholder="09:00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closingTime">Closing Time</Label>
                <Input
                  id="closingTime"
                  type="time"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  placeholder="21:00"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 py-4">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <DollarSign className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center">Pricing</h2>
            <p className="text-center text-muted-foreground mb-6">
              Set the standard price per hour for court bookings.
            </p>

            <div className="space-y-2">
              <Label htmlFor="pricePerHour">Price Per Hour ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pricePerHour"
                  type="number"
                  min="1"
                  step="0.01"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value)}
                  className="pl-9"
                  placeholder="15.00"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 py-4">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <LayoutGrid className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center">
              Court Configuration
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              How many badminton courts does your facility have?
            </p>

            <div className="space-y-2">
              <Label htmlFor="totalCourts">Number of Courts</Label>
              <Input
                id="totalCourts"
                type="number"
                min="1"
                max="50"
                value={totalCourts}
                onChange={(e) => setTotalCourts(e.target.value)}
                placeholder="12"
              />
            </div>

            <div className="pt-4">
              <Separator />
              <div className="pt-4 text-center text-muted-foreground">
                <p>
                  You&apos;re all set! Click &quot;Complete Setup&quot; to
                  finish.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Badminton Court Setup</DialogTitle>
          <DialogDescription>
            Configure your badminton court booking system
          </DialogDescription>
        </DialogHeader>

        {renderStepContent()}

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Processing..." : step < 4 ? "Next" : "Complete Setup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
