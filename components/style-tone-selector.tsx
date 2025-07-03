"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MessageCircle, Smile, Heart, Settings, TrendingUp, ChevronDown, ChevronUp } from "lucide-react"

export interface StyleToneSettings {
  tone: string
  style: string
}

interface StyleToneSelectorProps {
  onSettingsChange: (settings: StyleToneSettings) => void
  currentSettings: StyleToneSettings
}

const TONES = [
  {
    id: "professional",
    name: "Professional",
    description: "Formal, authoritative, and business-focused",
    icon: Briefcase,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    id: "conversational",
    name: "Conversational",
    description: "Friendly, approachable, and easy to read",
    icon: MessageCircle,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  {
    id: "witty",
    name: "Witty",
    description: "Humorous, clever, and entertaining",
    icon: Smile,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  {
    id: "inspirational",
    name: "Inspirational",
    description: "Motivating, uplifting, and encouraging",
    icon: Heart,
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  },
  {
    id: "technical",
    name: "Technical",
    description: "Detailed, precise, and expert-level",
    icon: Settings,
    color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  },
  {
    id: "seo-optimized",
    name: "SEO-Optimized",
    description: "Search-friendly with strategic keywords",
    icon: TrendingUp,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
]

const STYLES = [
  {
    id: "blog-post",
    name: "Casual Blog",
    description: "Relaxed, personal, and engaging blog format",
  },
  {
    id: "academic",
    name: "Academic",
    description: "Scholarly, research-based, and formal structure",
  },
  {
    id: "promotional",
    name: "Promotional",
    description: "Marketing-focused with call-to-actions",
  },
  {
    id: "tutorial",
    name: "Tutorial/Guide",
    description: "Step-by-step instructional format",
  },
  {
    id: "listicle",
    name: "Listicle",
    description: "List-based format with numbered points",
  },
  {
    id: "news-article",
    name: "News Article",
    description: "Journalistic style with facts and quotes",
  },
]

export function StyleToneSelector({ onSettingsChange, currentSettings }: StyleToneSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToneChange = (toneId: string) => {
    const newSettings = { ...currentSettings, tone: toneId }
    onSettingsChange(newSettings)
  }

  const handleStyleChange = (styleId: string) => {
    const newSettings = { ...currentSettings, style: styleId }
    onSettingsChange(newSettings)
  }

  const selectedTone = TONES.find((tone) => tone.id === currentSettings.tone)
  const selectedStyle = STYLES.find((style) => style.id === currentSettings.style)

  return (
    <Card className="border border-purple-200 dark:border-purple-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
      <CardHeader className="cursor-pointer pb-3" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Writing Style & Tone
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {selectedTone && (
                <Badge variant="secondary" className={selectedTone.color}>
                  {selectedTone.name}
                </Badge>
              )}
              {selectedStyle && (
                <Badge variant="outline" className="text-xs">
                  {selectedStyle.name}
                </Badge>
              )}
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-6">
          {/* Tone Selection */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Select Writing Tone
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TONES.map((tone) => {
                const Icon = tone.icon
                const isSelected = currentSettings.tone === tone.id
                return (
                  <Button
                    key={tone.id}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleToneChange(tone.id)}
                    className={`h-auto p-3 flex flex-col items-start gap-2 ${
                      isSelected
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{tone.name}</span>
                    </div>
                    <span
                      className={`text-xs text-left ${
                        isSelected ? "text-purple-100" : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {tone.description}
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Select Writing Style
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STYLES.map((style) => {
                const isSelected = currentSettings.style === style.id
                return (
                  <Button
                    key={style.id}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleStyleChange(style.id)}
                    className={`h-auto p-3 flex flex-col items-start gap-1 ${
                      isSelected
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <span className="font-medium text-sm">{style.name}</span>
                    <span
                      className={`text-xs text-left ${
                        isSelected ? "text-purple-100" : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {style.description}
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Preview */}
          {(selectedTone || selectedStyle) && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">Current Selection:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTone && (
                  <div className="flex items-center gap-2">
                    <selectedTone.icon className="h-3 w-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Tone:</strong> {selectedTone.name}
                    </span>
                  </div>
                )}
                {selectedStyle && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-3 w-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Style:</strong> {selectedStyle.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
