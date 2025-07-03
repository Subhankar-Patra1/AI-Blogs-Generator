"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, Sparkles } from "lucide-react"

interface TopicSuggestionsProps {
  onSelectTopic: (topic: string) => void
  currentTopic: string
}

const TRENDING_TOPICS = [
  "The Future of Artificial Intelligence in Healthcare",
  "Remote Work: Benefits and Challenges in 2024",
  "Sustainable Living: Simple Steps for a Greener Lifestyle",
  "Digital Marketing Trends That Will Dominate This Year",
  "Mental Health Awareness in the Modern Workplace",
  "Cryptocurrency and Blockchain: A Beginner's Guide",
  "The Rise of Electric Vehicles and Their Impact",
  "Social Media's Influence on Modern Communication",
  "Healthy Eating Habits for Busy Professionals",
  "The Evolution of E-commerce and Online Shopping",
]

const CATEGORY_TOPICS = {
  Technology: [
    "Latest Smartphone Features and Innovations",
    "Cloud Computing Benefits for Small Businesses",
    "Cybersecurity Best Practices for Remote Workers",
    "The Impact of 5G Technology on Daily Life",
  ],
  Health: [
    "Benefits of Regular Exercise and Fitness",
    "Nutrition Tips for a Balanced Diet",
    "Managing Stress in a Fast-Paced World",
    "The Importance of Quality Sleep",
  ],
  Business: [
    "Entrepreneurship Tips for First-Time Founders",
    "Building a Strong Personal Brand Online",
    "Effective Leadership Strategies for Teams",
    "Customer Service Excellence in Digital Age",
  ],
  Lifestyle: [
    "Minimalism: Living with Less for More Happiness",
    "Travel Tips for Budget-Conscious Adventurers",
    "Home Organization Hacks That Actually Work",
    "Building Meaningful Relationships in Digital Age",
  ],
  Education: [
    "Online Learning vs Traditional Education",
    "Skills Every Professional Should Develop",
    "The Future of Higher Education",
    "Lifelong Learning in a Changing World",
  ],
}

export function TopicSuggestions({ onSelectTopic, currentTopic }: TopicSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredTopics, setFilteredTopics] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    if (currentTopic.length > 2) {
      const allTopics = [...TRENDING_TOPICS, ...Object.values(CATEGORY_TOPICS).flat()]
      const filtered = allTopics.filter((topic) => topic.toLowerCase().includes(currentTopic.toLowerCase()))
      setFilteredTopics(filtered.slice(0, 5))
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
      setFilteredTopics([])
    }
  }, [currentTopic])

  const handleTopicSelect = (topic: string) => {
    onSelectTopic(topic)
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-4">
      {/* Auto-complete suggestions */}
      {showSuggestions && filteredTopics.length > 0 && (
        <Card className="border border-purple-200 dark:border-purple-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Suggested Topics</span>
            </div>
            <div className="space-y-1">
              {filteredTopics.map((topic, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTopicSelect(topic)}
                  className="w-full justify-start text-left h-auto p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{topic}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Topic inspiration section */}
      {!currentTopic && (
        <Card className="border border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">Need Inspiration?</span>
            </div>

            {/* Trending Topics */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trending Topics</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TOPICS.slice(0, 3).map((topic, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                    onClick={() => handleTopicSelect(topic)}
                  >
                    {topic.length > 40 ? topic.substring(0, 40) + "..." : topic}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Browse by Category
              </span>
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.keys(CATEGORY_TOPICS).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Category Topics */}
              {selectedCategory && (
                <div className="space-y-1">
                  {CATEGORY_TOPICS[selectedCategory as keyof typeof CATEGORY_TOPICS].map((topic, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTopicSelect(topic)}
                      className="w-full justify-start text-left h-auto p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{topic}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
