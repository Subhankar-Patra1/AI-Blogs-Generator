"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Languages, ChevronDown, ChevronUp, Zap } from "lucide-react"

export interface LanguageSettings {
  language: string
  languageCode: string
  nativeName: string
  direction: "ltr" | "rtl"
}

interface LanguageSelectorProps {
  onSettingsChange: (settings: LanguageSettings) => void
  currentSettings: LanguageSettings
  onTranslate?: (targetLanguage: LanguageSettings) => void
  isTranslating?: boolean
}

const SUPPORTED_LANGUAGES = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr" as const,
    flag: "🇺🇸",
    popular: true,
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    direction: "ltr" as const,
    flag: "🇪🇸",
    popular: true,
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    direction: "ltr" as const,
    flag: "🇫🇷",
    popular: true,
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    direction: "ltr" as const,
    flag: "🇩🇪",
    popular: true,
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    direction: "ltr" as const,
    flag: "🇮🇹",
    popular: true,
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    direction: "ltr" as const,
    flag: "🇵🇹",
    popular: true,
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    direction: "ltr" as const,
    flag: "🇷🇺",
    popular: true,
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    direction: "ltr" as const,
    flag: "🇯🇵",
    popular: true,
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    direction: "ltr" as const,
    flag: "🇰🇷",
    popular: false,
  },
  {
    code: "zh",
    name: "Chinese (Simplified)",
    nativeName: "简体中文",
    direction: "ltr" as const,
    flag: "🇨🇳",
    popular: true,
  },
  {
    code: "zh-TW",
    name: "Chinese (Traditional)",
    nativeName: "繁體中文",
    direction: "ltr" as const,
    flag: "🇹🇼",
    popular: false,
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    direction: "rtl" as const,
    flag: "🇸🇦",
    popular: false,
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    direction: "ltr" as const,
    flag: "🇮🇳",
    popular: false,
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    direction: "ltr" as const,
    flag: "🇧🇩",
    popular: false,
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    direction: "ltr" as const,
    flag: "🇹🇷",
    popular: false,
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    direction: "ltr" as const,
    flag: "🇳🇱",
    popular: false,
  },
  {
    code: "sv",
    name: "Swedish",
    nativeName: "Svenska",
    direction: "ltr" as const,
    flag: "🇸🇪",
    popular: false,
  },
  {
    code: "no",
    name: "Norwegian",
    nativeName: "Norsk",
    direction: "ltr" as const,
    flag: "🇳🇴",
    popular: false,
  },
  {
    code: "da",
    name: "Danish",
    nativeName: "Dansk",
    direction: "ltr" as const,
    flag: "🇩🇰",
    popular: false,
  },
  {
    code: "fi",
    name: "Finnish",
    nativeName: "Suomi",
    direction: "ltr" as const,
    flag: "🇫🇮",
    popular: false,
  },
  {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
    direction: "ltr" as const,
    flag: "🇵🇱",
    popular: false,
  },
  {
    code: "cs",
    name: "Czech",
    nativeName: "Čeština",
    direction: "ltr" as const,
    flag: "🇨🇿",
    popular: false,
  },
  {
    code: "hu",
    name: "Hungarian",
    nativeName: "Magyar",
    direction: "ltr" as const,
    flag: "🇭🇺",
    popular: false,
  },
  {
    code: "ro",
    name: "Romanian",
    nativeName: "Română",
    direction: "ltr" as const,
    flag: "🇷🇴",
    popular: false,
  },
  {
    code: "uk",
    name: "Ukrainian",
    nativeName: "Українська",
    direction: "ltr" as const,
    flag: "🇺🇦",
    popular: false,
  },
  {
    code: "th",
    name: "Thai",
    nativeName: "ไทย",
    direction: "ltr" as const,
    flag: "🇹🇭",
    popular: false,
  },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    direction: "ltr" as const,
    flag: "🇻🇳",
    popular: false,
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    direction: "ltr" as const,
    flag: "🇮🇩",
    popular: false,
  },
  {
    code: "ms",
    name: "Malay",
    nativeName: "Bahasa Melayu",
    direction: "ltr" as const,
    flag: "🇲🇾",
    popular: false,
  },
  {
    code: "he",
    name: "Hebrew",
    nativeName: "עברית",
    direction: "rtl" as const,
    flag: "🇮🇱",
    popular: false,
  },
]

export function LanguageSelector({
  onSettingsChange,
  currentSettings,
  onTranslate,
  isTranslating = false,
}: LanguageSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAllLanguages, setShowAllLanguages] = useState(false)

  const handleLanguageChange = (languageCode: string) => {
    const selectedLanguage = SUPPORTED_LANGUAGES.find((lang) => lang.code === languageCode)
    if (selectedLanguage) {
      const newSettings: LanguageSettings = {
        language: selectedLanguage.name,
        languageCode: selectedLanguage.code,
        nativeName: selectedLanguage.nativeName,
        direction: selectedLanguage.direction,
      }
      onSettingsChange(newSettings)
    }
  }

  const handleTranslate = (targetLanguageCode: string) => {
    const targetLanguage = SUPPORTED_LANGUAGES.find((lang) => lang.code === targetLanguageCode)
    if (targetLanguage && onTranslate) {
      const targetSettings: LanguageSettings = {
        language: targetLanguage.name,
        languageCode: targetLanguage.code,
        nativeName: targetLanguage.nativeName,
        direction: targetLanguage.direction,
      }
      onTranslate(targetSettings)
    }
  }

  const selectedLanguage = SUPPORTED_LANGUAGES.find((lang) => lang.code === currentSettings.languageCode)
  const popularLanguages = SUPPORTED_LANGUAGES.filter((lang) => lang.popular)
  const otherLanguages = SUPPORTED_LANGUAGES.filter((lang) => !lang.popular)

  return (
    <Card className="border border-purple-200 dark:border-purple-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
      <CardHeader className="cursor-pointer pb-3" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Language & Translation
          </CardTitle>
          <div className="flex items-center gap-2">
            {selectedLanguage && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>{selectedLanguage.flag}</span>
                  {selectedLanguage.nativeName}
                </Badge>
                {selectedLanguage.direction === "rtl" && (
                  <Badge variant="outline" className="text-xs">
                    RTL
                  </Badge>
                )}
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
        <CardContent className="pt-0 space-y-6">
          {/* Primary Language Selection */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Languages className="h-4 w-4" />
              Select Generation Language
            </h3>
            <Select value={currentSettings.languageCode} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a language">
                  {selectedLanguage && (
                    <div className="flex items-center gap-2">
                      <span>{selectedLanguage.flag}</span>
                      <span>{selectedLanguage.nativeName}</span>
                      <span className="text-gray-500">({selectedLanguage.name})</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Popular Languages</div>
                  {popularLanguages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <div className="flex items-center gap-2">
                        <span>{language.flag}</span>
                        <span>{language.nativeName}</span>
                        <span className="text-gray-500">({language.name})</span>
                      </div>
                    </SelectItem>
                  ))}
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 mt-4">Other Languages</div>
                  {otherLanguages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <div className="flex items-center gap-2">
                        <span>{language.flag}</span>
                        <span>{language.nativeName}</span>
                        <span className="text-gray-500">({language.name})</span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Language Selection */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Popular Languages</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {popularLanguages.map((language) => {
                const isSelected = currentSettings.languageCode === language.code
                return (
                  <Button
                    key={language.code}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLanguageChange(language.code)}
                    className={`flex items-center gap-2 justify-start h-auto p-2 ${
                      isSelected
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "hover:bg-purple-50 dark:hover:bg-purple-900/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-medium">{language.nativeName}</span>
                      <span
                        className={`text-xs ${isSelected ? "text-purple-200" : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {language.name}
                      </span>
                    </div>
                  </Button>
                )
              })}
            </div>

            {/* Show More Languages */}
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllLanguages(!showAllLanguages)}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                {showAllLanguages ? "Show Less" : `Show ${otherLanguages.length} More Languages`}
                <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showAllLanguages ? "rotate-180" : ""}`} />
              </Button>

              {showAllLanguages && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-3">
                  {otherLanguages.map((language) => {
                    const isSelected = currentSettings.languageCode === language.code
                    return (
                      <Button
                        key={language.code}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleLanguageChange(language.code)}
                        className={`flex items-center gap-2 justify-start h-auto p-2 ${
                          isSelected
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "hover:bg-purple-50 dark:hover:bg-purple-900/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-medium">{language.nativeName}</span>
                          <span
                            className={`text-xs ${isSelected ? "text-purple-200" : "text-gray-500 dark:text-gray-400"}`}
                          >
                            {language.name}
                          </span>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Translation Feature */}
          {onTranslate && currentSettings.languageCode !== "en" && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Quick Translation
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Translate existing content to {selectedLanguage?.nativeName}
              </p>
              <Button
                size="sm"
                onClick={() => handleTranslate(currentSettings.languageCode)}
                disabled={isTranslating}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
              >
                {isTranslating ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="h-3 w-3" />
                    Translate to {selectedLanguage?.nativeName}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Language Info */}
          {selectedLanguage && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 text-sm">Selected Language Info</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Language:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg">{selectedLanguage.flag}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{selectedLanguage.nativeName}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">English Name:</span>
                  <div className="font-medium text-gray-900 dark:text-gray-100 mt-1">{selectedLanguage.name}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Text Direction:</span>
                  <div className="font-medium text-gray-900 dark:text-gray-100 mt-1">
                    {selectedLanguage.direction.toUpperCase()}
                    {selectedLanguage.direction === "rtl" && " (Right-to-Left)"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Code:</span>
                  <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 rounded mt-1">
                    {selectedLanguage.code}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
