import api from "@/lib/api"
import type { CourseDetails } from "@/types/course"

interface FetchCoursesParams {
  userId: string | undefined
  accessToken: string | undefined
  levels: string[]
  interests: string[]
  skills: string[]
  grammar: string[]
  sort: string
  search: string
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
}: FetchCoursesParams): Promise<FetchCoursesResult> {
  try {
    // Build API request params - always include essential parameters
    const requestParams: Record<string, any> = {
      userId,
      direction: "asc",
    }

    // Handle level filters - use "Level = X" format
    if (levels.length > 0) {
      const levelFilters = levels.map((level) => `Level = ${level}`).join(" OR ")
      requestParams.levelFilter = levelFilters
    }

    // Combine other filters into search expression for Levenshtein matching
    const searchTerms = []

    // Add the original search term if provided
    if (search) {
      searchTerms.push(search)
    }

    // Add interests, skills, and grammar as search terms
    const allSearchFilters = [...interests, ...skills, ...grammar]
    if (allSearchFilters.length > 0) {
      searchTerms.push(...allSearchFilters)
    }

    // Set the combined search expression
    if (searchTerms.length > 0) {
      requestParams.searchExpression = searchTerms.join(" ")
    }

    // Determine sort parameters
    switch (sort) {
      case "price-high-low":
        requestParams.orderBy = "price"
        requestParams.direction = "desc"
        break
      case "rating-high-low":
        requestParams.orderBy = "rating"
        requestParams.direction = "desc"
        break
      case "newest":
        requestParams.orderBy = "createdAt"
        requestParams.direction = "desc"
        break
      case "popularity":
        requestParams.orderBy = "feedbacksNumber"
        requestParams.direction = "desc"
        break
      default:
        requestParams.orderBy = "price"
        break
    }

    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/Course/GetUnpurchasedCourses`)
    Object.entries(requestParams).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
    console.log("Debug - Request URL:", url.toString())

    const response = await api.get("/Course/GetUnpurchasedCourses", {
      params: requestParams,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.data) {
      return {
        courses: response.data || [],
        totalCount: response.data.length || 0,
      }
    }

    return { courses: [], totalCount: 0 }
  } catch (error) {
    console.error("Error fetching courses:", error)
    throw new Error("Failed to fetch courses")
  }
}
