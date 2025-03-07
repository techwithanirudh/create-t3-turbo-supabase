import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@acme/ui/accordion";

import MotionWrap from "../../motion-wrap";

export default function FAQ() {
  return (
    <MotionWrap className="w-full py-24 lg:py-32" id="faq">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-foreground/10">
              FAQ
            </div>
            <h2 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-gray-50 md:text-4xl/tight">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Common questions about our enterprise platform
            </p>
          </div>
        </div>
        <div className="mx-auto grid py-12 lg:grid-cols-2 lg:gap-12">
          <Accordion collapsible type="single">
            <AccordionItem value="question1">
              <AccordionTrigger className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                What features are included in the platform?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our platform includes comprehensive CRM tools, secure file storage and sharing,
                  team messaging and collaboration, advanced document/PDF management with version control,
                  and an AI-powered chatbot to streamline internal processes.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="question2">
              <AccordionTrigger className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                How is data security handled?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We implement enterprise-grade security with end-to-end encryption, role-based access controls,
                  regular security audits, and compliance with industry standards including GDPR, HIPAA, and SOC 2.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="question3">
              <AccordionTrigger className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                Can the platform be customized for our company needs?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Yes, our platform is highly customizable. We offer white-labeling options, custom workflows,
                  API integrations with your existing tools, and dedicated support for enterprise-specific requirements.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion collapsible type="single">
            <AccordionItem value="question4">
              <AccordionTrigger className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                How does the document management system work?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our document management system provides version history tracking, automated OCR for searchable PDFs,
                  collaborative editing, approval workflows, and secure sharing with fine-grained permissions.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="question5">
              <AccordionTrigger className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                What kind of support is provided?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enterprise clients receive 24/7 priority support, a dedicated account manager,
                  regular training sessions, implementation assistance, and access to our knowledge base
                  with best practices and configuration guides.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="question6">
              <AccordionTrigger className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                Is the platform accessible on mobile devices?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Yes, our platform is fully responsive and works across all devices. We also offer dedicated
                  mobile apps for iOS and Android with offline capabilities and secure push notifications.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </MotionWrap>
  );
}
