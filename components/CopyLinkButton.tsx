"use client";

import { useState } from "react";

export function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(window.location.origin + path);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="rounded-md bg-bl-green px-4 py-2 text-sm font-medium text-white hover:bg-bl-green-dark print:hidden"
    >
      {copied ? "Link copied!" : "Copy Link for College Coaches"}
    </button>
  );
}
