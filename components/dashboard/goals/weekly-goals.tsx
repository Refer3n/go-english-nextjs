"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const DAYS = [
  { key: "mon", label: "M" },
  { key: "tue", label: "T" },
  { key: "wed", label: "W" },
  { key: "thu", label: "T" },
  { key: "fri", label: "F" },
  { key: "sat", label: "S" },
  { key: "sun", label: "S" },
]

interface WeeklyGoals {
  selectedDays: boolean[]
  completedDays: boolean[]
  lastVisit?: string  
}

const defaultGoals: WeeklyGoals = {
  selectedDays: Array(7).fill(false),
  completedDays: Array(7).fill(false),
  lastVisit: undefined,
}

export default function WeeklyGoals() {
  const [goals, setGoals] = useState<WeeklyGoals>(defaultGoals)
  const [isEditing, setIsEditing] = useState(false)
  const [tempSelectedDays, setTempSelectedDays] = useState<boolean[]>([])

  useEffect(() => {
    const savedGoals = localStorage.getItem("weeklyGoals")
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("weeklyGoals", JSON.stringify(goals))
  }, [goals])

  useEffect(() => {
    const today = new Date().getDay()
    const lastVisit = goals.lastVisit ? new Date(goals.lastVisit) : null
    const todayDate = new Date().toISOString().split("T")[0]

    if (goals.selectedDays[today] && (!lastVisit || lastVisit.toISOString().split("T")[0] !== todayDate)) {
      const newCompletedDays = [...goals.completedDays]
      newCompletedDays[today] = true

      setGoals({ ...goals, completedDays: newCompletedDays, lastVisit: todayDate })
    }
  }, [goals])

  const toggleSelectedDay = (index: number) => {
    const newSelectedDays = [...tempSelectedDays]
    newSelectedDays[index] = !newSelectedDays[index]
    setTempSelectedDays(newSelectedDays)
  }

  const saveGoals = () => {
    const newCompletedDays = [...goals.completedDays]
    tempSelectedDays.forEach((selected, index) => {
      if (selected && !goals.selectedDays[index]) {
        newCompletedDays[index] = false
      }
    })

    setGoals({
      selectedDays: tempSelectedDays,
      completedDays: newCompletedDays,
      lastVisit: goals.lastVisit,
    })
    setIsEditing(false)
  }

  const getProgressMessage = () => {
    const selectedCount = goals.selectedDays.filter(Boolean).length
    const completedCount = goals.selectedDays.filter((selected, index) => selected && goals.completedDays[index]).length

    if (selectedCount === 0) return "Set your weekly goals to get started!"

    if (completedCount === 0) return "Your week is just beginning. You can do this!"

    if (completedCount === selectedCount) return "You are on track. Keep up the excellent work!"

    if (completedCount > 0 && completedCount < selectedCount) {
      return `Keep going! You've completed ${completedCount} of ${selectedCount} goals.`
    }

    return "You're making progress!"
  }

  return (
    <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
      <p className="text-center text-light-300 font-medium">{getProgressMessage()}</p>

      <div className="flex justify-center gap-2">
        {DAYS.map((day, index) => (
          <button
            key={day.key}
            disabled={true}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold transition-colors",
              !goals.selectedDays[index] && "border border-primary",
              goals.selectedDays[index] && !goals.completedDays[index] && "bg-primary text-white",
              goals.selectedDays[index] && goals.completedDays[index] && "bg-green-500 text-white",
            )}
          >
            {goals.completedDays[index] ? <Check className="h-5 w-5" /> : day.label}
          </button>
        ))}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild className="items-center">
          <Button variant="outline" className="rounded-full text-base px-6 pt-1.5 text-primary font-bold border-primary mx-auto block">
            Edit my goal
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white border-none shadow-lg max-w-md p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-bold text-black">Set Weekly Goals</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-light-300">Select the days you want to be active:</p>
            <div className="flex justify-center gap-2 items-center">
              {DAYS.map((day, index) => (
                <button
                  key={day.key}
                  onClick={() => toggleSelectedDay(index)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    tempSelectedDays[index]
                      ? "bg-primary text-white"
                      : "bg-light-100 text-light-300 hover:bg-light-200",
                  )}
                >
                  {day.label}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-light-300 text-light-300 hover:bg-light-100 hover:text-light-300"
              >
                Cancel
              </Button>
              <Button onClick={saveGoals} className="bg-primary hover:bg-primary/90">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
