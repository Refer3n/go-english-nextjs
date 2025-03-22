"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Lesson } from "@/types/course";
import { useCallback, useEffect } from "react";

interface LessonNavigationProps {
  courseId: string;
  moduleId: string;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
}

export function LessonNavigation({
  courseId,
  moduleId,
  prevLesson,
  nextLesson,
}: LessonNavigationProps) {
  const router = useRouter();

  useEffect(() => {
    if (prevLesson) {
      const prevUrl = `/dashboard/courses/${courseId}/modules/${moduleId}/lessons/${prevLesson.id}`
      router.prefetch(prevUrl)
    }

    if (nextLesson) {
      const nextUrl = `/dashboard/courses/${courseId}/modules/${moduleId}/lessons/${nextLesson.id}`
      router.prefetch(nextUrl)
    }
  }, [courseId, moduleId, nextLesson, prevLesson, router])

  const navigateToLesson = useCallback(
    (lesson: Lesson) => {
      router.push(`/dashboard/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`, { scroll: false })
    },
    [courseId, moduleId, router],
  )

  return (
    <div className="flex items-center gap-10 mr-6">
      {prevLesson ? (
        <Button
          variant="link"
          size="md"
          className="flex items-center gap-1 text-blue-600"
          onClick={() => navigateToLesson(prevLesson)}
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
          onClick={() => navigateToLesson(nextLesson)}
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
