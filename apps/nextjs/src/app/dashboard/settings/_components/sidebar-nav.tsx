"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/button";
import { Separator } from "@acme/ui/separator";
import { ScrollArea } from "@acme/ui/scroll-area";

interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
  separator?: boolean;
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <nav
        className={cn("flex flex-col space-y-1 px-4 py-2 sm:px-2", className)}
        {...props}
      >
        {items.map((item, index) => {
          if (item.separator) {
            return <Separator key={index} className="my-4" />;
          }

          if (item.items) {
            const isGroupActive = item.items.some((subItem) =>
              isActive(subItem.href),
            );
            return (
              <div key={item.title} className="space-y-2">
                <h4
                  className={cn(
                    "px-2 py-1 text-sm font-semibold tracking-tight",
                    isGroupActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.title}
                </h4>
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href ?? "#"}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      isActive(subItem.href)
                        ? "bg-muted hover:bg-muted font-medium text-primary"
                        : "hover:bg-muted text-muted-foreground hover:text-primary",
                      "w-full justify-start",
                    )}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href ?? "#"}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                isActive(item.href)
                  ? "bg-muted hover:bg-muted font-medium text-primary"
                  : "hover:bg-muted text-muted-foreground hover:text-primary",
                "w-full justify-start",
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </ScrollArea>
  );
}
