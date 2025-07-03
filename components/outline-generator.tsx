"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, List, ArrowRight, Clock, Target, Users, Lightbulb, CheckCircle, Edit3 } from "lucide-react"

interface OutlineGeneratorProps {
  onUseOutline: (topic: string, outline: string) => void
  disabled?: boolean
}

interface OutlineSection {
  id: string
  title: string
  description: string
  estimatedWords: number
  keyPoints: string[]
}

interface GeneratedOutline {
  title: string
  introduction: string
  sections: OutlineSection[]
  conclusion: string
  totalWords: number
  estimatedReadTime: string
  targetAudience: string
  keyTakeaways: string[]
}

export function OutlineGenerator({ onUseOutline, disabled }: OutlineGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [topic, setTopic] = useState("")
  const [targetAudience, setTargetAudience] = useState("general")
  const [contentGoal, setContentGoal] = useState("inform")
  const [desiredLength, setDesiredLength] = useState("medium")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedOutline, setGeneratedOutline] = useState<GeneratedOutline | null>(null)

  const handleGenerateOutline = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)

    // Simulate outline generation
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Generate mock outline based on inputs
    const mockOutline: GeneratedOutline = {
      title: topic,
      introduction: `An engaging introduction that hooks the reader and establishes the importance of ${topic.toLowerCase()}. This section will provide context and preview what readers will learn.`,
      sections: [
        {
          id: "1",
          title: `Understanding ${topic}`,
          description: "Foundational concepts and definitions",
          estimatedWords: 200,
          keyPoints: [
            "Core definitions and terminology",
            "Historical context and background",
            "Why this topic matters today",
          ],
        },
        {
          id: "2",
          title: `Key Benefits and Applications`,
          description: "Practical advantages and real-world uses",
          estimatedWords: 250,
          keyPoints: [
            "Primary benefits and advantages",
            "Real-world applications and examples",
            "Success stories and case studies",
          ],
        },
        {
          id: "3",
          title: `Best Practices and Implementation`,
          description: "Actionable strategies and methods",
          estimatedWords: 300,
          keyPoints: [
            "Step-by-step implementation guide",
            "Common pitfalls to avoid",
            "Expert tips and recommendations",
          ],
        },
        {
          id: "4",
          title: `Future Trends and Considerations`,
          description: "Looking ahead and preparing for changes",
          estimatedWords: 200,
          keyPoints: [
            "Emerging trends and developments",
            "Future challenges and opportunities",
            "Preparing for what's next",
          ],
        },
      ],
      conclusion:
        "A compelling conclusion that summarizes key insights, reinforces the main message, and provides clear next steps for readers.",
      totalWords: desiredLength === "short" ? 400 : desiredLength === "medium" ? 800 : 1200,
      estimatedReadTime: desiredLength === "short" ? "2-3 min" : desiredLength === "medium" ? "4-5 min" : "6-8 min",
      targetAudience: targetAudience,
      keyTakeaways: [
        `Clear understanding of ${topic.toLowerCase()} fundamentals`,
        "Practical strategies for implementation",
        "Awareness of future trends and opportunities",
        "Actionable next steps for continued learning",
      ],
    }

    setGeneratedOutline(mockOutline)
    setIsGenerating(false)
  }

  const handleUseOutlineForGeneration = () => {
    if (!generatedOutline) return

    const outlineText = `
# ${generatedOutline.title}

## Introduction
${generatedOutline.introduction}

${generatedOutline.sections
  .map(
    (section) => `
## ${section.title}
${section.description}

Key points to cover:
${section.keyPoints.map((point) => `- ${point}`).join("\n")}
`,
  )
  .join("\n")}

## Conclusion
${generatedOutline.conclusion}

Target Audience: ${generatedOutline.targetAudience}
Estimated Length: ${generatedOutline.totalWords} words
Reading Time: ${generatedOutline.estimatedReadTime}
    `.trim()

    onUseOutline(generatedOutline.title, outlineText)
    setIsOpen(false)
  }

  const resetForm = () => {
    setTopic("")
    setTargetAudience("general")
    setContentGoal("inform")
    setDesiredLength("medium")
    setAdditionalNotes("")
    setGeneratedOutline(null)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className={`flex items-center gap-2 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <List className="h-4 w-4" />
          <span className="hidden sm:inline">Generate Outline</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <FileText className="h-5 w-5" />
            Content Outline Generator
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Create a detailed outline before generating your full blog post
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-6 min-h-0 overflow-hidden">
          {/* Input Form */}
          <div className="flex flex-col min-h-0 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Outline Parameters
              </h3>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Blog Topic</Label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter your blog topic..."
                    className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Target Audience</Label>
                  <Select value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Audience</SelectItem>
                      <SelectItem value="beginners">Beginners</SelectItem>
                      <SelectItem value="professionals">Professionals</SelectItem>
                      <SelectItem value="experts">Experts</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Content Goal</Label>
                  <Select value={contentGoal} onValueChange={setContentGoal}>
                    <SelectTrigger className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inform">Inform & Educate</SelectItem>
                      <SelectItem value="persuade">Persuade & Convince</SelectItem>
                      <SelectItem value="entertain">Entertain & Engage</SelectItem>
                      <SelectItem value="inspire">Inspire & Motivate</SelectItem>
                      <SelectItem value="guide">Guide & Instruct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Desired Length</Label>
                  <Select value={desiredLength} onValueChange={setDesiredLength}>
                    <SelectTrigger className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (300-500 words)</SelectItem>
                      <SelectItem value="medium">Medium (600-900 words)</SelectItem>
                      <SelectItem value="long">Long (1000+ words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Additional Notes</Label>
                  <Textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any specific requirements, key points to include, or style preferences..."
                    className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleGenerateOutline}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Outline...
                    </>
                  ) : (
                    <>
                      <List className="h-4 w-4 mr-2" />
                      Generate Outline
                    </>
                  )}
                </Button>
              </div>
            </ScrollArea>
          </div>

          {/* Generated Outline */}
          <div className="flex flex-col min-h-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Generated Outline
              </h3>
              {generatedOutline && (
                <Button
                  onClick={handleUseOutlineForGeneration}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <ArrowRight className="h-3 w-3 mr-1" />
                  Use Outline
                </Button>
              )}
            </div>

            {!generatedOutline && !isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <Lightbulb className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Ready to Create Outline</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Fill in the parameters and generate a detailed content outline
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Creating Your Outline...</h3>
                <p className="text-gray-500 dark:text-gray-400">Analyzing your topic and structuring the content</p>
              </div>
            )}

            {generatedOutline && (
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {/* Outline Header */}
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{generatedOutline.title}</h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {generatedOutline.targetAudience}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {generatedOutline.totalWords} words
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {generatedOutline.estimatedReadTime}
                      </Badge>
                    </div>
                  </div>

                  {/* Introduction */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Introduction
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{generatedOutline.introduction}</p>
                    </CardContent>
                  </Card>

                  {/* Sections */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Main Sections</h3>
                    {generatedOutline.sections.map((section, index) => (
                      <Card key={section.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center justify-between">
                            <span>
                              {index + 1}. {section.title}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              ~{section.estimatedWords} words
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Key Points:</p>
                            <ul className="space-y-1">
                              {section.keyPoints.map((point, i) => (
                                <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Conclusion */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Conclusion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{generatedOutline.conclusion}</p>
                    </CardContent>
                  </Card>

                  {/* Key Takeaways */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Key Takeaways
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {generatedOutline.keyTakeaways.map((takeaway, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
