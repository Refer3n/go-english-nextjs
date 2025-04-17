"use client"

import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FormEvent } from "react"

export function SearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const search = formData.get("search") as string

    const params = new URLSearchParams(searchParams.toString())

    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }

    params.set("page", "1")

    router.push(`/dashboard/shop?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <Input type="text" name="search" placeholder="Search courses..." defaultValue={defaultValue} className="flex-1" />
      <Button type="submit" className="bg-primary text-white">
        Search
      </Button>
    </form>
  )
}
