"use client";

import { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import {
  ApiDataItem,
  calculateYAxisProps,
  ChartDataItem,
} from "@/lib/utils/chart-utils";

export function useChartData(
  period: string,
  selectedYear: string,
  dateRange: { from: Date; to: Date }
) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 70]);
  const [yAxisTicks, setYAxisTicks] = useState<number[]>([
    0, 10, 20, 30, 40, 50, 60, 70,
  ]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !session?.user?.accessToken) return;

    setIsLoading(true);
    setError(null);

    api
      .get("/Progress/GetLearningActivity", {
        params: { userId, year: selectedYear },
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          const transformedData: ApiDataItem[] = response.data.map((item) => {
            const date = new Date(item.date);
            return {
              tasks: item.tasks,
              date: date,
              timeSpentInMinutes: item.timeSpentInMinutes || 0,
            };
          });

          const allTasks =
            transformedData && transformedData.length > 0
              ? transformedData.reduce((sum, item) => {
                  const taskValue =
                    typeof item.tasks === "number" && !isNaN(item.tasks)
                      ? item.tasks
                      : 0;
                  return sum + taskValue;
                }, 0)
              : 0;

          const allTimeSpent = transformedData.reduce(
            (sum, item) => sum + item.timeSpentInMinutes,
            0
          );

          setTotalTasks(allTasks);
          setTotalTimeSpent(allTimeSpent);

          const filteredData = transformedData.filter(
            (item) => item.date >= dateRange.from && item.date <= dateRange.to
          );

          let groupedData: ChartDataItem[] = [];

          if (period === "year") {
            const monthGroups: Record<string, ChartDataItem> = {};

            const allMonths = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            allMonths.forEach((month, index) => {
              monthGroups[month] = {
                month,
                tasks: 0,
                date: new Date(Number(selectedYear), index, 15),
              };
            });

            filteredData.forEach((item) => {
              const monthKey = format(item.date, "MMM");
              if (monthGroups[monthKey]) {
                monthGroups[monthKey].tasks += item.tasks;
              }
            });

            groupedData = allMonths.map((month) => monthGroups[month]);
          } else if (period === "month") {
            const selectedMonth = new Date(dateRange.from).getMonth();
            const selectedMonthYear = new Date(dateRange.from).getFullYear();
            const lastDay = new Date(
              selectedMonthYear,
              selectedMonth + 1,
              0
            ).getDate();

            const dayMap: Record<number, ChartDataItem> = {};

            filteredData.forEach((item) => {
              const day = item.date.getDate();
              if (!dayMap[day]) {
                dayMap[day] = {
                  month: day.toString(),
                  tasks: 0,
                  date: new Date(selectedMonthYear, selectedMonth, day),
                };
              }
              dayMap[day].tasks += item.tasks;
            });

            if (!dayMap[1]) {
              dayMap[1] = {
                month: "1",
                tasks: 0,
                date: new Date(selectedMonthYear, selectedMonth, 1),
              };
            }

            if (!dayMap[lastDay]) {
              dayMap[lastDay] = {
                month: lastDay.toString(),
                tasks: 0,
                date: new Date(selectedMonthYear, selectedMonth, lastDay),
              };
            }

            groupedData = Object.values(dayMap).sort(
              (a, b) => a.date.getDate() - b.date.getDate()
            );
          } else if (period === "week") {
            const weekStart = new Date(dateRange.from);

            groupedData = Array.from({ length: 7 }, (_, i) => {
              const currentDay = addDays(weekStart, i);
              const dayNumber = i + 1;

              const tasksForDay = filteredData
                .filter((item) => isSameDay(item.date, currentDay))
                .reduce((sum, item) => sum + item.tasks, 0);

              return {
                month: dayNumber.toString(),
                tasks: tasksForDay,
                date: currentDay,
              };
            });
          }

          setChartData(groupedData);

          const { yAxisDomain, yAxisTicks } = calculateYAxisProps(groupedData);
          setYAxisDomain(yAxisDomain);
          setYAxisTicks(yAxisTicks);

          setIsLoading(false);
        } else {
          console.error("Invalid data format:", response.data);
          setError("Invalid data format received from the server");
          setChartData([]);
          setTotalTasks(0);
          setTotalTimeSpent(0);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching learning activity data:", error);
        setError("Failed to fetch learning activity data");
        setChartData([]);
        setTotalTasks(0);
        setTotalTimeSpent(0);
        setIsLoading(false);
      });
  }, [dateRange, userId, selectedYear, period, session?.user?.accessToken]);

  return {
    chartData,
    yAxisDomain,
    yAxisTicks,
    totalTasks,
    totalTimeSpent,
    isLoading,
    error,
  };
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
}
