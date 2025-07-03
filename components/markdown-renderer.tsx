"use client"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Enhanced markdown parser with dark mode support
  const parseMarkdown = (text: string) => {
    let html = text

    // Headers with dark mode classes
    html = html.replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">$1</h3>',
    )
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">$1</h2>',
    )
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 border-b-2 border-purple-200 dark:border-purple-700 pb-3">$1</h1>',
    )

    // Bold and italic with dark mode
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>')

    // Lists with dark mode
    html = html.replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 text-gray-700 dark:text-gray-300">• $1</li>')
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1 text-gray-700 dark:text-gray-300">• $1</li>')

    // Numbered lists
    html = html.replace(
      /^\d+\. (.*$)/gim,
      '<li class="ml-4 mb-1 text-gray-700 dark:text-gray-300 list-decimal">$1</li>',
    )

    // Wrap consecutive list items
    html = html.replace(/(<li.*?<\/li>\s*)+/g, '<ul class="mb-4 space-y-1">$&</ul>')

    // Paragraphs with dark mode
    html = html.replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">')
    html = '<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">' + html + "</p>"

    // Horizontal rule with dark mode
    html = html.replace(/^---$/gim, '<hr class="my-8 border-gray-300 dark:border-gray-600">')

    // Line breaks
    html = html.replace(/\n/g, "<br />")

    return html
  }

  return (
    <div
      className="prose prose-lg max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  )
}
