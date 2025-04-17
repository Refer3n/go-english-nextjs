import Link from "next/link";
import type React from "react";
import StarRating from "../StarsRating";
import type { CourseDetails } from "@/types/course";
import { ShoppingCart } from "lucide-react";

type CourseCardProps = {
  course: CourseDetails;
  variant?: "default" | "shop";
};

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  variant = "default",
}) => {
  const {
    id,
    title,
    level,
    lessonsCount,
    rating,
    feedbacksNumber,
    imageUrl,
    description,
    price,
  } = course;

  const isShop = variant === "shop";

  return (
    <div
      className={`flex ${!isShop ? "flex-col-reverse" : "flex-col"} bg-light-600 rounded-2xl shadow-md ${
        isShop ? "w-full h-full" : "w-[320px] 2xl:w-[340px] h-[500px]"
      }`}
    >
      {!isShop ? (
        <>
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-primary">{title}</h3>
              <p className="text-base font-bold text-primary">Level {level}</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4">

              <p className="text-2xl text-primary font-bold self-center">
                {lessonsCount} lessons
              </p>

              <Link
                href={`/courses/${id}`}
                className="button "
              >
                View product
              </Link>

              <div className="flex items-center gap-3 self-center">
                <StarRating rating={rating} />
                <span className="text-lg text-gray-400">{feedbacksNumber}</span>
              </div>
            </div>
          </div>

          <div className="w-full flex-grow overflow-hidden rounded-t-2xl">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </>
      ) : (
        <>
          <div className="w-full overflow-hidden rounded-t-2xl">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col flex-grow p-6 space-y-4 justify-between">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-primary">{title}</h3>
              <p className="text-base font-bold text-primary">Level {level}</p>
              {description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 self-center">
              <StarRating rating={rating} />
              <span className="text-lg text-gray-400">{feedbacksNumber}</span>
            </div>
          </div>
          <div className="flex items-center justify-between w-full px-6 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">{price} €</span>
            </div>
            <button className="button !py-2 flex items-center gap-2">
              Buy <ShoppingCart size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseCard;
