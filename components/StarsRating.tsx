import { Star } from "lucide-react";
import React from "react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star
          key={`full-${index}`}
          className="w-5 h-5 text-yellow-500 fill-current"
        />
      ))}

      {hasHalfStar && (
        <span className="relative w-5 h-5">
          <Star className="absolute text-gray-200 w-5 h-5 fill-current" />
          <Star
            className="absolute text-yellow-500 w-5 h-5 fill-current"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </span>
      )}

      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star
          key={`empty-${index}`}
          className="w-5 h-5 text-gray-200 fill-current"
        />
      ))}
    </div>
  );
};

export default StarRating;
