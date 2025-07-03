"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

const INTEGRATION_WARNING_KEY = "blog-generator-integration-warning-dismissed"

export function IntegrationWarningDialog() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem(INTEGRATION_WARNING_KEY)
      if (!dismissed) setShow(true)
    }
  }, [])

  const handleClose = () => {
    setShow(false)
  }

  const handleDontShowAgain = () => {
    setShow(false)
    if (typeof window !== "undefined") {
      localStorage.setItem(INTEGRATION_WARNING_KEY, "true")
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative bg-black text-white rounded-xl shadow-xl p-8 max-w-md w-full flex flex-col gap-4">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={handleClose}
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center rounded-full bg-white/10 h-12 w-12">
            <X className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="text-lg font-semibold">This generation uses an integration</div>
            <div className="text-sm text-gray-300 mt-1">Complete the steps in chat to ensure the generation works correctly.</div>
          </div>
        </div>
        <button
          className="mt-4 bg-white/10 hover:bg-white/20 text-white rounded-md px-4 py-2 text-sm font-medium border border-white/20 self-end"
          onClick={handleDontShowAgain}
        >
          Don't show again
        </button>
      </div>
    </div>
  )
} 