"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";// Import the Pagination component
import Pagination from "../Pagination";

const slides = [
  {
    image: "/images/bridge.png",
    alt: "Tower Bridge in London",
  },
  {
    image: "/images/big-ben.jpg",
    alt: "Big Ben in London",
  },
  {
    image: "/images/london-eye.jpg",
    alt: "London Eye at sunset",
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="main-section h-[calc(100vh-11rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] h-full">
      <div className="relative flex flex-col justify-center items-start bg-primary h-full gap-6 px-8 lg:px-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Master English,
            <br />
            Transform Your Future!
          </h1>
          <p className="text-light-500 text-xl mb-8 max-w-3xl font-medium">
            Join our expert-led English courses and unlock global opportunities
            whether you're aiming to excel in your career, ace exams, or travel
            the world confidently.
          </p>
          <div>
            <Link
              href="/get-started"
              className="button !bg-primary !border !border-light-100 !text-light-100"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="relative h-[400px] lg:h-full">
          <div className="absolute inset-0 transition-opacity duration-500">
            <Image
              src={slides[currentIndex].image}
              alt={slides[currentIndex].alt}
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
            <Pagination
              currentPage={currentIndex + 1}
              totalItems={slides.length}
              itemsPerPage={1} 
              onPageChange={(page) => goToSlide(page - 1)} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
