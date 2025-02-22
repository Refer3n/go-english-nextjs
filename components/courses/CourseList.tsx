"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "./CourseCard"; 
import Pagination from "../Pagination"; // Import the Pagination component

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  price: number;
  lessonsCount: number;
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
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/Course/GetCoursesInfo`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

        setCourses(paginatedData);
        setTotalCourses(data.length);
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
    <div className="flex flex-col gap-8 justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedCourses.map((course) => (
          <CourseCard
            key={course.id}
            image="/images/default.jpg" 
            name={course.title} 
            level={course.level}
            lessons={course.lessonsCount}
            rating={4.4} 
            feedbackCount={100} 
            onViewLink={`/course/${course.id}`}
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
