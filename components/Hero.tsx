import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

const Hero = () => {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-background  mt-16 w-full flex items-center justify-center">
      <div className="container px-4 md:px-6 lg:w-[1200px]">
        <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <Badge
                className="inline-flex rounded-md px-3 py-1 text-sm"
                variant="secondary"
              >
                New Features Available
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Badminton Court Booking Made Simple
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Streamline your court reservations, manage bookings, and
                optimize your facility with our all-in-one solution.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/page">
                <Button size="lg" className="gap-1.5 cursor-pointer">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="cursor-pointer">
                  View Features
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>No credit card required</span>
              <Separator orientation="vertical" className="h-4" />
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>100% Free</span>

              {/* <CheckCircle className="h-4 w-4 text-primary" />
              <span>Cancel anytime</span> */}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative aspect-video overflow-hidden rounded-xl border bg-background p-2 shadow-xl">
              <div className="h-[550px] w-[330px]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
