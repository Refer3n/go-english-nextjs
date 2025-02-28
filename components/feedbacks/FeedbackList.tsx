"use client";

import React, { useState, useEffect } from "react";
import FeedbackCard from "./FeedbackCard";
import fetchData from "@/lib/actions/fetchData";

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
        const feedbacks: Feedback[] = await fetchData<Feedback>(
          "Feedback/GetFeedbacks",
          "en"
        );

        console.log(feedbacks);

        const sortedFeedbacks = feedbacks
          .sort((a, b) =>
            b.date && a.date
              ? new Date(b.date).getTime() - new Date(a.date).getTime()
              : 0
          )
          .slice(0, 4);

        setFeedbacks(sortedFeedbacks);
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="grid w-full gap-6 px-4 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 justify-items-center">
      {feedbacks.map((feedback) => (
        <FeedbackCard key={feedback.id} feedback={feedback} />
      ))}
    </div>
  );
};

export default FeedbackList;
