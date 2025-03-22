import { CourseContent, CourseDetails } from "@/types/course";
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
  }
}

/**
 * @param courseId The course ID
 * @param userId The user ID
 * @param accessToken The access token for authentication
 * @returns A promise that resolves to the course content
 */
export async function fetchCourseContent(
  courseId: string | number,
  userId: string,
  accessToken: string,
): Promise<CourseContent> {
  try {
    const response = await api.get("/Course/GetCourseContent", {
      params: { courseId, userId },
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (response.data) {
      return response.data
    } else {
      console.error("Invalid data format:", response.data)
      throw new Error("Invalid data format received from the server")
    }
  } catch (error) {
    console.error("Error fetching course content:", error)
    throw error
  }
}

/**
 * @param courseId The course ID
 * @param accessToken The access token for authentication
 * @returns A promise that resolves to the course details
 */
export async function fetchCourseDetails(courseId: string | number, accessToken: string): Promise<CourseDetails> {
  try {
    const response = await api.get(`/Course/GetCourseInfo/${courseId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (response.data) {
      return response.data
    } else {
      console.error("Invalid data format:", response.data)
      throw new Error("Invalid data format received from the server")
    }
  } catch (error) {
    console.error("Error fetching course details:", error)
    throw error
  }
}
