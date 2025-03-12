"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePeriodOptions } from "@/hooks/use-period-options";
import StudyStats from "./study-stats";
import StudyChart from "./study-chart";
import { useChartData } from "@/hooks/use-study-data";

export default function StudyAnalytics() {
  const [period, setPeriod] = useState("year");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  // Get period options based on current selections
  const {
    periodOptions,
    selectedPeriodOption,
    dateRange,
    handlePeriodOptionChange,
  } = usePeriodOptions(period, selectedYear, selectedMonth);

  // Fetch chart data based on current period and date range
  const {
    chartData,
    yAxisDomain,
    yAxisTicks,
    totalTasks,
    totalTimeSpent,
    isLoading,
    error,
  } = useChartData(period, selectedYear, dateRange);

  // Update period options when period changes
  useEffect(() => {
    // Reset selected options when period changes
    if (period === "year") {
      setSelectedMonth(null);
      setSelectedWeek(null);
    } else if (period === "month") {
      setSelectedWeek(null);
      // If no month is selected, select the first available month
      if (!selectedMonth && periodOptions.length > 0) {
        setSelectedMonth(periodOptions[0].label);
        handlePeriodOptionChange(periodOptions[0].label);
      }
    } else if (period === "week") {
      // If no week is selected, select the first available week
      if (!selectedWeek && periodOptions.length > 0) {
        setSelectedWeek(periodOptions[0].label);
        handlePeriodOptionChange(periodOptions[0].label);
      }
    }
  }, [
    period,
    periodOptions,
    selectedMonth,
    selectedWeek,
    handlePeriodOptionChange,
  ]);

  // Handle period change (year, month, week)
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };

  // Handle period option change (specific month or week)
  const handleOptionChange = (value: string) => {
    if (period === "month") {
      setSelectedMonth(value);
    } else if (period === "week") {
      setSelectedWeek(value);
    }
    handlePeriodOptionChange(value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl">
      <Card className="w-full border-none rounded-xl">
        <CardContent className="p-6 bg-white border-none rounded-xl">
          <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4 mb-6">
            <Tabs
              defaultValue="year"
              value={period}
              onValueChange={handlePeriodChange}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger className="button-option mr-4" value="week">
                  Week
                </TabsTrigger>
                <TabsTrigger className="button-option mr-4" value="month">
                  Month
                </TabsTrigger>
                <TabsTrigger className="button-option" value="year">
                  Year
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {period === "year" ? (
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32 button-option !text-black !font-semibold">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-none overflow-hidden text-black font-semibold leading-6">
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select
                  value={selectedPeriodOption}
                  onValueChange={handleOptionChange}
                  defaultValue={periodOptions[0]?.label}
                >
                  <SelectTrigger
                    className={
                      period === "week"
                        ? "w-64 button-option !text-black !font-semibold"
                        : "w-48 button-option !text-black !font-semibold"
                    }
                  >
                    <SelectValue placeholder={`Select ${period}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-none overflow-hidden text-black font-semibold leading-6">
                    {periodOptions.map((option) => (
                      <SelectItem key={option.label} value={option.label}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <StudyStats totalTasks={totalTasks} totalTimeSpent={totalTimeSpent} />

          {error ? (
            <div className="text-red-500 p-4 text-center">{error}</div>
          ) : isLoading ? (
            <div className="h-80 flex items-center justify-center">
              Loading chart data...
            </div>
          ) : (
            <StudyChart
              chartData={chartData}
              yAxisDomain={yAxisDomain}
              yAxisTicks={yAxisTicks}
              period={period}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
