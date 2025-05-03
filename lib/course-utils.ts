"use server";

import { unstable_cache } from "next/cache";
import type { CourseContent, CourseDetails } from "@/types/course";
import api from "./api";

/**
 * @param userId
 * @param accessToken
 * @param langCode
 */
export async function fetchUserCourses(userId: string, accessToken: string, langCode: string) {
  const cached = unstable_cache(
    async () => {
      try {
        const response = await api.get("/Course/GetUserCourses", {
          params: { userId },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Language": langCode,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.error("Invalid data format:", response.data);
          throw new Error("Invalid data format received from the server");
        }
      } catch (error) {
        console.error("Error fetching user courses:", error);
        throw error;
      }
    },
    [`user-courses`, userId, langCode],
    {
      revalidate: 3600,
      tags: [`user-courses-${userId}-${langCode}`],
    }
  );

  return cached();
}

/**
 * @param courseId
 * @param userId
 * @param accessToken
 * @param langCode
 */
export async function fetchCourseContent(
  courseId: string | number,
  userId: string,
  accessToken: string,
  langCode: string
): Promise<CourseContent> {
  const cached = unstable_cache(
    async (): Promise<CourseContent> => {
      try {
        const response = await api.get("/Course/GetCourseContent", {
          params: { courseId, userId },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Language": langCode,
          },
        });

        if (response.data) {
          return response.data;
        } else {
          console.error("Invalid data format:", response.data);
          throw new Error("Invalid data format received from the server");
        }
      } catch (error) {
        console.error("Error fetching course content:", error);
        throw error;
      }
    },
    [`course-content`, String(userId), String(courseId), langCode],
    {
      revalidate: 60,
      tags: [
        `course-content-${userId}-${courseId}-${langCode}`,
        `course-${courseId}-${langCode}`,
      ],
    }
  );

  return cached();
}

/**
 * @param courseId
 * @param accessToken
 * @param langCode
 */
export async function fetchCourseDetails(
  courseId: string | number,
  accessToken: string,
  langCode: string
): Promise<CourseDetails> {
  const cached = unstable_cache(
    async (): Promise<CourseDetails> => {
      const response = await api.get(`/Course/GetCourseInfo/${courseId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Language": langCode,
        },
      });

      if (response.data) {
        return response.data;
      } else {
        throw new Error("Invalid data format received from the server");
      }
    },
    [`course-details-${courseId}-${langCode}`],
    {
      revalidate: 86400,
      tags: [`course-details-${courseId}-${langCode}`, `course-${courseId}-${langCode}`],
    }
  );

  return cached();
}

/**
 * @param number
 * @param orderBy
 * @param direction
 * @param langCode
 */
export async function fetchAllCourses(
  number: number,
  orderBy: string,
  direction = "desc",
  langCode: string
): Promise<CourseDetails[]> {
  const cached = unstable_cache(
    async (): Promise<CourseDetails[]> => {
      try {
        const response = await api.get<CourseDetails[]>("/Course/GetCoursesinfo", {
          params: { orderBy, direction, number },
          headers: {
            "Content-Language": langCode,
          },
        });

        if (!Array.isArray(response.data)) {
          console.error("Invalid data format:", response.data);
          throw new Error("Invalid data format received from the server");
        }

        return response.data;
      } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
      }
    },
    [`all-courses-${langCode}`],
    {
      revalidate: 86400,
      tags: [`all-courses-${langCode}`],
    }
  );

  return cached();
}
