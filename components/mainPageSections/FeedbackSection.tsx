"use client";

import Link from "next/link";
import FeedbackList from "../feedbacks/FeedbackList";


export default function FeedBackSection() {
  return (
    <section className="main-section !mb-0">
      <div className="flex flex-col mx-[10vw]">
        <h2 className="heading mb-10">Be Inspired</h2>
        <FeedbackList></FeedbackList>
        <div className="flex flex-col items-center mt-20 gap-6">
          <p className="text-3xl text-primary font-semibold">
          Your Voice, Your Power – {" "} <Link className="link-text" href="/get-started">Go English</Link>
          </p>
        <Link className="button" href="/courses">Take the First Step Today!</Link>
        </div>
      </div>
    </section>
  );
}