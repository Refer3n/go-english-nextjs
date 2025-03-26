import { CourseAboutClient } from "./client"
import { fetchCourseContent, fetchCourseDetails } from "@/lib/course-utils"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { auth } from "@/auth"
import { getCachedCourseContent } from "@/lib/course-cache"

export default async function CourseAboutPage({
  params,
  searchParams,
}: {
  params: { courseId: string }
  searchParams: { status?: string }
}) {
  const resolvedParams = await Promise.resolve(params)
  const { courseId } = resolvedParams

  const session = await auth();

  if(!session) {
    return <div>Unauthorized</div>
  }

  const userId = session.user.id
  const status = searchParams.status || "in-progress"
  const accessToken = session.user.accessToken

  const breadcrumbItems = [
    { label: "Profile", href: "/dashboard" },
    { label: "Courses", href: "/dashboard/courses" },
    {
      label: status === "completed" ? "Completed" : "In progress",
      href: `/dashboard/courses?tab=${status}`,
    },
    {
      label: "Course",
      href: `/dashboard/courses?tab=${status}`,
    },
    { label: "About course", isCurrentPage: true },
  ]

  try {
    let courseContent
    let courseDetails

    try {
      courseContent = await getCachedCourseContent(courseId, userId, accessToken)
    } catch (cacheError) {
      courseContent = await fetchCourseContent(courseId, userId, accessToken)
    }

    try {
      courseDetails = await fetchCourseDetails(courseId, accessToken)
    } catch (detailsError) {
      throw detailsError 
    }

    let nextLessonPath = ""

    const firstIncompleteModule = courseContent.modules.find((module) => !module.isCompleted)

    if (firstIncompleteModule) {
      const firstIncompleteLesson = firstIncompleteModule.lessons.find((lesson) => !lesson.isCompleted)

      if (firstIncompleteLesson) {
        nextLessonPath = `/dashboard/courses/${courseId}/modules/${firstIncompleteModule.id}/lessons/${firstIncompleteLesson.id}`
      } else {
        nextLessonPath = `/dashboard/courses/${courseId}/modules/${firstIncompleteModule.id}/lessons/${firstIncompleteModule.lessons[0].id}`
      }
    } else if (courseContent.modules.length) {
      const firstModule = courseContent.modules[0]
      nextLessonPath = `/dashboard/courses/${courseId}/modules/${firstModule.id}/lessons/${firstModule.lessons[0].id}`
    }

    return (
      <div className="px-[2vw] py-6">
        <CourseAboutClient
          courseContent={courseContent}
          courseDetails={courseDetails}
          courseId={courseId}
          status={status}
          breadcrumbItems={breadcrumbItems}
          nextLessonPath={nextLessonPath}
        />
      </div>
    )
  } catch (error) {
    console.error("Error fetching course data:", error)
    return (
      <div className="px-[2vw] py-6">
        <div className="flex justify-between items-center mb-8">
          <BreadcrumbNav items={breadcrumbItems} />
        </div>
        <div className="bg-white rounded-lg p-8 text-center text-red-500">Failed to load course data</div>
      </div>
    )
  }
}

