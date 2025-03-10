"use client";

import { useState, useEffect } from "react";
import { startOfYear, endOfYear } from "date-fns";
import {
  generateWeeksForMonth,
  generateMonthsForYear,
} from "@/lib/utils/date-utils";

export type PeriodOption = {
  label: string;
  from: Date;
  to: Date;
};

export function usePeriodOptions(period: string, selectedYear: string) {
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
      options = generateWeeksForMonth(year, 0);
      setSelectedPeriodOption(options[0]?.label || "");
    } else if (period === "month") {
      options = generateMonthsForYear(year);
      setSelectedPeriodOption(options[0]?.label || "");
    } else {
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

    if (options.length > 0) {
      setDateRange({
        from: options[0].from,
        to: options[0].to,
      });
    }
  }, [period, selectedYear]);

  const handlePeriodOptionChange = (value: string) => {
    setSelectedPeriodOption(value);

    const option = periodOptions.find((opt) => opt.label === value);
    if (option) {
      setDateRange({
        from: option.from,
        to: option.to,
      });
    }
  };

  return {
    periodOptions,
    selectedPeriodOption,
    dateRange,
    handlePeriodOptionChange,
  };
}
