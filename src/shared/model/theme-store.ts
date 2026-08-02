import { create } from "zustand"

export type Theme = "dark" | "light" | "system"

type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"
export const THEME_STORAGE_KEY = "theme"

const THEME_VALUES: Theme[] = ["dark", "light", "system"]

export function isTheme(value: string | null): value is Theme {
  return value !== null && THEME_VALUES.includes(value as Theme)
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "system"

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)

  return isTheme(storedTheme) ? storedTheme : "system"
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => set({ theme }),
}))
