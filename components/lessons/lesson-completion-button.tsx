"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ChevronRight, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import type { Lesson } from "@/types/course";
import type { CourseContent } from "@/types/course";

interface LessonCompletionButtonProps {
  lessonId: string | number;
  testId?: number;
  score?: number;
  isCompleted?: boolean;
  nextLesson?: Lesson | null;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  onComplete?: () => void;
  courseContent?: CourseContent;
  updateCourseContent?: (updatedContent: CourseContent) => void;
}

export function LessonCompletionButton({
  lessonId,
  testId,
  score = -1,
  isCompleted = false,
  nextLesson,
  className = "",
  variant = "default",
  onComplete,
  courseContent,
  updateCourseContent,
}: LessonCompletionButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    if (!session?.user?.id) {
      setError("You must be logged in to complete this lesson");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (score >= 0 && testId) {
        await api.post(
          "/Progress/CompleteTest",
          {
            userId: session.user.id,
            testId: testId,
            score: score,
          },
          {
            headers: { Authorization: `Bearer ${session.user.accessToken}` },
          }
        );
      } else {
        await api.post(
          "/Progress/CompleteLesson",
          {
            userId: session.user.id,
            lessonId: lessonId,
          },
          {
            headers: { Authorization: `Bearer ${session.user.accessToken}` },
          }
        );
      }

      if (courseContent && updateCourseContent) {
        const updatedContent = updateLocalCourseContent(
          courseContent,
          lessonId.toString()
        );
        updateCourseContent(updatedContent);
      }

      if (onComplete) {
        onComplete();
      }

      if (nextLesson) {
        const courseId = params.courseId;
        const moduleId = params.moduleId;

        if (courseId && moduleId && nextLesson.id) {
          router.push(
            `/dashboard/courses/${courseId}/modules/${moduleId}/lessons/${nextLesson.id}`
          );
        } else {
          console.error("Missing navigation parameters:", {
            courseId,
            moduleId,
            lessonId: nextLesson.id,
          });
          setError("Cannot navigate to next lesson: missing parameters");
        }
      }
    } catch (err) {
      console.error("Error completing lesson/test:", err);
      setError("Failed to complete. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateLocalCourseContent = useCallback(
    (content: CourseContent, completedLessonId: string): CourseContent => {
      const updatedContent = JSON.parse(
        JSON.stringify(content)
      ) as CourseContent;

      for (const module of updatedContent.modules) {
        const lessonToUpdate = module.lessons.find(
          (lesson) => lesson.id.toString() === completedLessonId
        );

        if (lessonToUpdate) {
          lessonToUpdate.isCompleted = true;

          module.completedLessonsCount = module.lessons.filter(
            (lesson) => lesson.isCompleted
          ).length;

          module.isCompleted =
            module.completedLessonsCount === module.lessonsCount;

          updatedContent.completedModulesCount = updatedContent.modules.filter(
            (m) => m.isCompleted
          ).length;

          const totalLessons = updatedContent.modules.reduce(
            (sum, m) => sum + m.lessonsCount,
            0
          );
          const completedLessons = updatedContent.modules.reduce(
            (sum, m) => sum + m.completedLessonsCount,
            0
          );
          updatedContent.progress = Math.round(
            (completedLessons / totalLessons) * 100
          );

          break;
        }
      }

      return updatedContent;
    },
    []
  );

  const getButtonText = () => {
    if (isSubmitting) return "Submitting...";
    if (isCompleted) return nextLesson ? "Next Lesson" : "Completed";
    return nextLesson ? "Complete & Continue" : "Mark as Complete";
  };

  return (
    <>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <Button
        variant={variant}
        className={`flex items-center gap-2 ${className}`}
        onClick={handleComplete}
        disabled={isSubmitting || (isCompleted && !nextLesson)}
      >
        {getButtonText()}
        {nextLesson ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
      </Button>
    </>
  );
}
