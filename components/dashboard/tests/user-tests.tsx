"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import api from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import Pagination from "@/components/Pagination"
import { sortData } from "@/lib/utils/sort-utils"

interface Test {
  id: string
  title: string
  completionTime: string
  lastScore: number
  bestScore: number
}

type SortField = "title" | "completionTime" | "lastScore" | "bestScore"

const testData: Test[] = [
  {
    id: "1",
    title: "Identify the Main point",
    completionTime: "2024-12-26T10:30:00Z",
    lastScore: 89,
    bestScore: 95,
  },
  {
    id: "2",
    title: "Layout-Bullet Points, Tables and Fonts",
    completionTime: "2024-12-25T14:15:00Z",
    lastScore: 89,
    bestScore: 95,
  },
  {
    id: "3",
    title: "Identify form and Purpose",
    completionTime: "2024-12-24T09:45:00Z",
    lastScore: 63,
    bestScore: 70,
  },
  {
    id: "4",
    title: "Layout-Organizational Features",
    completionTime: "2024-12-23T16:20:00Z",
    lastScore: 63,
    bestScore: 70,
  },
  {
    id: "5",
    title: "Finding the Meaning of Words",
    completionTime: "2024-12-22T11:10:00Z",
    lastScore: 89,
    bestScore: 90,
  },
  {
    id: "6",
    title: "Diagnostic: B2 Writing",
    completionTime: "2024-12-21T13:30:00Z",
    lastScore: 99,
    bestScore: 99,
  },
]

export default function UserTests() {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [tests, setTests] = useState<Test[]>(testData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>("completionTime")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(3)

  useEffect(() => {
    setIsLoading(true)

    api
      .get("/Test/GetUserTests", {
        params: { userId },
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          if (response.data.length > 0) {
            setTests(response.data)
          }
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching tests:", err)
        setError("Failed to fetch test results")
        setIsLoading(false)
      })
  }, [userId, session?.user?.accessToken])

  const handleSort = (field: SortField) => {
    const newOrder = field === sortField && sortOrder === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortOrder(newOrder)
  }

  const sortedTests = sortData(tests, sortField, sortOrder)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTests = sortedTests.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl overflow-hidden p-4 shadow-sm">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="w-[300px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("title")}
                  className="hover:bg-transparent p-0 font-semibold"
                >
                  Task Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("completionTime")}
                  className="hover:bg-transparent p-0 font-semibold"
                >
                  Last Attempt
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("lastScore")}
                  className="hover:bg-transparent p-0 font-semibold ml-auto"
                >
                  Last Score
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("bestScore")}
                  className="hover:bg-transparent p-0 font-semibold ml-auto"
                >
                  Best Score
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTests.map((test) => (
              <TableRow key={test.id} className="border-0">
                <TableCell className="font-medium border-0">{test.title}</TableCell>
                <TableCell className="border-0">{format(new Date(test.completionTime), "dd MMM yyyy")}</TableCell>
                <TableCell className="text-right border-0">{test.lastScore}%</TableCell>
                <TableCell className="text-right border-0">{test.bestScore}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {tests.length > itemsPerPage && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalItems={tests.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

