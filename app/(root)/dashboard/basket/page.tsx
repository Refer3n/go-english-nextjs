import { auth } from "@/auth"
import api from "@/lib/api"
import type { CourseDetails } from "@/types/course"
import { BasketClient } from "./client"

export default async function BasketPage() {
  const session = await auth()

  if (!session) {
    return <div></div>
  }

  let basketItems: CourseDetails[] = []
  let error: string | null = null

  try {
    const response = await api.get("/Basket/GetBasket", {
      params: { userId: session.user.id },
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    })

    if (response.data) {
      basketItems = response.data
    }
  } catch (err) {
    console.error("Error fetching basket:", err)
    error = "Failed to load your basket. Please try again later."
  }

  return (
    <div className="px-[2vw] py-6 bg-light-400 min-h-[calc(100vh-102px)]">
      <BasketClient
        basketItems={basketItems}
        error={error}
        userId={session.user.id}
        accessToken={session.user.accessToken}
      />
    </div>
  )
}
