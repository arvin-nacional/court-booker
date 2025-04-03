import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Settings } from "lucide-react";

const Navbar = () => {
  return (
    <div className="w-full z-50 border-b-2 flex justify-center bg-white fixed">
      <div className="flex gap-5 py-4 max-xl:w-full max-xl:p-6 max-sm:px-10 max-sm:py-6 xl:min-w-[1300px] ">
        <div className="flex items-center gap-5 w-full justify-between ">
          <div className="flex gap-10 items-center">
            <Link href="/" className="flex items-center gap-1">
              <p className="text-2xl font-bold">
                <span>Court</span>
                <span>Booker</span>
              </p>
            </Link>
            <div className="flex gap-5 text-gray-700 max-md:hidden">
              <Link href="/" className="base-regular hover:text-gray-900">
                Home
              </Link>

              <Link
                href="#features"
                className="base-regular hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="/shipping-calculator"
                className="base-regular hover:text-gray-900"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="flex gap-2">
            <SignedOut>
              <Link href="/sign-in" className="base-regular">
                <Button
                  className="font-regular cursor-pointer"
                  variant={"outline"}
                >
                  Login
                </Button>
              </Link>
              <Link href="/sign-up" className="base-regular">
                <Button className="font-regular cursor-pointer">
                  Get Started
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/settings" className="base-regular">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Settings"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                  variables: {
                    colorPrimary: "#ff7000",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
