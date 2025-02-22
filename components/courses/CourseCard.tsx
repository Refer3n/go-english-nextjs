import Link from "next/link";
import type React from "react";
import StarRating from "../StarsRating";

type CourseCardProps = {
  image: string;
  name: string;
  level: string;
  lessons: number;
  rating: number;
  feedbackCount: number;
  onViewLink: string;
};

const CourseCard: React.FC<CourseCardProps> = ({
  image,
  name,
  level,
  lessons,
  rating,
  feedbackCount,
  onViewLink,
}) => {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md w-[400px] h-[55vh]">
      <div className="w-full h-[300px] overflow-hidden rounded-t-2xl">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-between flex-grow p-6 space-y-4">
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-primary">{name}</h3>
          <p className="text-base font-bold text-primary">Level {level}</p>
        </div>
        <p className="text-2xl text-primary font-bold self-center">{lessons} lessons</p>
        <Link href={onViewLink} className="button self-center">
          View product
        </Link>
        <div className="flex items-center gap-3 self-center">
          <StarRating rating={rating} />
          <span className="text-lg text-gray-400">{feedbackCount}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
