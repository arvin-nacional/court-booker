import Footer from "@/components/Footer";
import Navbar from "@/components/navigation/main-nav";

import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      <Navbar />
      <main className="flex justify-center items-center size-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
