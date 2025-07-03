"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, BookOpen, ChevronDown, ChevronUp } from "lucide-react"

export interface WordCountSettings {
  length: string
  wordCount: number
  estimatedReadTime: string
}

interface WordCountSelectorProps {
  onSettingsChange: (settings: WordCountSettings) => void
  currentSettings: WordCountSettings
}

const LENGTH_OPTIONS = [
  {
    id: "short",
    name: "Short",
    wordCount: 300,
    range: "250-350 words",
    estimatedReadTime: "1-2 min read",
    description: "Quick read, perfect for social media or brief updates",
    icon: FileText,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    useCase: "Social posts, quick tips, announcements",
  },
  {
    id: "medium",
    name: "Medium",
    wordCount: 700,
    range: "600-800 words",
    estimatedReadTime: "3-4 min read",
    description: "Standard blog length, ideal for most topics",
    icon: Clock,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    useCase: "Regular blog posts, how-to guides, reviews",
  },
  {
    id: "long",
    name: "Long",
    wordCount: 1200,
    range: "1000-1500 words",
    estimatedReadTime: "5-7 min read",
    description: "In-depth content for comprehensive coverage",
    icon: BookOpen,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    useCase: "Detailed tutorials, research articles, comprehensive guides",
  },
]

export function WordCountSelector({ onSettingsChange, currentSettings }: WordCountSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLengthChange = (lengthId: string) => {
    const selectedOption = LENGTH_OPTIONS.find((option) => option.id === lengthId)
    if (selectedOption) {
      const newSettings: WordCountSettings = {
        length: lengthId,
        wordCount: selectedOption.wordCount,
        estimatedReadTime: selectedOption.estimatedReadTime,
      }
      onSettingsChange(newSettings)
    }
  }

  const selectedOption = LENGTH_OPTIONS.find((option) => option.id === currentSettings.length)

  return (
    <Card className="border border-purple-200 dark:border-purple-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
      <CardHeader className="cursor-pointer pb-3" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Content Length
          </CardTitle>
          <div className="flex items-center gap-2">
            {selectedOption && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={selectedOption.color}>
                  {selectedOption.name}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {selectedOption.range}
                </Badge>
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedOption.estimatedReadTime}
                </Badge>
              </div>
            )}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Select Content Length
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {LENGTH_OPTIONS.map((option) => {
                const Icon = option.icon
                const isSelected = currentSettings.length === option.id
                return (
                  <Button
                    key={option.id}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleLengthChange(option.id)}
                    className={`h-auto p-4 flex items-center gap-4 ${
                      isSelected
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg">{option.name}</span>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${isSelected ? "bg-white/20 text-white" : option.color}`}
                        >
                          {option.range}
                        </Badge>
                      </div>
                      <p
                        className={`text-sm mb-2 ${
                          isSelected ? "text-purple-100" : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {option.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className={isSelected ? "text-purple-200" : "text-gray-500 dark:text-gray-400"}>
                            {option.estimatedReadTime}
                          </span>
                        </div>
                        <div className={`${isSelected ? "text-purple-200" : "text-gray-500 dark:text-gray-400"}`}>
                          Best for: {option.useCase}
                        </div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Word Count Visualization */}
          {selectedOption && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 text-sm">Content Length Preview</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Target Word Count:</span>
                  <Badge variant="outline" className="font-mono">
                    ~{selectedOption.wordCount} words
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Estimated Reading Time:</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedOption.estimatedReadTime}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Content Type:</span>
                  <Badge variant="outline">{selectedOption.name} Form Content</Badge>
                </div>
              </div>

              {/* Visual Length Indicator */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Length Scale</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{selectedOption.range}</span>
                </div>
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedOption.id === "short"
                        ? "w-1/3 bg-green-500"
                        : selectedOption.id === "medium"
                          ? "w-2/3 bg-blue-500"
                          : "w-full bg-purple-500"
                    }`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Short</span>
                  <span>Medium</span>
                  <span>Long</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
