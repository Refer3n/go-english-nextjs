"use client"

import CourseList from "../courses/CourseList"
import { useTranslations } from "next-intl"

export default function CourseSection() {
  const t = useTranslations("HomePage.CourseSection")

  return (
    <section className="main-section-colored h-auto pb-10 mb-14">
      <div className="flex flex-col mx-[10vw]">
        <h2 className="heading mb-10">{t("title")}</h2>
        <CourseList itemsPerPage={4} />
      </div>
    </section>
  )
}
