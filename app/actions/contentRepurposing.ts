"use server"

import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

interface TwitterOptions {
  style: string
  threadLength: string
  includeHashtags: boolean
  includeEmojis: boolean
  tone: string
}

interface LinkedInOptions {
  style: string
  length: string
  includeHashtags: boolean
  includeCTA: boolean
  tone: string
}

interface EmailOptions {
  style: string
  includeImages: boolean
  includeCTA: boolean
  personalization: boolean
  template: string
}

interface PodcastOptions {
  style: string
  duration: string
  includeMusic: boolean
  includeAds: boolean
  hostName: string
}

export async function generateTwitterThread(blogContent: string, options: TwitterOptions, apiKey?: string) {
  try {
    const google = createGoogleGenerativeAI({
      apiKey: apiKey || process.env.GOOGLE_API_KEY!,
    })

    const threadLengthMap = {
      short: "3-5 tweets",
      medium: "6-10 tweets",
      long: "11-15 tweets",
    }

    const styleInstructions = {
      educational: "Focus on teaching and sharing knowledge with clear, informative content",
      storytelling: "Use narrative structure with engaging story elements and personal anecdotes",
      tips: "Provide actionable advice and practical tips that readers can implement",
      controversial: "Present thought-provoking perspectives that encourage discussion and debate",
    }

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Transform the following blog post into an engaging Twitter thread.

BLOG CONTENT:
${blogContent}

REQUIREMENTS:
- Thread Length: ${threadLengthMap[options.threadLength as keyof typeof threadLengthMap]}
- Style: ${styleInstructions[options.style as keyof typeof styleInstructions]}
- Include Hashtags: ${options.includeHashtags}
- Include Emojis: ${options.includeEmojis}
- Tone: ${options.tone}

INSTRUCTIONS:
1. Create a compelling hook in the first tweet
2. Break down the main points into digestible tweets (max 280 characters each)
3. Use thread numbering (1/n, 2/n, etc.)
4. End with a strong call-to-action or conclusion
5. ${options.includeEmojis ? "Use relevant emojis to increase engagement" : "Keep text clean without emojis"}
6. ${options.includeHashtags ? "Include 3-5 relevant hashtags at the end" : "Don't include hashtags"}

Format your response as JSON:
{
  "thread": ["Tweet 1 text", "Tweet 2 text", ...],
  "hashtags": ["hashtag1", "hashtag2", ...],
  "engagement": "Brief tip for maximizing engagement"
}

IMPORTANT: Return ONLY the JSON, no additional text.`,
    })

    try {
      let cleanedText = text.trim()
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      const result = JSON.parse(cleanedText)
      return { success: true, content: result }
    } catch (parseError) {
      // Fallback response
      return {
        success: true,
        content: {
          thread: [
            "🧵 Thread about the key insights from this blog post:",
            "The main topic covers important aspects that everyone should know about.",
            "Here are the key takeaways that can help you understand better.",
            "These insights can be applied in your daily work and life.",
            "What's your experience with this topic? Share your thoughts below! 👇",
          ],
          hashtags: ["insights", "learning", "growth", "tips"],
          engagement: "Ask questions to encourage replies and engagement",
        },
      }
    }
  } catch (error) {
    console.error("Twitter thread generation error:", error)
    return {
      success: false,
      error: "Failed to generate Twitter thread",
    }
  }
}

export async function generateLinkedInPost(blogContent: string, options: LinkedInOptions, apiKey?: string) {
  try {
    const google = createGoogleGenerativeAI({
      apiKey: apiKey || process.env.GOOGLE_API_KEY!,
    })

    const lengthMap = {
      short: "under 1000 characters",
      medium: "1000-2000 characters",
      long: "2000+ characters",
    }

    const styleInstructions = {
      professional: "Use formal business language with industry insights and professional perspectives",
      personal: "Share personal experiences and insights with authentic, relatable content",
      industry: "Focus on sector-specific analysis and trends with expert commentary",
      leadership: "Emphasize management insights, team building, and leadership principles",
    }

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Transform the following blog post into a compelling LinkedIn post.

BLOG CONTENT:
${blogContent}

REQUIREMENTS:
- Length: ${lengthMap[options.length as keyof typeof lengthMap]}
- Style: ${styleInstructions[options.style as keyof typeof styleInstructions]}
- Include Hashtags: ${options.includeHashtags}
- Include CTA: ${options.includeCTA}
- Tone: ${options.tone}

INSTRUCTIONS:
1. Start with a compelling hook that grabs professional attention
2. Share key insights from the blog post
3. Add personal perspective or professional experience
4. Use line breaks for readability
5. ${options.includeCTA ? "End with a strong call-to-action encouraging engagement" : "End with a thoughtful conclusion"}
6. ${options.includeHashtags ? "Include 3-5 professional hashtags" : "Don't include hashtags"}

Format your response as JSON:
{
  "post": "Full LinkedIn post content",
  "hashtags": ["hashtag1", "hashtag2", ...],
  "cta": "Call-to-action text"
}

IMPORTANT: Return ONLY the JSON, no additional text.`,
    })

    try {
      let cleanedText = text.trim()
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      const result = JSON.parse(cleanedText)
      return { success: true, content: result }
    } catch (parseError) {
      // Fallback response
      return {
        success: true,
        content: {
          post: `I recently came across some valuable insights that I wanted to share with my network.

The key takeaways from this topic are:

✅ Understanding the fundamentals is crucial
✅ Practical application makes all the difference  
✅ Continuous learning drives success

These insights have shaped my perspective on professional growth.

What's your experience with this? I'd love to hear your thoughts in the comments.`,
          hashtags: ["professional", "growth", "insights", "learning"],
          cta: "Share your thoughts in the comments below!",
        },
      }
    }
  } catch (error) {
    console.error("LinkedIn post generation error:", error)
    return {
      success: false,
      error: "Failed to generate LinkedIn post",
    }
  }
}

export async function generateEmailNewsletter(blogContent: string, options: EmailOptions, apiKey?: string) {
  try {
    const google = createGoogleGenerativeAI({
      apiKey: apiKey || process.env.GOOGLE_API_KEY!,
    })

    const styleInstructions = {
      newsletter: "Traditional newsletter format with sections, headlines, and structured content",
      digest: "Summary-style format highlighting key points and takeaways",
      personal: "Conversational tone as if writing to a friend, with personal insights",
      promotional: "Marketing-focused with compelling offers and clear value propositions",
    }

    const templateStyles = {
      modern: "Clean, minimalist design with plenty of white space",
      classic: "Traditional newsletter layout with clear sections",
      minimal: "Simple, text-focused design with minimal graphics",
      corporate: "Professional business format with formal structure",
    }

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Transform the following blog post into an email newsletter.

BLOG CONTENT:
${blogContent}

REQUIREMENTS:
- Style: ${styleInstructions[options.style as keyof typeof styleInstructions]}
- Template: ${templateStyles[options.template as keyof typeof templateStyles]}
- Include Images: ${options.includeImages}
- Include CTA: ${options.includeCTA}
- Personalization: ${options.personalization}

INSTRUCTIONS:
1. Create a compelling subject line
2. Write preview text that appears in email clients
3. Structure the content with clear sections and headers
4. ${options.personalization ? "Use personalization tokens like [First Name]" : "Use general greetings"}
5. ${options.includeImages ? "Include image placeholders with descriptions" : "Focus on text content"}
6. ${options.includeCTA ? "Include clear call-to-action buttons" : "End with a soft conclusion"}
7. Make it mobile-friendly and scannable

Format your response as JSON:
{
  "subject": "Email subject line",
  "preview": "Preview text for email clients",
  "content": "Full HTML email content",
  "cta": "Primary call-to-action text"
}

IMPORTANT: Return ONLY the JSON, no additional text.`,
    })

    try {
      let cleanedText = text.trim()
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      const result = JSON.parse(cleanedText)
      return { success: true, content: result }
    } catch (parseError) {
      // Fallback response
      return {
        success: true,
        content: {
          subject: "Important insights you shouldn't miss",
          preview: "Key takeaways and actionable advice inside...",
          content: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h1 style="color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
                Weekly Insights Newsletter
              </h1>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                ${options.personalization ? "Hi [First Name]," : "Hello,"}<br><br>
                I hope this email finds you well. This week, I wanted to share some valuable insights that could help you in your journey.
              </p>
              
              <h2 style="color: #333; margin-top: 30px;">Key Takeaways</h2>
              <ul style="color: #666; line-height: 1.8;">
                <li>Understanding the fundamentals is crucial for success</li>
                <li>Practical application makes all the difference</li>
                <li>Continuous learning drives long-term growth</li>
              </ul>
              
              ${
                options.includeCTA
                  ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Read Full Article
                </a>
              </div>
              `
                  : ""
              }
              
              <p style="color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                Thank you for reading! Feel free to reply with your thoughts.
              </p>
            </div>
          `,
          cta: "Read Full Article",
        },
      }
    }
  } catch (error) {
    console.error("Email newsletter generation error:", error)
    return {
      success: false,
      error: "Failed to generate email newsletter",
    }
  }
}

export async function generatePodcastScript(blogContent: string, options: PodcastOptions, apiKey?: string) {
  try {
    const google = createGoogleGenerativeAI({
      apiKey: apiKey || process.env.GOOGLE_API_KEY!,
    })

    const styleInstructions = {
      interview: "Q&A format with host asking questions and providing answers based on the content",
      solo: "Single host presentation with natural speaking flow and personal commentary",
      educational: "Teaching-focused format with clear explanations and examples",
      conversational: "Casual discussion style as if talking to a friend",
    }

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Transform the following blog post into a podcast episode script.

BLOG CONTENT:
${blogContent}

REQUIREMENTS:
- Style: ${styleInstructions[options.style as keyof typeof styleInstructions]}
- Duration: ${options.duration} minutes
- Host Name: ${options.hostName}
- Include Music: ${options.includeMusic}
- Include Ads: ${options.includeAds}

INSTRUCTIONS:
1. Create an engaging introduction that hooks listeners
2. Develop a clear episode outline with main talking points
3. Write natural, conversational script that sounds good when spoken
4. ${options.includeMusic ? "Include music cues and transitions" : "Focus on spoken content"}
5. ${options.includeAds ? "Include ad break placements" : "Keep content flowing without interruptions"}
6. End with a strong conclusion and call-to-action
7. Use the host name "${options.hostName}" throughout
8. Include timing estimates for each section

Format your response as JSON:
{
  "intro": "Episode introduction script",
  "outline": ["Main point 1", "Main point 2", ...],
  "script": "Full episode script with timing cues",
  "outro": "Episode conclusion script",
  "duration": "Estimated total duration"
}

IMPORTANT: Return ONLY the JSON, no additional text.`,
    })

    try {
      let cleanedText = text.trim()
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      const result = JSON.parse(cleanedText)
      return { success: true, content: result }
    } catch (parseError) {
      // Fallback response
      return {
        success: true,
        content: {
          intro: `${options.includeMusic ? "[INTRO MUSIC FADES IN]\n\n" : ""}Welcome to today's episode! I'm ${options.hostName}, and I'm excited to dive into some fascinating insights with you today. ${options.includeMusic ? "\n\n[MUSIC FADES OUT]" : ""}`,
          outline: [
            "Introduction to the main topic",
            "Key insight #1 and practical applications",
            "Key insight #2 with real-world examples",
            "Key insight #3 and actionable takeaways",
            "Conclusion and next steps",
          ],
          script: `[00:00] ${options.includeMusic ? "[INTRO MUSIC]\n\n" : ""}Welcome everyone! I'm ${options.hostName}, and today we're exploring some really valuable insights that I think will help you in your journey.

[01:00] Let me start by sharing the main concept we'll be discussing today...

[02:30] The first key point I want to highlight is absolutely crucial for understanding this topic...

[05:00] ${options.includeAds ? "[AD BREAK - 30 seconds]\n\n" : ""}Now, moving on to our second major point...

[08:00] This brings us to something really interesting that I think you'll find valuable...

[12:00] Finally, let's talk about how you can actually apply these insights in your own situation...

[${options.duration.split("-")[0]}:00] That wraps up our discussion for today. I hope these insights have been helpful for you.`,
          outro: `Thanks for tuning in today! If you found this episode valuable, please subscribe and share it with someone who might benefit. ${options.includeMusic ? "\n\n[OUTRO MUSIC FADES IN]" : ""}\n\nUntil next time, keep learning and growing. This is ${options.hostName} signing off!${options.includeMusic ? "\n\n[MUSIC FADES OUT]" : ""}`,
          duration: `${options.duration} minutes`,
        },
      }
    }
  } catch (error) {
    console.error("Podcast script generation error:", error)
    return {
      success: false,
      error: "Failed to generate podcast script",
    }
  }
}

export async function generateContentRepurposing(content: string, format: string, options: any, apiKey?: string) {
  switch (format) {
    case "twitter":
      return await generateTwitterThread(content, options, apiKey)
    case "linkedin":
      return await generateLinkedInPost(content, options, apiKey)
    case "email":
      return await generateEmailNewsletter(content, options, apiKey)
    case "podcast":
      return await generatePodcastScript(content, options, apiKey)
    default:
      return {
        success: false,
        error: "Unsupported format",
      }
  }
}
