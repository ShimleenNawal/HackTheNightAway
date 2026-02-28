import { NextRequest, NextResponse } from "next/server"

const MINIMAX_API_URL = "https://api.minimax.io/v1/text/chatcompletion_v2"
const MINIMAX_MODEL = "M2-her"

function buildSafeChatPrompt(message: string): { systemPrompt: string; userContent: string } {
  const systemPrompt = `You are a child online safety assistant for Guardian Classroom, an app used by students aged 8-16. Your job is to analyze messages for potential risks before a student sends them.

Analyze the given message and respond ONLY with a valid JSON object — no markdown fences, no extra text. The JSON must match this exact structure:

{
  "riskLevel": "safe" | "caution" | "danger",
  "tags": [
    {
      "type": "personal-info" | "bullying" | "risky-link" | "stranger-danger" | "safe",
      "label": "short label (max 4 words)",
      "description": "child-friendly explanation (1 sentence)",
      "severity": "high" | "medium" | "low" | "safe"
    }
  ],
  "highlights": [
    {
      "text": "exact substring from the message",
      "reason": "short reason label"
    }
  ],
  "saferRewrite": "a rewritten version of the message with risks removed, or the original if safe",
  "explanation": "a friendly, encouraging explanation for a child (1-2 sentences)"
}

Rules:
- riskLevel is "danger" if any tag has severity "high", "caution" if only "medium", "safe" if all clear
- If message is safe, tags must contain exactly one entry with type "safe" and severity "safe"
- highlights must only contain substrings that literally appear in the message
- saferRewrite must replace personal info with "[hidden for safety]" and hurtful words with "***"
- Keep language friendly and age-appropriate (8-16 year olds)
- Detect: personal info (phone, email, address, real name, school name, location), bullying/hurtful language, shortened/suspicious URLs (bit.ly, tinyurl etc), grooming/stranger danger patterns`

  return {
    systemPrompt,
    userContent: `Analyze this message: "${message}"`,
  }
}

function buildStudyHelperPrompt(
  subject: string,
  question: string,
  difficulty: string
): { systemPrompt: string; userContent: string } {
  const systemPrompt = `You are an enthusiastic educational assistant for Guardian Classroom, helping students aged 8-16.

Given a subject, an optional specific question, and a difficulty level, generate a study resource and respond ONLY with a valid JSON object — no markdown fences, no extra text. The JSON must match this exact structure:

{
  "topic": "specific topic name (e.g. 'Quadratic Equations', 'Photosynthesis')",
  "subject": "subject name",
  "explanation": {
    "beginner": "simple explanation for beginners (2-3 sentences, use analogies and everyday language)",
    "intermediate": "more detailed explanation with terminology (3-4 sentences)",
    "advanced": "in-depth explanation with technical detail (3-4 sentences)"
  },
  "keyPoints": [
    "key point 1",
    "key point 2",
    "key point 3",
    "key point 4"
  ],
  "practiceQuestions": [
    {
      "question": "multiple choice question",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0,
      "explanation": "why this answer is correct (1-2 sentences, encouraging tone)"
    }
  ]
}

Rules:
- keyPoints must have exactly 4 items
- practiceQuestions must have exactly 3 items
- correctIndex is 0-based (0 = first option)
- All language must be age-appropriate and engaging for students aged 8-16
- Use a friendly, enthusiastic tone — like a great teacher
- If the student provided a specific question, focus the topic and content around answering it`

  return {
    systemPrompt,
    userContent: `Subject: ${subject}\nDifficulty level: ${difficulty}\nStudent question: ${question || "Give me a good topic to study in this subject"}`,
  }
}

async function callMinimax(
  systemPrompt: string,
  userContent: string,
  temperature: number
): Promise<string> {
  const apiKey = process.env.MINIMAX_API_KEY
  if (!apiKey || apiKey === "your_key_here") {
    throw new Error("MINIMAX_API_KEY is not configured. Please add it to your .env.local file.")
  }

  const response = await fetch(MINIMAX_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MINIMAX_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature,
      max_completion_tokens: 1024,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Minimax API error ${response.status}: ${errorText}`)
  }

  const data = await response.json()

  if (data.base_resp?.status_code && data.base_resp.status_code !== 0) {
    throw new Error(`Minimax error ${data.base_resp.status_code}: ${data.base_resp.status_msg}`)
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error("Empty response from Minimax API")
  }

  return content
}

function parseJsonFromContent(content: string): unknown {
  // Strip markdown fences if present
  let cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()

  // Extract the first complete JSON object or array from the response,
  // in case the model wraps it with extra prose
  const firstBrace = cleaned.indexOf("{")
  const firstBracket = cleaned.indexOf("[")
  let start = -1
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    start = firstBrace
  } else if (firstBracket !== -1) {
    start = firstBracket
  }

  if (start > 0) {
    cleaned = cleaned.slice(start)
  }

  // Trim any trailing prose after the final closing brace/bracket
  const lastBrace = cleaned.lastIndexOf("}")
  const lastBracket = cleaned.lastIndexOf("]")
  const end = Math.max(lastBrace, lastBracket)
  if (end !== -1 && end < cleaned.length - 1) {
    cleaned = cleaned.slice(0, end + 1)
  }

  return JSON.parse(cleaned)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { feature, payload } = body as {
      feature: "safe-chat" | "study-helper"
      payload: Record<string, string>
    }

    if (!feature || !payload) {
      return NextResponse.json({ error: "Missing feature or payload" }, { status: 400 })
    }

    if (feature === "safe-chat") {
      const { message } = payload
      if (!message?.trim()) {
        return NextResponse.json({ error: "Message is required" }, { status: 400 })
      }

      const { systemPrompt, userContent } = buildSafeChatPrompt(message)
      const content = await callMinimax(systemPrompt, userContent, 0.4)
      const result = parseJsonFromContent(content)
      return NextResponse.json(result)
    }

    if (feature === "study-helper") {
      const { subject, question, difficulty } = payload
      if (!subject?.trim()) {
        return NextResponse.json({ error: "Subject is required" }, { status: 400 })
      }

      const { systemPrompt, userContent } = buildStudyHelperPrompt(
        subject,
        question ?? "",
        difficulty ?? "beginner"
      )
      const content = await callMinimax(systemPrompt, userContent, 0.7)
      const result = parseJsonFromContent(content)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Unknown feature" }, { status: 400 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error"
    console.error("[Minimax API route]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
