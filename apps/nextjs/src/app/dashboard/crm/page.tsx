import React from "react";
import { MoreHorizontal, Plus, Search, UserPlus } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

export default function CRMPage() {
  return (
    <div className="flex flex-col space-y-6 p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Customer Relationship Management
          </h1>
          <p className="text-muted-foreground">
            Manage your customer contacts, leads, and deals
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            New Contact
          </Button>
          <Button size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            New Deal
          </Button>
        </div>
      </div>

      <Tabs defaultValue="contacts">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
          </TabsList>
          <div className="relative w-full max-w-sm sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8" />
          </div>
        </div>

        <TabsContent value="contacts" className="mt-6">
          <Card>
            <CardHeader className="p-4">
              <CardTitle>All Contacts</CardTitle>
              <CardDescription>
                A list of all your customer contacts.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        {contact.name}
                      </TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            contact.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
                          }`}
                        >
                          {contact.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4">
              <div className="text-sm text-muted-foreground">
                Showing 5 of 100 contacts
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="companies" className="mt-6">
          <Card>
            <CardHeader className="p-4">
              <CardTitle>All Companies</CardTitle>
              <CardDescription>
                A list of all your customer companies.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
                <p className="text-muted-foreground">
                  Companies tab content will go here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals" className="mt-6">
          <Card>
            <CardHeader className="p-4">
              <CardTitle>All Deals</CardTitle>
              <CardDescription>
                A list of all your deals and opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
                <p className="text-muted-foreground">
                  Deals tab content will go here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const mockContacts = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    company: "Acme Inc.",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "(555) 987-6543",
    company: "Globex Corp",
    status: "Active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "(555) 456-7890",
    company: "Initech",
    status: "Lead",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "(555) 765-4321",
    company: "Umbrella Corp",
    status: "Active",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "(555) 321-6547",
    company: "Stark Industries",
    status: "Lead",
  },
];
