import Link from "next/link";

import { buttonVariants } from "@acme/ui/button";
import { Card, CardHeader } from "@acme/ui/card";

import MotionWrap from "../../motion-wrap";

export default function Features() {
  return (
    <MotionWrap className="w-full py-24 lg:py-32" id="features">
      <div className="container space-y-12 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-foreground/10">
              Key Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-gray-50 sm:text-5xl">
              Comprehensive Enterprise Solutions
            </h2>
            <p className="max-w-[900px] text-gray-600 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our integrated platform delivers essential tools to optimize your company's operations
              and collaboration workflows.
            </p>
          </div>
        </div>
        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
          <Card className="grid gap-1">
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                Customer Relationship Management
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Centralized customer data, interaction tracking, and sales pipeline management.
              </p>
            </CardHeader>
          </Card>
          <Card className="grid gap-1">
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                Secure File Storage
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enterprise-grade storage with encryption, access controls, and unlimited capacity.
              </p>
            </CardHeader>
          </Card>
          <Card className="grid gap-1">
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                Team Messaging
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time communication with channels, direct messages, and video conferencing.
              </p>
            </CardHeader>
          </Card>
          <Card className="grid gap-1">
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                Document Management
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comprehensive document workflows with version control and approval processes.
              </p>
            </CardHeader>
          </Card>
          <Card className="grid gap-1">
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                AI-Powered Chatbot
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Intelligent virtual assistant to automate tasks and provide instant support.
              </p>
            </CardHeader>
          </Card>
          <Card className="grid gap-1">
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                Advanced Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Data-driven insights and customizable reports for informed decision-making.
              </p>
            </CardHeader>
          </Card>
        </div>
        <div className="flex flex-row items-start justify-between gap-4 md:justify-center">
          <Link
            href="/auth/signin"
            className={buttonVariants({ variant: "default" })}
          >
            Schedule Demo
          </Link>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/about"
          >
            Learn More
          </Link>
        </div>
      </div>
    </MotionWrap>
  );
}