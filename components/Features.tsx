import {
  Calendar,
  Repeat,
  CreditCard,
  Users,
  Clock,
  BarChart3,
} from "lucide-react";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";

const Features = () => {
  return (
    <div className="w-full ">
      <section
        id="features"
        className="py-12 md:py-24 bg-muted/50 flex justify-center items-center"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge className="border-2 text-primary" variant="outline">
                Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Everything You Need to Manage Your Courts
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform provides all the tools you need to efficiently
                manage your badminton facility.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Calendar className="h-6 w-12 text-primary" />
                </div>
                <CardTitle>Easy Scheduling</CardTitle>
                <CardDescription className="w-full">
                  Intuitive calendar interface for quick and easy court
                  bookings.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="flex flex-col ">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Repeat className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Recurring Bookings</CardTitle>
                <CardDescription>
                  Set up regular sessions with our recurring booking feature.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="flex flex-col  ">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Payment Tracking</CardTitle>
                <CardDescription>
                  Keep track of payments and manage your finances efficiently.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multi-Court Management</CardTitle>
                <CardDescription>
                  Manage multiple courts from a single dashboard with ease.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="flex flex-col  ">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-time Availability</CardTitle>
                <CardDescription>
                  See court availability in real-time and make instant bookings.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="flex flex-col  ">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Gain insights into court usage and optimize your operations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
