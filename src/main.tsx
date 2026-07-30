import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"

import "./index.css"

import { queryClient } from "@/app/providers/query-client"
import { ThemeProvider } from "@/app/providers/theme-provider"
import { routeTree } from "./routeTree.gen"

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return
  }

  const { worker } = await import("@/app/mocks/browser")

  return worker.start()
}

async function main(): Promise<void> {
  await enableMocking()

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}

main().catch((error: unknown) => {
  console.error("Failed to start the application", error)
})
