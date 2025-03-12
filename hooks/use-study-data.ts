"use client"

import { useState, useEffect, useCallback } from "react"
import { format, isSameDay } from "date-fns"
import { useSession } from "next-auth/react"
import api from "@/lib/api"
import { ChartDataItem, calculateYAxisProps } from "@/lib/utils/chart-utils"

// Update the API data item interface to match the actual API response structure
export type ApiDataItem = {
  tasksCompleted: number
  startDate: Date
  timeSpentInMinutes: number
}

export function useChartData(period: string, selectedYear: string, dateRange: { from: Date; to: Date }) {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [allData, setAllData] = useState<ApiDataItem[]>([])
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 70])
  const [yAxisTicks, setYAxisTicks] = useState<number[]>([0, 10, 20, 30, 40, 50, 60, 70])
  const [totalTasks, setTotalTasks] = useState(0)
  const [totalTimeSpent, setTotalTimeSpent] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchedYear, setLastFetchedYear] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !session?.user?.accessToken) return

    if (lastFetchedYear !== selectedYear) {
      setIsLoading(true)
      setError(null)

      api
        .get("/Progress/GetLearningActivity", {
          params: { userId, year: selectedYear },
          headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
        })
        .then((response) => {
          if (response.data && Array.isArray(response.data)) {
            const transformedData: ApiDataItem[] = response.data.map((item) => {
              const date = new Date(item.startDate)
              return {
                tasksCompleted:
                  typeof item.tasksCompleted === "number" && !isNaN(item.tasksCompleted) ? item.tasksCompleted : 0,
                startDate: date,
                timeSpentInMinutes:
                  typeof item.timeSpentInMinutes === "number" && !isNaN(item.timeSpentInMinutes)
                    ? item.timeSpentInMinutes
                    : 0,
              }
            })

            setAllData(transformedData)


            calculateTotals(transformedData)

            setLastFetchedYear(selectedYear)
            setIsLoading(false)
          } else {
            console.error("Invalid data format:", response.data)
            setError("Invalid data format received from the server")
            setAllData([])
            setTotalTasks(0)
            setTotalTimeSpent(0)
            setIsLoading(false)
          }
        })
        .catch((error) => {
          console.error("Error fetching learning activity data:", error)
          setError("Failed to fetch learning activity data")
          setAllData([])
          setTotalTasks(0)
          setTotalTimeSpent(0)
          setIsLoading(false)
        })
    }
  }, [userId, selectedYear, session?.user?.accessToken, lastFetchedYear])

  const calculateTotals = useCallback((data: ApiDataItem[]) => {
    const allTasks = data.reduce((sum, item) => {
      const taskValue = typeof item.tasksCompleted === "number" && !isNaN(item.tasksCompleted) ? item.tasksCompleted : 0
      return sum + taskValue
    }, 0)

    const allTimeSpent = data.reduce((sum, item) => {
      const timeValue =
        typeof item.timeSpentInMinutes === "number" && !isNaN(item.timeSpentInMinutes) ? item.timeSpentInMinutes : 0
      return sum + timeValue
    }, 0)

    setTotalTasks(allTasks)
    setTotalTimeSpent(allTimeSpent)
  }, [])

  // Process data for chart based on period and date range
  useEffect(() => {
    if (allData.length === 0) return

    const filteredData = allData.filter((item) => item.startDate >= dateRange.from && item.startDate <= dateRange.to)

    let groupedData: ChartDataItem[] = []

    if (period === "year") {
      const monthGroups: Record<string, ChartDataItem> = {}

      const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      allMonths.forEach((month, index) => {
        monthGroups[month] = {
          month,
          tasks: 0,
          date: new Date(Number(selectedYear), index, 15),
        }
      })

      // Add tasks to the corresponding months
      filteredData.forEach((item) => {
        const monthKey = format(item.startDate, "MMM")
        if (monthGroups[monthKey]) {
          const taskValue =
            typeof item.tasksCompleted === "number" && !isNaN(item.tasksCompleted) ? item.tasksCompleted : 0
          monthGroups[monthKey].tasks += taskValue
        }
      })

      groupedData = allMonths.map((month) => monthGroups[month])
    } else if (period === "month") {
      const selectedMonth = new Date(dateRange.from).getMonth()
      const selectedMonthYear = new Date(dateRange.from).getFullYear()
      const lastDay = new Date(selectedMonthYear, selectedMonth + 1, 0).getDate()

      const dayMap: Record<number, ChartDataItem> = {}

      filteredData.forEach((item) => {
        const day = item.startDate.getDate()
        if (!dayMap[day]) {
          dayMap[day] = {
            month: day.toString(),
            tasks: 0,
            date: new Date(selectedMonthYear, selectedMonth, day),
          }
        }
        const taskValue =
          typeof item.tasksCompleted === "number" && !isNaN(item.tasksCompleted) ? item.tasksCompleted : 0
        dayMap[day].tasks += taskValue
      })

      if (!dayMap[1]) {
        dayMap[1] = {
          month: "1",
          tasks: 0,
          date: new Date(selectedMonthYear, selectedMonth, 1),
        }
      }

      if (!dayMap[lastDay]) {
        dayMap[lastDay] = {
          month: lastDay.toString(),
          tasks: 0,
          date: new Date(selectedMonthYear, selectedMonth, lastDay),
        }
      }


      groupedData = Object.values(dayMap).sort((a, b) => a.date.getDate() - b.date.getDate())
    } else if (period === "week") {
      const weekStart = new Date(dateRange.from)


      groupedData = Array.from({ length: 7 }, (_, i) => {
        const currentDay = addDays(weekStart, i)
        const dayNumber = i + 1

        const tasksForDay = filteredData
          .filter((item) => isSameDay(item.startDate, currentDay))
          .reduce((sum, item) => {
            const taskValue =
              typeof item.tasksCompleted === "number" && !isNaN(item.tasksCompleted) ? item.tasksCompleted : 0
            return sum + taskValue
          }, 0)

        return {
          month: dayNumber.toString(),
          tasks: tasksForDay,
          date: currentDay,
        }
      })
    }

    setChartData(groupedData)

    const { yAxisDomain, yAxisTicks } = calculateYAxisProps(groupedData)
    setYAxisDomain(yAxisDomain)
    setYAxisTicks(yAxisTicks)
  }, [allData, period, dateRange, selectedYear])

  return {
    chartData,
    yAxisDomain,
    yAxisTicks,
    totalTasks,
    totalTimeSpent,
    isLoading,
    error,
  }
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(date.getDate() + days)
  return result
}

