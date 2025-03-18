import React from "react";
import {
    AtSign,
    Camera,
    Paperclip,
    Phone,
    PlusCircle,
    Search,
    Send,
    Settings,
    Smile,
    Video,
} from "lucide-react";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@acme/ui/tabs";
import { ScrollArea } from "@acme/ui/scroll-area";

export default function MessagingPage() {
    return (
        <div className="flex h-[calc(100vh-54px)] flex-col p-0">
            <div className="flex flex-1 overflow-hidden">
                <aside className="flex w-80 flex-col border-r">
                    <div className="flex h-14 items-center justify-between border-b px-4">
                        <h2 className="text-lg font-semibold">Messages</h2>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Settings</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                                <PlusCircle className="h-4 w-4" />
                                <span className="sr-only">New message</span>
                            </Button>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search messages..."
                                className="pl-8"
                            />
                        </div>
                    </div>

                    <Tabs defaultValue="all" className="mb-2 px-4">
                        <TabsList className="w-full">
                            <TabsTrigger value="all" className="flex-1">
                                All
                            </TabsTrigger>
                            <TabsTrigger value="unread" className="flex-1">
                                Unread
                            </TabsTrigger>
                            <TabsTrigger value="groups" className="flex-1">
                                Groups
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <ScrollArea className="flex-1">
                        <div className="px-2">
                            {conversationsMock.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    className={`flex cursor-pointer items-center gap-3 rounded-md p-3 ${conversation.id === "1"
                                        ? "bg-muted"
                                        : "hover:bg-muted/50"
                                        }`}
                                >
                                    <Avatar>
                                        <AvatarImage src={conversation.avatar} />
                                        <AvatarFallback>
                                            {conversation.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{conversation.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {conversation.time}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="line-clamp-1 text-sm text-muted-foreground">
                                                {conversation.lastMessage}
                                            </p>
                                            {conversation.unread > 0 && (
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                                    {conversation.unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </aside>

                <div className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex h-14 items-center justify-between border-b px-6">
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src="/placeholder-avatar.jpg" />
                                <AvatarFallback>MK</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-medium">Marketing Team</h3>
                                <p className="text-xs text-muted-foreground">
                                    5 members • 2 online
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Phone className="h-4 w-4" />
                                <span className="sr-only">Call</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Video className="h-4 w-4" />
                                <span className="sr-only">Video call</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                                <AtSign className="h-4 w-4" />
                                <span className="sr-only">Mention</span>
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messagesMock.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.sender === "me" ? "justify-end" : ""
                                        }`}
                                >
                                    {message.sender !== "me" && (
                                        <Avatar>
                                            <AvatarImage src={message.avatar} />
                                            <AvatarFallback>
                                                {message.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div
                                        className={`space-y-1 ${message.sender === "me" ? "items-end" : ""
                                            }`}
                                    >
                                        <div className="flex gap-2">
                                            {message.sender !== "me" && (
                                                <span className="font-medium">{message.name}</span>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {message.time}
                                            </span>
                                        </div>
                                        <div
                                            className={`max-w-md rounded-lg px-4 py-2 ${message.sender === "me"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                                }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="border-t p-4">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Paperclip className="h-4 w-4" />
                                <span className="sr-only">Attach</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Camera className="h-4 w-4" />
                                <span className="sr-only">Camera</span>
                            </Button>
                            <Input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1"
                            />
                            <Button variant="ghost" size="icon">
                                <Smile className="h-4 w-4" />
                                <span className="sr-only">Emoji</span>
                            </Button>
                            <Button size="icon">
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const conversationsMock = [
    {
        id: "1",
        name: "Marketing Team",
        avatar: "/placeholder-avatar.jpg",
        lastMessage: "Sarah: We need to finalize the campaign assets by tomorrow.",
        time: "10:42 AM",
        unread: 3,
    },
    {
        id: "2",
        name: "John Doe",
        avatar: "/placeholder-avatar.jpg",
        lastMessage: "Can you review the proposal I sent over?",
        time: "Yesterday",
        unread: 0,
    },
    {
        id: "3",
        name: "Product Development",
        avatar: "/placeholder-avatar.jpg",
        lastMessage: "Mike: The new feature is ready for testing.",
        time: "Yesterday",
        unread: 0,
    },
    {
        id: "4",
        name: "Jane Smith",
        avatar: "/placeholder-avatar.jpg",
        lastMessage: "Looking forward to our meeting tomorrow!",
        time: "Monday",
        unread: 0,
    },
    {
        id: "5",
        name: "Sales Team",
        avatar: "/placeholder-avatar.jpg",
        lastMessage: "Tom: We closed the deal with Acme Corp!",
        time: "Monday",
        unread: 0,
    },
    {
        id: "6",
        name: "HR Department",
        avatar: "/placeholder-avatar.jpg",
        lastMessage: "Please complete your quarterly review by Friday.",
        time: "05/10/2024",
        unread: 1,
    },
    {
        id: "7",
        name: "Tech Support",
        avatar: "/placeholder-avatar.jpg",
        lastMessage: "Your ticket #45678 has been resolved.",
        time: "05/08/2024",
        unread: 0,
    },
];

const messagesMock = [
    {
        id: "1",
        sender: "other",
        name: "Sarah Johnson",
        avatar: "/placeholder-avatar.jpg",
        content: "Hi team! We need to finalize the campaign assets by tomorrow. Can everyone share their progress?",
        time: "10:30 AM",
    },
    {
        id: "2",
        sender: "other",
        name: "Mike Chen",
        avatar: "/placeholder-avatar.jpg",
        content: "I've completed the social media graphics. Will upload them to the shared folder in an hour.",
        time: "10:32 AM",
    },
    {
        id: "3",
        sender: "me",
        name: "You",
        avatar: "",
        content: "The email templates are ready. I'm just making some final tweaks to the copy.",
        time: "10:35 AM",
    },
    {
        id: "4",
        sender: "other",
        name: "Emily Wong",
        avatar: "/placeholder-avatar.jpg",
        content: "I'm still working on the landing page design. Should be done by EOD.",
        time: "10:38 AM",
    },
    {
        id: "5",
        sender: "other",
        name: "Sarah Johnson",
        avatar: "/placeholder-avatar.jpg",
        content: "Great progress everyone! Let's have a quick sync at 4 PM today to review everything.",
        time: "10:40 AM",
    },
    {
        id: "6",
        sender: "me",
        name: "You",
        avatar: "",
        content: "Sounds good! I'll be available.",
        time: "10:42 AM",
    },
]; 