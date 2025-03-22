"use client";

import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { VideoPlayer } from "@/components/lessons/video-player";
import { TestQuestions } from "@/components/lessons/test-questions";
import { CourseSidebar } from "@/components/lessons/course-sidebar";
import { useEffect, useState, useCallback, useTransition } from "react";
import type { CourseContent, Module, Lesson } from "@/types/course";
import { LessonCompletionButton } from "@/components/lessons/lesson-completion-button";

interface LessonClientProps {
  courseId: string;
  moduleId: string;
  lessonId: string;
  lesson: Lesson;
  module: Module;
  moduleProgress: number;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  courseContent: CourseContent;
}

export function LessonClient({
  courseId,
  moduleId,
  lessonId,
  lesson,
  module,
  moduleProgress,
  prevLesson,
  nextLesson,
  courseContent: initialCourseContent,
}: LessonClientProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [testScore, setTestScore] = useState<number>(-1);
  const hasVideoAndTest = lesson.lessonType === "VideoWithTest";

  const [courseContent, setCourseContent] =
    useState<CourseContent>(initialCourseContent);

  const updateCourseContent = useCallback((updatedContent: CourseContent) => {
    setCourseContent(updatedContent);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navigateToLesson = useCallback(
    (lesson: Lesson) => {
      setIsLoading(true);
      startTransition(() => {
        router.push(
          `/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`,
          { scroll: false }
        );
      });
    },
    [courseId, moduleId, router]
  );

  useEffect(() => {
    setIsLoading(false);
  }, [lessonId]);

  const completedModulesCount = courseContent.modules.filter(
    (mod) => mod.isCompleted
  ).length;
  const totalModules = courseContent.modules.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      {(isPending || isLoading) && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <div className="animate-pulse text-primary font-medium">
            Loading...
          </div>
        </div>
      )}

      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-4">
          Module {module.order}: {lesson.order}. {lesson.title}
        </h1>

        <div className="mb-4">
          <p className="text-2xl font-bold mb-4">{lesson.description}</p>
          <span className="text-sm text-light-300 font-semibold">
            {moduleProgress}% complete {completedModulesCount}/{totalModules}{" "}
            Module
          </span>
          <div className="flex items-center mt-2 w-1/2">
            <Progress
              value={moduleProgress}
              className="flex-1 h-0.5 bg-gray-400"
            />
          </div>
        </div>

        {isClient &&
          (lesson.lessonType === "Video" ||
            lesson.lessonType === "VideoWithTest") &&
          lesson.video && <VideoPlayer video={lesson.video} />}

        {isClient &&
          (lesson.lessonType === "Test" ||
            lesson.lessonType === "VideoWithTest") &&
          lesson.test && (
            <TestQuestions
              test={lesson.test}
              lessonType={lesson.lessonType}
              lessonId={lessonId}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onNavigate={navigateToLesson}
              onScoreChange={setTestScore}
              hideSubmitButton={hasVideoAndTest}
            />
          )}

        {hasVideoAndTest && testScore >= 0 && (
          <div className="mt-8 flex justify-end">
            <LessonCompletionButton
              lessonId={lessonId}
              testId={lesson.test?.id}
              score={testScore}
              isCompleted={lesson.isCompleted}
              nextLesson={nextLesson}
              className="bg-primary hover:bg-primary/90 text-white"
              courseContent={courseContent}
              updateCourseContent={updateCourseContent}
            />
          </div>
        )}

        {lesson.lessonType === "Video" && (
          <div className="mt-8 flex justify-end">
            <LessonCompletionButton
              lessonId={lessonId}
              isCompleted={lesson.isCompleted}
              nextLesson={nextLesson}
              className="bg-primary hover:bg-primary/90 text-white"
              courseContent={courseContent}
              updateCourseContent={updateCourseContent}
            />
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <CourseSidebar
          courseContent={courseContent}
          courseId={courseId}
          currentModuleId={moduleId}
          currentLessonId={lessonId}
        />
      </div>
    </div>
  );
}
