"use client";

import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard"; 
import Pagination from "../Pagination"; // Import the Pagination component
import fetchData from "@/lib/actions/fetchData";

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  price: number;
  lessonsCount: number;
  modulesCount: number;
  rating: number;
  feedbacksNumber: number;
  estimatedTimeInMinutes: number;
}

interface CourseListProps {
  itemsPerPage: number;
  sortBy: string;
}

const CourseList: React.FC<CourseListProps> = ({ itemsPerPage, sortBy }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses: Course[] = await fetchData<Course>("Course/GetCoursesInfo", "en");

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedData = courses.slice(startIndex, startIndex + itemsPerPage);

        setCourses(paginatedData);
        setTotalCourses(courses.length);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [currentPage, itemsPerPage]);

  const sortedCourses = courses.sort((a, b) => {
    if (sortBy === "price") {
      return a.price - b.price;
    }
    return 0;
  });

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-row justify-between items-center mb-10 w-full">
        {sortedCourses.map((course) => (
          <CourseCard
          key={course.id} course={course}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalCourses}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CourseList;
