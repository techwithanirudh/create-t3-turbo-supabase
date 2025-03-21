import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@acme/ui/accordion";

const faqs = [
  {
    question: "What does this command do?",
    answer:
      "The command sets up a complete full-stack monorepo with Next.js, React Native, and Supabase. It includes database setup, authentication, and deployment configurations.",
  },
  {
    question: "What are the prerequisites?",
    answer:
      "You need Node.js 18+, pnpm, and Docker installed. For iOS development, you'll need Xcode, and for Android, Android Studio.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Initial setup takes about 5-10 minutes, depending on your internet connection. This includes creating the project, installing dependencies, and setting up the database.",
  },
  {
    question: "Can I customize the stack?",
    answer:
      "Yes! The setup script is interactive and allows you to choose which features to include. You can also modify the stack after installation.",
  },
  {
    question: "How do I deploy my application?",
    answer:
      "The project comes with built-in deployment configurations for Vercel (web) and Expo (mobile). Just connect your repositories and deploy.",
  },
  {
    question: "What about the database?",
    answer:
      "Supabase is used for the database, with Drizzle ORM for type-safe database operations. The setup includes local development with Docker and production deployment configs.",
  },
];

export default function FAQ() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="faq">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-[800px]">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-gray-900 dark:text-gray-50">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
