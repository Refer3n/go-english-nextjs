import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  description: string;
  content: string;
  image?: string;
}

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const { id, title, description, image } = blog;

  // Truncate description to a maximum of 100 characters
  const truncatedDescription = description.length > 100 ? `${description.slice(0, 100)}...` : description;

  return (
    <div className="bg-transparent p-6 flex flex-col gap-3 w-[300px] h-[400px]">
      {/* Image takes up the remaining space */}
      <div className="relative w-full h-[250px] flex-grow">
        <Image
          src={image || "/images/default3.jpg"}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      
      <p className="text-black-100 text-base">{truncatedDescription}</p>
      
      <Link href={`/blog/${id}`} className="link-text flex items-center mt-auto">
        View full story <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default BlogCard;
