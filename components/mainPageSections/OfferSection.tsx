"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import { ChevronLeft, ChevronRight, ChevronRightCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "../ui/button";

const carouselItems = [
  {
    icon: "/icons/carousel-icons/icon1",
    title1: "Real-Life Online Practice",
    title2: "Speak with Confidence",
    description:
      "From day one, you'll practice speaking English in real-life scenarios. Build your confidence.",
    imageUrl: "/images/carousel-images/image1.jpg",
    link: "link1",
  },
  {
    icon: "/icons/carousel-icons/icon2",
    title1: "Free access to Resources",
    title2: "Unlimited Learning Tools",
    description:
      "Enjoy access to our self-paced learning platform, packed with videos, exercises, and study guides. Progress on your terms with ...",
    imageUrl: "/images/carousel-images/image2.jpg",
    link: "link2",
  },
  {
    icon: "/icons/carousel-icons/icon3",
    title1: "Proven Success",
    title2: "Results That Matter",
    description:
      "With Go English ESOL School, you're not just learning English; you're investing in your future. Our team is highly qualified.",
    imageUrl: "/images/carousel-images/image3.jpg",
    link: "link3",
  },
  {
    icon: "/icons/carousel-icons/icon1",
    title1: "Real-Life Online Practice",
    title2: "Speak with Confidence",
    description:
      "From day one, you'll practice speaking English in real-life scenarios. Build your confidence.",
    imageUrl: "/images/carousel-images/image1.jpg",
    link: "link1",
  },
  {
    icon: "/icons/carousel-icons/icon2",
    title1: "Free access to Resources",
    title2: "Unlimited Learning Tools",
    description:
      "Enjoy access to our self-paced learning platform, packed with videos, exercises, and study guides. Progress on your terms with ...",
    imageUrl: "/images/carousel-images/image2.jpg",
    link: "link2",
  },
  {
    icon: "/icons/carousel-icons/icon3",
    title1: "Proven Success",
    title2: "Results That Matter",
    description:
      "With Go English ESOL School, you're not just learning English; you're investing in your future. Our team is highly qualified.",
    imageUrl: "/images/carousel-images/image3.jpg",
    link: "link3",
  },
];

export default function OfferSection() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(1);

  React.useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const newIndex = api.selectedScrollSnap() + 1;
      setCurrentIndex(newIndex === 6 ? 0 : newIndex);
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <section className="main-section-colored pb-14">
      <div className="flex flex-col gap-8 justify-center mx-[10vw]">
        <h2 className="heading text-start">
          What We are Offer
        </h2>
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            setApi={setApi}
            className="w-full"
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
          >
            <CarouselContent className="-ml-4 px-5">
              {carouselItems.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="pl-12 basis-full md:basis-1/3 h-[55vh]"
                >
                  <Card
                    className={cn(
                      "shadow-lg shadow-gray-500/50 p-0 overflow-hidden rounded-xl border-none flex flex-col h-[55vh]",
                      currentIndex === index ? "bg-primary" : "bg-light-600"
                    )}
                  >
                    <CardContent className="p-0 flex flex-col flex-grow">
                      <div className={cn("space-y-4 p-6", currentIndex === index
                                ? "text-light-100"
                                : "text-black-100")}>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              currentIndex === index
                                ? "bg-yellow"
                                : "bg-primary"
                            )}
                          >
                            <Image
                              src={
                                currentIndex === index
                                  ? `${item.icon}-blue.svg`
                                  : `${item.icon}-yellow.svg`
                              }
                              width={20}
                              height={20}
                              alt={`icon ${index + 1}`}
                            />
                          </div>
                          <h3
                            className="text-2xl font-semibold"
                          >
                            {item.title1}
                          </h3>
                        </div>
                        <h4
                          className="text-base font-medium"
                        >
                          {item.title2}
                        </h4>
                        <p
                          className="text-sm"
                        >
                          {item.description}
                        </p>
                        <Link
                          href={item.link}
                          className="link-text flex items-center !text-blue-300"
                        >
                          Learn more <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>

                      <div className="flex-grow w-full overflow-hidden rounded-b-xl">
                        <img
                          src={item.imageUrl}
                          alt={item.title1}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-20 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary text-white hover:bg-primary/90 border-none"></CarouselPrevious>
            <CarouselNext className="absolute -right-20 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary text-white hover:bg-primary/90 border-none"></CarouselNext>
          </Carousel>
        </div>
        <Link className="button self-center mt-4" href="/courses">
          Book Your Classes Today
        </Link>
      </div>
    </section>
  );
}
