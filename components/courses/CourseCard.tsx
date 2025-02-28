import Link from "next/link";
import type React from "react";
import StarRating from "../StarsRating";

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

type CourseCardProps = {
 course: Course;
};

const CourseCard: React.FC<CourseCardProps> = ({
  course
}) => {
  const {id, title, level, lessonsCount, rating, feedbacksNumber} = course;

  return (
    <div className="flex flex-col bg-light-600 rounded-2xl shadow-md w-[340px] h-[500px]">
      <div className="w-full overflow-hidden rounded-t-2xl">
        <img src="/images/default.jpg" alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-between flex-grow p-6 space-y-4 h-1/2">
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-primary">{title}</h3>
          <p className="text-base font-bold text-primary">Level {level}</p>
        </div>
        <p className="text-2xl text-primary font-bold self-center">{lessonsCount} lessons</p>
        <Link href={`/courses/${id}`} className="button self-center">
          View product
        </Link>
        <div className="flex items-center gap-3 self-center">
          <StarRating rating={rating} />
          <span className="text-lg text-gray-400">{feedbacksNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
