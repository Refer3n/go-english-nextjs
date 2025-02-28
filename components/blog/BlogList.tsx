"use client"

import BlogCard from "./BlogCard"; // Import the BlogCard component
import { useEffect, useState } from "react";
import fetchData from "@/lib/actions/fetchData";

interface Blog {
  id: number;
  title: string;
  description: string;
  content: string;
  image?: string
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs: Blog[] = await fetchData<Blog>("Blog/GetBlogPosts", "en", { number: 0 });

      setBlogs(blogs);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="grid w-full gap-6 px-4 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 justify-items-center">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
