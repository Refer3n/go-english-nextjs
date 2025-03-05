"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

const navLinks = [
  { title: "My Dashboard", url: "/dashboard", icon: "/icons/nav-icons/dashboard.svg" },
  { title: "Courses", url: "/dashboard/courses", icon: "/icons/nav-icons/courses.svg" },
  { title: "Materials", url: "/dashboard/materials", icon: "/icons/nav-icons/materials.svg" },
  { title: "Awards", url: "/dashboard/awards", icon: "/icons/nav-icons/awards.svg" },
  { title: "Shop", url: "/dashboard/shop", icon: "/icons/nav-icons/shop.svg" },
  { title: "Basket", url: "/dashboard/basket", icon: "/icons/nav-icons/basket.svg" },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() 

  return (
    <Sidebar className="bg-primary text-white border-none h-screen" {...props}>
      <SidebarHeader className="p-4">
        <SidebarMenu>
        <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton size="xl" asChild className="w-full flex justify-center items-center">
              <Link href="/" className="flex justify-center items-center w-full pr-14">
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
                  src="/images/default3.jpg"
                  alt="User avatar"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 flex items-center justify-center outline-none">
                <ChevronDown className="size-4 text-white" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Level Test</DropdownMenuItem>
                <DropdownMenuItem>My courses</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <SidebarMenu className="w-full">
          {navLinks.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title} className="mb-6">
                <SidebarMenuButton
                  asChild
                  className={`flex-col h-auto py-2 hover:bg-primary ${
                    isActive ? "bg-blue-400 hover:bg-blue-400" : ""
                  }`}
                >
                  <Link href={item.url} className="flex flex-col items-center gap-1 p-2">
                    <Image src={item.icon} width={30} height={30} alt={item.title} />
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
