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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Clock,
  CreditCard,
  Mail,
  Phone,
  User,
  Repeat,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Copy,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface BookingDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
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
  } | null;
  onDeleteBooking?: (id: number, deleteAllRecurring: boolean) => void;
  onMarkNoShow?: (id: number) => void;
  onMarkAsPaid?: (id: number) => void;
  onToggleRecurring?: (id: number, isRecurring: boolean) => void;
}

export function BookingDetailsDialog({
  open,
  onOpenChange,
  booking,
  onDeleteBooking,
  onMarkNoShow,
  onMarkAsPaid,
  onToggleRecurring,
}: BookingDetailsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string>("confirmed");
  const [paymentStatus, setPaymentStatus] = useState<string>("unpaid");
  const [isRecurring, setIsRecurring] = useState(false);
  const [deleteAllRecurring, setDeleteAllRecurring] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  // Initialize the status values when the booking changes
  useEffect(() => {
    if (booking) {
      setBookingStatus(booking.status || "confirmed");
      setPaymentStatus(booking.paid ? "paid" : "unpaid");
      setIsRecurring(booking.recurring || false);
      setActiveTab("details");
    }
  }, [booking]);

  if (!booking) return null;

  const handleDelete = () => {
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
      onOpenChange(false);

      if (onDeleteBooking) {
        onDeleteBooking(booking.id, deleteAllRecurring);
      }

      toast("Booking Deleted", {
        description: `The booking for ${booking.court} on ${format(
          booking.date,
          "PPP"
        )} has been deleted${
          deleteAllRecurring && booking.recurring
            ? ", along with all future recurring bookings"
            : ""
        }.`,
      });
    }, 1000);
  };

  const handleStatusChange = (value: string) => {
    setIsProcessing(true);
    setBookingStatus(value);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);

      if (value === "no-show" && onMarkNoShow) {
        onMarkNoShow(booking.id);
      }

      toast("Status Updated", {
        description: `Booking status has been updated to ${value}.`,
      });
    }, 1000);
  };

  const handlePaymentChange = (value: string) => {
    setIsProcessing(true);
    setPaymentStatus(value);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);

      if (value === "paid" && onMarkAsPaid) {
        onMarkAsPaid(booking.id);
      }

      toast("Payment Status Updated", {
        description: `Payment status has been updated to ${value}.`,
      });
    }, 1000);
  };

  const handleRecurringChange = (checked: boolean) => {
    setIsProcessing(true);
    setIsRecurring(checked);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);

      if (onToggleRecurring) {
        onToggleRecurring(booking.id, checked);
      }

      toast("Recurring Status Updated", {
        description: checked
          ? "This booking is now recurring weekly."
          : "This booking is no longer recurring. Future recurring bookings have been removed.",
      });
    }, 1000);
  };

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast("Copied to clipboard", {
        description: description,
      });
    });
  };

  // const isPaid = booking.paid;
  // const isNoShow = booking.status === "no-show";
  // const isUpcoming = booking.date > new Date();
  const isPastBooking = booking.date < new Date();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "no-show":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getPaymentIcon = (paid: boolean) => {
    return paid ? (
      <CheckCircle2 className="h-5 w-5 text-green-500" />
    ) : (
      <AlertCircle className="h-5 w-5 text-amber-500" />
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px] max-w-[95vw] rounded-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">Booking Details</DialogTitle>
              <div className="flex gap-2">
                {booking.recurring && (
                  <Badge
                    variant="outline"
                    className="border-purple-500 text-purple-700"
                  >
                    Recurring
                  </Badge>
                )}
                <Badge
                  variant={
                    booking.status === "no-show"
                      ? "destructive"
                      : booking.status === "confirmed"
                      ? "default"
                      : "outline"
                  }
                  className={
                    booking.status === "confirmed" ? "bg-blue-500" : ""
                  }
                >
                  {booking.status === "no-show"
                    ? "No-Show"
                    : booking.status === "confirmed"
                    ? "Confirmed"
                    : booking.status === "completed"
                    ? "Completed"
                    : booking.status || "Pending"}
                </Badge>
                <Badge
                  variant={booking.paid ? "default" : "outline"}
                  className={
                    booking.paid
                      ? "bg-green-500"
                      : "text-amber-500 border-amber-500"
                  }
                >
                  {booking.paid ? "Paid" : "Unpaid"}
                </Badge>
              </div>
            </div>
            <DialogDescription>
              Booking #{booking.id} for {booking.court} on{" "}
              {format(booking.date, "PPP")}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {booking.court}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {format(booking.date, "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {booking.time}:00 - {booking.time + booking.duration}:00
                        <span className="ml-1 text-muted-foreground">
                          ({booking.duration} hour
                          {booking.duration > 1 ? "s" : ""})
                        </span>
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        ${booking.amount}.00
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status || "confirmed")}
                      <span className="text-sm">
                        Status:{" "}
                        {booking.status
                          ? booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)
                          : "Confirmed"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(booking.paid)}
                      <span className="text-sm">
                        Payment: {booking.paid ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {booking.recurring && (
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Repeat className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">
                        Recurring Booking
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This booking repeats weekly at the same time.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="customer" className="space-y-4 pt-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {booking.renter}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        copyToClipboard(booking.renter, "Customer name copied")
                      }
                      className="h-8 w-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm break-all">{booking.email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        copyToClipboard(booking.email, "Email address copied")
                      }
                      className="h-8 w-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {booking.phone || "Not provided"}
                      </span>
                    </div>
                    {booking.phone && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          copyToClipboard(booking.phone, "Phone number copied")
                        }
                        className="h-8 w-8"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const mailtoLink = `mailto:${
                      booking.email
                    }?subject=Your booking for ${booking.court} on ${format(
                      booking.date,
                      "PPP"
                    )}`;
                    window.open(mailtoLink, "_blank");
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email Customer
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="manage" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-sm font-medium">Booking Status</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={
                          bookingStatus === "confirmed" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleStatusChange("confirmed")}
                        disabled={isProcessing}
                        className={
                          bookingStatus === "confirmed"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : ""
                        }
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Confirmed
                      </Button>
                      <Button
                        variant={
                          bookingStatus === "completed" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleStatusChange("completed")}
                        disabled={isProcessing}
                        className={
                          bookingStatus === "completed"
                            ? "bg-green-500 hover:bg-green-600"
                            : ""
                        }
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Completed
                      </Button>
                      <Button
                        variant={
                          bookingStatus === "no-show"
                            ? "destructive"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleStatusChange("no-show")}
                        disabled={isProcessing}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        No-Show
                      </Button>
                      <Button
                        variant={
                          bookingStatus === "cancelled"
                            ? "secondary"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleStatusChange("cancelled")}
                        disabled={isProcessing}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancelled
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-sm font-medium">Payment Status</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={
                          paymentStatus === "paid" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePaymentChange("paid")}
                        disabled={isProcessing}
                        className={
                          paymentStatus === "paid"
                            ? "bg-green-500 hover:bg-green-600"
                            : ""
                        }
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark as Paid
                      </Button>
                      <Button
                        variant={
                          paymentStatus === "unpaid" ? "secondary" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePaymentChange("unpaid")}
                        disabled={isProcessing}
                      >
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Mark as Unpaid
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Recurring Booking</h3>
                      <Switch
                        id="recurring"
                        checked={isRecurring}
                        onCheckedChange={handleRecurringChange}
                        disabled={isProcessing || isPastBooking}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isPastBooking
                        ? "Cannot modify recurring status for past bookings"
                        : isRecurring
                        ? "This booking repeats weekly. Turning this off will remove all future bookings."
                        : "Make this booking repeat weekly at the same time."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isProcessing}
              size="sm"
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Booking
            </Button>

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
              disabled={isProcessing}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {booking.recurring && (
            <div className="flex items-center space-x-2 py-2">
              <Switch
                id="delete-all-recurring"
                checked={deleteAllRecurring}
                onCheckedChange={setDeleteAllRecurring}
              />
              <Label htmlFor="delete-all-recurring">
                Delete all future recurring bookings
              </Label>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground"
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
