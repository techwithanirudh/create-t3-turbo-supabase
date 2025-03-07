import type { LucideIcon } from "lucide-react";
import {
  Bot,
  FileText,
  HardDrive,
  Home,
  MessageSquare,
  Settings,
  Trash2,
  Users,
} from "lucide-react";

export interface NavItem {
  title: string;
  href?: string;
  icon?: LucideIcon;
  items?: NavItem[];
  separator?: boolean;
  variant?: "default" | "ghost";
  label?: string;
}

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    variant: "default",
  },
  {
    title: "CRM",
    href: "/dashboard/crm",
    icon: Users,
    variant: "ghost",
  },
  {
    title: "Storage",
    href: "/dashboard/storage",
    icon: HardDrive,
    variant: "ghost",
  },
  {
    title: "Messaging",
    href: "/dashboard/messaging",
    icon: MessageSquare,
    variant: "ghost",
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
    variant: "ghost",
  },
  {
    title: "Chatbot",
    href: "/dashboard/chatbot",
    icon: Bot,
    variant: "ghost",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    variant: "ghost",
  },
  {
    title: "Trash",
    href: "/dashboard/trash",
    icon: Trash2,
    variant: "ghost",
  },
];

export const settingsNavItems: NavItem[] = [
  {
    title: "User Settings",
    items: [
      {
        title: "Profile",
        href: "/dashboard/settings/profile",
      },
      {
        title: "Account",
        href: "/dashboard/settings/account",
      },
    ],
  },
  {
    title: "Divider",
    separator: true,
  },
  {
    title: "Preferences",
    items: [
      {
        title: "Appearance",
        href: "/dashboard/settings/appearance",
      },
      {
        title: "Display",
        href: "/dashboard/settings/display",
      },
      {
        title: "Notifications",
        href: "/dashboard/settings/notifications",
      },
    ],
  },
];
