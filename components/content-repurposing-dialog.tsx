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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Share2,
  Twitter,
  Linkedin,
  Mail,
  Mic,
  Copy,
  Check,
  Download,
  Sparkles,
  MessageSquare,
  Users,
  Headphones,
  RefreshCw,
  Edit,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface ContentRepurposingDialogProps {
  blogContent: string
  blogTitle: string
  onGenerate: (content: string, format: string, options: any) => Promise<any>
}

interface GeneratedContent {
  twitter: {
    thread: string[]
    hashtags: string[]
    engagement: string
  }
  linkedin: {
    post: string
    hashtags: string[]
    cta: string
  }
  email: {
    subject: string
    preview: string
    content: string
    cta: string
  }
  podcast: {
    intro: string
    outline: string[]
    script: string
    outro: string
    duration: string
  }
}

const TWITTER_STYLES = [
  { id: "educational", name: "Educational", description: "Informative thread with key insights" },
  { id: "storytelling", name: "Storytelling", description: "Narrative-driven thread" },
  { id: "tips", name: "Tips & Tricks", description: "Actionable advice format" },
  { id: "controversial", name: "Thought-Provoking", description: "Engaging debate starter" },
]

const LINKEDIN_STYLES = [
  { id: "professional", name: "Professional", description: "Business-focused content" },
  { id: "personal", name: "Personal Brand", description: "Personal insights and experiences" },
  { id: "industry", name: "Industry Insights", description: "Sector-specific analysis" },
  { id: "leadership", name: "Leadership", description: "Management and leadership focus" },
]

const EMAIL_STYLES = [
  { id: "newsletter", name: "Newsletter", description: "Traditional newsletter format" },
  { id: "digest", name: "Weekly Digest", description: "Summary-style format" },
  { id: "personal", name: "Personal Note", description: "Conversational tone" },
  { id: "promotional", name: "Promotional", description: "Marketing-focused" },
]

const PODCAST_STYLES = [
  { id: "interview", name: "Interview Style", description: "Q&A format with host" },
  { id: "solo", name: "Solo Episode", description: "Single host presentation" },
  { id: "educational", name: "Educational", description: "Teaching-focused format" },
  { id: "conversational", name: "Conversational", description: "Casual discussion style" },
]

export function ContentRepurposingDialog({ blogContent, blogTitle, onGenerate }: ContentRepurposingDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("twitter")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<Partial<GeneratedContent>>({})
  const [copiedContent, setCopiedContent] = useState<string | null>(null)
  const [editMode, setEditMode] = useState({
    twitter: false,
    linkedin: false,
    email: false,
    podcast: false,
  })

  // Options for each format
  const [twitterOptions, setTwitterOptions] = useState({
    style: "educational",
    threadLength: "medium",
    includeHashtags: true,
    includeEmojis: true,
    tone: "professional",
  })

  const [linkedinOptions, setLinkedinOptions] = useState({
    style: "professional",
    length: "medium",
    includeHashtags: true,
    includeCTA: true,
    tone: "professional",
  })

  const [emailOptions, setEmailOptions] = useState({
    style: "newsletter",
    includeImages: true,
    includeCTA: true,
    personalization: true,
    template: "modern",
  })

  const [podcastOptions, setPodcastOptions] = useState({
    style: "solo",
    duration: "15-20",
    includeMusic: true,
    includeAds: false,
    hostName: "Host",
  })

  const handleGenerate = async (format: string) => {
    setIsGenerating(true)
    try {
      let options
      switch (format) {
        case "twitter":
          options = twitterOptions
          break
        case "linkedin":
          options = linkedinOptions
          break
        case "email":
          options = emailOptions
          break
        case "podcast":
          options = podcastOptions
          break
        default:
          options = {}
      }

      const result = await onGenerate(blogContent, format, options)
      if (result.success) {
        setGeneratedContent((prev) => ({
          ...prev,
          [format]: result.content,
        }))
      }
    } catch (error) {
      console.error(`Failed to generate ${format} content:`, error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (content: string, contentId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedContent(contentId)
      setTimeout(() => setCopiedContent(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadContent = (content: string, filename: string, format: string) => {
    const blob = new Blob([content], { type: format === "email" ? "text/html" : "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleContentEdit = (format: string, newContent: string) => {
    if (format === "twitter") {
      const tweets = newContent.split("\n\n")
      setGeneratedContent((prev) => ({
        ...prev,
        twitter: {
          thread: tweets,
          hashtags: prev.twitter?.hashtags || [],
          engagement: prev.twitter?.engagement || "",
        },
      }))
    }
    if (format === "linkedin") {
      setGeneratedContent((prev) => ({
        ...prev,
        linkedin: {
          post: newContent,
          hashtags: prev.linkedin?.hashtags || [],
          cta: prev.linkedin?.cta || "",
        },
      }))
    }
    if (format === "email") {
      setGeneratedContent((prev) => ({
        ...prev,
        email: {
          content: newContent,
          subject: prev.email?.subject || "",
          preview: prev.email?.preview || "",
          cta: prev.email?.cta || "",
        },
      }))
    }
    if (format === "podcast") {
      setGeneratedContent((prev) => ({
        ...prev,
        podcast: {
          script: newContent,
          intro: prev.podcast?.intro || "",
          outline: prev.podcast?.outline || [],
          outro: prev.podcast?.outro || "",
          duration: prev.podcast?.duration || "",
        },
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center gap-2 px-4 min-w-[140px] border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Repurpose Content</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[98vw] w-full h-[95vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Share2 className="h-5 w-5" />
            Content Repurposing Studio
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Transform your blog post into social media content, newsletters, and podcast scripts
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mb-4 flex-shrink-0">
              <TabsTrigger value="twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                <span className="hidden sm:inline">Twitter</span>
              </TabsTrigger>
              <TabsTrigger value="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
              <TabsTrigger value="podcast" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Podcast</span>
              </TabsTrigger>
            </TabsList>

            {/* Twitter Thread Tab */}
            <TabsContent value="twitter" className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-4 overflow-hidden">
                <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
                  <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter Thread Options
                    </h3>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Thread Style</Label>
                        <Select
                          value={twitterOptions.style}
                          onValueChange={(value) => setTwitterOptions((prev) => ({ ...prev, style: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TWITTER_STYLES.map((style) => (
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

                      <div>
                        <Label className="text-sm font-medium">Thread Length</Label>
                        <Select
                          value={twitterOptions.threadLength}
                          onValueChange={(value) => setTwitterOptions((prev) => ({ ...prev, threadLength: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Short (3-5 tweets)</SelectItem>
                            <SelectItem value="medium">Medium (6-10 tweets)</SelectItem>
                            <SelectItem value="long">Long (11-15 tweets)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Include Hashtags</Label>
                        <Switch
                          checked={twitterOptions.includeHashtags}
                          onCheckedChange={(checked) =>
                            setTwitterOptions((prev) => ({ ...prev, includeHashtags: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Include Emojis</Label>
                        <Switch
                          checked={twitterOptions.includeEmojis}
                          onCheckedChange={(checked) =>
                            setTwitterOptions((prev) => ({ ...prev, includeEmojis: checked }))
                          }
                        />
                      </div>

                      <Button
                        onClick={() => handleGenerate("twitter")}
                        disabled={isGenerating}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Twitter Thread
                          </>
                        )}
                      </Button>
                    </div>
                  </ScrollArea>
                </div>

                <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col overflow-hidden">
                  {generatedContent.twitter ? (
                    <>
                      <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Twitter className="h-4 w-4" />
                          Generated Twitter Thread
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(generatedContent.twitter?.thread.join("\n\n") || "", "twitter")
                            }
                          >
                            {copiedContent === "twitter" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              downloadContent(
                                generatedContent.twitter?.thread.join("\n\n") || "",
                                "twitter-thread.txt",
                                "text",
                              )
                            }
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerate("twitter")}
                            disabled={isGenerating}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditMode((prev) => ({ ...prev, twitter: !prev.twitter }))}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <ScrollArea className="flex-1">
                        {editMode.twitter ? (
                          <textarea
                            className="w-full h-full p-4 border-0 resize-none bg-transparent text-gray-900 dark:text-gray-100"
                            value={generatedContent.twitter?.thread.join("\n\n") || ""}
                            onChange={(e) => handleContentEdit("twitter", e.target.value)}
                          />
                        ) : (
                          <div className="flex-1 p-4 space-y-4">
                            {generatedContent.twitter?.thread.map((tweet, index) => (
                              <Card key={index} className="border border-gray-200 dark:border-gray-700">
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{tweet}</p>
                                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                        <span>{tweet.length}/280 characters</span>
                                        {index === 0 && <Badge variant="secondary">Thread starter</Badge>}
                                        {index === (generatedContent.twitter?.thread ?? []).length - 1 && (
                                          <Badge variant="secondary">Thread end</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}

                            {generatedContent.twitter.hashtags && (
                              <Card className="border border-gray-200 dark:border-gray-700">
                                <CardContent className="p-4">
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Suggested Hashtags
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {generatedContent.twitter.hashtags.map((hashtag, index) => (
                                      <Badge key={index} variant="outline" className="text-blue-600">
                                        #{hashtag}
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        )}
                      </ScrollArea>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-center p-8">
                      <div>
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Ready to Create</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Configure your options and generate a Twitter thread
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* LinkedIn Post Tab */}
            <TabsContent value="linkedin" className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-4 overflow-hidden">
                <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
                  <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn Post Options
                    </h3>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Post Style</Label>
                        <Select
                          value={linkedinOptions.style}
                          onValueChange={(value) => setLinkedinOptions((prev) => ({ ...prev, style: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LINKEDIN_STYLES.map((style) => (
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

                      <div>
                        <Label className="text-sm font-medium">Post Length</Label>
                        <Select
                          value={linkedinOptions.length}
                          onValueChange={(value) => setLinkedinOptions((prev) => ({ ...prev, length: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Short (under 1000 chars)</SelectItem>
                            <SelectItem value="medium">Medium (1000-2000 chars)</SelectItem>
                            <SelectItem value="long">Long (2000+ chars)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Include Hashtags</Label>
                        <Switch
                          checked={linkedinOptions.includeHashtags}
                          onCheckedChange={(checked) =>
                            setLinkedinOptions((prev) => ({ ...prev, includeHashtags: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Include Call-to-Action</Label>
                        <Switch
                          checked={linkedinOptions.includeCTA}
                          onCheckedChange={(checked) =>
                            setLinkedinOptions((prev) => ({ ...prev, includeCTA: checked }))
                          }
                        />
                      </div>

                      <Button
                        onClick={() => handleGenerate("linkedin")}
                        disabled={isGenerating}
                        className="w-full bg-blue-700 hover:bg-blue-800"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate LinkedIn Post
                          </>
                        )}
                      </Button>
                    </div>
                  </ScrollArea>
                </div>

                <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col overflow-hidden">
                  {generatedContent.linkedin ? (
                    <>
                      <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Linkedin className="h-4 w-4" />
                          Generated LinkedIn Post
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generatedContent.linkedin?.post || "", "linkedin")}
                          >
                            {copiedContent === "linkedin" ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              downloadContent(generatedContent.linkedin?.post || "", "linkedin-post.txt", "text")
                            }
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerate("linkedin")}
                            disabled={isGenerating}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditMode((prev) => ({ ...prev, linkedin: !prev.linkedin }))}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <ScrollArea className="flex-1">
                        {editMode.linkedin ? (
                          <textarea
                            className="w-full h-full p-4 border-0 resize-none bg-transparent text-gray-900 dark:text-gray-100"
                            value={generatedContent.linkedin?.post || ""}
                            onChange={(e) => handleContentEdit("linkedin", e.target.value)}
                          />
                        ) : (
                          <div className="flex-1 p-4 space-y-4">
                            <Card className="border border-gray-200 dark:border-gray-700">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-medium">
                                    You
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-gray-100">Your Name</div>
                                    <div className="text-sm text-gray-500">Your Title • Now</div>
                                  </div>
                                </div>
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                    {generatedContent.linkedin.post}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                                  <span>{generatedContent.linkedin.post.length} characters</span>
                                  <Badge variant="secondary">Professional</Badge>
                                </div>
                              </CardContent>
                            </Card>

                            {generatedContent.linkedin.hashtags && (
                              <Card className="border border-gray-200 dark:border-gray-700">
                                <CardContent className="p-4">
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Suggested Hashtags
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {generatedContent.linkedin.hashtags.map((hashtag, index) => (
                                      <Badge key={index} variant="outline" className="text-blue-700">
                                        #{hashtag}
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        )}
                      </ScrollArea>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-center p-8">
                      <div>
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Ready to Create</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Configure your options and generate a LinkedIn post
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Email Newsletter Tab */}
            <TabsContent value="email" className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-4 overflow-hidden">
                <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
                  <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Newsletter Options
                    </h3>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Email Style</Label>
                        <Select
                          value={emailOptions.style}
                          onValueChange={(value) => setEmailOptions((prev) => ({ ...prev, style: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {EMAIL_STYLES.map((style) => (
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

                      <div>
                        <Label className="text-sm font-medium">Template</Label>
                        <Select
                          value={emailOptions.template}
                          onValueChange={(value) => setEmailOptions((prev) => ({ ...prev, template: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="classic">Classic</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                            <SelectItem value="corporate">Corporate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Include Images</Label>
                        <Switch
                          checked={emailOptions.includeImages}
                          onCheckedChange={(checked) =>
                            setEmailOptions((prev) => ({ ...prev, includeImages: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Include Call-to-Action</Label>
                        <Switch
                          checked={emailOptions.includeCTA}
                          onCheckedChange={(checked) => setEmailOptions((prev) => ({ ...prev, includeCTA: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Personalization</Label>
                        <Switch
                          checked={emailOptions.personalization}
                          onCheckedChange={(checked) =>
                            setEmailOptions((prev) => ({ ...prev, personalization: checked }))
                          }
                        />
                      </div>

                      <Button
                        onClick={() => handleGenerate("email")}
                        disabled={isGenerating}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Email Newsletter
                          </>
                        )}
                      </Button>
                    </div>
                  </ScrollArea>
                </div>

                <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col overflow-hidden">
                  {generatedContent.email ? (
                    <>
                      <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Generated Email Newsletter
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generatedContent.email?.content || "", "email")}
                          >
                            {copiedContent === "email" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              downloadContent(generatedContent.email?.content || "", "newsletter.html", "email")
                            }
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerate("email")}
                            disabled={isGenerating}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditMode((prev) => ({ ...prev, email: !prev.email }))}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <ScrollArea className="flex-1">
                        {editMode.email ? (
                          <textarea
                            className="w-full h-full p-4 border-0 resize-none bg-transparent text-gray-900 dark:text-gray-100"
                            value={generatedContent.email?.content || ""}
                            onChange={(e) => handleContentEdit("email", e.target.value)}
                          />
                        ) : (
                          <div className="flex-1 p-4 space-y-4">
                            <Card className="border border-gray-200 dark:border-gray-700">
                              <CardHeader>
                                <CardTitle className="text-sm">Email Subject</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {generatedContent.email.subject}
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="border border-gray-200 dark:border-gray-700">
                              <CardHeader>
                                <CardTitle className="text-sm">Preview Text</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-600 dark:text-gray-400">{generatedContent.email.preview}</p>
                              </CardContent>
                            </Card>

                            <Card className="border border-gray-200 dark:border-gray-700">
                              <CardHeader>
                                <CardTitle className="text-sm">Email Content</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div
                                  className="prose prose-sm max-w-none dark:prose-invert"
                                  dangerouslySetInnerHTML={{ __html: generatedContent.email.content }}
                                />
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </ScrollArea>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-center p-8">
                      <div>
                        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Ready to Create</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Configure your options and generate an email newsletter
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Podcast Script Tab */}
            <TabsContent value="podcast" className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-4 overflow-hidden">
                <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
                  <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      Podcast Script Options
                    </h3>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Podcast Style</Label>
                        <Select
                          value={podcastOptions.style}
                          onValueChange={(value) => setPodcastOptions((prev) => ({ ...prev, style: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PODCAST_STYLES.map((style) => (
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

                      <div>
                        <Label className="text-sm font-medium">Episode Duration</Label>
                        <Select
                          value={podcastOptions.duration}
                          onValueChange={(value) => setPodcastOptions((prev) => ({ ...prev, duration: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5-10">Short (5-10 minutes)</SelectItem>
                            <SelectItem value="15-20">Medium (15-20 minutes)</SelectItem>
                            <SelectItem value="30-45">Long (30-45 minutes)</SelectItem>
                            <SelectItem value="60+">Extended (60+ minutes)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Host Name</Label>
                        <input
                          type="text"
                          value={podcastOptions.hostName}
                          onChange={(e) => setPodcastOptions((prev) => ({ ...prev, hostName: e.target.value }))}
                          className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                          placeholder="Enter host name"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Include Music Cues</Label>
                        <Switch
                          checked={podcastOptions.includeMusic}
                          onCheckedChange={(checked) =>
                            setPodcastOptions((prev) => ({ ...prev, includeMusic: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Include Ad Breaks</Label>
                        <Switch
                          checked={podcastOptions.includeAds}
                          onCheckedChange={(checked) => setPodcastOptions((prev) => ({ ...prev, includeAds: checked }))}
                        />
                      </div>

                      <Button
                        onClick={() => handleGenerate("podcast")}
                        disabled={isGenerating}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Podcast Script
                          </>
                        )}
                      </Button>
                    </div>
                  </ScrollArea>
                </div>

                <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col overflow-hidden">
                  {generatedContent.podcast ? (
                    <>
                      <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Mic className="h-4 w-4" />
                          Generated Podcast Script
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generatedContent.podcast?.script || "", "podcast")}
                          >
                            {copiedContent === "podcast" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              downloadContent(generatedContent.podcast?.script || "", "podcast-script.txt", "text")
                            }
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerate("podcast")}
                            disabled={isGenerating}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditMode((prev) => ({ ...prev, podcast: !prev.podcast }))}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <ScrollArea className="flex-1">
                        {editMode.podcast ? (
                          <textarea
                            className="w-full h-full p-4 border-0 resize-none bg-transparent text-gray-900 dark:text-gray-100"
                            value={generatedContent.podcast?.script || ""}
                            onChange={(e) => handleContentEdit("podcast", e.target.value)}
                          />
                        ) : (
                          <div className="flex-1 p-4 space-y-4">
                            <Card className="border border-gray-200 dark:border-gray-700">
                              <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                  <Badge variant="secondary">Intro</Badge>
                                  Episode Introduction
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                  {generatedContent.podcast.intro}
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="border border-gray-200 dark:border-gray-700">
                              <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                  <Badge variant="secondary">Outline</Badge>
                                  Episode Outline
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  {generatedContent.podcast.outline.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-purple-600 font-medium">{index + 1}.</span>
                                      <span className="text-gray-900 dark:text-gray-100">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>

                            <Card className="border border-gray-200 dark:border-gray-700">
                              <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                  <Badge variant="secondary">Script</Badge>
                                  Full Episode Script
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                    {generatedContent.podcast.script}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="border border-gray-200 dark:border-gray-700">
                              <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                  <Badge variant="secondary">Outro</Badge>
                                  Episode Conclusion
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                  {generatedContent.podcast.outro}
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="border border-gray-200 dark:border-gray-700">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                  <span>Estimated Duration: {generatedContent.podcast.duration}</span>
                                  <Badge variant="outline">{podcastOptions.style} Style</Badge>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </ScrollArea>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-center p-8">
                      <div>
                        <Headphones className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Ready to Create</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Configure your options and generate a podcast script
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
