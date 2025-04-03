import React from "react";

import Link from "next/link";
import { Mail, Phone, PinIcon } from "lucide-react";

const Footer = () => {
  return (
    <section className="bg-gray-800 flex items-center justify-center bg-dark-300 w-full py-10 max-md:px-5 flex-col">
      <div className="mt-14 flex w-[1200px] flex-row  justify-between max-sm:mt-5 max-sm:flex-col">
        <div className="flex flex-col gap-5 pb-12">
          <p className="text-slate-50 font-bold text-2xl">CourtBooker</p>
          <p className="w-[350px] text-slate-300 font-light">
            Forget the hassle of manually managing your badminton court
            bookings. Our platform automates the process, allowing you to focus
            on what you do best: providing a great experience for your players.
          </p>
        </div>
        <div className="text-dark400_light800 pb-12">
          <p className="h3-bold text-white">Quick Links</p>
          <div className="body-regular mt-2 flex flex-col gap-2 text-slate-300">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/shipping-calculator">Shipping Calculator</Link>
            <Link href="/locations">Location</Link>
          </div>
        </div>
        <div className="text-dark400_light800 pb-12 ">
          <p className="h3-bold text-white">Contact</p>
          <div className="body-regular text-slate-300">
            <div className=" mt-3 flex gap-5 ">
              <Phone />
              <p>+63 965 925 6451</p>
            </div>
            <div className="mt-3 flex gap-5 ">
              <Mail />
              <p>inquiries@rvinpaul.com</p>
            </div>
            <div className="mt-3 flex gap-5 items-start">
              <PinIcon />
              <p className="text-wrap">Caloocan City</p>
            </div>
          </div>
        </div>

        {/* <div className="pb-12">
          <p className="h3-bold text-white">Subscribe</p>
          <p className="small-regular mb-3 py-2 text-slate-300">
            Subscribe to get our latest news and updates.
          </p>
          <Subscriber type="" />
        </div> */}
      </div>

      <div>
        <p className="text-slate-300 body-regular text-center">
          Created by{" "}
          <Link href={"https://www.rvinpaul.com"}>
            <span className="text-blue-700">r</span>
            <span>vinpaul</span>.
          </Link>
        </p>
      </div>
      <div>
        <p className="text-slate-300 body-regular text-center mt-2">
          © 2025 CourtBooker. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Footer;
