"use server"

import { auth } from "@/auth"
import { fetchCourseContent } from "@/lib/course-utils"
import { LessonClient } from "./client"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { notFound } from "next/navigation"
import { LessonNavigation } from "@/components/lessons/lesson-navigation"
import type { Lesson } from "@/types/course"
import { getLocale } from "next-intl/server"

export async function generateStaticParams() {
  return ['en', 'uk'].map((locale) => ({
    locale
  }));
}

export default async function LessonPage({
  params,
}: {
  params: { courseId: string; moduleId: string; lessonId: string }
}) {
  const resolvedParams = await Promise.resolve(params)
  const { courseId, moduleId, lessonId } = resolvedParams

  const session = await auth()

  if (!session) {
    return <div>Unauthorized</div>
  }

  const userId = session.user.id
  const accessToken = session.user.accessToken

  const locale = await getLocale()

  let courseContent
  try {
    courseContent = await fetchCourseContent(courseId, userId, accessToken, locale)
  } catch (contentError) {
    throw contentError
  }

  const currentModuleIndex = courseContent.modules.findIndex((module) => module.id.toString() === moduleId)

  if (currentModuleIndex === -1) {
    return notFound()
  }

  const currentModule = courseContent.modules[currentModuleIndex]

  const currentLesson = currentModule.lessons.find((lesson) => lesson.id.toString() === lessonId)

  if (!currentLesson) {
    return notFound()
  }

  const currentLessonIndex = currentModule.lessons.findIndex((lesson) => lesson.id.toString() === lessonId)

  let prevLesson: Lesson | null = null
  let prevModuleId: string | number | null = null

  if (currentLessonIndex > 0) {
    prevLesson = currentModule.lessons[currentLessonIndex - 1]
    prevModuleId = currentModule.id
  } else if (currentModuleIndex > 0) {
    const prevModule = courseContent.modules[currentModuleIndex - 1]
    if (prevModule.lessons.length > 0) {
      prevLesson = prevModule.lessons[prevModule.lessons.length - 1]
      prevModuleId = prevModule.id
    }
  }

  let nextLesson: Lesson | null = null
  let nextModuleId: string | number | null = null

  if (currentLessonIndex < currentModule.lessons.length - 1) {
    nextLesson = currentModule.lessons[currentLessonIndex + 1]
    nextModuleId = currentModule.id
  } else if (currentModuleIndex < courseContent.modules.length - 1) {
    const nextModule = courseContent.modules[currentModuleIndex + 1]
    if (nextModule.lessons.length > 0) {
      nextLesson = nextModule.lessons[0]
      nextModuleId = nextModule.id
    }
  }

  const completedLessons = currentModule.lessons.filter((lesson) => lesson.isCompleted).length
  const moduleProgress = Math.round((completedLessons / currentModule.lessonsCount) * 100)

  const breadcrumbItems = [
    { label: "Profile", href: "/dashboard" },
    { label: "Courses", href: "/dashboard/courses" },
    {
      label: courseContent.title || "Course",
      href: `/dashboard/courses/${courseId}/about`,
    },
    {
      label: currentModule.name,
      href: `/dashboard/courses/${courseId}/modules/${moduleId}/lessons/${currentModule.lessons[0].id}`,
    },
    { label: currentLesson.title, isCurrentPage: true },
  ]

  return (
    <div className="px-[2vw] py-6">
      <div className="flex justify-between items-center mb-6">
        <BreadcrumbNav items={breadcrumbItems} />
        <LessonNavigation
          courseId={courseId}
          prevLesson={prevLesson}
          prevModuleId={prevModuleId}
          nextLesson={nextLesson}
          nextModuleId={nextModuleId}
        />
      </div>

      <LessonClient
        courseId={courseId}
        moduleId={moduleId}
        lessonId={lessonId}
        lesson={currentLesson}
        module={currentModule}
        moduleProgress={moduleProgress}
        prevLesson={prevLesson}
        prevModuleId={prevModuleId}
        nextLesson={nextLesson}
        nextModuleId={nextModuleId}
        courseContent={courseContent}
      />
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: { courseId: string; moduleId: string; lessonId: string }
}) {
  const session = await auth()

  if (!session) {
    return {
      title: "Unauthorized",
      description: "You must be signed in to view this content.",
    }
  }

  const resolvedParams = await Promise.resolve(params)
  const { courseId, moduleId, lessonId } = resolvedParams
  
  const userId = session.user.id
  const accessToken = session.user.accessToken

  const locale = await getLocale()

  try {
    const courseContent = await fetchCourseContent(courseId, userId, accessToken, locale)
    const module = courseContent.modules.find(
      (m) => m.id.toString() === moduleId
    )
    const lesson = module?.lessons.find(
      (l) => l.id.toString() === lessonId
    )

    if (!lesson) {
      return {
        title: "Lesson Not Found",
        description: "We couldn't find the requested lesson.",
      }
    }

    return {
      title: `${lesson.title} | ${courseContent.title}`,
      description: lesson.description ?? "Lesson in your course module",
    }
  } catch (error) {
    console.error("Metadata generation error:", error)
    return {
      title: "Lesson",
      description: "An error occurred while loading the lesson.",
    }
  }
}

