import { Link } from "@/i18n/navigation"
import {
  Breadcrumb,
  BreadcrumbItem as UICBreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type React from "react"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <Breadcrumb className="text-light-300 text-sm font-normal">
      <BreadcrumbList className="sm:gap-1.5">
        {items.flatMap((item, index) => {
          const elements: React.ReactNode[] = [
            <UICBreadcrumbItem key={`item-${index}`}>
              {item.isCurrentPage ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : item.href ? (
                <BreadcrumbLink href={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbLink>{item.label}</BreadcrumbLink>
              )}
            </UICBreadcrumbItem>,
          ]

          if (index < items.length - 1) {
            elements.push(<BreadcrumbSeparator key={`separator-${index}`}> <ChevronRight className="!w-6 !h-6" strokeWidth={1.5}/> </BreadcrumbSeparator>)
          }

          return elements
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

