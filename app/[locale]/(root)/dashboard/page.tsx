"use client"

import StudyAnalytics from "@/components/dashboard/statistics/study-analytics"
import LearningStats from "@/components/dashboard/statistics/learning-stats"
import UserCourses from "@/components/courses/user-courses"
import WeeklyGoals from "@/components/dashboard/goals/weekly-goals"
import UserTests from "@/components/dashboard/tests/user-tests"
import { useTranslations } from "next-intl"

export default function Dashboard() {
  const t = useTranslations("Dashboard")

  return (
    <section className="w-full h-full px-[2vw] py-8 bg-light-400">
      <div className="flex flex-col gap-6">
        <h2 className="text-4xl font-bold mb-4">{t("title")}</h2>
        <h3 className="text-2xl font-bold">{t("learningStatistics")}</h3>

        <LearningStats />

        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-bold">{t("learningActivity")}</h3>
            <StudyAnalytics />
            <h3 className="text-2xl font-bold mt-4">{t("tracker")}</h3>
            <UserTests />
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-bold">{t("myCourses")}</h3>
            <UserCourses />
            <h3 className="text-2xl font-bold mt-4">{t("weeklyGoalTracker")}</h3>
            <WeeklyGoals />
          </div>
        </div>
      </div>
    </section>
  )
}
