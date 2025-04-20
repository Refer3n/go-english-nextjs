"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import StarRating from "@/components/StarsRating";
import type { CourseDetails } from "@/types/course";
import { removeFromBasket } from "@/lib/actions/basket-actions";

interface BasketClientProps {
  basketItems: CourseDetails[];
  error: string | null;
  userId: string;
  accessToken: string;
}

export function BasketClient({
  basketItems: initialBasketItems,
  error: initialError,
  userId,
}: BasketClientProps) {
  const router = useRouter();
  const [basketItems, setBasketItems] =
    useState<CourseDetails[]>(initialBasketItems);
  const [error, setError] = useState<string | null>(initialError);
  const [promoCode, setPromoCode] = useState("");
  const [isRemovingItem, setIsRemovingItem] = useState<number | null>(null);

  const handleRemoveItem = async (courseId: number) => {
    setIsRemovingItem(courseId);

    try {
      console.log(courseId);
      console.log(userId);
      const result = await removeFromBasket(courseId, userId);

      if (result.success) {
        setBasketItems((prevItems) =>
          prevItems.filter((item) => item.id !== courseId)
        );
      } else {
        setError(
          result.error || "Failed to remove item from basket. Please try again."
        );
      }
    } catch (error) {
      console.error("Error removing item from basket:", error);
      setError("Failed to remove item from basket. Please try again.");
    } finally {
      setIsRemovingItem(null);
    }
  };

  const handleApplyPromoCode = () => {
    console.log("Apply promo code:", promoCode);
  };

  const handleCheckout = () => {
    router.push("/dashboard/checkout");
  };

  const totalPrice = basketItems.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}.${mins > 0 ? mins : 0} total hours`;
  };

  if (basketItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] align-content-center pt-[8%]">
        <div className="mb-6">
          <Image
            src="/icons/shopping-cart.svg"
            alt="Empty shopping cart"
            width={350}
            height={350}
          />
        </div>

        <p className="text-center font-bold mb-6">
          Your basket is currently empty. Keep shopping to find a course!
        </p>

        <Link href="/dashboard/shop">
          <Button className="button hover:bg-yellow">Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col xl:flex-row gap-8">
      <div className="flex flex-col gap-4 flex-1">
        <h1 className="text-3xl font-bold">Basket</h1>
        <p className="text-primary text-xl font-bold">
          {basketItems.length} {basketItems.length === 1 ? "course" : "courses"}{" "}
          in your basket
        </p>
        <div className="w-full pr-[3vw] space-y-6">
          {basketItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg"
            >
              <div className="sm:w-[180px] h-[180px] relative flex-shrink-0">
                <Image
                  src={item.imageUrl || "/placeholder.svg?height=120&width=180"}
                  alt={item.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {item.title}
                </h3>
                <p className="text-base text-primary font-bold mb-4">
                  Level {item.level}
                </p>
                <p className="text-lg font-semibold mb-6">
                  {item.lessonsCount}{" "}
                  {item.lessonsCount === 1 ? "lesson" : "lessons"}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={item.rating} />
                  <span className="text-base font-semibold">
                    {item.rating} ({item.feedbacksNumber} ratings)
                  </span>
                </div>
                <p className="text-base font-semibold  text-light-300">
                  {formatTime(item.estimatedTimeInMinutes)}
                </p>
              </div>
              <div className="flex sm:flex-col justify-between items-end gap-2 mt-2 sm:mt-0 pb-6">
                <div className="text-xl font-bold pr-8">£{item.price}</div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="flex items-center gap-1 text-base text-light-300 hover:text-red-500"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isRemovingItem === item.id}
                  >
                    <Trash2 size={24} />
                    {isRemovingItem === item.id ? "Removing..." : "Remove"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full lg:w-[350px] flex-shrink-0">
        <div className="sticky top-6">
          <Card className="w-full bg-white">
            <CardContent className="p-6 space-y-4">
              <p className="text-base font-normal">Apply a promo code</p>
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-3/4 pr-[40px] rounded-xl text-light-300 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  onClick={handleApplyPromoCode}
                  className="absolute top-1/2 right-0 -translate-y-1/2 button !text-white !font-normal !text-lg !bg-primary"
                >
                  Apply
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Course(s)</span>
                  <span>£{totalPrice}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>£{totalPrice}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full button-bordered !font-semibold"
                onClick={handleCheckout}
              >
                Confirm and pay
              </Button>

              <div className="text-center text-sm text-gray-500">
                <Link className="link-text" href="/money-return">
                  30-Day Money-Back Guarantee
                </Link>
                <p className="font-semibold mt-1">Full Lifetime Access</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-500 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
