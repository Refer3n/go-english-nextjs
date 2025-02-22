"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import StarRating from "../StarsRating"

interface User {
  id: number
  firstName: string
  lastName: string
  avatarUrl: string | null
}

interface Feedback {
  id: number
  courseId: number
  rating: number
  comments: string
  user: User
  date?: string
}

interface FeedbackCardProps {
  feedback: Feedback
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  const { rating, comments, user, date } = feedback
  const [expanded, setExpanded] = useState(false)
  const truncatedComments = comments.length > 100 ? `${comments.slice(0, 100)}...` : comments
  const formattedDate = date ? new Date(date).toLocaleDateString() : "29.11.2024"

  return (
    <div className="relative bg-gray-300 shadow-xl rounded-2xl p-6 w-full max-w-lg">
      <div className="flex items-center justify-between mb-4">
        <StarRating rating={rating} />
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 text-sm leading-relaxed">
          {expanded ? comments : truncatedComments}
          {comments.length > 100 && (
            <button
              className="text-primary font-medium ml-1 hover:underline focus:outline-none"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl || "/placeholder.svg"}
              alt={`${user.firstName} ${user.lastName}`}
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-lg">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-800">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-gray-500 text-xs">Verified Reviewer</p>
        </div>
      </div>
    </div>
  )
}

export default FeedbackCard

