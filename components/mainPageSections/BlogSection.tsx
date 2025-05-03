"use client"

import { Link } from "@/i18n/navigation"
import { ChevronRight } from "lucide-react"
import BlogList from "../blog/BlogList"
import { useTranslations } from "next-intl"

export default function BlogSection() {
  const t = useTranslations("HomePage.BlogSection")

  return (
    <section className="main-section bg-gray-300 py-6">
      <div className="flex flex-col mx-[10vw]">
        <h2 className="heading mb-4">{t("title")}</h2>
        <Link href="/blog" className="link-text flex items-center ml-auto mb-6">
          {t("viewMore")} <ChevronRight className="w-4 h-4" />
        </Link>
        <BlogList></BlogList>
      </div>
    </section>
  )
}
