"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, MoreVertical } from "lucide-react";
import Link from "next/link";
import { fetchUserCourses } from "@/lib/course-utils";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  lastActive?: string;
  level: string;
}

interface UserCourseListProps {
  status: string;
}

export default function UserCourseList({ status }: UserCourseListProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !session?.user?.accessToken) return;

    setIsLoading(true);
    setError(null);

    fetchUserCourses(userId, session.user.accessToken)
      .then((data) => {
        setCourses(data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user courses:", err);
        setError(err.message || "Failed to fetch user courses");
        setCourses([]); 
        setIsLoading(false);
      });
  }, [userId, session?.user?.accessToken]);

  const filteredCourses = courses.filter((course) => {
    if (status === "in-progress")
      return course.progress >= 0 && course.progress < 100;
    if (status === "completed") return course.progress === 100;
    return false; 
  });

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl p-6 h-[480px] overflow-hidden shadow-none border-none">
        <div className="space-y-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center gap-6 animate-pulse">
              <div className="w-[180px] h-[120px] bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white rounded-xl p-6 h-[520px] overflow-hidden shadow-none border-none">
        <div className="flex items-center justify-center h-full text-red-500">
          {error}
        </div>
      </Card>
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <Card className="bg-white rounded-xl p-6 h-[520px] overflow-hidden shadow-none border-none">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <BookOpen className="h-12 w-12 text-light-300 mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">
            No courses found
          </h3>
          <p className="text-light-300">
            {status === "in-progress"
              ? "You don't have any courses in progress."
              : status === "completed"
                ? "You haven't completed any courses yet."
                : "You don't have any courses in your wishlist."}{" "}
            <Link href="/courses" className="link-text">
              Start your learning journey today!
            </Link>
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl p-6 h-[520px] overflow-hidden shadow-none border-none">
      <div className="h-full overflow-y-auto space-y-6 items-center">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="flex items-start gap-6 ml-4 mr-8 pb-6 border-b border-gray-100 last:border-0 last:pb-0"
          >
            <div className="relative overflow-hidden flex-shrink-0">
              <Image
                src={course.thumbnail || "/images/default.jpg"}
                alt={course.title}
                width={200} 
                height={130}
                className="object-cover rounded-lg"
              />
            </div>

            <div className="flex-1 min-w-0 w-[50%]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-black">
                    {course.title}
                  </h3>
                  <p className="text-sm text-light-300 text-pretty max-w-md">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 w-[55%]">
                <div className="bg-light-100 px-2 py-0.5 text-sm text-light-300 font-medium">
                  {course.level}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <Progress
                    value={course.progress}
                    className="flex-1 h-2 bg-light-100"
                  />
                  <div className="whitespace-nowrap">
                    <span className="text-light-300 text-sm">
                      {course.progress}%
                    </span>
                    <span className="text-light-300 text-sm ml-1">
                      Complete
                    </span>
                  </div>
                </div>
              </div>

              {course.lastActive && (
                <div className="text-light-300 text-xs mt-2">
                  Last active: {course.lastActive}
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 my-auto">
              <Link href={`/dashboard/courses/${course.id}/about?status=${status}`}>
                <button className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary/90">
                  Go to the course
                </button>
              </Link>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
