import React from "react";
import {
  Box,
  Database,
  Globe,
  Layers,
  Lock,
  Smartphone,
  Terminal,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "Full-Stack TypeScript",
    description:
      "End-to-end type safety with TypeScript across your entire stack",
    icon: Zap,
  },
  {
    title: "Monorepo Structure",
    description:
      "Turborepo-powered monorepo with shared packages and configurations",
    icon: Layers,
  },
  {
    title: "Web & Mobile",
    description:
      "Next.js for web and Expo for iOS/Android, sharing code between platforms",
    icon: Smartphone,
  },
  {
    title: "Database & Auth",
    description: "Supabase for auth and PostgreSQL database with Drizzle ORM",
    icon: Database,
  },
  {
    title: "Type-Safe API",
    description:
      "End-to-end typesafe API with tRPC for seamless client-server communication",
    icon: Globe,
  },
  {
    title: "Developer Experience",
    description:
      "Hot reload, type checking, and unified commands across all packages",
    icon: Terminal,
  },
  {
    title: "Production Ready",
    description: "Built-in deployment configurations for Vercel and Expo",
    icon: Box,
  },
  {
    title: "Security First",
    description:
      "Row-level security, type-safe operations, and secure authentication flows",
    icon: Lock,
  },
];

export default function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="features">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-lg bg-gray-900 p-3">
                <feature.icon className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-50">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
