"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Wand2,
  Target,
  TrendingUp,
  BookOpen,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Check,
  Copy,
  Zap,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PromptEnhancerProps {
  currentTopic: string
  onTopicSelect: (enhancedTopic: string) => void
  onEnhance: (originalTopic: string, options: EnhancementOptions) => Promise<EnhancementResult>
  disabled?: boolean
}

interface EnhancementOptions {
  style: "specific" | "engaging" | "seo" | "trending" | "academic" | "creative"
  audience: "general" | "beginners" | "professionals" | "experts" | "students"
  intent: "inform" | "persuade" | "entertain" | "educate" | "inspire"
  length: "short" | "medium" | "long"
}

interface EnhancementResult {
  success: boolean
  suggestions: Array<{
    id: string
    title: string
    description: string
    category: string
    score: number
    keywords: string[]
    reasoning: string
  }>
  error?: string
}

const ENHANCEMENT_STYLES = [
  {
    id: "specific",
    name: "More Specific",
    description: "Make the topic more focused and detailed",
    icon: Target,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    id: "engaging",
    name: "More Engaging",
    description: "Add hooks and compelling elements",
    icon: Sparkles,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  {
    id: "seo",
    name: "SEO Optimized",
    description: "Include trending keywords and search terms",
    icon: TrendingUp,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  {
    id: "trending",
    name: "Trending Topics",
    description: "Connect to current trends and hot topics",
    icon: Zap,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  {
    id: "academic",
    name: "Academic Style",
    description: "Research-focused and scholarly approach",
    icon: BookOpen,
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  },
  {
    id: "creative",
    name: "Creative Angle",
    description: "Unique perspectives and creative approaches",
    icon: Lightbulb,
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  },
]

const AUDIENCE_OPTIONS = [
  { id: "general", name: "General Audience", description: "Broad appeal for everyone" },
  { id: "beginners", name: "Beginners", description: "New to the topic" },
  { id: "professionals", name: "Professionals", description: "Working in the field" },
  { id: "experts", name: "Experts", description: "Advanced knowledge" },
  { id: "students", name: "Students", description: "Learning and studying" },
]

const INTENT_OPTIONS = [
  { id: "inform", name: "Inform", description: "Share knowledge and facts" },
  { id: "persuade", name: "Persuade", description: "Convince and influence" },
  { id: "entertain", name: "Entertain", description: "Engage and amuse" },
  { id: "educate", name: "Educate", description: "Teach and explain" },
  { id: "inspire", name: "Inspire", description: "Motivate and uplift" },
]

export function PromptEnhancer({ currentTopic, onTopicSelect, onEnhance, disabled }: PromptEnhancerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<string>("engaging")
  const [enhancementOptions, setEnhancementOptions] = useState<EnhancementOptions>({
    style: "engaging",
    audience: "general",
    intent: "inform",
    length: "medium",
  })
  const [customTopic, setCustomTopic] = useState("")
  const [suggestions, setSuggestions] = useState<EnhancementResult["suggestions"]>([])
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)
  const [copiedSuggestion, setCopiedSuggestion] = useState<string | null>(null)

  const handleEnhance = async () => {
    const topicToEnhance = customTopic.trim() || currentTopic.trim()
    if (!topicToEnhance) return

    setIsEnhancing(true)
    try {
      const result = await onEnhance(topicToEnhance, enhancementOptions)
      if (result.success) {
        setSuggestions(result.suggestions)
      } else {
        console.error("Enhancement failed:", result.error)
        // Fallback to sample suggestions
        setSuggestions(generateSampleSuggestions(topicToEnhance, enhancementOptions))
      }
    } catch (error) {
      console.error("Enhancement error:", error)
      // Fallback to sample suggestions
      setSuggestions(generateSampleSuggestions(topicToEnhance, enhancementOptions))
    } finally {
      setIsEnhancing(false)
    }
  }

  const generateSampleSuggestions = (topic: string, options: EnhancementOptions) => {
    const baseSuggestions = [
      {
        id: "1",
        title: `${topic}: A Complete Guide for ${options.audience === "beginners" ? "Beginners" : "Professionals"}`,
        description: `Comprehensive coverage of ${topic.toLowerCase()} with practical examples and actionable insights.`,
        category: "Comprehensive Guide",
        score: 92,
        keywords: ["guide", "complete", topic.toLowerCase(), "practical"],
        reasoning: "Combines authority with accessibility, appealing to your target audience.",
      },
      {
        id: "2",
        title: `The Future of ${topic}: Trends and Predictions for 2024`,
        description: `Explore emerging trends and future developments in ${topic.toLowerCase()}.`,
        category: "Trend Analysis",
        score: 88,
        keywords: ["future", "trends", "2024", topic.toLowerCase()],
        reasoning: "Leverages current interest in future predictions and trending topics.",
      },
      {
        id: "3",
        title: `${topic}: Common Mistakes and How to Avoid Them`,
        description: `Learn from common pitfalls and discover best practices in ${topic.toLowerCase()}.`,
        category: "Problem-Solution",
        score: 85,
        keywords: ["mistakes", "avoid", "best practices", topic.toLowerCase()],
        reasoning: "Addresses pain points and provides valuable solutions.",
      },
      {
        id: "4",
        title: `Why ${topic} Matters More Than Ever in Today's World`,
        description: `Discover the growing importance and relevance of ${topic.toLowerCase()} in modern society.`,
        category: "Relevance & Impact",
        score: 82,
        keywords: ["importance", "relevance", "modern", topic.toLowerCase()],
        reasoning: "Creates urgency and establishes relevance to current events.",
      },
      {
        id: "5",
        title: `${topic} vs. Alternatives: Which Approach Works Best?`,
        description: `Compare different approaches and find the most effective solution for ${topic.toLowerCase()}.`,
        category: "Comparison",
        score: 79,
        keywords: ["comparison", "alternatives", "best approach", topic.toLowerCase()],
        reasoning: "Helps readers make informed decisions through comparative analysis.",
      },
    ]

    // Adjust suggestions based on enhancement style
    return baseSuggestions.map((suggestion, index) => {
      switch (options.style) {
        case "specific":
          suggestion.title = suggestion.title.replace("Complete Guide", "Step-by-Step Guide")
          suggestion.keywords.push("specific", "detailed")
          break
        case "seo":
          suggestion.title = `${suggestion.title} [2024 Updated]`
          suggestion.keywords.push("2024", "updated", "latest")
          break
        case "creative":
          suggestion.title = suggestion.title.replace("Guide", "Journey")
          suggestion.keywords.push("creative", "unique", "innovative")
          break
        case "academic":
          suggestion.title = `Research-Based Analysis: ${suggestion.title}`
          suggestion.keywords.push("research", "analysis", "evidence")
          break
        case "trending":
          suggestion.title = `🔥 ${suggestion.title} - What Everyone's Talking About`
          suggestion.keywords.push("trending", "popular", "viral")
          break
      }
      return suggestion
    })
  }

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId)
    setEnhancementOptions((prev) => ({ ...prev, style: styleId as any }))
  }

  const handleUseSuggestion = (suggestion: any) => {
    onTopicSelect(suggestion.title)
    setIsOpen(false)
  }

  const copySuggestion = async (suggestion: any) => {
    try {
      await navigator.clipboard.writeText(suggestion.title)
      setCopiedSuggestion(suggestion.id)
      setTimeout(() => setCopiedSuggestion(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const selectedStyleData = ENHANCEMENT_STYLES.find((s) => s.id === selectedStyle)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className={`flex items-center gap-2 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:scale-105 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Wand2 className="h-4 w-4" />
          <span className="hidden sm:inline">Enhance Topic</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Wand2 className="h-5 w-5" />
            AI Prompt Enhancer
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Transform your basic topic into compelling, engaging blog post ideas using AI
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Enhancement Options */}
          <div className="lg:col-span-1 flex flex-col min-h-0 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Enhancement Options
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Custom Topic Input */}
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Topic to Enhance</Label>
                <Textarea
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder={currentTopic || "Enter your blog topic here..."}
                  className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  rows={3}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty to use current topic: "{currentTopic}"
                </p>
              </div>

              {/* Enhancement Style */}
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 block">
                  Enhancement Style
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {ENHANCEMENT_STYLES.map((style) => {
                    const Icon = style.icon
                    const isSelected = selectedStyle === style.id
                    return (
                      <Button
                        key={style.id}
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => handleStyleSelect(style.id)}
                        className={`h-auto p-3 flex items-start gap-3 text-left ${
                          isSelected
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "hover:bg-purple-50 dark:hover:bg-purple-900/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{style.name}</div>
                          <div
                            className={`text-xs mt-1 ${
                              isSelected ? "text-purple-100" : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {style.description}
                          </div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Target Audience</Label>
                <Select
                  value={enhancementOptions.audience}
                  onValueChange={(value) => setEnhancementOptions((prev) => ({ ...prev, audience: value as any }))}
                >
                  <SelectTrigger className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIENCE_OPTIONS.map((audience) => (
                      <SelectItem key={audience.id} value={audience.id}>
                        <div>
                          <div className="font-medium">{audience.name}</div>
                          <div className="text-xs text-gray-500">{audience.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Content Intent */}
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Content Intent</Label>
                <Select
                  value={enhancementOptions.intent}
                  onValueChange={(value) => setEnhancementOptions((prev) => ({ ...prev, intent: value as any }))}
                >
                  <SelectTrigger className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INTENT_OPTIONS.map((intent) => (
                      <SelectItem key={intent.id} value={intent.id}>
                        <div>
                          <div className="font-medium">{intent.name}</div>
                          <div className="text-xs text-gray-500">{intent.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Enhance Button */}
              <Button
                onClick={handleEnhance}
                disabled={isEnhancing || (!customTopic.trim() && !currentTopic.trim())}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isEnhancing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Enhance Topic
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Enhanced Suggestions */}
          <div className="lg:col-span-2 flex flex-col min-h-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Enhanced Topic Suggestions
                {suggestions.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {suggestions.length} suggestions
                  </Badge>
                )}
              </h3>
              {suggestions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEnhance}
                  disabled={isEnhancing}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              )}
            </div>

            {suggestions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <Lightbulb className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Ready to Enhance</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Click "Enhance Topic" to generate compelling blog post ideas
                </p>
                {selectedStyleData && (
                  <div className="flex items-center gap-2">
                    <selectedStyleData.icon className="h-4 w-4" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Using {selectedStyleData.name} style
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <Card
                      key={suggestion.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedSuggestion === suggestion.id
                          ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => setSelectedSuggestion(suggestion.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                #{index + 1}
                              </Badge>
                              <Badge className={`text-xs ${selectedStyleData?.color || ""}`}>
                                {suggestion.category}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-1 h-1 rounded-full mr-0.5 ${
                                        i < Math.floor(suggestion.score / 20)
                                          ? "bg-green-500"
                                          : "bg-gray-300 dark:bg-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{suggestion.score}%</span>
                              </div>
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                              {suggestion.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {suggestion.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {suggestion.keywords.slice(0, 4).map((keyword, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                              {suggestion.keywords.length > 4 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{suggestion.keywords.length - 4} more
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic">💡 {suggestion.reasoning}</p>
                          </div>
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUseSuggestion(suggestion)
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white h-8"
                            >
                              <ArrowRight className="h-3 w-3 mr-1" />
                              Use
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                copySuggestion(suggestion)
                              }}
                              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 h-8 w-8 p-0"
                            >
                              {copiedSuggestion === suggestion.id ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
