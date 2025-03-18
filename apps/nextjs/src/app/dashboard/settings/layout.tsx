import type { Metadata } from "next";

import { Separator } from "@acme/ui/separator";
import { SidebarNav } from "~/app/dashboard/settings/_components/sidebar-nav";
import { settingsNavItems } from "~/app/dashboard/config/nav";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Enterprise Suite settings. Customize your preferences and configure your account settings here.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="space-y-6 p-4 pb-16 md:p-8 lg:p-10">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set your preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/4 xl:w-1/5">
            <SidebarNav items={settingsNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-3xl">
            <div className="rounded-lg border bg-card p-4 shadow-sm md:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
