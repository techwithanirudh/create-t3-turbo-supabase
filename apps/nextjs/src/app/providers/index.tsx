"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "@acme/ui/theme";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "@acme/ui/sonner";

export function Providers({
  children,
  theme,
}: {
  children: ReactNode;
  theme: string;
}) {
  return (
    <ThemeProvider defaultTheme={theme} attribute="class" enableSystem>
      <TRPCReactProvider>
        {children}
        <Toaster />
      </TRPCReactProvider>
    </ThemeProvider>
  );
}
