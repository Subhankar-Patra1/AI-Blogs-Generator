"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Settings, ExternalLink, X, ArrowUpRight, Eye, EyeOff } from "lucide-react"

const API_KEY_STORAGE_KEY = "blog-generator-api-key"
const SETTINGS_TIP_KEY = "blog-generator-settings-tip-shown"

export function SettingsDialog() {
  const [open, setOpen] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [saved, setSaved] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [initialApiKey, setInitialApiKey] = useState("")
  const iconRef = useRef<HTMLButtonElement>(null)

  // Track if the user has interacted with the input after reset
  const [touched, setTouched] = useState(false)

  // Load API key from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(API_KEY_STORAGE_KEY) || ""
      setApiKey(stored)
      setInitialApiKey(stored)
    }
  }, [open])

  // Show tip for new users
  useEffect(() => {
    if (typeof window !== "undefined") {
      const tipShown = localStorage.getItem(SETTINGS_TIP_KEY)
      if (!tipShown) setShowTip(true)
    }
  }, [])

  // When dialog is opened, mark tip as shown
  useEffect(() => {
    if (open && showTip) {
      setShowTip(false)
      localStorage.setItem(SETTINGS_TIP_KEY, "true")
    }
  }, [open, showTip])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value)
    setTouched(true)
  }

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey)
      setSaved(true)
      setInitialApiKey(apiKey)
      setTouched(false)
      setTimeout(() => setSaved(false), 1500)
      window.dispatchEvent(new Event("api-key-updated"))
    }
  }

  const handleReset = () => {
    setApiKey("")
    setTouched(false)
    if (typeof window !== "undefined") {
      localStorage.removeItem(API_KEY_STORAGE_KEY)
      window.dispatchEvent(new Event("api-key-updated"))
    }
  }

  const handleTipDismiss = () => {
    setShowTip(false)
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_TIP_KEY, "true")
    }
  }

  // Save button should be enabled if apiKey is non-empty and different from initialApiKey
  const canSave = apiKey && (apiKey !== initialApiKey || (initialApiKey === "" && touched))

  return (
    <>
      <div className="relative">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              ref={iconRef}
              variant="outline"
              size="sm"
              className="relative overflow-hidden transition-all duration-300 hover:scale-105 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600"
              aria-label="Open settings"
            >
              <Settings className="h-4 w-4" />
              <span className="ml-2 text-sm font-medium">Settings</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Settings className="h-5 w-5" />
                Settings
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                Configure your Google Gemini API key to enable AI-powered blog generation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Google Gemini API Key
                </label>
                <div className="relative">
                  <Input
                    id="api-key"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={handleInputChange}
                    placeholder="Enter your API key (Alza...)"
                    autoComplete="off"
                    className="border-purple-200 dark:border-purple-700 focus:border-purple-400 dark:focus:border-purple-500 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    onClick={() => setShowApiKey(v => !v)}
                    tabIndex={-1}
                  >
                    {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 rounded-lg px-4 py-3 text-blue-900 dark:text-blue-100 text-sm flex items-center gap-2">
                <span>Your API key is stored securely in your browser's local storage and is never sent to our servers.</span>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    Get API Key <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="link" size="sm">
                  <a
                    href="https://ai.google.dev/gemini-api/docs/get-api-key"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    Learn More <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            <DialogFooter className="flex flex-row gap-2 mt-6">
              <Button
                onClick={handleSave}
                variant="default"
                size="lg"
                className="flex-1"
                disabled={!canSave}
              >
                Save
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Reset
              </Button>
            </DialogFooter>
            {saved && <div className="text-green-600 dark:text-green-400 text-sm mt-2 text-center">Saved!</div>}
          </DialogContent>
        </Dialog>
        {/* Introductory tip for new users */}
        {showTip && (
          <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50 flex flex-col items-center animate-fade-in">
            <div className="relative bg-gradient-to-br from-purple-700 via-pink-600 to-indigo-700 text-white rounded-xl shadow-lg px-6 py-4 min-w-[340px] max-w-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold flex items-center gap-2">👋 Welcome to AI Blog Generator!</span>
                <button onClick={handleTipDismiss} className="ml-2 text-white/70 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="text-base font-medium mb-1">Please enter your API key in the settings to generate blogs and use AI features.</div>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <span className="">↑ Click the settings icon above</span>
              </div>
              {/* Animated arrow up */}
              <span className="absolute left-1/2 -top-6 -translate-x-1/2 animate-bounce">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 32V8M16 8l-8 8M16 8l8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
} 