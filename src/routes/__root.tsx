import type { QueryClient } from "@tanstack/react-query"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"

import { useThemeStore } from "@/shared/model/theme-store"
import { Toaster } from "@/shared/ui/sonner"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
})

function RootComponent() {
  const theme = useThemeStore((state) => state.theme)

  return (
    <>
      <Outlet />
      <Toaster theme={theme} position="top-right" richColors />
    </>
  )
}
