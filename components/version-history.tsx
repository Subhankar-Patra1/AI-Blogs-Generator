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
import { History, Clock, RotateCcw, Eye, Trash2 } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface Version {
  id: string
  content: string
  timestamp: number
  wordCount: number
  changeDescription: string
}

interface VersionHistoryProps {
  versions: Version[]
  onRestoreVersion: (content: string) => void
  onDeleteVersion: (id: string) => void
  onClearHistory: () => void
}

export function VersionHistory({ versions, onRestoreVersion, onDeleteVersion, onClearHistory }: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeDifference = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">History</span>
          {versions.length > 0 && (
            <Badge variant="secondary" className="ml-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              {versions.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <History className="h-5 w-5" />
            Version History
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            View and restore previous versions of your blog post
          </DialogDescription>
        </DialogHeader>

        {versions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <History className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No versions saved yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Start editing your blog post to create version history</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-4 min-h-0 overflow-hidden">
            {/* Version List */}
            <div className="flex flex-col min-h-0 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex-shrink-0 flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-center lg:items-start p-4 border-b border-gray-200 dark:border-gray-700 gap-2">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Versions ({versions.length})</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearHistory}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-8"
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="ml-1 hidden sm:inline">Clear</span>
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {versions.map((version, index) => (
                    <Card
                      key={version.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedVersion === version.id
                          ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => setSelectedVersion(version.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                              Version {versions.length - index}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                              {version.changeDescription}
                            </p>
                          </div>
                          {index === 0 && (
                            <Badge
                              variant="secondary"
                              className="text-xs ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700"
                            >
                              Latest
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {getTimeDifference(version.timestamp)}
                          </div>
                          <span>{version.wordCount} words</span>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {formatDate(version.timestamp)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Version Preview */}
            <div className="lg:col-span-2 flex flex-col min-h-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {selectedVersion ? (
                (() => {
                  const version = versions.find((v) => v.id === selectedVersion)
                  if (!version) return null

                  const versionIndex = versions.findIndex((v) => v.id === selectedVersion)
                  const isLatest = versionIndex === 0

                  return (
                    <>
                      <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            Version {versions.length - versionIndex}
                            {isLatest && (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700"
                              >
                                Current
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {version.changeDescription} • {formatDate(version.timestamp)}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {!isLatest && (
                            <Button
                              size="sm"
                              onClick={() => onRestoreVersion(version.content)}
                              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1 h-8"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span className="hidden sm:inline">Restore</span>
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteVersion(version.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <ScrollArea className="flex-1 p-4">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <MarkdownRenderer content={version.content} />
                        </div>
                      </ScrollArea>
                      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                          <span>{version.wordCount} words</span>
                          <span>Est. reading time: {Math.ceil(version.wordCount / 200)} min</span>
                        </div>
                      </div>
                    </>
                  )
                })()
              ) : (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div>
                    <Eye className="h-8 w-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Select a version to preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
