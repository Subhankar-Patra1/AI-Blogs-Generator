"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface GlossyGenerateButtonProps {
  onClick: () => void
  disabled: boolean
  isLoading: boolean
}

export function GlossyGenerateButton({ onClick, disabled, isLoading }: GlossyGenerateButtonProps) {
  return (
    <Button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden px-6 py-2.5 font-semibold text-white
        bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700
        hover:from-purple-700 hover:via-pink-700 hover:to-purple-800
        dark:from-purple-700 dark:via-pink-700 dark:to-purple-800
        dark:hover:from-purple-800 dark:hover:via-pink-800 dark:hover:to-purple-900
        shadow-lg hover:shadow-xl
        transform transition-all duration-300 ease-out
        hover:scale-105 active:scale-95
        border-0 rounded-lg
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        before:absolute before:inset-0 before:bg-gradient-to-r 
        before:from-white/20 before:via-white/10 before:to-transparent
        before:opacity-0 hover:before:opacity-100
        before:transition-opacity before:duration-300
        after:absolute after:inset-0 after:bg-gradient-to-t
        after:from-black/10 after:to-transparent after:pointer-events-none
      `}
    >
      <div className="relative z-10 flex items-center justify-center">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            <span className="bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent font-bold">
              Generating...
            </span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2 drop-shadow-sm" />
            <span className="bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent font-bold">
              Generate
            </span>
          </>
        )}
      </div>

      {/* Glossy highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent opacity-60 pointer-events-none" />

      {/* Animated shine effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-1000 hover:translate-x-full pointer-events-none" />
    </Button>
  )
}
