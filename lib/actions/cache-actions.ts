"use server"

import { revalidateTag } from "next/cache";

/**
 * @param courseId
 * @param userId
 * @returns
 */
export async function revalidateUserCourseCache(courseId: string, userId: string) {
  const langCodes = ['en', 'uk'];

  for (const lang of langCodes) {
    revalidateTag(`course-content-${userId}-${courseId}-${lang}`);
    revalidateTag(`user-courses-${userId}-${lang}`);
  }

  return { success: true };
}

