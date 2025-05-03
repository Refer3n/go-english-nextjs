"use client"

import { Link } from "@/i18n/navigation"
import FeedbackList from "../feedbacks/FeedbackList"
import { useTranslations } from "next-intl"

export default function FeedBackSection() {
  const t = useTranslations("HomePage.FeedbackSection")

  return (
    <section className="main-section !h-auto">
      <div className="flex flex-col mx-[10vw]">
        <h2 className="heading mb-10">{t("title")}</h2>
        <FeedbackList></FeedbackList>
        <div className="flex flex-col items-center mt-20 gap-6">
          <p className="text-3xl text-primary font-semibold">
            {t.rich("tagline", {
              link: (chunks) => (
                <Link className="link-text" href="/get-started">
                  {chunks}
                </Link>
              ),
            })}
          </p>
          <Link className="button" href="/courses">
            {t("ctaButton")}
          </Link>
        </div>
      </div>
    </section>
  )
}
