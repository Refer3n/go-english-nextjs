"use client"

import type React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FilterOption {
  id: string
  label: string
  count: number
}

interface FilterSectionProps {
  title: string
  options: FilterOption[]
  selectedOptions: string[]
  onChange: (optionId: string) => void
  isOpen?: boolean
  onToggle: () => void
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selectedOptions,
  onChange,
  isOpen = false,
  onToggle,
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      value={isOpen ? title : ""}
      onValueChange={(value) => {
        if (value === title || value === "") {
          onToggle()
        }
      }}
      className="border-b pb-2"
    >
      <AccordionItem value={title} className="border-none">
        <AccordionTrigger className="py-2 hover:no-underline">
          <h3 className="text-lg font-medium">{title}</h3>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-2">
            {options.map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={() => onChange(option.id)}
                    className="text-white"
                  />
                  <Label htmlFor={option.id} className="text-sm font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
                <span className="text-gray-400 text-xs">{option.count}</span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default FilterSection
