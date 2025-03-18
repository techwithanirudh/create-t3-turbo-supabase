import React from "react";
import {
  Bot,
  FilePlus,
  MoreVertical,
  Plus,
  PlusCircle,
  SendHorizontal,
  Settings,
} from "lucide-react";

import { Button } from "@acme/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { Input } from "@acme/ui/input";
import { ScrollArea } from "@acme/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui/tooltip";

export default function ChatbotPage() {
  return (
    <div className="flex h-[calc(100vh-54px)] flex-col p-0">
      <div className="grid h-full grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  New Chat
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="p-4">
            <Button className="w-full justify-start" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-110px)]">
            <div className="px-4 py-2">
              <h3 className="mb-2 text-sm font-medium">Recent Chats</h3>
              <div className="space-y-2">
                {recentChats.map((chat) => (
                  <Button
                    key={chat.id}
                    variant={chat.id === "1" ? "secondary" : "ghost"}
                    className="w-full justify-start font-normal"
                  >
                    <Bot className="mr-2 h-4 w-4" />
                    {chat.title}
                  </Button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </aside>

        <div className="flex flex-col">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <h3 className="flex items-center font-semibold">
              <Bot className="mr-2 h-5 w-5" />
              Enterprise Assistant
            </h3>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <FilePlus className="h-4 w-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach file</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Assistant settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] gap-3 rounded-lg p-4 ${
                      message.sender === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {/* {message.sender === "assistant" && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src="/bot-avatar.png" alt="AI Assistant" />
                                                <AvatarFallback>
                                                    <Bot className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )} */}
                    <div className="space-y-2">
                      <p>{message.content}</p>
                      {message.actions && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {message.actions.map((action, i) => (
                            <Button
                              key={i}
                              size="sm"
                              variant={
                                message.sender === "user"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {action}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <form className="flex items-center gap-2">
              <Input
                placeholder="Ask the AI assistant anything..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <SendHorizontal className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              The assistant may generate inaccurate information. Check important
              facts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const recentChats = [
  {
    id: "1",
    title: "Marketing Campaign Ideas",
  },
  {
    id: "2",
    title: "Q2 Sales Analysis",
  },
  {
    id: "3",
    title: "Product Roadmap Help",
  },
  {
    id: "4",
    title: "Competitor Research",
  },
  {
    id: "5",
    title: "Customer Persona Development",
  },
];

const chatMessages = [
  {
    id: "1",
    sender: "assistant",
    content:
      "Hello! I'm your enterprise AI assistant. How can I help you today?",
    actions: ["Generate report", "Answer questions", "Draft email"],
  },
  {
    id: "2",
    sender: "user",
    content:
      "I need help brainstorming marketing campaign ideas for our new product launch.",
  },
  {
    id: "3",
    sender: "assistant",
    content:
      "I'd be happy to help brainstorm marketing campaign ideas for your new product launch. Could you share some details about the product, your target audience, and any specific marketing goals or constraints?",
    actions: null,
  },
  {
    id: "4",
    sender: "user",
    content:
      "It's a new SaaS platform for small businesses to manage their finances. Target audience is small business owners and finance managers. Our goal is to get 500 sign-ups in the first month.",
  },
  {
    id: "5",
    sender: "assistant",
    content:
      "Great! Here are some marketing campaign ideas for your SaaS financial platform launch:\n\n1. **Free Trial Campaign**: Offer a 30-day free trial with full access to all features. Highlight how much time/money they can save.\n\n2. **Early Bird Discount**: Special pricing for the first 100 sign-ups.\n\n3. **Testimonial Campaign**: Partner with a few small businesses before launch to get case studies and testimonials.\n\n4. **Problem-Solution Content**: Create short videos showing common financial pain points and how your platform solves them.\n\n5. **Webinar Series**: Host weekly webinars on small business financial management, with a demo of your platform.\n\nWould you like me to elaborate on any of these ideas?",
    actions: ["Elaborate on webinars", "Content strategy", "Social media plan"],
  },
];
