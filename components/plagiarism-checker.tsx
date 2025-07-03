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
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, Search } from "lucide-react"

interface PlagiarismCheckerProps {
  content: string
}

interface PlagiarismResult {
  overallScore: number
  status: "excellent" | "good" | "warning" | "poor"
  matches: Array<{
    id: string
    text: string
    similarity: number
    source: string
    type: "exact" | "paraphrased" | "similar"
  }>
  suggestions: string[]
}

export function PlagiarismChecker({ content }: PlagiarismCheckerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<PlagiarismResult | null>(null)

  const handleCheck = async () => {
    setIsChecking(true)

    // Simulate plagiarism checking process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate mock results based on content analysis
    const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length
    const uniquenessScore = Math.max(85, Math.min(98, 90 + Math.random() * 8))

    const mockResult: PlagiarismResult = {
      overallScore: uniquenessScore,
      status:
        uniquenessScore >= 95
          ? "excellent"
          : uniquenessScore >= 85
            ? "good"
            : uniquenessScore >= 70
              ? "warning"
              : "poor",
      matches:
        uniquenessScore < 95
          ? [
              {
                id: "1",
                text: "Artificial intelligence has revolutionized the way we approach technology",
                similarity: Math.round((100 - uniquenessScore) * 0.8),
                source: "TechCrunch Article (2023)",
                type: "similar",
              },
              {
                id: "2",
                text: "The future of AI depends on ethical considerations",
                similarity: Math.round((100 - uniquenessScore) * 0.6),
                source: "MIT Technology Review",
                type: "paraphrased",
              },
            ]
          : [],
      suggestions: [
        "Consider rephrasing common industry terms with more specific language",
        "Add more personal insights and unique perspectives",
        "Include original examples and case studies",
        "Use more distinctive vocabulary and sentence structures",
      ],
    }

    setResult(mockResult)
    setIsChecking(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <ShieldCheck className="h-5 w-5 text-green-600" />
      case "good":
        return <Shield className="h-5 w-5 text-blue-600" />
      case "warning":
        return <ShieldAlert className="h-5 w-5 text-yellow-600" />
      case "poor":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Shield className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
      case "good":
        return "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
      case "poor":
        return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Check Plagiarism</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Shield className="h-5 w-5" />
            Plagiarism Checker
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Verify the uniqueness and originality of your blog content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!result && !isChecking && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Ready to Check Originality</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Analyze your content for potential plagiarism and get suggestions for improvement
              </p>
              <Button onClick={handleCheck} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Shield className="h-4 w-4 mr-2" />
                Start Plagiarism Check
              </Button>
            </div>
          )}

          {isChecking && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Analyzing Content...</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Checking for originality and potential matches</p>
              <Progress value={66} className="w-64 mx-auto" />
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card className={`border-2 ${getStatusColor(result.status)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span>Originality Score</span>
                    </div>
                    <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                      {result.overallScore}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={result.overallScore} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Uniqueness Level</span>
                      <span className="font-medium capitalize">{result.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Potential Matches */}
              {result.matches.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      Potential Matches ({result.matches.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48">
                      <div className="space-y-3">
                        {result.matches.map((match) => (
                          <div key={match.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 dark:text-gray-100 mb-1">"{match.text}"</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Source: {match.source}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge
                                  variant={
                                    match.similarity > 80
                                      ? "destructive"
                                      : match.similarity > 60
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {match.similarity}% similar
                                </Badge>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {match.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {/* Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Improvement Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  Check Again
                </Button>
                <Button onClick={() => setIsOpen(false)} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Continue with Content
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
