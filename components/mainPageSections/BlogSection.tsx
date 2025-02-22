"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import BlogList from "../blog/BlogList";

export default function BlogSection() {
  return (
    <section className="main-section bg-gray-300 py-6 !mb-0">
      <div className="flex flex-col mx-[10vw]">
        <h2 className="heading mb-4">Latest from The Blog</h2>
        <Link href="/blog" className="link-text flex items-center ml-auto mb-6">
          View more <ChevronRight className="w-4 h-4" />
        </Link>
        <BlogList></BlogList>
      </div>
    </section>
  );
}
