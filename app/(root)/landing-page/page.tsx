import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import React from "react";

const page = () => {
  return (
    <section className="flex flex-col items-center justify-center">
      <Hero />
      <Features />
      <FAQ />
      <CTA />
      <Footer />
    </section>
  );
};

export default page;
