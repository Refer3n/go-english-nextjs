"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import Logo from "./Logo"
import { useSession } from "next-auth/react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("Navigation.Sidebar")
  const pathname = usePathname()
  const session = useSession()
  const avatarUrl = session.data?.user.avatarUrl

  const navLinks = [
    { title: t("dashboard"), url: "/dashboard", icon: "/icons/nav-icons/dashboard.svg" },
    { title: t("courses"), url: "/dashboard/courses", icon: "/icons/nav-icons/courses.svg" },
    { title: t("materials"), url: "/dashboard/materials", icon: "/icons/nav-icons/materials.svg" },
    { title: t("awards"), url: "/dashboard/awards", icon: "/icons/nav-icons/awards.svg" },
    { title: t("shop"), url: "/dashboard/shop", icon: "/icons/nav-icons/shop.svg" },
    { title: t("basket"), url: "/dashboard/basket", icon: "/icons/nav-icons/basket.svg" },
  ]

  return (
    <Sidebar className="bg-primary text-white border-none h-screen" {...props}>
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton size="xl" asChild className="w-full flex justify-center items-center">
              <Link href="/" className="flex justify-center items-center w-full lg:pr-[55%] 2xl:pr-14">
                <Logo size="sm" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-col items-center gap-6 pt-4">
        <div className="w-full flex justify-center mb-4">
          <div className="flex items-center relative">
            <Link href="/dashboard/profile" className="block">
              <div className="relative rounded-full overflow-hidden">
                <Image
                  src={avatarUrl || "/images/default3.jpg"}
                  alt={t("userAvatar")}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
            </Link>
          </div>
        </div>

        <SidebarMenu className="w-full">
          {navLinks.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title} className="mb-6">
                <SidebarMenuButton
                  asChild
                  className={`flex-col h-auto py-2 hover:bg-primary ${isActive ? "bg-blue-400 hover:bg-blue-400" : ""}`}
                >
                  <Link href={item.url} className="flex flex-col items-center gap-1 p-2">
                    <Image src={item.icon || "/placeholder.svg"} width={30} height={30} alt={item.title} />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
