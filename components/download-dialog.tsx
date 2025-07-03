"use client"

import React from "react"

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
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, Code, Globe, FileDown, File, Check, Settings, Palette, Type } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface DownloadDialogProps {
  content: string
  title: string
  language: string
  languageCode: string
}

interface DownloadOptions {
  format: "markdown" | "html" | "pdf" | "txt" | "docx"
  includeMetadata: boolean
  styling: "minimal" | "modern" | "classic" | "dark"
  fontSize: "small" | "medium" | "large"
  includeTableOfContents: boolean
  filename: string
}

const FORMAT_OPTIONS = [
  {
    id: "markdown",
    name: "Markdown",
    description: "Original markdown format with all formatting preserved",
    icon: FileText,
    extension: ".md",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    features: ["Preserves formatting", "GitHub compatible", "Lightweight"],
    recommended: true,
  },
  {
    id: "html",
    name: "HTML",
    description: "Web-ready HTML with embedded CSS styling",
    icon: Code,
    extension: ".html",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    features: ["Web ready", "Custom styling", "Printable"],
    recommended: false,
  },
  {
    id: "pdf",
    name: "PDF",
    description: "Professional PDF document with formatting",
    icon: FileDown,
    extension: ".pdf",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    features: ["Professional", "Print ready", "Universal format"],
    recommended: true,
  },
  {
    id: "txt",
    name: "Plain Text",
    description: "Simple text file without formatting",
    icon: File,
    extension: ".txt",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    features: ["Universal", "Lightweight", "No formatting"],
    recommended: false,
  },
  {
    id: "docx",
    name: "Word Document",
    description: "Microsoft Word compatible document",
    icon: Globe,
    extension: ".docx",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    features: ["MS Word compatible", "Editable", "Professional"],
    recommended: false,
  },
]

const STYLING_OPTIONS = [
  { id: "minimal", name: "Minimal", description: "Clean and simple styling" },
  { id: "modern", name: "Modern", description: "Contemporary design with gradients" },
  { id: "classic", name: "Classic", description: "Traditional document styling" },
  { id: "dark", name: "Dark Mode", description: "Dark theme for better readability" },
]

export function DownloadDialog({ content, title, language, languageCode }: DownloadDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>("markdown")
  const [downloadOptions, setDownloadOptions] = useState<DownloadOptions>({
    format: "markdown",
    includeMetadata: true,
    styling: "modern",
    fontSize: "medium",
    includeTableOfContents: false,
    filename: title.replace(/\s+/g, "-").toLowerCase(),
  })
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState<string | null>(null)

  const handleFormatSelect = (formatId: string) => {
    setSelectedFormat(formatId)
    setDownloadOptions((prev) => ({
      ...prev,
      format: formatId as any,
    }))
  }

  const generateFilename = () => {
    const format = FORMAT_OPTIONS.find((f) => f.id === selectedFormat)
    const baseFilename = downloadOptions.filename || title.replace(/\s+/g, "-").toLowerCase()
    return `${baseFilename}-${languageCode}${format?.extension || ".txt"}`
  }

  const generateMetadata = () => {
    if (!downloadOptions.includeMetadata) return ""

    const metadata = `---
title: ${title}
language: ${language}
generated: ${new Date().toISOString()}
word_count: ${content.split(/\s+/).filter((word) => word.length > 0).length}
format: ${selectedFormat}
---

`
    return metadata
  }

  const convertToHTML = (markdownContent: string) => {
    const metadata = downloadOptions.includeMetadata ? generateMetadata() : ""
    const fullContent = metadata + markdownContent

    // Simple markdown to HTML conversion
    let html = fullContent
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/^\* (.*$)/gim, "<li>$1</li>")
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")

    html = "<p>" + html + "</p>"

    const styles = getHTMLStyles()

    return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>${styles}</style>
</head>
<body>
    <div class="container">
        ${downloadOptions.includeTableOfContents ? generateTableOfContents(markdownContent) : ""}
        <div class="content">
            ${html}
        </div>
    </div>
</body>
</html>`
  }

  const getHTMLStyles = () => {
    const baseStyles = `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 20px;
      }
      .container { max-width: 800px; margin: 0 auto; }
      .content { margin-top: 2rem; }
      h1, h2, h3 { color: #333; margin-top: 2rem; margin-bottom: 1rem; }
      p { margin-bottom: 1rem; }
      ul, ol { margin-bottom: 1rem; padding-left: 2rem; }
      li { margin-bottom: 0.5rem; }
      strong { font-weight: 600; }
      em { font-style: italic; }
    `

    const fontSizes = {
      small: "body { font-size: 14px; }",
      medium: "body { font-size: 16px; }",
      large: "body { font-size: 18px; }",
    }

    const themes = {
      minimal: "",
      modern: `
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .container { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 20px; padding: 2rem; }
        h1, h2, h3 { color: #fff; }
      `,
      classic: `
        body { background: #f5f5f5; color: #333; }
        .container { background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); padding: 3rem; }
        h1 { border-bottom: 3px solid #333; padding-bottom: 0.5rem; }
      `,
      dark: `
        body { background: #1a1a1a; color: #e0e0e0; }
        .container { background: #2d2d2d; border-radius: 10px; padding: 2rem; }
        h1, h2, h3 { color: #fff; }
      `,
    }

    return baseStyles + fontSizes[downloadOptions.fontSize] + themes[downloadOptions.styling]
  }

  const generateTableOfContents = (markdownContent: string) => {
    const headings = markdownContent.match(/^#{1,3} .+$/gm) || []
    if (headings.length === 0) return ""

    const tocItems = headings
      .map((heading) => {
        const level = heading.match(/^#+/)?.[0].length || 1
        const text = heading.replace(/^#+\s/, "")
        const id = text.toLowerCase().replace(/\s+/g, "-")
        return `<li class="toc-level-${level}"><a href="#${id}">${text}</a></li>`
      })
      .join("")

    return `<div class="table-of-contents">
      <h2>Table of Contents</h2>
      <ul>${tocItems}</ul>
    </div>`
  }

  const convertToPlainText = (markdownContent: string) => {
    const metadata = downloadOptions.includeMetadata ? generateMetadata() : ""
    let text = metadata + markdownContent

    // Remove markdown formatting
    text = text
      .replace(/^#{1,6} /gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^[-*] /gm, "• ")
      .replace(/^\d+\. /gm, "")

    return text
  }

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      let fileContent: string | Blob
      let mimeType: string
      const filename = generateFilename()

      switch (selectedFormat) {
        case "markdown":
          const metadata = downloadOptions.includeMetadata ? generateMetadata() : ""
          fileContent = metadata + content
          mimeType = "text/markdown"
          break

        case "html":
          fileContent = convertToHTML(content)
          mimeType = "text/html"
          break

        case "txt":
          fileContent = convertToPlainText(content)
          mimeType = "text/plain"
          break

        case "pdf":
          // For PDF, we'll create an HTML version and let the browser handle PDF conversion
          const htmlContent = convertToHTML(content)
          const printWindow = window.open("", "_blank")
          if (printWindow) {
            printWindow.document.write(htmlContent)
            printWindow.document.close()
            printWindow.print()
            setDownloadComplete(selectedFormat)
            setIsDownloading(false)
            return
          }
          break

        case "docx":
          // For DOCX, we'll create a simple HTML version that Word can import
          const docContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
            <head><meta charset="utf-8"><title>${title}</title></head>
            <body>${convertToHTML(content).match(/<body>(.*)<\/body>/s)?.[1] || content}</body>
            </html>
          `
          fileContent = docContent
          mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          break

        default:
          fileContent = content
          mimeType = "text/plain"
      }

      if (typeof fileContent === "string") {
        const blob = new Blob([fileContent], { type: mimeType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }

      setDownloadComplete(selectedFormat)
      setTimeout(() => setDownloadComplete(null), 3000)
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const selectedFormatData = FORMAT_OPTIONS.find((f) => f.id === selectedFormat)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Download className="h-5 w-5" />
            Download Blog Post
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Choose your preferred format and customize download options
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Format Selection */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Select Download Format
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3">
              {FORMAT_OPTIONS.map((format) => {
                const Icon = format.icon
                const isSelected = selectedFormat === format.id
                return (
                  <Card
                    key={format.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected
                        ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => handleFormatSelect(format.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${format.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{format.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {format.extension}
                            </Badge>
                            {format.recommended && (
                              <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{format.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {format.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {isSelected && <Check className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Options Panel */}
          <div className="flex flex-col min-h-0 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Download Options
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Filename */}
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Filename</Label>
                <input
                  type="text"
                  value={downloadOptions.filename}
                  onChange={(e) => setDownloadOptions((prev) => ({ ...prev, filename: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  placeholder="Enter filename"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Final: {generateFilename()}</p>
              </div>

              {/* Include Metadata */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Include Metadata</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Add title, date, and word count</p>
                </div>
                <Switch
                  checked={downloadOptions.includeMetadata}
                  onCheckedChange={(checked) => setDownloadOptions((prev) => ({ ...prev, includeMetadata: checked }))}
                />
              </div>

              {/* Styling (for HTML/PDF) */}
              {(selectedFormat === "html" || selectedFormat === "pdf") && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Palette className="h-3 w-3" />
                    Styling Theme
                  </Label>
                  <Select
                    value={downloadOptions.styling}
                    onValueChange={(value) => setDownloadOptions((prev) => ({ ...prev, styling: value as any }))}
                  >
                    <SelectTrigger className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLING_OPTIONS.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          <div>
                            <div className="font-medium">{style.name}</div>
                            <div className="text-xs text-gray-500">{style.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Font Size (for HTML/PDF) */}
              {(selectedFormat === "html" || selectedFormat === "pdf") && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Type className="h-3 w-3" />
                    Font Size
                  </Label>
                  <Select
                    value={downloadOptions.fontSize}
                    onValueChange={(value) => setDownloadOptions((prev) => ({ ...prev, fontSize: value as any }))}
                  >
                    <SelectTrigger className="mt-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (14px)</SelectItem>
                      <SelectItem value="medium">Medium (16px)</SelectItem>
                      <SelectItem value="large">Large (18px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Table of Contents */}
              {(selectedFormat === "html" || selectedFormat === "pdf") && (
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Table of Contents</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Generate TOC from headings</p>
                  </div>
                  <Switch
                    checked={downloadOptions.includeTableOfContents}
                    onCheckedChange={(checked) =>
                      setDownloadOptions((prev) => ({ ...prev, includeTableOfContents: checked }))
                    }
                  />
                </div>
              )}

              <Separator />

              {/* Preview Info */}
              {selectedFormatData && (
                <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    {React.createElement(selectedFormatData.icon, { className: "h-4 w-4" })}
                    {selectedFormatData.name} Preview
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Format:</span>
                      <span className="text-gray-900 dark:text-gray-100">{selectedFormatData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">File size:</span>
                      <span className="text-gray-900 dark:text-gray-100">~{Math.round(content.length / 1024)}KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Language:</span>
                      <span className="text-gray-900 dark:text-gray-100">{language}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Download Button */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Preparing Download...
                  </>
                ) : downloadComplete === selectedFormat ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Downloaded!
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download {selectedFormatData?.name}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
