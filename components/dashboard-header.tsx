"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Input } from "./ui/input"
import { signOutOfAccount } from "@/lib/actions/auth"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import LanguageSwitcher from "./LanguageSwitcher"

const DashboardHeader = () => {
  const t = useTranslations("Common.DashboardHeader")
  const [searchValue, setSearchValue] = useState("")
  const router = useRouter()

  const handleSignOut = async () => {
    await signOutOfAccount()
    window.location.href = "/"
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      const encoded = encodeURIComponent(searchValue.trim())
      router.push(`/dashboard/shop?page=1&search=${encoded}`)
    }
  }

  return (
    <div className="flex flex-col px-[1vw] mb-6 mt-5 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="auth-input-container text-2xl ml-8">
            <div className="icon-right">
              <Image src={`/icons/search-icon.svg`} width={30} height={30} alt={t("searchIconAlt")} />
            </div>
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="search-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <LanguageSwitcher />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleSignOut}>
            <Image src="/icons/sign-out.svg" width={30} height={30} alt={t("signOutAlt")} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader
