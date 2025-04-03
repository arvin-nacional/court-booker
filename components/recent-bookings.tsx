"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Update the mock data for upcoming bookings to include payment status
const upcomingBookings = [
  {
    id: 1,
    court: "Court 1",
    date: new Date(2025, 2, 30),
    startTime: 18,
    duration: 1,
    status: "confirmed",
    renter: "John Doe",
    paid: true,
    amount: 15,
  },
  {
    id: 2,
    court: "Court 3",
    date: new Date(2025, 3, 2),
    startTime: 10,
    duration: 2,
    status: "confirmed",
    renter: "John Doe",
    paid: false,
    amount: 30,
  },
  {
    id: 3,
    court: "Court 2",
    date: new Date(2025, 3, 5),
    startTime: 14,
    duration: 3,
    status: "pending",
    renter: "John Doe",
    paid: false,
    amount: 45,
  },
];

// Update the mock data for past bookings to include payment status and no-show
const pastBookings = [
  {
    id: 4,
    court: "Court 4",
    date: new Date(2025, 2, 20),
    startTime: 16,
    duration: 1,
    status: "completed",
    renter: "John Doe",
    paid: true,
    amount: 15,
  },
  {
    id: 5,
    court: "Court 1",
    date: new Date(2025, 2, 15),
    startTime: 11,
    duration: 2,
    status: "completed",
    renter: "John Doe",
    paid: true,
    amount: 30,
  },
  {
    id: 6,
    court: "Court 2",
    date: new Date(2025, 2, 10),
    startTime: 9,
    duration: 1,
    status: "no-show",
    renter: "John Doe",
    paid: false,
    amount: 15,
  },
];

// Add a function to render the payment status badge
const getPaymentBadge = (paid: boolean) => {
  return paid ? (
    <Badge className="bg-green-500">Paid</Badge>
  ) : (
    <Badge variant="outline" className="text-amber-500 border-amber-500">
      Unpaid
    </Badge>
  );
};

export function RecentBookings() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-500 border-yellow-500"
          >
            Pending
          </Badge>
        );
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "no-show":
        return <Badge variant="destructive">No-Show</Badge>;
      default:
        return null;
    }
  };

  // Group bookings by date
  const bookingsByDate = upcomingBookings.reduce((acc, booking) => {
    const dateStr = booking.date.toDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(booking);
    return acc;
  }, {} as Record<string, typeof upcomingBookings>);

  return (
    <Tabs defaultValue="upcoming" className="space-y-4">
      <TabsList className="w-full grid grid-cols-2 md:w-auto md:inline-flex">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming" className="space-y-4">
        {upcomingBookings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground">
                You don&#39;t have any upcoming bookings.
              </p>
              <Button className="mt-4">Book a Court</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(bookingsByDate).map(([dateStr, bookings]) => {
              const date = new Date(dateStr);

              return (
                <div key={dateStr} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      {format(date, "EEEE, MMMM d, yyyy")}
                    </h3>
                    <Badge variant="outline">
                      {bookings.length}{" "}
                      {bookings.length === 1 ? "booking" : "bookings"}
                    </Badge>
                  </div>

                  <div className="grid gap-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="grid gap-1">
                              <CardTitle>{booking.court}</CardTitle>
                              <CardDescription className="flex items-center gap-1">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                {format(booking.date, "PPP")}
                              </CardDescription>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5" />
                                  {booking.startTime}:00 -{" "}
                                  {booking.startTime + booking.duration}:00
                                  {booking.duration > 1 && (
                                    <span className="text-xs ml-1">
                                      ({booking.duration}h)
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="h-3.5 w-3.5" />
                                  Main Building
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2">
                              {getStatusBadge(booking.status)}
                              {getPaymentBadge(booking.paid)}
                              <div className="text-sm font-medium mt-0 sm:mt-2">
                                ${booking.amount}.00
                              </div>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              Reschedule
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </TabsContent>
      <TabsContent value="past" className="space-y-4">
        <div className="grid gap-4">
          {pastBookings.map((booking) => (
            <Card
              key={booking.id}
              className={
                booking.status === "no-show" ? "border-red-200 bg-red-50" : ""
              }
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="grid gap-1">
                    <CardTitle>{booking.court}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {format(booking.date, "PPP")}
                    </CardDescription>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {booking.startTime}:00 -{" "}
                        {booking.startTime + booking.duration}:00
                        {booking.duration > 1 && (
                          <span className="text-xs ml-1">
                            ({booking.duration}h)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        Main Building
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2">
                    {getStatusBadge(booking.status)}
                    {booking.status !== "no-show" &&
                      getPaymentBadge(booking.paid)}
                    <div className="text-sm font-medium mt-0 sm:mt-2">
                      ${booking.amount}.00
                    </div>
                  </div>
                </div>
                {booking.status === "completed" && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Book Again
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
