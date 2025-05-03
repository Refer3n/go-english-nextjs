"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AboutSection from "@/components/mainPageSections/AboutSection";
import BlogSection from "@/components/mainPageSections/BlogSection";
import CourseSection from "@/components/mainPageSections/CourseSection";
import FeedBackSection from "@/components/mainPageSections/FeedbackSection";
import HeroSection from "@/components/mainPageSections/HeroSection";
import OfferSection from "@/components/mainPageSections/OfferSection";

const Home = () => {
  return (
    <div>
      <Header></Header>
      <HeroSection></HeroSection>
      <AboutSection></AboutSection>
      <OfferSection></OfferSection>
      <CourseSection></CourseSection>
      <FeedBackSection></FeedBackSection>
      <BlogSection></BlogSection>
      <Footer></Footer>
    </div>
  );
};

export default Home;
