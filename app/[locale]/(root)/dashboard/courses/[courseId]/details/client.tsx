"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "@/i18n/navigation"
import { Check, FileText, Video, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import StarRating from "@/components/StarsRating"
import type { CourseDetails } from "@/types/course"
import api from "@/lib/api"
import { useSession } from "next-auth/react"
import FeedbackCard from "@/components/feedbacks/FeedbackCard"
import Pagination from "@/components/Pagination"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

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
}

interface CourseDetailsClientProps {
  courseDetails: CourseDetails
}

export function CourseDetailsClient({ courseDetails }: CourseDetailsClientProps) {
  const t = useTranslations("CourseDetails")
  const router = useRouter()
  const { data: session } = useSession()
  const [isAddingToBasket, setIsAddingToBasket] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const REVIEWS_PER_PAGE = 3

  const {
    id,
    title,
    description,
    level,
    modulesCount,
    lessonsCount,
    rating,
    feedbacksNumber,
    videoTimeInMinutes,
    price,
  } = courseDetails

  const videoHours = Math.floor(videoTimeInMinutes / 60)

  const shortDescription = description.length > 150 ? `${description.substring(0, 150)}...` : description

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await api.get(`/Feedback/GetCourseFeedback/${id}`)
        if (response.data) {
          setFeedbacks(response.data)
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error)
      } finally {
        setIsLoadingFeedbacks(false)
      }
    }

    fetchFeedbacks()
  }, [id])

  const addToBasket = async (redirectToBasket = false) => {
    if (!session?.user?.id) {
      router.push("/log-in")
      return
    }
    const userId = session.user.id

    try {
      const url = `/Basket/Add/${id}?userId=${encodeURIComponent(userId)}`
      await api.post(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        },
      )

      if (redirectToBasket) {
        router.push("/dashboard/basket")
      } else {
        router.push("/dashboard/shop")
      }
    } catch (error) {
      console.error("Error adding to basket:", error)
    }
  }

  const handleAddToBasket = async () => {
    setIsAddingToBasket(true)
    try {
      await addToBasket(false)
    } finally {
      setIsAddingToBasket(false)
    }
  }

  const handleBuyNow = async () => {
    setIsBuyingNow(true)
    try {
      await addToBasket(true)
    } finally {
      setIsBuyingNow(false)
    }
  }

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row gap-6 mb-8 justify-between">
        <div className="md:flex-1 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg xl:h-[320px]">
                <Image
                  src={courseDetails.imageUrl || "/placeholder.svg?height=400&width=600"}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="w-auto max-w-lg">
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <p className="text-lg mb-4">{t("boostFluency", { title })}</p>

              <p className="mb-6 max-w-[480px]">{t("courseConsistsOf", { modulesCount, level })}</p>

              <h2 className="text-xl font-bold mb-4">{t("courseIncludes")}</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" />
                  <div className="flex items-center gap-2">
                    <Video className="text-primary" />
                    <span>{t("onDemandVideo", { hours: videoHours })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Check className="text-green-500" />
                  <div className="flex items-center gap-2">
                    <FileText className="text-primary" />
                    <span>{t("lessons", { count: lessonsCount })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Check className="text-green-500" />
                  <div className="flex items-center gap-2">
                    <FileText className="text-primary" />
                    <span>{t("modules", { count: modulesCount })}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">{t("description")}</h2>
                <div className="mb-2">
                  <p>{isDescriptionExpanded ? description : shortDescription}</p>
                </div>

                <Button
                  variant="link"
                  className="text-primary p-0 mb-8 flex items-center gap-1"
                  onClick={toggleDescription}
                >
                  {isDescriptionExpanded ? (
                    <>
                      {t("showLess")} <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      {t("fullCourseDescription")} <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:min-w-[260px] xl:min-w-[320px] 2xl:min-w-[400px]">
          <Card className="sticky top-6 w-full">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-end gap-3">
                <span className="text-2xl font-bold">£{price}</span>
              </div>

              <Button
                variant="outline"
                className="w-full button-bordered !font-semibold"
                onClick={handleAddToBasket}
                disabled={isAddingToBasket}
              >
                {isAddingToBasket ? t("adding") : t("addToBasket")}
              </Button>

              <Button
                variant="outline"
                className="w-full button-bordered !font-semibold"
                onClick={handleBuyNow}
                disabled={isBuyingNow}
              >
                {isBuyingNow ? t("processing") : t("buyNow")}
              </Button>

              <div className="text-center text-sm text-gray-500">
                <Link className="link-text" href="/money-return">
                  {t("moneyBackGuarantee")}
                </Link>
                <p className="font-semibold mt-1">{t("lifetimeAccess")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">{t("reviews")}</h2>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex flex-row items-center gap-2">
            <p className="text-4xl font-bold -mt-1">{rating}</p>
            <StarRating rating={rating} />
            <p className="text-sm text-gray-500 mt-1">{t("reviewCount", { count: feedbacksNumber })}</p>
          </div>
        </div>

        {isLoadingFeedbacks ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="max-w-md mx-auto w-full">
                <div className="bg-gray-300 shadow-xl rounded-2xl p-6 w-full animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 rounded-full bg-gray-200"></div>
                      ))}
                    </div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">{t("noReviews")}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 justify-beetween">
              {feedbacks.slice((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE).map((feedback) => (
                <div key={feedback.id} className="max-w-sm w-full">
                  <FeedbackCard feedback={feedback} />
                </div>
              ))}
            </div>

            {feedbacks.length > REVIEWS_PER_PAGE && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalItems={feedbacks.length}
                  itemsPerPage={REVIEWS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
