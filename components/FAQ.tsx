import React from "react";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const FAQ = () => {
  return (
    <div>
      <section className="py-12 md:py-24 ">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="outline" className="border-2 text-primary">
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Find answers to common questions about our platform.
              </p>
            </div>
          </div>
          <div className="mx-auto py-12 ">
            <Accordion
              type="single"
              collapsible
              className="xl:w-[800px] md:w-[600px] max-sm:w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  How do I get started with CourtBooker?
                </AccordionTrigger>
                <AccordionContent>
                  Getting started is easy! Simply click the &quot;Get
                  Started&quot; button, create an account, and follow the setup
                  wizard to configure your courts and settings. You&apos;ll be
                  up and running in minutes.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Can I customize the booking rules for different courts?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, you can set different booking rules for each court,
                  including advance booking periods, cancellation policies, and
                  pricing. This flexibility allows you to manage your facility
                  exactly how you want.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Is there a mobile app available?
                </AccordionTrigger>
                <AccordionContent>
                  While we don&apos;t have a dedicated mobile app yet, our
                  platform is fully responsive and works perfectly on mobile
                  devices. You can access all features through your mobile
                  browser.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  How does the payment system work?
                </AccordionTrigger>
                <AccordionContent>
                  We don&apos;t have a payment system but you can track all the
                  amounts earned from the bookings.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  Can players book courts themselves?
                </AccordionTrigger>
                <AccordionContent>
                  No, only the court admin can book courts in the booking page.
                  The admin can control which time slots are available and can
                  approve bookings manually.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  What kind of support do you offer?
                </AccordionTrigger>
                <AccordionContent>
                  All plans include email support. Pro plans include chat
                  support during business hours, while Enterprise plans include
                  priority support with dedicated account managers and phone
                  support.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
