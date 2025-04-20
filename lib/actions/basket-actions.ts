"use server"

import { auth } from "@/auth"
import api from "@/lib/api"
import { revalidatePath } from "next/cache"

export async function removeFromBasket(courseId: number, userId: string) {
  const session = await auth()

  if (!session) {
    throw new Error("Unauthorized")
  }

  try {
    const url = `/Basket/Remove/${courseId}?userId=${encodeURIComponent(userId)}`
    await api.delete(url, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    })

    revalidatePath("/dashboard/basket")

    return { success: true }
  } catch (error) {
    console.error("Error removing item from basket:", error)
    return { success: false, error: "Failed to remove item from basket" }
  }
}
