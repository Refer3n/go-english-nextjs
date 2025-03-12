"use client";

import { useState, useEffect, useCallback } from "react";
import { startOfYear, endOfYear } from "date-fns";
import {
  generateMonthsForYear,
  generateWeeksForMonth,
} from "@/lib/utils/date-utils";

export type PeriodOption = {
  label: string;
  from: Date;
  to: Date;
};

export function usePeriodOptions(
  period: string,
  selectedYear: string,
  selectedMonth: string | null = null
) {
  const [periodOptions, setPeriodOptions] = useState<PeriodOption[]>([]);
  const [selectedPeriodOption, setSelectedPeriodOption] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfYear(new Date(2025, 0, 1)),
    to: endOfYear(new Date(2025, 0, 1)),
  });

  useEffect(() => {
    const year = Number.parseInt(selectedYear);
    let options: PeriodOption[] = [];

    if (period === "week") {
      let monthIndex = 0;

      if (selectedMonth) {
        try {
          const monthName = selectedMonth.split(" ")[0];
          const monthMap: Record<string, number> = {
            January: 0,
            February: 1,
            March: 2,
            April: 3,
            May: 4,
            June: 5,
            July: 6,
            August: 7,
            September: 8,
            October: 9,
            November: 10,
            December: 11,
          };
          monthIndex = monthMap[monthName] || 0;
        } catch (e) {
          console.error("Error parsing month:", e);
          monthIndex = 0;
        }
      }

      options = generateWeeksForMonth(year, monthIndex);
    } else if (period === "month") {
      options = generateMonthsForYear(year);
    } else {
      options = [
        {
          label: selectedYear,
          from: startOfYear(new Date(year, 0, 1)),
          to: endOfYear(new Date(year, 0, 1)),
        },
      ];
    }

    setPeriodOptions(options);

    if (options.length > 0) {
      if (period === "month" && !selectedPeriodOption) {
        setSelectedPeriodOption(options[0].label);
        setDateRange({
          from: options[0].from,
          to: options[0].to,
        });
      } else if (period === "week" && !selectedPeriodOption) {
        setSelectedPeriodOption(options[0].label);
        setDateRange({
          from: options[0].from,
          to: options[0].to,
        });
      } else if (period === "year") {
        setSelectedPeriodOption(options[0].label);
        setDateRange({
          from: options[0].from,
          to: options[0].to,
        });
      }
    }
  }, [period, selectedYear, selectedMonth, selectedPeriodOption]);

  const handlePeriodOptionChange = useCallback(
    (value: string) => {
      setSelectedPeriodOption(value);

      const option = periodOptions.find((opt) => opt.label === value);
      if (option) {
        setDateRange({
          from: option.from,
          to: option.to,
        });
      }
    },
    [periodOptions]
  );

  return {
    periodOptions,
    selectedPeriodOption,
    dateRange,
    handlePeriodOptionChange,
  };
}
