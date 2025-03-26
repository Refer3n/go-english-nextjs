import { auth } from "@/auth"
import { fetchCourseContent, findNextLesson } from "@/lib/course-utils"
import { LessonClient } from "./client"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { notFound } from "next/navigation"
import { LessonNavigation } from "@/components/lessons/lesson-navigation"
import { unstable_cache } from "next/cache"
import type { Lesson } from "@/types/course"

const getCachedCourseContent = unstable_cache(
  async (courseId: string, userId: string, accessToken: string) => {
    return fetchCourseContent(courseId, userId, accessToken)
  },
  ["course-content"],
  { revalidate: 60 },
)

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

  let courseContent
  try {
    courseContent = await getCachedCourseContent(courseId, userId, accessToken)
  } catch (cacheError) {
    courseContent = await fetchCourseContent(courseId, userId, accessToken)
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
  const resolvedParams = await Promise.resolve(params)
  const { courseId, moduleId, lessonId } = resolvedParams

  const session = await auth()

  if (!session) {
    return {
      title: "Unauthorized",
    }
  }

  const userId = session.user.id
  const accessToken = session.user.accessToken

  try {
    const courseContent = await getCachedCourseContent(courseId, userId, accessToken)
    const module = courseContent.modules.find((m) => m.id.toString() === moduleId)
    const lesson = module?.lessons.find((l) => l.id.toString() === lessonId)

    if (!lesson) {
      return {
        title: "Lesson Not Found",
      }
    }

    return {
      title: `${lesson.title} | ${courseContent.title}`,
      description: lesson.description,
    }
  } catch (error) {
    return {
      title: "Lesson",
    }
  }
}

