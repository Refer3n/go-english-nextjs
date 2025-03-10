"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, BookOpen, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import api from "@/lib/api";

interface LearningStatsData {
  courseCompletion: number;
  coursesInProgress: number;
  coursesCompleted: number;
}

export default function LearningStats() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [statsData, setStatsData] = useState<LearningStatsData>({
    courseCompletion: 0,
    coursesInProgress: 0,
    coursesCompleted: 0,
  });

  useEffect(() => {
    if (!userId || !session?.user?.accessToken) return;

    api
      .get("/Progress/GetLearningStatistics", {
        params: { userId },
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      })
      .then((response) => {
        if (response.data) {
          setStatsData(response.data);
        } else {
          console.error("Invalid data format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching learning statistics:", error);
      });
  }, [userId, session?.user?.accessToken]);

  const stats = [
    {
      value: `${statsData.courseCompletion}%`,
      label: "Course Completion",
      icon: <Clock className="text-light-300" />,
    },
    {
      value: statsData.coursesInProgress.toString(),
      label: "Courses in Progress",
      icon: <BookOpen className="text-light-300" />,
    },
    {
      value: statsData.coursesCompleted.toString(),
      label: "Courses Completed",
      icon: <CheckCircle className="text-light-300" />,
    },
  ];

  return (
    <div className="w-full max-w-4xl flex flex-row gap-5">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="flex-1 bg-white rounded-2xl shadow-sm border-none"
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-light-400 p-2 rounded-md">
              {stat.icon}
            </div>
            <div>
              <p className="text-primary font-bold">{stat.value}</p>
              <p className="text-light-300 font-semibold">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
