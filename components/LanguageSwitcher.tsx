"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const LanguageSwitcher = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("Common")

  const pathnameWithoutLocale = pathname.replace(`/${locale}`, "") || "/"

  const handleLanguageChange = (newLocale: string) => {
    if (!newLocale || newLocale === locale) return

    router.push(`/${newLocale}${pathnameWithoutLocale}`)
  }

  return (
    <ToggleGroup
      type="single"
      value={locale}
      onValueChange={handleLanguageChange}
      className="px-4 py-4 bg-primary rounded-full flex items-center gap-1"
    >
      <ToggleGroupItem
        value="uk"
        className="text-white text-base font-bold h-5 w-5 data-[state=on]:text-yellow flex items-center justify-center"
        aria-label={t("switchToUkrainian")}
      >
        UK
      </ToggleGroupItem>
      <span className="text-white text-xl h-5 flex items-center">|</span>
      <ToggleGroupItem
        value="en"
        className="text-white text-base font-bold h-5 w-5 data-[state=on]:text-yellow flex items-center justify-center"
        aria-label={t("switchToEnglish")}
      >
        EN
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export default LanguageSwitcher
