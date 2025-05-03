"use client"

import type React from "react"

import { useEffect, useState } from "react"
import fetchData from "@/lib/actions/fetchData"
import { useLoading } from "@/context/LoadingContext"
import { useLocale } from "next-intl"
import BlogCard from "./BlogCard"

interface Blog {
  id: number
  title: string
  description: string
  content: string
  image?: string
}

const BlogList: React.FC = () => {
  const { setLoading } = useLoading()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const locale = useLocale()

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        const blogs: Blog[] = await fetchData<Blog>("Blog/GetBlogPosts", locale, {
          number: 0,
        })

        setBlogs(blogs)
      } catch (error) {
        console.error("Error fetching blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [locale, setLoading])

  return (
    <div className="grid w-full gap-6 px-4 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 justify-items-center">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogList
