"use client";

import { AppSidebar } from "@/components/app-sidebar";
import DashboardHeader from "@/components/dashboard-header";
import { SidebarProvider } from "@/components/sidebar-provider";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3 w-full">
            <SidebarTrigger className="text-primary h-12 w-12" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DashboardHeader />
          </div>
        </header>
        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
