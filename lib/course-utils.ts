import { unstable_cache } from "next/cache";
import type { CourseContent, CourseDetails } from "@/types/course";
import api from "./api";

/**
 * @param userId
 * @param accessToken
 * @returns
 */
export async function fetchUserCourses(userId: string, accessToken: string) {
  try {
    const response = await api.get("/Course/GetUserCourses", {
      params: { userId },
      headers: { Authorization: `Bearer ${accessToken}` },
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
}

/**
 * @param courseId
 * @param userId
 */
export const getCourseContentCacheKey = (
  courseId: string | number,
  userId?: string
) =>
  userId
    ? `course-content-${courseId}-${userId}`
    : `course-content-${courseId}`;

/**
 * @param courseId
 */
export const getCourseDetailsCacheKey = (courseId: string | number) =>
  `course-details-${courseId}`;

/**
 * @param courseId
 * @param userId
 * @param accessToken
 * @returns
 */
export const fetchCourseContent = unstable_cache(
  async (
    courseId: string | number,
    userId: string,
    accessToken: string
  ): Promise<CourseContent> => {
    try {
      const response = await api.get("/Course/GetCourseContent", {
        params: { courseId, userId },
        headers: { Authorization: `Bearer ${accessToken}` },
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
  ["course-content"],
  {
    revalidate: 60,
    tags: ["course-content"],
  }
);

export const fetchCourseDetails = unstable_cache(
  async (
    courseId: string | number,
    accessToken: string
  ): Promise<CourseDetails> => {
    try {
      const response = await api.get(`/Course/GetCourseInfo/${courseId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data) {
        return response.data;
      } else {
        console.error("Invalid data format:", response.data);
        throw new Error("Invalid data format received from the server");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      throw error;
    }
  },
  ["course-details"],
  {
    revalidate: 300,
    tags: ["course-details"],
  }
);
export const fetchAllCourses = (
  number: number,
  orderBy: string,
  direction: string = "desc" 
): Promise<CourseDetails[]> =>
  api
    .get<CourseDetails[]>("/Course/GetCoursesinfo", {
      params: { orderBy, direction, number },
    })
    .then((response) => {
      if (!Array.isArray(response.data)) {
        console.error("Invalid data format:", response.data);
        throw new Error("Invalid data format received from the server");
      }
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching courses:", error.message || error);
      throw error;
    });


export function findNextLesson(courseContent: CourseContent) {
  for (const module of courseContent.modules) {
    for (const lesson of module.lessons) {
      if (!lesson.isCompleted) {
        return {
          lesson,
          moduleId: module.id,
          url: `/dashboard/courses/${courseContent.id}/modules/${module.id}/lessons/${lesson.id}`,
        };
      }
    }
  }

  if (
    courseContent.modules.length > 0 &&
    courseContent.modules[0].lessons.length > 0
  ) {
    const firstModule = courseContent.modules[0];
    const firstLesson = firstModule.lessons[0];
    return {
      lesson: firstLesson,
      moduleId: firstModule.id,
      url: `/dashboard/courses/${courseContent.id}/modules/${firstModule.id}/lessons/${firstLesson.id}`,
    };
  }

  return {
    lesson: null,
    moduleId: null,
    url: `/dashboard/courses/${courseContent.id}/about`,
  };
}
