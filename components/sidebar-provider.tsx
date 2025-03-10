"use client"

import type * as React from "react"
import { SidebarProvider as OriginalSidebarProvider } from "@/components/ui/sidebar"

const SIDEBAR_WIDTH = "14rem"
const SIDEBAR_WIDTH_ICON = "5rem" 
const SIDEBAR_WIDTH_MOBILE = "22rem" 

export function SidebarProvider({ children, ...props }: React.ComponentProps<typeof OriginalSidebarProvider>) {
  return (
    <OriginalSidebarProvider
      {...props}
      style={
        {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...props.style,
        } as React.CSSProperties
      }
    >
      {children}
    </OriginalSidebarProvider>
  )
}

