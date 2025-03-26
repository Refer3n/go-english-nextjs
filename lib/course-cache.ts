import { unstable_cache } from "next/cache"
import { fetchCourseContent, getCourseContentCacheKey as getUtilsCacheKey } from "./course-utils"
import type { CourseContent } from "@/types/course"

export const getCourseContentCacheKey = getUtilsCacheKey

export const getCachedCourseContent = unstable_cache(
  async (courseId: string, userId: string, accessToken: string): Promise<CourseContent> => {
    return fetchCourseContent(courseId, userId, accessToken)
  },
  ["cached-course-content"],
  {
    revalidate: 60,
    tags: ["course-content"],
  },
)


