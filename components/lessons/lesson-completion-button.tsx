"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { revalidateUserCourseCache } from "@/lib/actions/cache-actions";
import { useToast } from "@/hooks/use-toast";

interface LessonCompletionButtonProps {
  lessonId: string | number;
  testId?: number;
  score?: number;
  isCompleted?: boolean;
  nextLesson?: { id: string | number } | null;
  nextModuleId?: string | number | null;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  onComplete?: () => void;
}

export function LessonCompletionButton({
  lessonId,
  testId,
  score = -1,
  isCompleted = false,
  nextLesson,
  nextModuleId,
  className = "",
  variant = "default",
  onComplete,
}: LessonCompletionButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const { toast, dismiss } = useToast();
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    if (!session?.user?.id) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (score >= 0 && testId) {
        await api.post("/Progress/CompleteTest", {
          userId: session.user.id,
          testId,
          score,
        });
      } else {
        await api.post("/Progress/CompleteLesson", {
          userId: session.user.id,
          lessonId,
        });
      }

      setIsRevalidating(true);

      const { id: toastId } = toast({
        title: "Updating Progress...",
        description: (
          <div className="flex flex-col gap-2">
            <p>Please wait while we update your course progress.</p>
            <div className="w-full bg-gray-300 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full animate-progress"></div>
            </div>
          </div>
        ),
        duration: 15000,
        className: "bg-light-100 border-gray-200 text-primary",
      })


      const courseId = params.courseId as string;

      try {
        if (courseId) {
          await revalidateUserCourseCache(courseId, session.user.id);
        }

        if (onComplete) onComplete();

        if (nextLesson && nextModuleId && courseId) {
          router.push(
            `/dashboard/courses/${courseId}/modules/${nextModuleId}/lessons/${nextLesson.id}`
          );
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to update data.");

        dismiss(toastId);

        toast({
          title: "Error",
          description: "Failed to save your progress.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to complete. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsRevalidating(false);
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return "Submitting...";
    if (isRevalidating) return "Updating...";
    if (isCompleted) return nextLesson ? "Next Lesson" : "Completed";
    return nextLesson ? "Complete & Continue" : "Mark as Complete";
  };

  const getButtonIcon = () => {
    if (isSubmitting || isRevalidating) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    return nextLesson ? (
      <ChevronRight className="h-4 w-4" />
    ) : (
      <CheckCircle className="h-4 w-4" />
    );
  };

  return (
    <>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <Button
        variant={variant}
        className={`flex items-center gap-2 ${className}`}
        onClick={handleComplete}
        disabled={
          isSubmitting || isRevalidating || (isCompleted && !nextLesson)
        }
      >
        {getButtonText()}
        {getButtonIcon()}
      </Button>
    </>
  );
}
