"use server"

import { Suspense } from "react"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { fetchCourseDetails } from "@/lib/course-utils"
import { CourseDetailsClient } from "./client"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { Skeleton } from "@/components/ui/skeleton"
import { getLocale } from "next-intl/server"

export async function generateStaticParams() {
  return ['en', 'uk'].map((locale) => ({
    locale
  }));
}

export default async function CourseDetailsPage({
  params,
}: {
  params: { courseId: string }
}) {
  const session = await auth()

  if (!session) {
    return <div></div>
  }

  const { courseId } = await params
  const accessToken = session.user.accessToken

  const locale = await getLocale();

  try {
    const courseDetails = await fetchCourseDetails(courseId, accessToken, locale)

    if (!courseDetails) {
      return notFound()
    }

    const breadcrumbItems = [
      { label: "Courses", href: "/dashbord/courses" },
      { label: "Shop", href: "/dashboard/shop" },
      { label: courseDetails.title, isCurrentPage: true },
    ]

    return (
      <div className="px-[2vw] py-6">
        <BreadcrumbNav items={breadcrumbItems} />
        <Suspense fallback={<CourseDetailsSkeleton />}>
          <CourseDetailsClient courseDetails={courseDetails} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error("Error fetching course details:", error)
    return <div>Failed to load course details</div>
  }
}

function CourseDetailsSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Skeleton className="h-80 w-full mb-6" />
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-6" />

        <div className="space-y-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>

        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>

      <div>
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  )
}
