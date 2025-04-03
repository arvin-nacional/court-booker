import SignUpComponent from "@/components/auth/Signup";
import React from "react";

const Page = () => {
  return (
    <div className="mt-[120px] mb-16 flex flex-row gap-20 max-sm:flex-col items-center">
      <SignUpComponent />
    </div>
  );
};

export default Page;
