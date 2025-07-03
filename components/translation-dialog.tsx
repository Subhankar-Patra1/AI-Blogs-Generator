"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Languages, ArrowRight, Copy, Check, Download } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface TranslationDialogProps {
  originalContent: string
  originalLanguage: string
  onTranslate: (targetLanguage: string) => Promise<string>
  onUseTranslation: (translatedContent: string, targetLanguage: string) => void
}

const POPULAR_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
]

export function TranslationDialog({
  originalContent,
  originalLanguage,
  onTranslate,
  onUseTranslation,
}: TranslationDialogProps) {
  const [targetLanguage, setTargetLanguage] = useState("")
  const [translatedContent, setTranslatedContent] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleTranslate = async () => {
    if (!targetLanguage) return

    setIsTranslating(true)
    try {
      const result = await onTranslate(targetLanguage)
      setTranslatedContent(result)
    } catch (error) {
      console.error("Translation failed:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translatedContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadTranslation = () => {
    const targetLang = POPULAR_LANGUAGES.find((lang) => lang.code === targetLanguage)
    const blob = new Blob([translatedContent], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `translated-blog-post-${targetLang?.code || "unknown"}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sourceLang = POPULAR_LANGUAGES.find((lang) => lang.code === originalLanguage)
  const targetLang = POPULAR_LANGUAGES.find((lang) => lang.code === targetLanguage)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">Translate</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Languages className="h-5 w-5" />
            Translate Blog Post
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Translate your blog post to different languages using AI
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Language Selection - Fixed Header */}
          <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                >
                  {sourceLang?.flag} {sourceLang?.nativeName || originalLanguage}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">From</span>
              </div>

              <ArrowRight className="h-4 w-4 text-gray-400 hidden sm:block" />
              <div className="sm:hidden w-full border-t border-gray-200 dark:border-gray-700 my-2"></div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Select target language">
                      {targetLang && (
                        <div className="flex items-center gap-2">
                          <span>{targetLang.flag}</span>
                          <span>{targetLang.nativeName}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    {POPULAR_LANGUAGES.filter((lang) => lang.code !== originalLanguage).map((language) => (
                      <SelectItem
                        key={language.code}
                        value={language.code}
                        className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <span>{language.flag}</span>
                          <span>{language.nativeName}</span>
                          <span className="text-gray-500 dark:text-gray-400">({language.name})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleTranslate}
                  disabled={!targetLanguage || isTranslating}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
                >
                  {isTranslating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Translating...
                    </>
                  ) : (
                    <>
                      <Languages className="h-4 w-4 mr-2" />
                      Translate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Translation Results - Scrollable Content */}
          {translatedContent && (
            <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
              {/* Original Content */}
              <div className="flex flex-col min-h-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {sourceLang?.flag} Original ({sourceLang?.nativeName})
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-xs w-fit bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
                  >
                    {originalContent.split(/\s+/).filter((word) => word.length > 0).length} words
                  </Badge>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <MarkdownRenderer content={originalContent} />
                  </div>
                </ScrollArea>
              </div>

              {/* Translated Content */}
              <div className="flex flex-col min-h-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {targetLang?.flag} Translation ({targetLang?.nativeName})
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
                    >
                      {translatedContent.split(/\s+/).filter((word) => word.length > 0).length} words
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 h-8 w-8 p-0"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadTranslation}
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 h-8 w-8 p-0"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <MarkdownRenderer content={translatedContent} />
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Action Buttons - Fixed Footer */}
          {translatedContent && (
            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setTranslatedContent("")
                  setTargetLanguage("")
                }}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 w-full sm:w-auto"
              >
                Clear
              </Button>
              <Button
                onClick={() => onUseTranslation(translatedContent, targetLanguage)}
                className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
              >
                Use This Translation
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
