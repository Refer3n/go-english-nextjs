"use server"

import { revalidateTag } from "next/cache"
import { getCourseContentCacheKey } from "../course-utils"

export async function invalidateCourseCache(courseId: string, userId: string) {
  revalidateTag(`course-${courseId}`)
  revalidateTag("course-content")
  revalidateTag("course-details")
  revalidateTag("cached-course-content")

  revalidateTag(getCourseContentCacheKey(courseId, userId))

  return { success: true }
}

export async function invalidateAllCourseCaches() {
  revalidateTag("course-content")
  revalidateTag("course-details")
  revalidateTag("cached-course-content")

  return { success: true }
}

