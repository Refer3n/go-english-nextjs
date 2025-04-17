"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { X } from "lucide-react"
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

export function ShopFilters({
  selectedLevels = [],
  selectedInterests = [],
  selectedSkills = [],
  selectedGrammar = [],
}: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

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
    const params = new URLSearchParams(searchParams.toString())

    const currentFilters = params.get(section)?.split(",") || []

    let newFilters: string[]
    if (currentFilters.includes(optionId)) {
      newFilters = currentFilters.filter((id) => id !== optionId)
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

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete("levels")
    params.delete("interests")
    params.delete("skills")
    params.delete("grammar")
    params.set("page", "1")

    router.push(`/dashboard/shop?${params.toString()}`)
  }

  const selectedFilterCount =
    selectedLevels.length + selectedInterests.length + selectedSkills.length + selectedGrammar.length

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Filters</h2>
        <div className="flex items-center gap-2">
          {selectedFilterCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {selectedFilterCount} Chosen
            </Badge>
          )}
          {selectedFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 text-xs text-primary">
              Clear all <X size={14} className="ml-1" />
            </Button>
          )}
        </div>
      </div>

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
