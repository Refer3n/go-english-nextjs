"use client";

import { useRouter } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle,
  FileText,
  BookOpen,
  HelpCircle,
  Play,
} from "lucide-react";
import type { CourseContent, Lesson } from "@/types/course";
import { useEffect, useState } from "react";

interface CourseSidebarProps {
  courseContent: CourseContent;
  courseId: string;
  currentModuleId: string;
  currentLessonId: string;
}

export function CourseSidebar({
  courseContent,
  courseId,
  currentModuleId,
  currentLessonId,
}: CourseSidebarProps) {
  const router = useRouter();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setExpandedModules([currentModuleId]);
    setIsClient(true);
  }, [currentModuleId]);

  const navigateToLesson = (lesson: Lesson, moduleId: number) => {
    router.push(`/dashboard/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`, {
        scroll: false
      })
  };

  const handleAccordionChange = (value: string[]) => {
    setExpandedModules(value);
  };

  if (!isClient) {
    return (
      <Card className="bg-white rounded-lg shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-500">
            <h2 className="text-lg font-semibold">Course content</h2>
          </div>
          <div className="p-4">Loading course content...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-300 rounded-lg shadow-none border-none p-3 py  -5">
      <CardContent className="p-0">
        <div className="w-full bg-white p-4 border-b border-gray-500">
          <h2 className="text-2xl font-bold">Course content</h2>
        </div>

        <Accordion
          type="multiple"
          value={expandedModules}
          onValueChange={handleAccordionChange}
          className="w-full"
        >
          {courseContent.modules.map((mod) => {
            const moduleLessonsCompleted = mod.lessons.filter(
              (l) => l.isCompleted
            ).length;

            return (
              <AccordionItem
                key={mod.id}
                value={mod.id.toString()}
                className="border-b border-gray-500 px-0"
              >
                <AccordionTrigger
                  className="hover:no-underline px-4 py-3 bg-gray-300"
                  data-state={
                    expandedModules.includes(mod.id.toString())
                      ? "open"
                      : "closed"
                  }
                >
                  <div className="flex flex-col items-start text-left w-full">
                    <div className="font-bold text-lg">
                      Module {mod.order}: {mod.name}
                    </div>
                    <div className="text-sm text-light-300 flex items-center mt-1">
                      <span>
                        {moduleLessonsCompleted}/{mod.lessonsCount}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{mod.estimatedTimeInMinutes} min</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0 bg-white border-t border-gray-500">
                  <div className="space-y-0">
                    {mod.lessons.map((les) => (
                      <div
                        key={les.id}
                        className={`flex items-start p-3 cursor-pointer hover:bg-blue-100/30 transition-colors ${
                          les.id.toString() === currentLessonId
                            ? "bg-blue-100/30"
                            : ""
                        }`}
                        onClick={() => navigateToLesson(les, mod.id)}
                      >
                        <div className="mr-3 mt-1">
                          {les.isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-normal max-w-sm text-pretty">
                            {les.order}. {les.title}
                          </div>
                          <div className="flex items-center text-sm text-light-300 mt-2">
                            {les.lessonType === "Test" ? (
                              <HelpCircle className="h-4 w-4 mr-3 text-primary" />
                            ) : les.lessonType === "Video" ? (
                              <Play className="h-4 w-4 mr-3 text-primary" />
                            ) : les.lessonType === "VideoWithTest" ? (
                              <BookOpen className="h-4 w-4 mr-3 text-primary" />
                            ) : (
                              <FileText className="h-4 w-4 mr-3 text-primary" />
                            )}
                            <span>{les.estimatedTimeInMinutes} min</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
