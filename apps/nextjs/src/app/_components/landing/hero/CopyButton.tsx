"use client";

import { useState } from "react";

export default function CopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/pedromshin/create-turbo-stack/main/scripts/setup-project.sh)"',
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 text-sm text-gray-400 hover:text-gray-300"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
