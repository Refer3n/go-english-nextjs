"use client";

import CourseList from "../courses/CourseList";

export default function CourseSection() {
  return (
    <section className="main-section-colored">
      <div className="flex flex-col mx-[10vw]">
        <h2 className="heading mb-10">Our popular courses</h2>
        <CourseList itemsPerPage={4} sortBy="price" />
      </div>
    </section>
  );
}

