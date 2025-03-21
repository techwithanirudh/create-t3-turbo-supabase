import React from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";
import CopyButton from "./CopyButton";

import { Button } from "@acme/ui/button";
import MotionWrap from "../../motion-wrap";

// Explicitly mark as Server Component
export default function Hero() {
  return (
    <MotionWrap
      className="mt-14 w-full py-24 md:mt-0 lg:py-32 xl:py-48"
      id="hero"
    >
      <div className="container space-y-10 px-4 md:px-6 xl:space-y-16">
        <div className="mx-auto flex flex-col items-center text-center max-w-[900px]">
          <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter text-gray-900 dark:text-gray-50 sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] mb-6">
            Create Turbo Stack
          </h1>
          <h2 className="text-xl text-gray-600 dark:text-gray-400 md:text-2xl mb-8">
            The Missing Full-Stack Monorepo Generator for Next.js + React Native
          </h2>
          <div className="w-full max-w-3xl mx-auto bg-gray-900 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-gray-400" />
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center justify-center bg-gray-800/50 rounded-md p-4">
              <span className="text-gray-400 font-mono mr-2">$</span>
              <code className="text-green-400 font-mono text-lg">
                /bin/bash -c "$(curl -fsSL
                https://raw.githubusercontent.com/pedromshin/create-turbo-stack/main/scripts/setup-project.sh)"
              </code>
              <CopyButton />
            </div>
            <p className="text-gray-400 text-sm mt-4 text-center">
              Paste that in your terminal to create a new full-stack monorepo.
            </p>
            <div className="mt-6 text-left">
              <p className="text-gray-400 text-sm mb-2">Prerequisites:</p>
              <ul className="text-gray-400 text-sm list-disc list-inside space-y-1">
                <li>
                  macOS, Linux, or Windows (WSL2) (
                  <span className="text-green-400">detected automatically</span>
                  )
                </li>
                <li>
                  Node.js 18+ (
                  <span className="text-green-400">installed if needed</span>)
                </li>
                <li>
                  Docker (
                  <span className="text-green-400">for local Supabase</span>)
                </li>
                <li>
                  Git (
                  <span className="text-green-400">installed if needed</span>)
                </li>
              </ul>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            The script explains what it will do and then pauses before it does
            it.
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/docs">Documentation</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://github.com/pedromshin/create-turbo-stack">
                GitHub
              </Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {[
              "Next.js 14",
              "React Native",
              "Supabase",
              "TypeScript",
              "Tailwind",
              "tRPC",
              "Expo",
              "Drizzle",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </MotionWrap>
  );
}
