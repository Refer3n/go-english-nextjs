"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"
import { SquareX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import FilterSection from "@/components/shop/filter-section"
import { LEVELS, INTERESTS, SKILLS, GRAMMAR } from "@/constants/shop-filtres"

interface ShopFiltersProps {
  selectedLevels: string[]
  selectedInterests: string[]
  selectedSkills: string[]
  selectedGrammar: string[]
}

interface SelectedFilter {
  section: string
  id: string
  name: string
}

export function ShopFilters({
  selectedLevels = [],
  selectedInterests = [],
  selectedSkills = [],
  selectedGrammar = [],
}: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())

  const [openSections, setOpenSections] = useState({
    levels: true,
    interests: true,
    skills: false,
    grammar: false,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleFilterChange = (section: string, optionId: string) => {
    const currentFilters = params.get(section)?.split(",").filter(Boolean) || []

    let newFilters: string[] = []
    if (currentFilters.includes(optionId)) {
      newFilters = currentFilters.filter(id => id !== optionId)
    } else {
      newFilters = [...currentFilters, optionId]
    }

    if (newFilters.length > 0) {
      params.set(section, newFilters.join(","))
    } else {
      params.delete(section)
    }

    params.set("page", "1")
    router.push(`/dashboard/shop?${params.toString()}`)
  }

  const removeFilter = (section: string, optionId: string) => {
    handleFilterChange(section, optionId)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete("levels")
    params.delete("interests")
    params.delete("skills")
    params.delete("grammar")
    params.delete("search")
    params.set("page", "1")

    router.push(`/dashboard/shop?${params.toString()}`)
  }

  const getSelectedFiltersWithNames = (): SelectedFilter[] => {
    const filters: SelectedFilter[] = []

    selectedLevels.forEach((id) => {
      const option = LEVELS.find((level) => level.id === id)
      if (option) filters.push({ section: "levels", id, name: option.label })
    })

    selectedInterests.forEach((id) => {
      const option = INTERESTS.find((interest) => interest.id === id)
      if (option) filters.push({ section: "interests", id, name: option.label })
    })

    selectedSkills.forEach((id) => {
      const option = SKILLS.find((skill) => skill.id === id)
      if (option) filters.push({ section: "skills", id, name: option.label })
    })

    selectedGrammar.forEach((id) => {
      const option = GRAMMAR.find((grammar) => grammar.id === id)
      if (option) filters.push({ section: "grammar", id, name: option.label })
    })

    return filters
  }

  const selectedFilters = getSelectedFiltersWithNames()
  const hasSelectedFilters = selectedFilters.length > 0 || params.get("search")

  return (
    <div className="bg-white p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Filters</h2>
        {hasSelectedFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 text-xs text-primary">
            Clear all
          </Button>
        )}
      </div>

      {hasSelectedFilters && (
        <div className="mb-6">
          <div className="text-sm font-medium mb-2">Chosen:</div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto text-primary">
            {selectedFilters.map((filter) => (
              <Badge
                key={`${filter.section}-${filter.id}`}
                variant="outline"
                className="flex items-center gap-1 px-4 py-2 text-base rounded-full font-normal border border-primary"
              >
                {filter.name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFilter(filter.section, filter.id)}
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                >
                  <SquareX size={12} />
                  <span className="sr-only">Remove {filter.name}</span>
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <FilterSection
        title="Levels"
        options={LEVELS}
        selectedOptions={selectedLevels}
        onChange={(id) => handleFilterChange("levels", id)}
        isOpen={openSections.levels}
        onToggle={() => toggleSection("levels")}
      />

      <FilterSection
        title="Interests"
        options={INTERESTS}
        selectedOptions={selectedInterests}
        onChange={(id) => handleFilterChange("interests", id)}
        isOpen={openSections.interests}
        onToggle={() => toggleSection("interests")}
      />

      <FilterSection
        title="Skills"
        options={SKILLS}
        selectedOptions={selectedSkills}
        onChange={(id) => handleFilterChange("skills", id)}
        isOpen={openSections.skills}
        onToggle={() => toggleSection("skills")}
      />

      <FilterSection
        title="Grammar"
        options={GRAMMAR}
        selectedOptions={selectedGrammar}
        onChange={(id) => handleFilterChange("grammar", id)}
        isOpen={openSections.grammar}
        onToggle={() => toggleSection("grammar")}
      />
    </div>
  )
}
