"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import Autoplay from "embla-carousel-autoplay"
import { useTranslations } from "next-intl"

export default function OfferSection() {
  const t = useTranslations("HomePage.OfferSection")
  const [api, setApi] = React.useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = React.useState(1)

  const carouselItems = [
    {
      icon: "/icons/carousel-icons/icon1",
      title1: t("carousel.item1.title1"),
      title2: t("carousel.item1.title2"),
      description: t("carousel.item1.description"),
      imageUrl: "/images/carousel-images/image1.jpg",
      link: "link1",
    },
    {
      icon: "/icons/carousel-icons/icon2",
      title1: t("carousel.item2.title1"),
      title2: t("carousel.item2.title2"),
      description: t("carousel.item2.description"),
      imageUrl: "/images/carousel-images/image2.jpg",
      link: "link2",
    },
    {
      icon: "/icons/carousel-icons/icon3",
      title1: t("carousel.item3.title1"),
      title2: t("carousel.item3.title2"),
      description: t("carousel.item3.description"),
      imageUrl: "/images/carousel-images/image3.jpg",
      link: "link3",
    },
    {
      icon: "/icons/carousel-icons/icon1",
      title1: t("carousel.item1.title1"),
      title2: t("carousel.item1.title2"),
      description: t("carousel.item1.description"),
      imageUrl: "/images/carousel-images/image1.jpg",
      link: "link1",
    },
    {
      icon: "/icons/carousel-icons/icon2",
      title1: t("carousel.item2.title1"),
      title2: t("carousel.item2.title2"),
      description: t("carousel.item2.description"),
      imageUrl: "/images/carousel-images/image2.jpg",
      link: "link2",
    },
    {
      icon: "/icons/carousel-icons/icon3",
      title1: t("carousel.item3.title1"),
      title2: t("carousel.item3.title2"),
      description: t("carousel.item3.description"),
      imageUrl: "/images/carousel-images/image3.jpg",
      link: "link3",
    },
  ]

  React.useEffect(() => {
    if (!api) return

    const handleSelect = () => {
      const newIndex = api.selectedScrollSnap() + 1
      setCurrentIndex(newIndex === 6 ? 0 : newIndex)
    }

    api.on("select", handleSelect)

    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  return (
    <section className="main-section-colored pb-14">
      <div className="flex flex-col gap-8 justify-center mx-[10vw]">
        <h2 className="heading text-start">{t("title")}</h2>
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
                <CarouselItem key={index} className="pl-12 basis-full md:basis-1/3 h-[65vh] 2xl:h-[55vh]">
                  <Card
                    className={cn(
                      "shadow-lg shadow-gray-500/50 p-0 overflow-hidden rounded-xl border-none flex flex-col h-[65vh] 2xl:h-[55vh]",
                      currentIndex === index ? "bg-primary" : "bg-light-600",
                    )}
                  >
                    <CardContent className="p-0 flex flex-col flex-grow">
                      <div
                        className={cn("space-y-4 p-6", currentIndex === index ? "text-light-100" : "text-black-100")}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              currentIndex === index ? "bg-yellow" : "bg-primary",
                            )}
                          >
                            <Image
                              src={currentIndex === index ? `${item.icon}-blue.svg` : `${item.icon}-yellow.svg`}
                              width={20}
                              height={20}
                              alt={`icon ${index + 1}`}
                            />
                          </div>
                          <h3 className="text-2xl font-semibold">{item.title1}</h3>
                        </div>
                        <h4 className="text-base font-medium">{item.title2}</h4>
                        <p className="text-sm">{item.description}</p>
                        <Link href={item.link} className="link-text flex items-center !text-blue-300">
                          {t("learnMore")} <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>

                      <div className="flex-grow w-full overflow-hidden rounded-b-xl">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
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
          {t("ctaButton")}
        </Link>
      </div>
    </section>
  )
}
