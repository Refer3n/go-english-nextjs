import api from "@/lib/api"
import type { CourseDetails } from "@/types/course"
import { useLocale } from "next-intl"

interface FetchCoursesParams {
  userId?: string
  accessToken?: string
  levels: string[]
  interests: string[]
  skills: string[]
  grammar: string[]
  sort: string
  search: string
  langCode: string
}

interface FetchCoursesResult {
  courses: CourseDetails[]
  totalCount: number
}

export async function fetchCourses({
  userId,
  accessToken,
  levels,
  interests,
  skills,
  grammar,
  sort,
  search,
  langCode,
}: FetchCoursesParams): Promise<FetchCoursesResult> {
  try {
    const filterExpression =
    levels.length > 0
      ? levels.map((level) => `Level = "${level.slice(0, 2)}"`).join(" OR ")
      : undefined
  

    const searchTerms = [
      ...(search ? [search] : []),
      ...interests,
      ...skills,
      ...grammar,
    ]

    const searchExpression = searchTerms.length > 0
      ? searchTerms.join(" ")
      : undefined

    const sortOptions: Record<string, { orderBy: string; direction: "asc" | "desc" }> = {
      "price-high-low": { orderBy: "Price", direction: "desc" },
      "rating-high-low": { orderBy: "Rating", direction: "desc" },
      "newest": { orderBy: "createdAt", direction: "desc" },
      "popularity": { orderBy: "feedbacksNumber", direction: "desc" },
      "default": { orderBy: "price", direction: "asc" },
    }

    const { orderBy, direction } = sortOptions[sort] || sortOptions.default

    const params: Record<string, any> = {
      userId,
      orderBy,
      direction,
      ...(filterExpression && { filterExpression }),
      ...(searchExpression && { searchExpression }),
    }

    const response = await api.get("/Course/GetUnpurchasedCourses", {
      headers: {
        "Content-Language": langCode,
      },
      params
    })

    const data = response.data ?? []

    return {
      courses: data,
      totalCount: data.length,
    }
  } catch (error) {
    console.error("Error fetching courses:", error)
    throw new Error("Failed to fetch courses")
  }
}
