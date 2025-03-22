import { auth } from "@/auth";
import { fetchCourseContent } from "@/lib/course-utils";
import { LessonClient } from "./client";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { notFound } from "next/navigation";
import { LessonNavigation } from "@/components/lessons/lesson-navigation";
import { unstable_cache } from "next/cache";

const getCachedCourseContent = unstable_cache(
  async (courseId: string, userId: string, accessToken: string) => {
    return fetchCourseContent(courseId, userId, accessToken);
  },
  ["course-content"],
  { revalidate: 60 }
);

export default async function LessonPage({
  params,
}: {
  params: { courseId: string; moduleId: string; lessonId: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const { courseId, moduleId, lessonId } = resolvedParams;

  const session = await auth();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const userId = session.user.id;

  const courseContent = await getCachedCourseContent(
    courseId,
    userId,
    session.user.accessToken
  );

  const currentModule = courseContent.modules.find(
    (module) => module.id.toString() === moduleId
  );

  if (!currentModule) {
    return notFound();
  }

  const currentLesson = currentModule.lessons.find(
    (lesson) => lesson.id.toString() === lessonId
  );

  if (!currentLesson) {
    return notFound();
  }

  const currentLessonIndex = currentModule.lessons.findIndex(
    (lesson) => lesson.id.toString() === lessonId
  );

  const prevLesson =
    currentLessonIndex > 0
      ? currentModule.lessons[currentLessonIndex - 1]
      : null;

  const nextLesson =
    currentLessonIndex < currentModule.lessons.length - 1
      ? currentModule.lessons[currentLessonIndex + 1]
      : null;

  const completedLessons = currentModule.lessons.filter(
    (lesson) => lesson.isCompleted
  ).length;
  const moduleProgress = Math.round(
    (completedLessons / currentModule.lessonsCount) * 100
  );

  const breadcrumbItems = [
    { label: "Profile", href: "/dashboard" },
    { label: "Courses", href: "/dashboard/courses" },
    {
      label: courseContent.title || "Course",
      href: `/dashboard/courses/${courseId}/about`,
    },
    {
      label: currentModule.name,
      href: `/dashboard/courses/${courseId}/modules/${moduleId}`,
    },
    { label: currentLesson.title, isCurrentPage: true },
  ];

  return (
    <div className="px-[2vw] py-6">
      <div className="flex justify-between items-center mb-6">
        <BreadcrumbNav items={breadcrumbItems} />
        <LessonNavigation
          courseId={courseId}
          moduleId={moduleId}
          prevLesson={prevLesson}
          nextLesson={nextLesson}
        />
      </div>

      <LessonClient
        courseId={courseId}
        moduleId={moduleId}
        lessonId={lessonId}
        lesson={currentLesson}
        module={currentModule}
        moduleProgress={moduleProgress}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        courseContent={courseContent}
      />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { courseId: string; moduleId: string; lessonId: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const { courseId, moduleId, lessonId } = resolvedParams;

  const session = await auth();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const userId = session.user.id;

  try {
    const courseContent = await getCachedCourseContent(
      courseId,
      userId,
      session.user.accessToken
    );
    const module = courseContent.modules.find(
      (m) => m.id.toString() === moduleId
    );
    const lesson = module?.lessons.find((l) => l.id.toString() === lessonId);

    if (!lesson) {
      return {
        title: "Lesson Not Found",
      };
    }

    return {
      title: `${lesson.title} | ${courseContent.title}`,
      description: lesson.description,
    };
  } catch (error) {
    return {
      title: "Lesson",
    };
  }
}
