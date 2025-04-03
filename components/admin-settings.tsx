"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Clock, DollarSign, RefreshCw } from "lucide-react";

interface FacilityConfig {
  openingTime: string;
  closingTime: string;
  pricePerHour: number;
  totalCourts: number;
}

interface AdminSettingsProps {
  initialTotalCourts: number;
  onTotalCourtsChange: (value: number) => void;
  facilityConfig: FacilityConfig;
  onConfigChange: (config: FacilityConfig) => void;
  onShowOnboarding: () => void;
}

export function AdminSettings({
  initialTotalCourts,
  onTotalCourtsChange,
  facilityConfig,
  onConfigChange,
  onShowOnboarding,
}: AdminSettingsProps) {
  const [totalCourts, setTotalCourts] = useState(initialTotalCourts);
  const [openingTime, setOpeningTime] = useState(facilityConfig.openingTime);
  const [closingTime, setClosingTime] = useState(facilityConfig.closingTime);
  const [pricePerHour, setPricePerHour] = useState(
    facilityConfig.pricePerHour.toString()
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);

    // Validate inputs
    if (!openingTime || !closingTime || !pricePerHour) {
      toast("Missing Information", {
        description: "Please fill in all fields to save settings.",
        // variant: "destructive",
      });

      setIsLoading(false);
      return;
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(openingTime) || !timeRegex.test(closingTime)) {
      toast("Invalid Time Format", {
        description: "Please enter times in the format HH:MM (e.g., 09:00).",
        // variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate price
    const priceValue = Number.parseFloat(pricePerHour);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast("Invalid Price", {
        description: "Please enter a valid price per hour.",
        // variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      onTotalCourtsChange(totalCourts);
      onConfigChange({
        openingTime,
        closingTime,
        pricePerHour: priceValue,
        totalCourts,
      });
      setIsLoading(false);

      toast("Settings Saved", {
        description: `Updated facility configuration.`,
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 ">
      <div className="flex justify-between items-center mt-20">
        <h2 className="text-2xl font-bold">Facility Settings</h2>
        <Button
          variant="outline"
          onClick={onShowOnboarding}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Setup Wizard</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Court Configuration</CardTitle>
          <CardDescription>
            Configure court availability and booking rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="total-courts">Total Number of Courts</Label>
                <span className="text-2xl font-bold">{totalCourts}</span>
              </div>
              <Slider
                id="total-courts"
                min={1}
                max={20}
                step={1}
                value={[totalCourts]}
                onValueChange={(value) => setTotalCourts(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {Array.from({ length: totalCourts }, (_, i) => (
                <Card key={i} className="bg-muted/50">
                  <CardContent className="p-4 flex items-center justify-center">
                    <span className="font-medium">Court {i + 1}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Operating Hours</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opening-time">Opening Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="opening-time"
                    type="time"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="closing-time">Closing Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="closing-time"
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Pricing</h3>

            <div className="space-y-2">
              <Label htmlFor="price-per-hour">Price Per Hour ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price-per-hour"
                  type="number"
                  min="1"
                  step="0.01"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Other Settings</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="advance-booking">Advance Booking</Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to book courts up to 14 days in advance
                </p>
              </div>
              <Switch id="advance-booking" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cancellation">Free Cancellation</Label>
                <p className="text-sm text-muted-foreground">
                  Allow free cancellation up to 24 hours before booking time
                </p>
              </div>
              <Switch id="cancellation" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="waitlist">Waitlist</Label>
                <p className="text-sm text-muted-foreground">
                  Enable waitlist for fully booked time slots
                </p>
              </div>
              <Switch id="waitlist" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
