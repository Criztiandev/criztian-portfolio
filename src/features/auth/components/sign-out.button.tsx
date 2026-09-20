"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { LOGIN_PATH } from "@/data/auth.data"
import { useTRPC } from "@/lib/trpc/trpc.client"

export function SignOutButton() {
  const router = useRouter()
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const logout = useMutation(
    trpc.auth.logout.mutationOptions({
      onSuccess: function onSuccess() {
        queryClient.clear()
        router.replace(LOGIN_PATH)
        router.refresh()
      },
    })
  )

  function onClick() {
    logout.mutate()
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={logout.isPending}
    >
      {logout.isPending ? "Signing out…" : "Sign out"}
    </Button>
  )
}
