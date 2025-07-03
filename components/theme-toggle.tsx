"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  // Show a placeholder while mounting to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="relative overflow-hidden border-purple-200 dark:border-purple-700"
        aria-label="Loading theme toggle"
      >
        <div className="relative flex items-center justify-center w-5 h-5">
          <Sun className="h-4 w-4 opacity-50" />
        </div>
        <span className="ml-2 text-sm font-medium opacity-50">Theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="relative overflow-hidden transition-all duration-300 hover:scale-105 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="relative flex items-center justify-center w-5 h-5">
        <Sun
          className={`absolute h-4 w-4 transition-all duration-300 ${
            theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
          }`}
        />
        <Moon
          className={`absolute h-4 w-4 transition-all duration-300 ${
            theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
      <span className="ml-2 text-sm font-medium">{theme === "light" ? "Dark" : "Light"}</span>
    </Button>
  )
}
