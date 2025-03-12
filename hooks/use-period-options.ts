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
  selectedMonth: string | null = null,
) {
  const [periodOptions, setPeriodOptions] = useState<PeriodOption[]>([]);
  const [selectedPeriodOption, setSelectedPeriodOption] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfYear(new Date(2025, 0, 1)),
    to: endOfYear(new Date(2025, 0, 1)),
  });

  // Generate period options based on the selected period and year/month
  useEffect(() => {
    const year = Number.parseInt(selectedYear);
    let options: PeriodOption[] = [];

    if (period === "week") {
      // If a month is selected, generate weeks for that month
      // Otherwise, default to January
      const monthIndex = selectedMonth ? new Date(selectedMonth).getMonth() : 0;

      options = generateWeeksForMonth(year, monthIndex);

      // If there are options and no selection yet, select the first one
      if (options.length > 0 && !selectedPeriodOption) {
        setSelectedPeriodOption(options[0]?.label || "");
      } else if (options.length > 0) {
        // Try to keep the same week if possible
        const existingWeekIndex = options.findIndex(
          (opt) => opt.label === selectedPeriodOption,
        );
        if (existingWeekIndex === -1) {
          setSelectedPeriodOption(options[0]?.label || "");
        }
      }
    } else if (period === "month") {
      options = generateMonthsForYear(year);

      // If there are options and no selection yet, select the first one
      if (options.length > 0 && !selectedPeriodOption) {
        setSelectedPeriodOption(options[0]?.label || "");
      } else if (options.length > 0 && selectedMonth) {
        // Try to find and select the previously selected month
        const monthOption = options.find((opt) => opt.label === selectedMonth);
        if (monthOption) {
          setSelectedPeriodOption(monthOption.label);
        } else {
          setSelectedPeriodOption(options[0]?.label || "");
        }
      }
    } else {
      // Year period
      options = [
        {
          label: selectedYear,
          from: startOfYear(new Date(year, 0, 1)),
          to: endOfYear(new Date(year, 0, 1)),
        },
      ];
      setSelectedPeriodOption(options[0]?.label || "");
    }

    setPeriodOptions(options);

    // Set date range based on the selected option
    if (options.length > 0) {
      const selectedOption =
        period === "month" && selectedMonth
          ? options.find((opt) => opt.label === selectedMonth)
          : options.find((opt) => opt.label === selectedPeriodOption) ||
            options[0];

      if (selectedOption) {
        setDateRange({
          from: selectedOption.from,
          to: selectedOption.to,
        });
      }
    }
  }, [period, selectedYear, selectedMonth, selectedPeriodOption]);

  // Handle period option change
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
    [periodOptions],
  );

  return {
    periodOptions,
    selectedPeriodOption,
    dateRange,
    handlePeriodOptionChange,
  };
}
