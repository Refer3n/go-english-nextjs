"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  lastActive?: string;
  level: string;
}

export default function UserCourses() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !session?.user?.accessToken) return;

    setIsLoading(true);
    setError(null);

    api
      .get("/Course/GetUserCourses", {
        params: { userId },
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          console.error("Invalid data format:", response.data);
          setError("Invalid data format received from the server");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user courses:", error);
        setError("Failed to fetch user courses");
        setIsLoading(false);
      });
  }, [userId, session?.user?.accessToken]);

  if (isLoading) {
    return (
      <Card className="user-courses-card">
        <div className="space-y-4">
          {[1, 2].map((index) => (
            <div key={index} className="flex items-center gap-4 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="user-courses-card">
        <div className="flex items-center justify-center h-full text-red-500">
          {error}
        </div>
      </Card>
    );
  }

  if (courses.length === 0) {
    return (
      <Card className="user-courses-card">
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <BookOpen className="h-12 w-12 text-light-300 mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">
            No courses found
          </h3>
          <p className="text-light-300">
            You haven't enrolled in any courses yet.{" "}
            <Link href="/dashboard/shop" className="link-text">
              Start your learning journey today!
            </Link>
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="user-courses-card">
      <div className="h-full overflow-auto space-y-6 pr-4">
        {courses.map((course, index) => (
          <div key={course.id} className="flex items-start gap-4">
            <div className="relative overflow-hidden flex-shrink-0 items-center">
              <Image
                src={course.thumbnail || "/images/default.jpg"}
                alt={course.title}
                width={120}
                height={120}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="font-bold text-black truncate">{course.title}</h3>
              <p className="text-sm text-light-300">{course.description}</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-3">
                  <div className="bg-light-100 px-2 py-0.5 text-sm text-light-300 font-medium">
                    {course.level}
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <Progress
                      value={course.progress}
                      className="flex-1 h-2 bg-light-100"
                    />
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <span className="text-light-300">{course.progress}%</span>
                      <span className="text-light-300">Complete</span>
                    </div>
                  </div>
                </div>
                {course.lastActive && (
                  <div className="text-light-300 text-xs">
                    Last active: {course.lastActive}
                  </div>
                )}
              </div>
              <Link href={`/dashboard/courses/${course.id}/about`}>
                <button className="button-bordered !text-sm mt-3">
                  Continue Learning
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
