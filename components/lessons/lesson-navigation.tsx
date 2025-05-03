"use client"

import { useCallback } from "react"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Lesson {
  id: string
  title: string
  videoUrl: string
  isCompleted: boolean
}

interface LessonNavigationProps {
  courseId: string
  prevLesson: Lesson | null
  prevModuleId: string | number | null
  nextLesson: Lesson | null
  nextModuleId: string | number | null
}

export function LessonNavigation({
  courseId,
  prevLesson,
  prevModuleId,
  nextLesson,
  nextModuleId,
}: LessonNavigationProps) {
  const router = useRouter();

  const navigateToPrevious = useCallback(() => {
    if (prevLesson && prevModuleId) {
      router.push(`/dashboard/courses/${courseId}/modules/${prevModuleId}/lessons/${prevLesson.id}`, { scroll: false })
    }
  }, [courseId, prevLesson, prevModuleId, router])

  const navigateToNext = useCallback(() => {
    if (nextLesson && nextModuleId) {
      router.push(`/dashboard/courses/${courseId}/modules/${nextModuleId}/lessons/${nextLesson.id}`, { scroll: false })
    }
  }, [courseId, nextLesson, nextModuleId, router])

  return (
    <div className="flex items-center gap-10 mr-6">
      {prevLesson ? (
        <Button
          variant="link"
          size="md"
          className="flex items-center gap-1 text-blue-600"
          onClick={navigateToPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      ) : (
        <span className="w-[74px]\"></span>
      )}

      {nextLesson ? (
        <Button
          variant="link"
          size="md"
          className="flex items-center gap-1 text-blue-600"
          onClick={navigateToNext}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <span className="w-[50px]"></span>
      )}
    </div>
  );
}
