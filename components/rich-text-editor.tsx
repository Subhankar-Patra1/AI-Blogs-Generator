"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link,
  Heading1,
  Heading2,
  Heading3,
  Save,
  Eye,
  Edit3,
  Type,
  Code,
} from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface RichTextEditorProps {
  content: string
  onContentChange: (content: string) => void
  onSave?: (content: string) => void
  onCancel?: () => void
}

export function RichTextEditor({ content, onContentChange, onSave, onCancel }: RichTextEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [editorContent, setEditorContent] = useState(content)
  const [hasChanges, setHasChanges] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditorContent(content)
    setHasChanges(false)
  }, [content])

  const handleContentChange = (newContent: string) => {
    setEditorContent(newContent)
    setHasChanges(true)
    onContentChange(newContent)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(editorContent)
    }
    setHasChanges(false)
  }

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }

  const insertMarkdown = (before: string, after = "") => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = textarea.value.substring(start, end)
      const newText = before + selectedText + after

      const newContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end)

      handleContentChange(newContent)

      // Set cursor position after the inserted text
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
      }, 0)
    }
  }

  const insertHeading = (level: number) => {
    const prefix = "#".repeat(level) + " "
    insertMarkdown(prefix)
  }

  const insertList = (ordered = false) => {
    const prefix = ordered ? "1. " : "- "
    insertMarkdown(prefix)
  }

  const insertLink = () => {
    const url = prompt("Enter URL:")
    if (url) {
      insertMarkdown("[", `](${url})`)
    }
  }

  const formatText = (format: string) => {
    switch (format) {
      case "bold":
        insertMarkdown("**", "**")
        break
      case "italic":
        insertMarkdown("*", "*")
        break
      case "code":
        insertMarkdown("`", "`")
        break
      case "quote":
        insertMarkdown("> ")
        break
    }
  }

  const ToolbarButton = ({
    icon: Icon,
    onClick,
    title,
    isActive = false,
  }: {
    icon: any
    onClick: () => void
    title: string
    isActive?: boolean
  }) => (
    <Toggle pressed={isActive} onPressedChange={onClick} size="sm" aria-label={title} className="h-8 w-8 p-0">
      <Icon className="h-4 w-4" />
    </Toggle>
  )

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Card className="flex-1 border border-purple-200 dark:border-purple-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm flex flex-col overflow-hidden">
        <CardHeader className="flex-shrink-0 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Rich Text Editor
              {hasChanges && (
                <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 rounded-full">
                  Unsaved Changes
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center gap-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
              >
                {isPreviewMode ? (
                  <>
                    <Type className="h-3 w-3" />
                    <span className="hidden sm:inline">Edit</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" />
                    <span className="hidden sm:inline">Preview</span>
                  </>
                )}
              </Button>
              {hasChanges && onSave && (
                <div className="flex gap-2">
                  {onCancel && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onCancel}
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1"
                  >
                    <Save className="h-3 w-3" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
          {!isPreviewMode && (
            <>
              {/* Toolbar */}
              <div className="flex-shrink-0 flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                {/* Text Formatting */}
                <div className="flex items-center gap-1">
                  <ToolbarButton icon={Bold} onClick={() => formatText("bold")} title="Bold" />
                  <ToolbarButton icon={Italic} onClick={() => formatText("italic")} title="Italic" />
                  <ToolbarButton icon={Code} onClick={() => formatText("code")} title="Inline Code" />
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Headings */}
                <div className="flex items-center gap-1">
                  <ToolbarButton icon={Heading1} onClick={() => insertHeading(1)} title="Heading 1" />
                  <ToolbarButton icon={Heading2} onClick={() => insertHeading(2)} title="Heading 2" />
                  <ToolbarButton icon={Heading3} onClick={() => insertHeading(3)} title="Heading 3" />
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Lists and Quotes */}
                <div className="flex items-center gap-1">
                  <ToolbarButton icon={List} onClick={() => insertList(false)} title="Bullet List" />
                  <ToolbarButton icon={ListOrdered} onClick={() => insertList(true)} title="Numbered List" />
                  <ToolbarButton icon={Quote} onClick={() => formatText("quote")} title="Quote" />
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Links */}
                <div className="flex items-center gap-1">
                  <ToolbarButton icon={Link} onClick={insertLink} title="Insert Link" />
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 relative overflow-hidden">
                <textarea
                  ref={textareaRef}
                  value={editorContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Start editing your blog post..."
                  spellCheck={true}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                  {editorContent.split(/\s+/).filter((word) => word.length > 0).length} words
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex-shrink-0 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">**text**</kbd>
                  <span>Bold</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">*text*</kbd>
                  <span>Italic</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs"># </kbd>
                  <span>Heading</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">- </kbd>
                  <span>List</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">[text](url)</kbd>
                  <span>Link</span>
                </div>
              </div>
            </>
          )}

          {/* Preview Mode */}
          {isPreviewMode && (
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <MarkdownRenderer content={editorContent} />
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Editor Stats */}
          <div className="flex-shrink-0 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <span>
                <strong>{editorContent.split(/\s+/).filter((word) => word.length > 0).length}</strong> words
              </span>
              <span>
                <strong>{editorContent.length}</strong> characters
              </span>
              <span>
                <strong>{editorContent.split("\n").length}</strong> lines
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && <span className="text-orange-600 dark:text-orange-400 text-xs">• Unsaved changes</span>}
              <span className="text-xs">
                Est. reading time:{" "}
                {Math.ceil(editorContent.split(/\s+/).filter((word) => word.length > 0).length / 200)} min
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
