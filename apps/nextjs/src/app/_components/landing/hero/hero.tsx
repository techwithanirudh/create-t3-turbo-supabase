import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@acme/ui/button";

import MotionWrap from "../../motion-wrap";

export default function Hero() {
  return (
    <MotionWrap
      className="mt-14 w-full py-24 md:mt-0 lg:py-32 xl:py-48"
      id="hero"
    >
      <div className="container space-y-10 px-4 md:px-6 xl:space-y-16">
        <div className="mx-auto grid max-w-[1300px] gap-4 px-4 md:grid-cols-2 md:gap-16">
          <div>
            <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter text-gray-900 dark:text-gray-50 sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
              All-in-One Enterprise Solution
            </h1>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-400 md:text-xl">
              Streamline your company operations with our unified platform for
              CRM, storage, messaging, document management, and AI assistance.
            </p>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/auth/signin">Get Started</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
        <Image
          alt="Enterprise Dashboard"
          className="mx-auto rounded-t-xl object-cover"
          height="300"
          src="/images/hero.jpg"
          width="1270"
          priority={true}
        />
      </div>
    </MotionWrap>
  );
}
