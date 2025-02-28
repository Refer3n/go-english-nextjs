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
    <div className="flex items-center">
      {Array.from({ length: fullStars }).map((_, index) => (
        <span key={`full-${index}`} className="text-2xl text-yellow-500">
          ★
        </span>
      ))}

      {hasHalfStar && (
        <span className="relative text-2xl text-yellow-500">
          <span className="absolute overflow-hidden w-[50%] left-0">
            ★
          </span>
          <span className="text-gray-200">★</span>
        </span>
      )}

      {Array.from({ length: emptyStars }).map((_, index) => (
        <span key={`empty-${index}`} className="text-2xl text-gray-200">
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
