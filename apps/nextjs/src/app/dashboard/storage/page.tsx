import React from "react";
import {
  FileIcon,
  FolderIcon,
  HardDriveIcon,
  ImageIcon,
  MoreVertical,
  PlusIcon,
  Search,
  UploadIcon,
} from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { Input } from "@acme/ui/input";
import { Progress } from "@acme/ui/progress";

export default function StoragePage() {
  return (
    <div className="flex flex-col space-y-6 p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">File Storage</h1>
          <p className="text-muted-foreground">
            Manage and organize your company files
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button size="sm">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button size="sm" variant="outline">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Folder
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Storage</CardTitle>
            <CardDescription>Overall storage usage</CardDescription>
          </CardHeader>
          <CardContent>
            <HardDriveIcon className="mb-4 h-8 w-8" />
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                245.9 GB of 1 TB
              </span>
              <span className="text-sm font-semibold">24.5%</span>
            </div>
            <Progress value={24.5} className="h-2" />
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-blue-500" />
                  <span>Documents</span>
                </div>
                <span>85.2 GB</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
                  <span>Images</span>
                </div>
                <span>64.3 GB</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500" />
                  <span>Videos</span>
                </div>
                <span>46.8 GB</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-purple-500" />
                  <span>Other</span>
                </div>
                <span>49.6 GB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Files and Folders</CardTitle>
                <CardDescription>My Files {"->"} Documents</CardDescription>
              </div>
              <div className="relative w-full max-w-sm sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search files..." className="pl-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex cursor-pointer flex-col rounded-lg border p-3 shadow-sm transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FolderIcon className="h-10 w-10 text-yellow-500" />
                        <div>
                          <div className="font-medium">{folder.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {folder.files} files
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <h3 className="mb-4 text-lg font-medium">Recent Files</h3>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg border p-3 shadow-sm transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        {file.type === "image" ? (
                          <ImageIcon className="h-8 w-8 text-blue-500" />
                        ) : (
                          <FileIcon className="h-8 w-8 text-gray-500" />
                        )}
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {file.size} • {file.modifiedDate}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const folders = [
  {
    id: "1",
    name: "Marketing Materials",
    files: 15,
  },
  {
    id: "2",
    name: "Product Documentation",
    files: 24,
  },
  {
    id: "3",
    name: "HR Documents",
    files: 8,
  },
  {
    id: "4",
    name: "Financial Reports",
    files: 12,
  },
  {
    id: "5",
    name: "Client Presentations",
    files: 19,
  },
  {
    id: "6",
    name: "Project Plans",
    files: 7,
  },
];

const files = [
  {
    id: "1",
    name: "Q3 Financial Report.pdf",
    size: "3.2 MB",
    type: "file",
    modifiedDate: "Today at 2:45 PM",
  },
  {
    id: "2",
    name: "Product Roadmap 2024.docx",
    size: "1.8 MB",
    type: "file",
    modifiedDate: "Yesterday at 10:30 AM",
  },
  {
    id: "3",
    name: "Marketing Campaign Banner.png",
    size: "4.5 MB",
    type: "image",
    modifiedDate: "May 12, 2024",
  },
  {
    id: "4",
    name: "Client Meeting Notes.pdf",
    size: "850 KB",
    type: "file",
    modifiedDate: "May 10, 2024",
  },
  {
    id: "5",
    name: "Team Photo.jpg",
    size: "6.2 MB",
    type: "image",
    modifiedDate: "May 5, 2024",
  },
];
