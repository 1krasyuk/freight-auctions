import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { cn } from "@/shared/lib/cn"
import {
  COLOR_SCHEME_QUERY,
  useThemeStore,
} from "@/shared/model/theme-store"
import { Label } from "@/shared/ui/label"
import { Switch } from "@/shared/ui/switch"

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const [systemIsDark, setSystemIsDark] = useState(() =>
    window.matchMedia(COLOR_SCHEME_QUERY).matches
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemIsDark(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const isDark = theme === "dark" || (theme === "system" && systemIsDark)

  return (
    <Label
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full border bg-background/70 px-2 py-2 shadow-sm backdrop-blur-sm sm:px-3",
        className
      )}
    >
      <SunIcon className="size-4 dark:text-muted-foreground" />
      <Switch
        aria-label="Тёмная тема"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <MoonIcon className="size-4 text-muted-foreground dark:text-foreground" />
    </Label>
  )
}
