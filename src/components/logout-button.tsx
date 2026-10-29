"use client"

import { IconLogout } from "@tabler/icons-react"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site.config"
import { createBrowserSupabase } from "@/lib/supabase/client"

export function LogoutButton() {
  const router = useRouter()
  const queryClient = useQueryClient()

  async function logout() {
    await createBrowserSupabase().auth.signOut({ scope: "local" })
    queryClient.clear()
    router.push(siteConfig.loginPath)
    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-2 rounded-md border-0 px-2 font-normal"
      onClick={logout}
    >
      <IconLogout aria-hidden />
      Log out
    </Button>
  )
}
