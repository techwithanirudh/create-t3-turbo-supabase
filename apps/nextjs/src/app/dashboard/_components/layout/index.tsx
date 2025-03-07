"use client";

import * as React from "react";
import Link from "next/link";
import type { UserResponse, User } from "@supabase/supabase-js";
import {
  NotebookTextIcon,
  Search,
  Menu,
} from "lucide-react";

import { cn } from "@acme/ui";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@acme/ui/breadcrumb";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@acme/ui/resizable";
import { Separator } from "@acme/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@acme/ui/sheet";
import { TooltipProvider } from "@acme/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@acme/ui/avatar";
import { ScrollArea } from "@acme/ui/scroll-area";

import { Logo } from "~/app/dashboard/_components/layout/logo";
import { Nav } from "~/app/dashboard/_components/layout/nav";
import UserAvatar from "../user-avatar";
import { ThemeToggle } from "@acme/ui/theme";
import { usePathname } from "next/navigation";
import { mainNavItems } from "~/app/dashboard/config/nav";

interface UserMetadata {
  avatar_url?: string;
  full_name?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  user: UserResponse & { data: { user: User & { user_metadata: UserMetadata } | null } };
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

function getBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`;
    const title = mainNavItems.find(link => link.href === href)?.title ??
      path.charAt(0).toUpperCase() + path.slice(1);
    return { href, title };
  });
  return breadcrumbs;
}

export function Layout({
  children,
  user,
  defaultLayout = [265, 1095],
  defaultCollapsed = false,
  navCollapsedSize,
}: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes,
          )}`;
        }}
        className="min-h-[100dvh] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
          }}
          className={cn(
            "hidden sm:block",
            isCollapsed &&
            "min-w-[50px] transition-all duration-300 ease-in-out",
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2",
            )}
          >
            <Logo isCollapsed={isCollapsed} />
          </div>
          <Separator />
          <Nav isCollapsed={isCollapsed} links={mainNavItems} />
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden sm:flex" />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className="flex h-full flex-col">
            <header
              className={cn(
                "sticky top-0 z-30 flex h-[52px] items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:px-6",
              )}
            >
              <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                      <BreadcrumbItem>
                        {index === breadcrumbs.length - 1 ? (
                          <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={crumb.href}>{crumb.title}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-[200px] pl-8 lg:w-[300px]"
                  />
                </div>

                <UserAvatar user={user} />

                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] p-0">
                    <div className="flex h-14 items-center border-b px-4">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 font-semibold"
                      >
                        <NotebookTextIcon className="h-6 w-6" />
                        <span>Enterprise Suite</span>
                      </Link>
                    </div>
                    <ScrollArea className="h-[calc(100vh-56px)]">
                      <div className="p-4">
                        <div className="mb-4">
                          <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full"
                          />
                        </div>
                        <nav className="grid gap-2">
                          {mainNavItems.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                            return (
                              <Link
                                key={link.href}
                                href={link.href ?? '#'}
                                className={cn(
                                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                  isActive
                                    ? "bg-muted text-primary"
                                    : "hover:bg-muted text-muted-foreground hover:text-primary"
                                )}
                              >
                                {link.icon && <link.icon className="h-5 w-5" />}
                                <span>{link.title}</span>
                              </Link>
                            );
                          })}
                        </nav>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 border">
                              <AvatarImage
                                src={user.data.user?.user_metadata.avatar_url}
                                alt={user.data.user?.email ?? ""}
                              />
                              <AvatarFallback>
                                {user.data.user?.email?.[0]?.toUpperCase() ?? "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-0.5 text-xs">
                              <span className="font-medium">
                                {user.data.user?.user_metadata.full_name ??
                                  user.data.user?.email ??
                                  "User"}
                              </span>
                              <span className="text-muted-foreground">
                                {user.data.user?.email}
                              </span>
                            </div>
                          </div>
                          <ThemeToggle />
                        </div>
                      </div>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </div>
            </header>
            <main className="flex-1 overflow-auto bg-muted/30">
              {children}
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
