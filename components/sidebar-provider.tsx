"use client";

import type * as React from "react";
import { SidebarProvider as OriginalSidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

const SIDEBAR_WIDTH_DEFAULT = "11.5rem";
const SIDEBAR_WIDTH_LARGE = "14rem";
const SIDEBAR_WIDTH_ICON = "5rem";
const SIDEBAR_WIDTH_MOBILE = "22rem";

export function SidebarProvider({
  children,
  ...props
}: React.ComponentProps<typeof OriginalSidebarProvider>) {
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_WIDTH_DEFAULT);

  useEffect(() => {
    const updateSidebarWidth = () => {
      if (window.innerWidth >= 1680) {
        setSidebarWidth(SIDEBAR_WIDTH_LARGE);
      } else {
        setSidebarWidth(SIDEBAR_WIDTH_DEFAULT);
      }
    };

    updateSidebarWidth();

    window.addEventListener("resize", updateSidebarWidth);
    return () => window.removeEventListener("resize", updateSidebarWidth);
  }, []);
  return (
    <OriginalSidebarProvider
      {...props}
      style={
        {
          "--sidebar-width": sidebarWidth,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...props.style,
        } as React.CSSProperties
      }
    >
      {children}
    </OriginalSidebarProvider>
  );
}
