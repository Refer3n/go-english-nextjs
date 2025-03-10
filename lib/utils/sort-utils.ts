

export function sortData<T>(
  data: T[],
  sortField: keyof T,
  sortOrder: SortOrder,
  customSortFn?: (a: T, b: T, field: keyof T, order: SortOrder) => number,
) {
  return [...data].sort((a, b) => {
    if (customSortFn) {
      return customSortFn(a, b, sortField, sortOrder)
    }

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (
      typeof aValue === "string" &&
      typeof bValue === "string" &&
      !isNaN(Date.parse(aValue)) &&
      !isNaN(Date.parse(bValue))
    ) {
      return sortOrder === "asc"
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime()
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })
}

