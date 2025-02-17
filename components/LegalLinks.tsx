"use client";

import Link from "next/link";

export default function LegalLinks() {
  return (
    <div className="flex flex-row gap-2 justify-center">
      <Link href="/terms" className="text-blue-100 text-center text-xs">
        Terms & Conditions
      </Link>
      <Link href="/privacy" className="text-blue-100 text-center text-xs">
        Privacy Policy
      </Link>
    </div>
  );
}
