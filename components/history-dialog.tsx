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
import { History, Trash2, Copy, Download, Clock, FileText } from "lucide-react"
import { useHistory } from "@/contexts/history-context"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface HistoryDialogProps {
  onSelectPost: (topic: string, content: string, isSample: boolean) => void
}

export function HistoryDialog({ onSelectPost }: HistoryDialogProps) {
  const { history, clearHistory, removeFromHistory, mounted } = useHistory()
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadAsMarkdown = (topic: string, content: string) => {
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${topic.replace(/\s+/g, "-").toLowerCase()}-blog-post.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="border-purple-200 dark:border-purple-700"
        aria-label="Loading history"
      >
        <History className="h-4 w-4 opacity-50" />
        <span className="ml-2 text-sm font-medium opacity-50">History</span>
      </Button>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative overflow-hidden transition-all duration-300 hover:scale-105 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600"
          aria-label="View blog post history"
        >
          <History className="h-4 w-4" />
          <span className="ml-2 text-sm font-medium">History</span>
          {history.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {history.length > 9 ? "9+" : history.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <History className="h-5 w-5" />
            Blog Post History
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            View and manage your previously generated blog posts
          </DialogDescription>
        </DialogHeader>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No blog posts yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Generate your first blog post to see it here!</p>
          </div>
        ) : (
          <div className="flex gap-4 h-[60vh]">
            {/* History List */}
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 pr-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Recent Posts ({history.length})</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {history.map((post) => (
                    <Card
                      key={post.id}
                      className={`cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        selectedPost === post.id ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20" : ""
                      }`}
                      onClick={() => setSelectedPost(post.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                            {post.topic}
                          </h4>
                          {post.isSample && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-1 py-0.5 rounded ml-2 flex-shrink-0">
                              Sample
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(post.timestamp)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Post Preview */}
            <div className="flex-1">
              {selectedPost ? (
                (() => {
                  const post = history.find((p) => p.id === selectedPost)
                  if (!post) return null

                  return (
                    <div className="h-full flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">{post.topic}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.timestamp)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(post.content, post.id)}>
                            {copied === post.id ? <Copy className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                            {copied === post.id ? "Copied!" : "Copy"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadAsMarkdown(post.topic, post.content)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onSelectPost(post.topic, post.content, post.isSample || false)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Use This Post
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromHistory(post.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <ScrollArea className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
                        <MarkdownRenderer content={post.content} />
                      </ScrollArea>
                    </div>
                  )
                })()
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <FileText className="h-8 w-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Select a blog post to preview</p>
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
