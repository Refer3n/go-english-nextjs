import axios from "axios";
import BlogCard from "./BlogCard"; // Import the BlogCard component
import { useEffect, useState } from "react";

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
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/Blog/GetBlogPosts?number=0`;
      const response = await axios.get(apiUrl);
      const data: Blog[] = response.data;

      setBlogs(data);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
