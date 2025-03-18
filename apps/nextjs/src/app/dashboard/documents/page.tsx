import React from "react";
import {
  ChevronDownIcon,
  Download,
  File,
  FileEditIcon,
  FileText,
  Filter,
  History,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Star,
  UserRound,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import { Badge } from "@acme/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";

export default function DocumentsPage() {
  return (
    <div className="flex flex-col space-y-6 p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">
            Manage, share, and track versions of your documents
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="recent">Recently Modified</TabsTrigger>
            <TabsTrigger value="shared">Shared with Me</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
          </TabsList>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search documents..." className="pl-8" />
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Documents</CardTitle>
              <CardDescription>
                View and manage all your documents
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Modified By</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead className="w-[100px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {doc.type === "pdf" ? (
                            <FileEditIcon className="h-5 w-5 text-red-500" />
                          ) : doc.type === "doc" ? (
                            <FileText className="h-5 w-5 text-blue-500" />
                          ) : (
                            <File className="h-5 w-5 text-gray-500" />
                          )}
                          <span>{doc.name}</span>
                          {doc.starred && (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {doc.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{doc.lastModified}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserRound className="h-4 w-4 text-muted-foreground" />
                          {doc.modifiedBy}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex items-center gap-1 px-2 py-1 text-xs"
                            >
                              v{doc.currentVersion}
                              <ChevronDownIcon className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Version History</DialogTitle>
                              <DialogDescription>
                                View and restore previous versions of {doc.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 space-y-4">
                              {doc.versions.map((version) => (
                                <div
                                  key={version.number}
                                  className="flex items-center justify-between rounded border p-3"
                                >
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant={
                                          version.number === doc.currentVersion
                                            ? "default"
                                            : "outline"
                                        }
                                      >
                                        v{version.number}
                                      </Badge>
                                      <span className="text-sm font-medium">
                                        {version.date}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      Modified by {version.modifiedBy}
                                    </p>
                                    {version.comment && (
                                      <p className="mt-2 text-sm">
                                        &quot;{version.comment}&quot;
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8"
                                    >
                                      Restore
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8"
                                    >
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <History className="mr-2 h-4 w-4" />
                              View History
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recently Modified</CardTitle>
              <CardDescription>
                Documents that have been modified in the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
                <p className="text-muted-foreground">
                  Recent documents will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Shared with Me</CardTitle>
              <CardDescription>
                Documents that have been shared with you by others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
                <p className="text-muted-foreground">
                  Shared documents will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="starred" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Starred Documents</CardTitle>
              <CardDescription>
                Your important documents marked with a star
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
                <p className="text-muted-foreground">
                  Starred documents will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const documents = [
  {
    id: "1",
    name: "Q2 Financial Report.pdf",
    type: "pdf",
    lastModified: "May 15, 2024",
    modifiedBy: "Jennifer Lee",
    currentVersion: 3.0,
    starred: true,
    versions: [
      {
        number: 3.0,
        date: "May 15, 2024",
        modifiedBy: "Jennifer Lee",
        comment: "Final version with updated projections",
      },
      {
        number: 2.5,
        date: "May 14, 2024",
        modifiedBy: "Jennifer Lee",
        comment: "Updated charts and graphs",
      },
      {
        number: 2.0,
        date: "May 12, 2024",
        modifiedBy: "David Chen",
        comment: "Added executive summary",
      },
      {
        number: 1.0,
        date: "May 10, 2024",
        modifiedBy: "Sarah Johnson",
        comment: "Initial draft",
      },
    ],
  },
  {
    id: "2",
    name: "Product Roadmap 2024.doc",
    type: "doc",
    lastModified: "May 12, 2024",
    modifiedBy: "Michael Brown",
    currentVersion: 2.0,
    starred: false,
    versions: [
      {
        number: 2.0,
        date: "May 12, 2024",
        modifiedBy: "Michael Brown",
        comment: "Updated timeline and milestones",
      },
      {
        number: 1.5,
        date: "May 8, 2024",
        modifiedBy: "Michael Brown",
        comment: null,
      },
      {
        number: 1.0,
        date: "May 5, 2024",
        modifiedBy: "Emily Wong",
        comment: "Initial draft",
      },
    ],
  },
  {
    id: "3",
    name: "Marketing Strategy.pdf",
    type: "pdf",
    lastModified: "May 10, 2024",
    modifiedBy: "Sarah Johnson",
    currentVersion: 4.0,
    starred: true,
    versions: [
      {
        number: 4.0,
        date: "May 10, 2024",
        modifiedBy: "Sarah Johnson",
        comment: "Final approved version",
      },
      {
        number: 3.5,
        date: "May 9, 2024",
        modifiedBy: "Sarah Johnson",
        comment: "Incorporated feedback from marketing team",
      },
      {
        number: 3.0,
        date: "May 8, 2024",
        modifiedBy: "David Chen",
        comment: "Updated social media section",
      },
      {
        number: 2.0,
        date: "May 5, 2024",
        modifiedBy: "Sarah Johnson",
        comment: "Added competitive analysis",
      },
      {
        number: 1.0,
        date: "May 1, 2024",
        modifiedBy: "Emily Wong",
        comment: "Initial draft",
      },
    ],
  },
  {
    id: "4",
    name: "Client Proposal - Acme Corp.pdf",
    type: "pdf",
    lastModified: "May 9, 2024",
    modifiedBy: "David Chen",
    currentVersion: 2.0,
    starred: false,
    versions: [
      {
        number: 2.0,
        date: "May 9, 2024",
        modifiedBy: "David Chen",
        comment: "Updated pricing section",
      },
      {
        number: 1.0,
        date: "May 7, 2024",
        modifiedBy: "David Chen",
        comment: "Initial draft",
      },
    ],
  },
  {
    id: "5",
    name: "HR Policy Updates.doc",
    type: "doc",
    lastModified: "May 8, 2024",
    modifiedBy: "Emily Wong",
    currentVersion: 3.0,
    starred: false,
    versions: [
      {
        number: 3.0,
        date: "May 8, 2024",
        modifiedBy: "Emily Wong",
        comment: "Final version for board approval",
      },
      {
        number: 2.0,
        date: "May 6, 2024",
        modifiedBy: "Emily Wong",
        comment: "Updated remote work policy",
      },
      {
        number: 1.0,
        date: "May 4, 2024",
        modifiedBy: "Jennifer Lee",
        comment: "Initial draft",
      },
    ],
  },
];
