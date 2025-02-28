"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";

export default function AboutSection() {
  const stats = [
    {
      icon: "/icons/about-icons/diagram-icon.svg",
      value: "93%",
      label: "of learners achieve their goals",
    },
    {
      icon: "/icons/about-icons/book-icon.svg",
      value: "20+",
      label: "years of experience",
    },
    {
      icon: "/icons/about-icons/profile-icon.svg",
      value: "1000+",
      label: "students",
    },
  ];

  return (
    <section className="main-section h-[900px]">
      <div className="absolute inset-0">
        <div className="h-full w-1/2 bg-gray-300" />
      </div>

      <div className="container mx-auto relative h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative h-[calc(100vh-10rem)] w-[calc(100vh-10rem)]">
            <div className="absolute inset-0 rounded-full border-white border-8 bg-white">
              <div className="absolute inset-[16px] rounded-full overflow-hidden bg-white">
                <Image
                  src="/images/about-picture.jpg"
                  alt="Teacher with ABC chalkboard"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-[15%] space-y-8 pl-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
              style={{ marginLeft: `${index * 24}px` }}
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Image
                  src={stat.icon}
                  alt={stat.label}
                  width={20}
                  height={20}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{stat.value}</span>
                <span className="text-gray-600">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 right-0 bg-white p-8 w-1/2 h-1/2">
          <div className="space-y-5 text-black-100">
            <h2 className="heading">About Us</h2>
            <p>
              At{" "}
              <Link
                className="link-text !text-primary font-semibold"
                href="/get-started"
              >
                GO English
              </Link>
              , we are passionate about providing high-quality English language
              learning resources. Our mission is to help learners of all levels{" "}
              <span className="font-semibold">develop</span> their{" "}
              <span className="font-semibold">language skills</span>.
            </p>

            <h3 className="heading">Our Mission</h3>
            <p>
              Our mission is to help learners of all levels{" "}
              <span className="font-semibold">develop</span> their{" "}
              <span className="font-semibold">language skills</span>.
              <Link href="/join" className="link-text mx-1">
                Join our
              </Link>{" "}
              community today and start improving your English with us!
            </p>

            <div className="flex flex-col space-y-4">
              <Link href="/read-more" className="link-text flex items-center">
                Read more <ChevronRight className="w-4 h-4" />
              </Link>
              <Link className="button self-start" href="/courses">
                Explore our Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
