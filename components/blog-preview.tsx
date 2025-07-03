"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Button } from "@/components/ui/button"
import { Edit3, Eye } from "lucide-react"

interface BlogPreviewProps {
  content: string
  onEdit: () => void
  direction?: "ltr" | "rtl"
}

export function BlogPreview({ content, onEdit, direction = "ltr" }: BlogPreviewProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Card className="flex-1 border border-purple-200 dark:border-purple-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Blog Preview</h3>
            </div>
            <Button
              onClick={onEdit}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6" dir={direction}>
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-blockquote:border-purple-200 dark:prose-blockquote:border-purple-700">
                <MarkdownRenderer content={content} />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Reading Stats */}
        <div className="flex-shrink-0 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-4">
            <span>
              <strong>{content.split(/\s+/).filter((word) => word.length > 0).length}</strong> words
            </span>
            <span>
              <strong>{content.length}</strong> characters
            </span>
            <span>
              <strong>{content.split("\n").length}</strong> paragraphs
            </span>
          </div>
          <span className="text-xs">
            Est. reading time: {Math.ceil(content.split(/\s+/).filter((word) => word.length > 0).length / 200)} min
          </span>
        </div>
      </Card>
    </div>
  )
}
