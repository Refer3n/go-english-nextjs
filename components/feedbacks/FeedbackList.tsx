"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import FeedbackCard from "./FeedbackCard";

interface Feedback {
  id: number;
  courseId: number;
  rating: number;
  comments: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  date?: string;
}

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/Feedback/GetFeedbacks`;
        const response = await axios.get(apiUrl);
        const data: Feedback[] = response.data;

        const sortedFeedbacks = data
          .sort((a, b) => (b.date && a.date ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0))
          .slice(0, 4);

        setFeedbacks(sortedFeedbacks);
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-between mx-auto items-center w-full">
    {feedbacks.map((feedback) => (
      <FeedbackCard key={feedback.id} feedback={feedback} />
    ))}
  </div>
  
  );
};

export default FeedbackList;
