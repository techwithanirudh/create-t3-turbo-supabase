import { Suspense } from "react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@acme/ui/breadcrumb";

import { api } from "~/trpc/server";
import { AuthShowcase } from "./_components/auth-showcase";
import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
} from "./_components/posts";

import { ScrollArea } from "@acme/ui/scroll-area"

export const runtime = "edge";

export default function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  const posts = api.post.all();

  return (
    <div className="flex-1 space-y-4 p-4 pt-2 md:p-6 md:pt-4 lg:p-8 lg:pt-6">
      <CreatePostForm />

      <ScrollArea className="w-full overflow-y-auto h-[65dvh]">
        <Suspense
          fallback={
            <div className="flex w-full flex-col gap-4">
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
          }
        >
          <PostList posts={posts} />
        </Suspense>
      </ScrollArea>
    </div>
  );
}
