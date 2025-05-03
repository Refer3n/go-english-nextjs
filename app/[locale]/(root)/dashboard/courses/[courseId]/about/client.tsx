"use client"

import { useRouter } from "@/i18n/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, BookOpen, ChevronRight } from "lucide-react"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import type { CourseContent, CourseDetails } from "@/types/course"
import StarRating from "@/components/StarsRating"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

interface CourseAboutClientProps {
  courseContent: CourseContent
  courseDetails: CourseDetails
  courseId: string
  status: string
  breadcrumbItems: Array<{
    label: string
    href?: string
    isCurrentPage?: boolean
  }>
  nextLessonPath: string
}

export function CourseAboutClient({
  courseContent,
  courseDetails,
  breadcrumbItems,
  nextLessonPath,
}: CourseAboutClientProps) {
  const t = useTranslations("CourseAbout")
  const router = useRouter()

  const handleContinueLearning = () => {
    if (nextLessonPath) {
      router.push(nextLessonPath)
    }
  }

  const buttonText =
    courseContent?.progress === 100
      ? t("restartCourse")
      : courseContent?.progress === 0
        ? t("startLearning")
        : t("continueLearning")

  const totalHours = Math.round(courseDetails.estimatedTimeInMinutes / 60)

  const totalLessons = courseContent.modules.reduce((sum, module) => sum + module.lessonsCount, 0)
  const completedLessons = courseContent.modules.reduce((sum, module) => sum + module.completedLessonsCount, 0)

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <BreadcrumbNav items={breadcrumbItems} />
        <Button className="button hover:bg-yellow/90" onClick={handleContinueLearning}>
          {buttonText}
        </Button>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-[65%]">
            <div className="relative w-full h-full 2xl:h-[650px] overflow-hidden">
              <Image
                src={courseDetails.imageUrl || "/images/default.jpg"}
                alt={courseDetails.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:w-[35%] p-8 space-y-10 pt-[4%]">
            <h1 className="text-2xl font-semibold">{t("aboutCourse")}</h1>

            <h2 className="text-3xl font-bold">{courseDetails.title}</h2>

            <p className="font-medium ">{courseDetails.description}</p>

            <div className="space-y-8">
              <div>
                <h3 className="text-base text-light-300 font-semibold mb-1">{t("completion")}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{courseContent.progress}%</span>
                  <span className="text-sm text-light-300">
                    {completedLessons}/{totalLessons}
                  </span>
                </div>
                <Progress value={courseContent.progress} className="flex-1 h-1 bg-light-100" />
              </div>

              <div className="flex items-center gap-4">
                <Clock className="h-6 w-6 text-light-300" />
                <span className="font-semibold">{t("hoursStudy", { hours: totalHours })}</span>
              </div>

              <div className="flex items-center gap-4">
                <BookOpen className="h-6 w-6 text-light-300" />
                <div className="flex items-center">
                  <span className="text-blue-600 font-medium">
                    {t("modules", { count: courseContent.modulesCount })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <StarRating rating={courseDetails.rating} />
                <span className="ml-2 text-gray-700">{t("rating", { rating: courseDetails.rating })}</span>
              </div>

              <div>
                <Link href="#" className="link-text flex items-center font-normal leading-6">
                  {t("fullCourseDescription")} <ChevronRight className="w-6 h-6 ml-2" strokeWidth={1.3} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
