import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider, createRouter } from "@tanstack/react-router"

import "./index.css"

import { ThemeProvider } from "@/app/providers/theme-provider.tsx"
import { routeTree } from "./routeTree.gen"

const router = createRouter({ routeTree })

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
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StrictMode>
  )
}

main().catch((error: unknown) => {
  console.error("Failed to start the application", error)
})
