import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <div className="bg-muted/50 w-full">
      <section className="py-12 md:py-24 flex items-center justify-center ">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Transform Your Court Management?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of facilities already using CourtBooker to
                streamline their operations.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="gap-1.5 cursor-pointer">
                Sign Up for Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required. 100% Free.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CTA;
