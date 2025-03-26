"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import UserCoursesList from "@/components/courses/user-courses-list";
import CourseList from "@/components/courses/CourseList";

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = searchParams.get("tab") || "in-progress";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    router.push(`/dashboard/courses?tab=${activeTab}`, { scroll: false });
  }, [activeTab, router]);

  const breadcrumbItems = [
    { label: "Profile", href: "/dashboard" },
    { label: "Courses", isCurrentPage: true },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="w-full px-[2vw] py-8 bg-light-400 pt-6">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="flex flex-col gap-8 mt-6">
        <div>
          <h1 className="text-4xl font-bold mb-8">Courses</h1>

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="mb-10"
          >
            <TabsList>
              <TabsTrigger
                className="button-option !px-8 !py-3 mr-6"
                value="in-progress"
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger
                className="button-option !px-8 !py-3 mr-6"
                value="completed"
              >
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <UserCoursesList status={activeTab} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Courses suggested for you</h2>
          <CourseList itemsPerPage={4} />
        </div>
      </div>
    </div>
  );
}
