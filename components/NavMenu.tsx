"use client"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export function NavMenu() {
  const t = useTranslations("Navigation.MainMenu")

  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-6">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="nav-item !p-0">{t("courses")}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <Link href="/courses/general-english">{t("coursesSubmenu.generalEnglish")}</Link>
              <Link href="/courses/business-english">{t("coursesSubmenu.businessEnglish")}</Link>
              <Link href="/courses/exam-prep">{t("coursesSubmenu.examPrep")}</Link>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/resources" legacyBehavior passHref>
            <NavigationMenuLink className="nav-item">{t("resources")}</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/level-test" legacyBehavior passHref>
            <NavigationMenuLink className="nav-item">{t("levelTest")}</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/blog" legacyBehavior passHref>
            <NavigationMenuLink className="nav-item">{t("blog")}</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/news" legacyBehavior passHref>
            <NavigationMenuLink className="nav-item">{t("news")}</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
