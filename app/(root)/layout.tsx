import Footer from "@/components/Footer";
import Navbar from "@/components/navigation/main-nav";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative w-full">
      <Navbar />
      <section className="min-h-screen">
        <div className="mx-auto w-full ">{children}</div>
      </section>
      <Footer />
    </main>
  );
};

export default Layout;
