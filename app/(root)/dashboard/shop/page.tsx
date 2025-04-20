"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { fetchCourses } from "@/lib/shop-utils"
import CourseCard from "@/components/courses/CourseCard"
import Pagination from "@/components/Pagination"
import { SortSelector } from "@/components/shop/sort-selector"
import { SearchForm } from "@/components/shop/search-form"
import { ShopFilters } from "@/components/shop/shop-filters"
import { useSession } from "next-auth/react"
import type { CourseDetails } from "@/types/course"
import CourseCardSkeleton from "@/components/shop/course-card-skeleton"

const ITEMS_PER_PAGE = 6

export default function ShopPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const [courses, setCourses] = useState<CourseDetails[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      const params = Object.fromEntries(searchParams.entries())

      const levels = params.levels?.split(",") ?? []
      const interests = params.interests?.split(",") ?? []
      const skills = params.skills?.split(",") ?? []
      const grammar = params.grammar?.split(",") ?? []
      const sort = params.sort ?? "price-low-high"
      const search = params.search ?? ""
      const page = Number.parseInt(params.page ?? "1")

      try {
        const { courses, totalCount } = await fetchCourses({
          userId: session.user.id,
          accessToken: session.user.accessToken,
          levels,
          interests,
          skills,
          grammar,
          sort,
          search,
        })

        

        setCourses(courses)
        setTotalCount(totalCount)
        setCurrentPage(page)
      } catch (err) {
        console.error("Failed to fetch courses:", err)
        setError("Failed to load courses. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchParams.toString(), session])

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`?${params.toString()}`)
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }


  if (error) {
    return (
      <div className="px-[2vw] py-6">
        <div className="bg-red-50 p-8 rounded-md text-center">
          <h3 className="text-xl font-medium mb-2 text-red-600">Error</h3>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-[2vw] py-6 bg-light-400 h-auto">

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4 pt-[60px]">
          <ShopFilters
            selectedLevels={searchParams.get("levels")?.split(",") ?? []}
            selectedInterests={searchParams.get("interests")?.split(",") ?? []}
            selectedSkills={searchParams.get("skills")?.split(",") ?? []}
            selectedGrammar={searchParams.get("grammar")?.split(",") ?? []}
          />
        </div>

        <div className="lg:w-3/4">
          <div className="flex justify-end mb-6">
            <SortSelector currentSort={searchParams.get("sort") ?? "price"} />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-md text-center">
              <h3 className="text-xl font-medium mb-2">No courses found</h3>
              <p className="text-gray-500">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCourses.map((course) => (
                <CourseCard key={course.id} course={course} variant="shop" />
              ))}
            </div>
          )}

          {!isLoading && totalCount > ITEMS_PER_PAGE && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalItems={totalCount}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
