import { CourseAboutClient } from "./client"
import { fetchCourseContent, fetchCourseDetails } from "@/lib/course-utils"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { auth } from "@/auth"

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
      href: `/dashboard/courses/${courseId}?status=${status}`,
    },
    { label: "About course", isCurrentPage: true },
  ]

  try {
    const [courseContent, courseDetails] = await Promise.all([
      fetchCourseContent(courseId, userId, accessToken),
      fetchCourseDetails(courseId, accessToken),
    ])

    return (
      <div className="px-[2vw] py-6">
        <CourseAboutClient
          courseContent={courseContent}
          courseDetails={courseDetails}
          courseId={courseId}
          status={status}
          breadcrumbItems={breadcrumbItems}
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

