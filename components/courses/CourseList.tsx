"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import CourseCard from "./CourseCard"
import Pagination from "../Pagination"
import type { CourseDetails } from "@/types/course"
import { fetchAllCourses } from "@/lib/course-utils"
import { Skeleton } from "../ui/skeleton"
import { useLocale } from "next-intl"

interface CourseListProps {
  itemsPerPage: number
}

export default function CourseList({ itemsPerPage }: CourseListProps) {
  const { status } = useSession()
  const [courses, setCourses] = useState<CourseDetails[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCourses, setTotalCourses] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [columnsPerRow, setColumnsPerRow] = useState(4)

  const locale = useLocale()

  useEffect(() => {
    setHasMounted(true)

    const getColumnsPerRow = () => {
      if (window.innerWidth >= 1680) return 4
      if (window.innerWidth >= 1024) return 3
      if (window.innerWidth >= 640) return 2
      return 1
    }

    const handleResize = () => {
      setColumnsPerRow(getColumnsPerRow())
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (status === "loading" || !hasMounted) return

    let isMounted = true
    setIsLoading(true)
    setError(null)

    const fetchLimit = itemsPerPage * 4  

    fetchAllCourses(fetchLimit, "rating", "desc", locale)
      .then((data) => {
        if (isMounted) {
          setCourses(data || [])
          setTotalCourses((data || []).length)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error fetching courses:", err)
          setError(err.message || "Failed to fetch courses")
          setCourses([])
          setTotalCourses(0)
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [status, hasMounted, itemsPerPage]) 

  const itemsPerFullPage = useMemo(() => {
    return Math.floor(itemsPerPage / columnsPerRow) * columnsPerRow
  }, [itemsPerPage, columnsPerRow])

  const totalPages = Math.ceil(totalCourses / itemsPerFullPage)

  const indexOfLastItem = currentPage * itemsPerFullPage
  const indexOfFirstItem = indexOfLastItem - itemsPerFullPage
  const currentCourses = useMemo(() => {
    return courses.slice(indexOfFirstItem, indexOfLastItem)
  }, [courses, indexOfFirstItem, indexOfLastItem])

  if (!hasMounted) return null

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {Array.from({ length: Math.min(itemsPerFullPage, 8) }).map((_, index) => (
          <Skeleton key={index} className="w-full h-[500px]" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-custom-4 gap-6 max-w-[1680px] w-full mx-auto">
        {currentCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalItems={totalCourses}
            itemsPerPage={itemsPerFullPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}
