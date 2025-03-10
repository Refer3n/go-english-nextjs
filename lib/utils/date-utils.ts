import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

export const generateWeeksForMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = endOfMonth(firstDay);

  let currentDay = startOfWeek(firstDay);
  const weeks = [];

  while (currentDay <= lastDay) {
    const weekEnd = endOfWeek(currentDay);
    weeks.push({
      label: `${format(currentDay, "d MMM")} - ${format(weekEnd, "d MMM yyyy")}`,
      from: currentDay,
      to: weekEnd,
    });
    currentDay = addDays(weekEnd, 1);
  }

  return weeks;
};

export const generateMonthsForYear = (year: number) => {
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(year, i, 1);
    return {
      label: format(date, "MMMM yyyy"),
      from: startOfMonth(date),
      to: endOfMonth(date),
    };
  });
};

export const getDateRangeForPeriod = (period: string, year: number) => {
  if (period === "year") {
    return {
      from: startOfYear(new Date(year, 0, 1)),
      to: endOfYear(new Date(year, 0, 1)),
    };
  }
  return null;
};
