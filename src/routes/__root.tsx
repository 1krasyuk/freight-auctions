import type { QueryClient } from "@tanstack/react-query"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"

import { useTheme } from "@/app/providers/theme-provider"
import { Toaster } from "@/shared/ui/sonner"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
})

function RootComponent() {
  const { theme } = useTheme()

  return (
    <>
      <Outlet />
      <Toaster theme={theme} position="top-right" richColors />
    </>
  )
}
