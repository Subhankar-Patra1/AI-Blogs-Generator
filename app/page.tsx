"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { generateBlog, generateSampleBlog, translateContent, enhanceTopic } from "./actions/generateBlog"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Copy, Check, ExternalLink, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { HistoryDialog } from "@/components/history-dialog"
import { GlossyGenerateButton } from "@/components/glossy-generate-button"
import { ThemeProvider } from "@/contexts/theme-context"
import { HistoryProvider, useHistory } from "@/contexts/history-context"
import { TopicSuggestions } from "@/components/topic-suggestions"
import { StyleToneSelector, type StyleToneSettings } from "@/components/style-tone-selector"
import { WordCountSelector, type WordCountSettings } from "@/components/word-count-selector"
import { LanguageSelector, type LanguageSettings } from "@/components/language-selector"
import { RichTextEditor } from "@/components/rich-text-editor"
import { VersionHistory } from "@/components/version-history"
import { TranslationDialog } from "@/components/translation-dialog"
import { DownloadDialog } from "@/components/download-dialog"
import { PromptEnhancer } from "@/components/prompt-enhancer"
import { ContentRepurposingDialog } from "@/components/content-repurposing-dialog"
import { generateContentRepurposing } from "./actions/contentRepurposing"
import { BlogPreview } from "@/components/blog-preview"
import { PlagiarismChecker } from "@/components/plagiarism-checker"
import { OutlineGenerator } from "@/components/outline-generator"
import { SettingsDialog } from "@/components/settings-dialog"
import { IntegrationWarningDialog } from "@/components/integration-warning-dialog"

function BlogGeneratorContent() {
  const [topic, setTopic] = useState("")
  const [blogPost, setBlogPost] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [errorType, setErrorType] = useState("")
  const [copied, setCopied] = useState(false)
  const [isSample, setIsSample] = useState(false)
  const [styleToneSettings, setStyleToneSettings] = useState<StyleToneSettings>({
    tone: "conversational",
    style: "blog-post",
  })
  const [wordCountSettings, setWordCountSettings] = useState<WordCountSettings>({
    length: "medium",
    wordCount: 700,
    estimatedReadTime: "3-4 min read",
  })
  const [languageSettings, setLanguageSettings] = useState<LanguageSettings>({
    language: "English",
    languageCode: "en",
    nativeName: "English",
    direction: "ltr",
  })

  const [versions, setVersions] = useState<
    Array<{
      id: string
      content: string
      timestamp: number
      wordCount: number
      changeDescription: string
    }>
  >([])
  const [isTranslating, setIsTranslating] = useState(false)

  const { addToHistory } = useHistory()

  const [isEditMode, setIsEditMode] = useState(false)
  const [showOutlineGenerator, setShowOutlineGenerator] = useState(false)
  const [generatedOutline, setGeneratedOutline] = useState("")

  const [hasApiKey, setHasApiKey] = useState(true)

  // Check for API key on mount and when settings dialog closes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = localStorage.getItem("blog-generator-api-key")
      setHasApiKey(!!key)
    }
    // Listen for custom event from SettingsDialog
    const handler = () => {
      const key = localStorage.getItem("blog-generator-api-key")
      setHasApiKey(!!key)
    }
    window.addEventListener("api-key-updated", handler)
    return () => window.removeEventListener("api-key-updated", handler)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setIsLoading(true)
    setError("")
    setBlogPost("")
    setErrorType("")
    setIsSample(false)

    try {
      // Retrieve API key from localStorage
      let apiKey = '';
      if (typeof window !== 'undefined') {
        apiKey = localStorage.getItem('blog-generator-api-key') || '';
      }
      const result = await generateBlog(topic.trim(), {
        tone: styleToneSettings.tone,
        style: styleToneSettings.style,
        wordCount: wordCountSettings.wordCount,
        length: wordCountSettings.length,
        language: languageSettings.language,
        languageCode: languageSettings.languageCode,
      }, apiKey)

      if (result.success) {
        setBlogPost(result.content)
        setIsEditMode(false)
        setIsSample(result.isSample || false)
        // Save initial version
        saveVersion(result.content, `AI Generated in ${languageSettings.language}`)
        // Add to history
        addToHistory(topic.trim(), result.content, result.isSample || false)
      } else {
        setError(result.error || "Failed to generate blog post")
        setErrorType(result.errorType || "unknown")
      }
    } catch (err) {
      console.error("Client error:", err)
      setError("Network error. Please check your connection and try again.")
      setErrorType("network")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSample = async () => {
    if (!topic.trim()) return

    setIsLoading(true)
    setError("")
    setBlogPost("")
    setErrorType("")

    try {
      const result = await generateSampleBlog(topic.trim(), {
        tone: styleToneSettings.tone,
        style: styleToneSettings.style,
        wordCount: wordCountSettings.wordCount,
        length: wordCountSettings.length,
        language: languageSettings.language,
        languageCode: languageSettings.languageCode,
      })
      if (result.success) {
        setBlogPost(result.content)
        setIsEditMode(false)
        setIsSample(true)
        // Save initial version
        saveVersion(result.content, `Sample Generated in ${languageSettings.language}`)
        // Add to history
        addToHistory(topic.trim(), result.content, true)
      }
    } catch (err) {
      console.error("Sample generation error:", err)
      setError("Failed to generate sample blog post")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectFromHistory = (historyTopic: string, historyContent: string, historySample: boolean) => {
    setTopic(historyTopic)
    setBlogPost(historyContent)
    setIsSample(historySample)
    setError("")
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(blogPost)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const getErrorAlert = () => {
    if (errorType === "quota") {
      return (
        <Alert variant="destructive" className="mb-8 border-red-200 dark:border-red-800">
          <CreditCard className="h-4 w-4" />
          <AlertTitle>Google AI API Quota Exceeded</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{error}</p>
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <Button variant="outline" size="sm" onClick={handleGenerateSample} disabled={isLoading}>
                Generate Sample Blog Post
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  Check Google AI Console <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )
    }

    if (errorType === "auth") {
      return (
        <Alert variant="destructive" className="mb-8 border-red-200 dark:border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{error}</p>
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <Button variant="outline" size="sm" onClick={handleGenerateSample} disabled={isLoading}>
                Generate Sample Blog Post
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  Get Gemini API Key <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )
    }

    return (
      <Alert variant="destructive" className="mb-8 border-red-200 dark:border-red-800">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          {(errorType === "quota" || errorType === "auth") && (
            <Button variant="outline" size="sm" className="mt-2" onClick={handleGenerateSample} disabled={isLoading}>
              Try Sample Generation
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  const handleTopicSelect = (selectedTopic: string) => {
    setTopic(selectedTopic)
  }

  const saveVersion = (content: string, description: string) => {
    const newVersion = {
      id: Date.now().toString(),
      content,
      timestamp: Date.now(),
      wordCount: content.split(/\s+/).filter((word) => word.length > 0).length,
      changeDescription: description,
    }
    setVersions((prev) => [newVersion, ...prev.slice(0, 9)]) // Keep only last 10 versions
  }

  const handleContentEdit = (newContent: string) => {
    setBlogPost(newContent)
  }

  const handleSaveEdit = (content: string) => {
    saveVersion(content, "Manual edit")
  }

  const handleRestoreVersion = (content: string) => {
    setBlogPost(content)
    saveVersion(content, "Restored from version history")
  }

  const handleDeleteVersion = (id: string) => {
    setVersions((prev) => prev.filter((v) => v.id !== id))
  }

  const handleClearVersions = () => {
    setVersions([])
  }

  const handleTranslate = async (targetLanguageCode: string): Promise<string> => {
    setIsTranslating(true)
    try {
      const targetLanguage = getLanguageByCode(targetLanguageCode)
      // Retrieve API key from localStorage
      let apiKey = '';
      if (typeof window !== 'undefined') {
        apiKey = localStorage.getItem('blog-generator-api-key') || '';
      }
      const result = await translateContent(blogPost, targetLanguage?.name || "English", targetLanguageCode, apiKey)
      if (result.success) {
        return result.content
      } else {
        throw new Error(result.error)
      }
    } finally {
      setIsTranslating(false)
    }
  }

  const handleUseTranslation = (translatedContent: string, targetLanguageCode: string) => {
    setBlogPost(translatedContent)
    const targetLanguage = getLanguageByCode(targetLanguageCode)
    if (targetLanguage) {
      setLanguageSettings({
        language: targetLanguage.name,
        languageCode: targetLanguage.code,
        nativeName: targetLanguage.nativeName,
        direction: targetLanguage.direction,
      })
    }
    saveVersion(translatedContent, `Translated to ${targetLanguage?.name || "Unknown"}`)
  }

  const handleEnhanceTopic = async (originalTopic: string, options: any) => {
    try {
      // Retrieve API key from localStorage
      let apiKey = '';
      if (typeof window !== 'undefined') {
        apiKey = localStorage.getItem('blog-generator-api-key') || '';
      }
      const result = await enhanceTopic(originalTopic, options, apiKey)
      return result
    } catch (error) {
      console.error("Enhancement failed:", error)
      return {
        success: false,
        suggestions: [],
        error: "Failed to enhance topic",
      }
    }
  }

  const getLanguageByCode = (code: string) => {
    const languages = [
      { code: "en", name: "English", nativeName: "English", direction: "ltr" as const },
      { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr" as const },
      { code: "fr", name: "French", nativeName: "Français", direction: "ltr" as const },
      { code: "de", name: "German", nativeName: "Deutsch", direction: "ltr" as const },
      { code: "it", name: "Italian", nativeName: "Italiano", direction: "ltr" as const },
      { code: "pt", name: "Portuguese", nativeName: "Português", direction: "ltr" as const },
      { code: "ru", name: "Russian", nativeName: "Русский", direction: "ltr" as const },
      { code: "ja", name: "Japanese", nativeName: "日本語", direction: "ltr" as const },
      { code: "zh", name: "Chinese", nativeName: "中文", direction: "ltr" as const },
    ]
    return languages.find((lang) => lang.code === code)
  }

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode)
  }

  const handleUseOutline = (outlineTopic: string, outlineContent: string) => {
    setTopic(outlineTopic)
    // You could also pre-populate some settings based on the outline
  }

  // Error alert for missing API key
  const getApiKeyErrorAlert = () => (
    <Alert variant="destructive" className="mb-8 border-red-200 dark:border-red-800">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Authentication Error</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>API key required. Please add your Google Gemini API key in settings.</p>
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              Get Gemini API Key <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <IntegrationWarningDialog />
      <main
        className="flex-grow bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 transition-colors duration-300 p-4"
        dir={languageSettings.direction}
      >
        <div className="container mx-auto max-w-5xl px-2 sm:px-4">
          {/* Header with Theme Toggle and History */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Title and subtitle on the left */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full">
                    <div className="h-8 w-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                      <div className="h-4 w-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
                AI Blog Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                Effortlessly turn your ideas into engaging blog posts.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Powered by Google's Gemini AI • {languageSettings.nativeName} Support
              </p>
            </div>
            {/* Buttons on the right */}
            <div className="flex-shrink-0 flex gap-2 sm:gap-3 items-center pt-2 w-full sm:w-auto justify-end">
              <HistoryDialog onSelectPost={handleSelectFromHistory} />
              <ThemeToggle />
              <SettingsDialog />
            </div>
          </div>

          {/* Show API key error if missing */}
          {!hasApiKey && getApiKeyErrorAlert()}

          <Card className="mb-8 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors duration-300 w-full">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">Generate Your Blog Post</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Enter a topic and let Gemini AI create an engaging blog post for you in {languageSettings.nativeName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={hasApiKey ? handleSubmit : e => e.preventDefault()} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The Future of Artificial Intelligence, Healthy Cooking Tips, Remote Work Benefits..."
                    className="flex-1 border-purple-200 dark:border-purple-700 focus:border-purple-400 dark:focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 h-11"
                    disabled={isLoading}
                    dir={languageSettings.direction}
                  />
                  <OutlineGenerator onUseOutline={hasApiKey ? handleUseOutline : undefined} disabled={!hasApiKey} />
                  <PromptEnhancer currentTopic={topic} onTopicSelect={handleTopicSelect} onEnhance={hasApiKey ? handleEnhanceTopic : undefined} disabled={!hasApiKey} />
                  <GlossyGenerateButton onClick={hasApiKey ? () => {} : undefined} disabled={isLoading || !topic.trim() || !hasApiKey} isLoading={isLoading} />
                </div>
                <TopicSuggestions onSelectTopic={handleTopicSelect} currentTopic={topic} />
                <LanguageSelector
                  onSettingsChange={setLanguageSettings}
                  currentSettings={languageSettings}
                  isTranslating={isTranslating}
                  disabled={!hasApiKey}
                />
                <StyleToneSelector onSettingsChange={setStyleToneSettings} currentSettings={styleToneSettings} disabled={!hasApiKey} />
                <WordCountSelector onSettingsChange={setWordCountSettings} currentSettings={wordCountSettings} />
              </form>
            </CardContent>
          </Card>

          {error && hasApiKey && getErrorAlert()}

          {blogPost && hasApiKey && (
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm transition-colors duration-300 overflow-hidden w-full">
              {/* Fixed Header with proper button layout */}
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white">
                <div className="space-y-4">
                  {/* Title and Description */}
                  <div>
                    <CardTitle className="flex flex-wrap items-center gap-2 text-white mb-2 text-base sm:text-lg lg:text-xl">
                      Generated Blog Post
                      {isSample && (
                        <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full whitespace-nowrap">
                          Sample
                        </span>
                      )}
                      <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full whitespace-nowrap">
                        {languageSettings.nativeName}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-purple-100 dark:text-purple-200">
                      {isSample
                        ? `Sample blog post generated in ${languageSettings.nativeName} due to API limitations`
                        : `Your Gemini AI-generated content in ${languageSettings.nativeName} is ready!`}
                    </CardDescription>
                  </div>

                  {/* Action buttons in a grid layout to prevent overlapping */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    <TranslationDialog
                      originalContent={blogPost}
                      originalLanguage={languageSettings.languageCode}
                      onTranslate={handleTranslate}
                      onUseTranslation={handleUseTranslation}
                    />
                    <VersionHistory
                      versions={versions}
                      onRestoreVersion={handleRestoreVersion}
                      onDeleteVersion={handleDeleteVersion}
                      onClearHistory={handleClearVersions}
                    />
                    <DownloadDialog
                      content={blogPost}
                      title={topic}
                      language={languageSettings.language}
                      languageCode={languageSettings.languageCode}
                    />
                    <PlagiarismChecker content={blogPost} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex items-center justify-center gap-2 px-4 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 flex-shrink-0" />
                          <span className="hidden sm:inline truncate">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 flex-shrink-0" />
                          <span className="hidden sm:inline truncate">Copy</span>
                        </>
                      )}
                    </Button>
                    <ContentRepurposingDialog
                      blogContent={blogPost}
                      blogTitle={topic}
                      onGenerate={async (content, format, options) => {
                        let apiKey = '';
                        if (typeof window !== 'undefined') {
                          apiKey = localStorage.getItem('blog-generator-api-key') || '';
                        }
                        return await generateContentRepurposing(content, format, options, apiKey);
                      }}
                    />
                  </div>
                </div>
              </CardHeader>

              {/* Scrollable Content Area */}
              <div className="h-[60vh] sm:h-[70vh] overflow-hidden">
                <div className="h-full p-4 sm:p-6" dir={languageSettings.direction}>
                  {isEditMode ? (
                    <RichTextEditor
                      content={blogPost}
                      onContentChange={handleContentEdit}
                      onSave={handleSaveEdit}
                      onCancel={handleEditToggle}
                    />
                  ) : (
                    <BlogPreview content={blogPost} onEdit={handleEditToggle} direction={languageSettings.direction} />
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full py-6 bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 border-t border-purple-200 dark:border-purple-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-base font-medium text-gray-700 dark:text-gray-200">
            © 2025 AI Blog Generator. All rights reserved.
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Built with <span className="text-pink-500 dark:text-pink-400">❤️</span> by Subhankar Patra
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function BlogGenerator() {
  return (
    <ThemeProvider>
      <HistoryProvider>
        <BlogGeneratorContent />
      </HistoryProvider>
    </ThemeProvider>
  )
}
