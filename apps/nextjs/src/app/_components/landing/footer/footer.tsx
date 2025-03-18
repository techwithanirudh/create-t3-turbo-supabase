import Link from "next/link";
import React from "react";
import { BuildingIcon, Mail, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full bg-gray-100 dark:bg-foreground/10">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BuildingIcon className="h-6 w-6" />
              <span className="font-semibold">Enterprise Suite</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Streamlining business operations with integrated enterprise
              solutions.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-400"
                  href="#features"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-400"
                  href="#pricing"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-400"
                  href="/docs"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-400"
                  href="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-400"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-400"
                  href="/careers"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-400"
                  href="/legal/terms"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-400"
                  href="/legal/privacy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-400"
                  href="/legal/cookies"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-200 pt-8 dark:border-gray-800 md:flex-row">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            © 2024 Enterprise Suite. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <a
              href="mailto:contact@enterprise-suite.com"
              className="text-gray-600 dark:text-gray-400"
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </a>
            <a
              href="tel:+1-555-123-4567"
              className="text-gray-600 dark:text-gray-400"
            >
              <Phone className="h-4 w-4" />
              <span className="sr-only">Phone</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
