"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface BlogPost {
  id: string
  topic: string
  content: string
  timestamp: number
  isSample?: boolean
}

interface HistoryContextType {
  history: BlogPost[]
  addToHistory: (topic: string, content: string, isSample?: boolean) => void
  clearHistory: () => void
  removeFromHistory: (id: string) => void
  mounted: boolean
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<BlogPost[]>([])
  const [mounted, setMounted] = useState(false)

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("blog-generator-history")
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        setHistory(parsedHistory)
      }
    } catch (error) {
      console.log("Error loading history:", error)
      setHistory([])
    }
    setMounted(true)
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("blog-generator-history", JSON.stringify(history))
      } catch (error) {
        console.log("Error saving history:", error)
      }
    }
  }, [history, mounted])

  const addToHistory = (topic: string, content: string, isSample = false) => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      topic,
      content,
      timestamp: Date.now(),
      isSample,
    }
    setHistory((prev) => [newPost, ...prev.slice(0, 19)]) // Keep only last 20 posts
  }

  const clearHistory = () => {
    setHistory([])
  }

  const removeFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((post) => post.id !== id))
  }

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, removeFromHistory, mounted }}>
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider")
  }
  return context
}
