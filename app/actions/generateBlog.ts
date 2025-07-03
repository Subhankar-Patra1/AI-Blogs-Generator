"use server"

import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

interface BlogGenerationOptions {
  tone?: string
  style?: string
  wordCount?: number
  length?: string
  language?: string
  languageCode?: string
}

interface EnhancementOptions {
  style: "specific" | "engaging" | "seo" | "trending" | "academic" | "creative"
  audience: "general" | "beginners" | "professionals" | "experts" | "students"
  intent: "inform" | "persuade" | "entertain" | "educate" | "inspire"
  length: "short" | "medium" | "long"
}

export async function generateBlog(topic: string, options: BlogGenerationOptions = {}, apiKey?: string) {
  try {
    // Use user-provided API key if available, otherwise fallback to env
    const google = createGoogleGenerativeAI({
      apiKey: apiKey || process.env.GOOGLE_API_KEY!,
    })

    console.log("Generating blog post for topic:", topic, "with options:", options)

    // Build tone instruction
    const toneInstructions = {
      professional:
        "Write in a professional, formal, and authoritative tone. Use business language and maintain credibility.",
      conversational:
        "Write in a friendly, conversational tone as if talking to a friend. Use casual language and personal pronouns.",
      witty:
        "Write with humor, clever wordplay, and entertaining elements. Include jokes or amusing observations where appropriate.",
      inspirational: "Write in an uplifting, motivating tone that encourages and inspires readers to take action.",
      technical:
        "Write with technical precision, using industry terminology and detailed explanations for expert readers.",
      "seo-optimized":
        "Write with SEO best practices, including strategic keyword placement and search-friendly structure.",
    }

    // Build style instruction
    const styleInstructions = {
      "blog-post": "Format as a casual blog post with personal insights, anecdotes, and engaging storytelling.",
      academic: "Structure as an academic article with citations, formal language, and scholarly approach.",
      promotional: "Write as promotional content with compelling calls-to-action and persuasive language.",
      tutorial: "Format as a step-by-step tutorial with clear instructions, numbered steps, and actionable advice.",
      listicle: "Structure as a listicle with numbered or bulleted points, each with detailed explanations.",
      "news-article": "Write in journalistic style with factual reporting, quotes, and news article structure.",
    }

    // Build length instruction
    const lengthInstructions = {
      short: "Keep the content concise and focused. Aim for 250-350 words with 2-3 main points.",
      medium: "Provide comprehensive coverage with good detail. Aim for 600-800 words with 3-4 main sections.",
      long: "Create in-depth, thorough content with extensive detail. Aim for 1000-1500 words with 4-6 main sections and subsections.",
    }

    const toneInstruction = options.tone ? toneInstructions[options.tone as keyof typeof toneInstructions] || "" : ""
    const styleInstruction = options.style
      ? styleInstructions[options.style as keyof typeof styleInstructions] || ""
      : ""
    const lengthInstruction = options.length
      ? lengthInstructions[options.length as keyof typeof lengthInstructions] || ""
      : ""

    const wordCountTarget = options.wordCount || 700
    const lengthDescription = options.length || "medium"
    const language = options.language || "English"
    const languageCode = options.languageCode || "en"

    // Build language instruction
    const languageInstruction =
      languageCode !== "en"
        ? `IMPORTANT: Write the ENTIRE blog post in ${language}. Use native ${language} expressions, idioms, and cultural references where appropriate. Ensure all headings, content, and formatting are in ${language}.`
        : ""

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Write a comprehensive blog post about "${topic}" in proper Markdown format.

${languageInstruction}

${toneInstruction ? `TONE: ${toneInstruction}` : ""}

${styleInstruction ? `STYLE: ${styleInstruction}` : ""}

${lengthInstruction ? `LENGTH: ${lengthInstruction}` : ""}

WORD COUNT TARGET: Approximately ${wordCountTarget} words (${lengthDescription} length)

Structure the blog post with:
- A compelling title using # (H1)
- An engaging introduction paragraph
${lengthDescription === "short" ? "- 2-3 main sections with ## (H2) subheadings" : lengthDescription === "medium" ? "- 3-4 main sections with ## (H2) subheadings" : "- 4-6 main sections with ## (H2) subheadings"}
${lengthDescription !== "short" ? "- Use ### (H3) for subsections if needed" : ""}
- Include bullet points using - or *
- Use **bold** for emphasis and *italics* where appropriate
${lengthDescription !== "short" ? "- Add numbered lists where relevant" : ""}
- Include a conclusion section
- Write in a ${options.tone || "conversational"} tone
- Format as a ${options.style || "blog post"}
- Use proper markdown formatting throughout
${lengthDescription === "long" ? "- Include detailed examples and case studies where appropriate" : ""}

${languageCode !== "en" ? `LANGUAGE: Write everything in ${language} (${languageCode})` : ""}

IMPORTANT: Aim for approximately ${wordCountTarget} words to match the ${lengthDescription} length requirement.

Topic: ${topic}

Format the response as clean markdown that will render beautifully.`,
    })

    console.log("Successfully generated blog post")
    return { success: true, content: text }
  } catch (error) {
    console.error("Detailed error:", error)

    // Handle specific Gemini API errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()

      if (
        errorMessage.includes("api key") ||
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("forbidden") ||
        errorMessage.includes("missing")
      ) {
        return {
          success: false,
          error: "Invalid or missing Gemini API key. Please check your Google AI API key configuration.",
          errorType: "auth",
        }
      }

      if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
        return {
          success: false,
          error: "Gemini API quota exceeded. Please check your Google AI usage limits.",
          errorType: "quota",
        }
      }

      if (errorMessage.includes("rate limit")) {
        return {
          success: false,
          error: "Rate limit exceeded. Please try again in a few minutes.",
          errorType: "rate_limit",
        }
      }

      if (errorMessage.includes("model")) {
        return {
          success: false,
          error: "Gemini model not available. Please try again later.",
          errorType: "model",
        }
      }

      return {
        success: false,
        error: `Generation failed: ${error.message}`,
        errorType: "general",
      }
    }

    return {
      success: false,
      error: "An unexpected error occurred while generating the blog post.",
      errorType: "unknown",
    }
  }
}

// Translation function
export async function translateContent(content: string, targetLanguage: string, targetLanguageCode: string, apiKey?: string) {
  try {
    const google = createGoogleGenerativeAI({
      apiKey: apiKey || process.env.GOOGLE_API_KEY!,
    })

    console.log("Translating content to:", targetLanguage)

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Translate the following blog post content to ${targetLanguage} (${targetLanguageCode}).

IMPORTANT INSTRUCTIONS:
- Maintain the original Markdown formatting (headings, lists, bold, italic, etc.)
- Preserve the structure and organization of the content
- Use native ${targetLanguage} expressions and idioms where appropriate
- Ensure cultural relevance for ${targetLanguage} speakers
- Keep technical terms accurate and appropriate for the target language
- Maintain the same tone and style as the original
- Do not add or remove content, only translate

Original content to translate:

${content}

Provide the complete translated content in proper Markdown format.`,
    })

    console.log("Successfully translated content")
    return { success: true, content: text }
  } catch (error) {
    console.error("Translation error:", error)
    return {
      success: false,
      error: "Failed to translate content. Please try again.",
    }
  }
}

// Helper function to generate fallback suggestions when API parsing fails
function generateFallbackSuggestions(topic: string, options: EnhancementOptions) {
  const styleModifiers = {
    specific: "Step-by-Step Guide to",
    engaging: "The Ultimate Guide to",
    seo: "Complete 2024 Guide:",
    trending: "🔥 What Everyone Should Know About",
    academic: "Research-Based Analysis of",
    creative: "Innovative Approaches to",
  }

  const audienceModifiers = {
    general: "for Everyone",
    beginners: "for Beginners",
    professionals: "for Professionals",
    experts: "for Advanced Practitioners",
    students: "for Students",
  }

  const baseTitle = `${styleModifiers[options.style]} ${topic} ${audienceModifiers[options.audience]}`

  return [
    {
      id: "1",
      title: baseTitle,
      description: `Comprehensive coverage of ${topic.toLowerCase()} tailored for ${options.audience}.`,
      category: "Enhanced Guide",
      score: 88,
      keywords: [topic.toLowerCase(), options.style, options.audience, "guide"],
      reasoning: `Optimized for ${options.style} style targeting ${options.audience} audience.`,
    },
    {
      id: "2",
      title: `${topic}: Common Mistakes and How to Avoid Them`,
      description: `Learn from common pitfalls and discover best practices in ${topic.toLowerCase()}.`,
      category: "Problem-Solution",
      score: 85,
      keywords: ["mistakes", "avoid", "best practices", topic.toLowerCase()],
      reasoning: "Addresses pain points and provides valuable solutions.",
    },
    {
      id: "3",
      title: `The Future of ${topic}: Trends and Predictions`,
      description: `Explore emerging trends and future developments in ${topic.toLowerCase()}.`,
      category: "Trend Analysis",
      score: 82,
      keywords: ["future", "trends", "predictions", topic.toLowerCase()],
      reasoning: "Leverages interest in future predictions and trending topics.",
    },
  ]
}

// Enhanced topic generation function
export async function enhanceTopic(originalTopic: string, options: EnhancementOptions, apiKey?: string) {
  try {
    const google = createGoogleGenerativeAI({
      apiKey: apiKey || process.env.GOOGLE_API_KEY!,
    })

    console.log("Enhancing topic:", originalTopic, "with options:", options)

    const styleInstructions = {
      specific: "Make the topic more focused, detailed, and specific. Add concrete elements and narrow the scope.",
      engaging: "Add compelling hooks, emotional elements, and engaging language that captures attention.",
      seo: "Include trending keywords, search-friendly terms, and phrases that rank well in search engines.",
      trending: "Connect to current trends, hot topics, and what people are talking about right now.",
      academic: "Use scholarly language, research-focused angles, and academic terminology.",
      creative: "Think outside the box with unique perspectives, creative angles, and innovative approaches.",
    }

    const audienceInstructions = {
      general: "Appeal to a broad, general audience with universal interests and accessible language.",
      beginners: "Focus on introductory concepts, basic explanations, and beginner-friendly approaches.",
      professionals: "Target working professionals with industry-specific insights and practical applications.",
      experts: "Address advanced practitioners with sophisticated concepts and expert-level discussions.",
      students: "Focus on educational value, learning objectives, and academic perspectives.",
    }

    const intentInstructions = {
      inform: "Focus on sharing knowledge, facts, and informative content that educates readers.",
      persuade: "Create compelling arguments and persuasive elements that influence reader opinions.",
      entertain: "Add entertaining elements, humor, and engaging content that amuses readers.",
      educate: "Structure as educational content with clear learning outcomes and teaching elements.",
      inspire: "Include motivational elements and inspiring messages that uplift and encourage readers.",
    }

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `You are an expert content strategist and copywriter. Your task is to enhance the given blog topic and create 5 compelling, improved versions.

ORIGINAL TOPIC: "${originalTopic}"

ENHANCEMENT REQUIREMENTS:
- Style: ${styleInstructions[options.style]}
- Target Audience: ${audienceInstructions[options.audience]}
- Content Intent: ${intentInstructions[options.intent]}
- Content Length: ${options.length}

Please generate exactly 5 enhanced topic suggestions. For each suggestion, provide:
1. An improved, compelling title
2. A brief description (1-2 sentences)
3. A category/type classification
4. A quality score (1-100)
5. 3-5 relevant keywords
6. A brief reasoning for why this enhancement works

Format your response as a JSON array with this exact structure:
[
  {
    "title": "Enhanced topic title here",
    "description": "Brief description of what this blog post would cover",
    "category": "Content category (e.g., How-to Guide, Trend Analysis, etc.)",
    "score": 85,
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "reasoning": "Brief explanation of why this enhancement is effective"
  }
]

Make sure each suggestion is:
- More compelling than the original
- Tailored to the specified audience and intent
- Optimized for the chosen enhancement style
- Unique and distinct from the other suggestions
- Actionable and specific

IMPORTANT: Return ONLY the JSON array, no additional text or formatting.`,
    })

    console.log("Successfully enhanced topic")

    try {
      // Clean the response by removing markdown code blocks if present
      let cleanedText = text.trim()

      // Remove markdown code block markers
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      // Additional cleanup - remove any leading/trailing whitespace and newlines
      cleanedText = cleanedText.trim()

      console.log("Cleaned response for parsing:", cleanedText.substring(0, 200) + "...")

      const suggestions = JSON.parse(cleanedText)

      // Validate that we got an array
      if (!Array.isArray(suggestions)) {
        throw new Error("Response is not an array")
      }

      return {
        success: true,
        suggestions: suggestions.map((suggestion: any, index: number) => ({
          ...suggestion,
          id: (index + 1).toString(),
        })),
      }
    } catch (parseError) {
      console.error("Failed to parse enhancement response:", parseError)
      console.error("Raw response:", text)

      // Return fallback suggestions instead of failing
      return {
        success: true,
        suggestions: generateFallbackSuggestions(originalTopic, options),
      }
    }
  } catch (error) {
    console.error("Enhancement error:", error)
    return {
      success: false,
      error: "Failed to enhance topic. Please try again.",
    }
  }
}

// Fallback function that generates a sample blog post when API is unavailable
export async function generateSampleBlog(topic: string, options: BlogGenerationOptions = {}) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const toneAdjustment =
    options.tone === "professional"
      ? "formal and business-focused"
      : options.tone === "witty"
        ? "humorous and entertaining"
        : options.tone === "inspirational"
          ? "motivating and uplifting"
          : options.tone === "technical"
            ? "detailed and precise"
            : options.tone === "seo-optimized"
              ? "search-engine optimized"
              : "conversational and friendly"

  const wordCount = options.wordCount || 700
  const length = options.length || "medium"
  const language = options.language || "English"
  const languageCode = options.languageCode || "en"

  // Sample content in different languages
  const sampleContent = {
    en: `# ${topic}: A Comprehensive Guide

## Introduction

Welcome to this **comprehensive guide** about *${topic}*. In today's rapidly evolving world, understanding ${topic} has become increasingly important for both individuals and businesses alike.

This guide will walk you through everything you need to know, from the basics to advanced concepts, ensuring you have a solid foundation to build upon. We'll explore this topic with a ${toneAdjustment} approach.

## Why ${topic} Matters

${topic} plays a crucial role in our daily lives. Here are some key reasons why you should care about ${topic}:

- **Relevance**: ${topic} directly impacts how we approach modern challenges
- **Innovation**: Understanding ${topic} opens doors to new opportunities  
- **Future-proofing**: Knowledge of ${topic} prepares us for what's ahead
- **Competitive advantage**: Staying informed gives you an edge in your field

## Conclusion

${topic} is a **fascinating and important subject** that deserves our attention. Whether you're just starting out or looking to deepen your knowledge, remember that learning about ${topic} is an *ongoing journey*.

---

*Note: This is a sample ${length} blog post (~${wordCount} words) generated with ${toneAdjustment} tone due to API limitations.*`,

    es: `# ${topic}: Una Guía Completa

## Introducción

Bienvenido a esta **guía completa** sobre *${topic}*. En el mundo actual que evoluciona rápidamente, entender ${topic} se ha vuelto cada vez más importante tanto para individuos como para empresas.

Esta guía te llevará a través de todo lo que necesitas saber, desde lo básico hasta conceptos avanzados, asegurando que tengas una base sólida sobre la cual construir. Exploraremos este tema con un enfoque ${toneAdjustment}.

## Por Qué ${topic} Importa

${topic} juega un papel crucial en nuestras vidas diarias. Aquí hay algunas razones clave por las que deberías preocuparte por ${topic}:

- **Relevancia**: ${topic} impacta directamente cómo abordamos los desafíos modernos
- **Innovación**: Entender ${topic} abre puertas a nuevas oportunidades
- **Preparación para el futuro**: El conocimiento de ${topic} nos prepara para lo que viene
- **Ventaja competitiva**: Mantenerse informado te da una ventaja en tu campo

## Conclusión

${topic} es un **tema fascinante e importante** que merece nuestra atención. Ya sea que estés comenzando o buscando profundizar tu conocimiento, recuerda que aprender sobre ${topic} es un *viaje continuo*.

---

*Nota: Esta es una publicación de blog de muestra ${length} (~${wordCount} palabras) generada con tono ${toneAdjustment} debido a limitaciones de la API.*`,

    fr: `# ${topic}: Un Guide Complet

## Introduction

Bienvenue dans ce **guide complet** sur *${topic}*. Dans le monde d'aujourd'hui qui évolue rapidement, comprendre ${topic} est devenu de plus en plus important pour les individus et les entreprises.

Ce guide vous guidera à travers tout ce que vous devez savoir, des bases aux concepts avancés, en vous assurant d'avoir une base solide sur laquelle construire. Nous explorerons ce sujet avec une approche ${toneAdjustment}.

## Pourquoi ${topic} Compte

${topic} joue un rôle crucial dans nos vies quotidiennes. Voici quelques raisons clés pour lesquelles vous devriez vous soucier de ${topic}:

- **Pertinence**: ${topic} impacte directement la façon dont nous abordons les défis modernes
- **Innovation**: Comprendre ${topic} ouvre des portes à de nouvelles opportunités
- **Préparation à l'avenir**: La connaissance de ${topic} nous prépare à ce qui nous attend
- **Avantage concurrentiel**: Rester informé vous donne un avantage dans votre domaine

## Conclusion

${topic} est un **sujet fascinant et important** qui mérite notre attention. Que vous commenciez ou cherchiez à approfondir vos connaissances, rappelez-vous qu'apprendre sur ${topic} est un *voyage continu*.

---

*Note: Ceci est un exemple d'article de blog ${length} (~${wordCount} mots) généré avec un ton ${toneAdjustment} en raison des limitations de l'API.*`,
  }

  const content = sampleContent[languageCode as keyof typeof sampleContent] || sampleContent.en

  return { success: true, content, isSample: true }
}
