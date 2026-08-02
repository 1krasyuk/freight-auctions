import { useEffect, type ReactNode } from "react"

import {
  COLOR_SCHEME_QUERY,
  isTheme,
  THEME_STORAGE_KEY,
  useThemeStore,
  type Theme,
} from "@/shared/model/theme-store"

type ThemeProviderProps = {
  children: ReactNode
  disableTransitionOnChange?: boolean
}

type ResolvedTheme = Exclude<Theme, "system">

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(COLOR_SCHEME_QUERY).matches ? "dark" : "light"
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => style.remove())
    })
  }
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true

  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true']")
  )
}

export function ThemeProvider({
  children,
  disableTransitionOnChange = true,
}: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  useEffect(() => {
    const applyTheme = () => {
      const resolvedTheme = theme === "system" ? getSystemTheme() : theme
      const restoreTransitions = disableTransitionOnChange
        ? disableTransitionsTemporarily()
        : null

      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(resolvedTheme)
      localStorage.setItem(THEME_STORAGE_KEY, theme)
      restoreTransitions?.()
    }

    applyTheme()

    if (theme !== "system") return

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
    mediaQuery.addEventListener("change", applyTheme)

    return () => mediaQuery.removeEventListener("change", applyTheme)
  }, [disableTransitionOnChange, theme])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditableTarget(event.target) ||
        event.key.toLowerCase() !== "d"
      ) {
        return
      }

      const currentTheme = useThemeStore.getState().theme
      const nextTheme =
        currentTheme === "dark"
          ? "light"
          : currentTheme === "light"
            ? "dark"
            : getSystemTheme() === "dark"
              ? "light"
              : "dark"

      setTheme(nextTheme)
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setTheme])

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage || event.key !== THEME_STORAGE_KEY) {
        return
      }

      useThemeStore.setState({
        theme: isTheme(event.newValue) ? event.newValue : "system",
      })
    }

    window.addEventListener("storage", handleStorageChange)

    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return children
}
