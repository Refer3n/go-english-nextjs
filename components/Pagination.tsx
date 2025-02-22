import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage === totalPages) {
        onPageChange(1);
      } else {
        onPageChange(currentPage + 1);
      }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        className="bg-primary text-white rounded-full p-2 hover:bg-primary/80 w-10 h-10 flex items-center justify-center"
        onClick={handlePrevPage}
      >
        <ChevronLeft className="w-10 h-10" />
      </button>

      <div className="flex gap-2 mx-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index + 1 === currentPage
                ? "bg-primary"
                : "bg-gray-200 hover:bg-white/70"
            }`}
            onClick={() => handlePageClick(index + 1)}
          />
        ))}
      </div>

      <button
        className="bg-primary text-white rounded-full p-2 hover:bg-primary/80 w-10 h-10 flex items-center justify-center"
        onClick={handleNextPage}
      >
        <ChevronRight className="w-10 h-10" />
      </button>
    </div>
  );
};

export default Pagination;
