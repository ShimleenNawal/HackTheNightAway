"use client"

import { useState, useCallback } from "react"
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Send,
  RotateCcw,
  Loader2,
  Eye,
  UserX,
  Link2,
  MessageSquareWarning,
  Sparkles,
  ThumbsUp,
  Mic,
  MicOff,
  Copy,
  Check,
  WifiOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useVoiceInput } from "@/hooks/use-voice-input"

interface RiskTag {
  type: "personal-info" | "bullying" | "risky-link" | "stranger-danger" | "safe"
  label: string
  description: string
  severity: "high" | "medium" | "low" | "safe"
}

interface AnalysisResult {
  riskLevel: "safe" | "caution" | "danger"
  tags: RiskTag[]
  highlights: { text: string; reason: string }[]
  saferRewrite: string
  explanation: string
}

const RISK_ICONS: Record<string, React.ReactNode> = {
  "personal-info": <Eye className="h-4 w-4" />,
  bullying: <MessageSquareWarning className="h-4 w-4" />,
  "risky-link": <Link2 className="h-4 w-4" />,
  "stranger-danger": <UserX className="h-4 w-4" />,
  safe: <ShieldCheck className="h-4 w-4" />,
}

async function analyzeMessageWithAI(message: string): Promise<AnalysisResult> {
  const response = await fetch("/api/minimax", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ feature: "safe-chat", payload: { message } }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(err.error ?? `Request failed (${response.status})`)
  }

  return response.json() as Promise<AnalysisResult>
}

const SEVERITY_STYLES: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-warning/15 text-warning-foreground border-warning/30",
  low: "bg-secondary text-secondary-foreground border-border",
  safe: "bg-success/10 text-success-foreground border-success/30",
}

const RISK_LEVEL_CONFIG = {
  safe: {
    icon: <ThumbsUp className="h-7 w-7" />,
    label: "All Clear!",
    subtitle: "This message is safe to send",
    className: "border-success/40 bg-success/10",
    textClass: "text-success-foreground",
  },
  caution: {
    icon: <AlertTriangle className="h-7 w-7" />,
    label: "Heads Up!",
    subtitle: "A couple of things to check",
    className: "border-warning/40 bg-warning/10",
    textClass: "text-warning-foreground",
  },
  danger: {
    icon: <ShieldAlert className="h-7 w-7" />,
    label: "Stop & Think!",
    subtitle: "This message needs some changes",
    className: "border-destructive/40 bg-destructive/10",
    textClass: "text-destructive",
  },
}

const EXAMPLE_MESSAGES = [
  "Hey wanna meet up after school at the park?",
  "My name is Sarah and I live at 42 Oak Street",
  "You're so stupid, nobody likes you!",
  "Check out this cool website: https://bit.ly/xyz123",
]

export function SafeChatChecker() {
  const [message, setMessage] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const { isListening, isSupported, toggleListening } = useVoiceInput({
    onResult: (transcript) => {
      setMessage((prev) => (prev ? prev + " " + transcript : transcript))
    },
  })

  const handleCheck = useCallback(async () => {
    if (!message.trim()) return
    setIsAnalyzing(true)
    setApiError(null)
    try {
      const analysisResult = await analyzeMessageWithAI(message)
      setResult(analysisResult)
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }, [message])

  const handleReset = useCallback(() => {
    setMessage("")
    setResult(null)
    setCopied(false)
    setApiError(null)
  }, [])

  const handleCopySafe = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const riskConfig = result ? RISK_LEVEL_CONFIG[result.riskLevel] : null

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-md shadow-primary/20">
          <ShieldCheck className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">Check Before You Send</h2>
          <p className="text-xs font-semibold text-muted-foreground sm:text-sm">
            Paste or speak a message and we{"'"}ll scan it for anything risky.
          </p>
        </div>
      </div>

      {/* Input area */}
      <Card className="border-2 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <Textarea
              placeholder="Type, paste, or tap the mic to speak your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-32 resize-none rounded-none border-0 p-4 pr-14 text-base font-semibold focus-visible:ring-0 sm:min-h-36"
              disabled={isAnalyzing}
            />
            {/* Floating mic button inside textarea */}
            {isSupported && (
              <button
                onClick={toggleListening}
                className={`absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-2xl transition-all active:scale-90 ${
                  isListening
                    ? "bg-destructive text-primary-foreground shadow-lg shadow-destructive/30 animate-pulse"
                    : "bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                }`}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            )}
            {isListening && (
              <div className="flex items-center gap-2 border-t border-dashed border-destructive/30 bg-destructive/5 px-4 py-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
                </span>
                <span className="text-xs font-bold text-destructive">Listening... speak now!</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t-2 border-border bg-secondary/50 p-3">
            <Button
              onClick={handleCheck}
              disabled={!message.trim() || isAnalyzing}
              className="h-12 flex-1 rounded-xl font-bold shadow-md shadow-primary/20 gap-2 text-base sm:flex-none sm:h-10 sm:text-sm"
              size="lg"
            >
              {isAnalyzing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              {isAnalyzing ? "Scanning..." : "Scan Message"}
            </Button>
            {result && (
              <Button variant="outline" onClick={handleReset} className="h-12 rounded-xl font-bold gap-2 sm:h-10">
                <RotateCcw className="h-4 w-4" />
                Start Over
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Voice hint for mobile */}
      {isSupported && !result && !isListening && (
        <button
          onClick={toggleListening}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 py-4 text-sm font-bold text-primary transition-all active:scale-[0.98] sm:hidden"
        >
          <Mic className="h-5 w-5" />
          Tap to speak your message instead
        </button>
      )}

      {/* API error banner */}
      {apiError && (
        <Card className="border-2 border-destructive/40 bg-destructive/5">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <WifiOff className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-destructive">Couldn{"'"}t scan right now</p>
              <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{apiError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Try these examples */}
      {!result && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Try these examples:
          </span>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {EXAMPLE_MESSAGES.map((msg, i) => (
              <button
                key={i}
                onClick={() => setMessage(msg)}
                className="rounded-xl border-2 border-border bg-card px-4 py-3 text-left text-xs font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md active:scale-[0.98] sm:py-2"
              >
                {`"${msg.slice(0, 45)}${msg.length > 45 ? "..." : ""}"`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && riskConfig && (
        <div className="flex flex-col gap-4">
          {/* Status banner */}
          <Card className={`border-2 ${riskConfig.className} overflow-hidden`}>
            <CardContent className="flex items-center gap-4 p-4 sm:p-5">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm ${riskConfig.textClass}`}>
                {riskConfig.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-xl font-extrabold ${riskConfig.textClass}`}>
                  {riskConfig.label}
                </p>
                <p className="text-xs font-semibold text-muted-foreground sm:text-sm">
                  {result.explanation}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {result.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="outline"
                className={`gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold border-2 ${SEVERITY_STYLES[tag.severity]}`}
              >
                {RISK_ICONS[tag.type]}
                {tag.label}
              </Badge>
            ))}
          </div>

          {/* Flagged items */}
          {result.highlights.length > 0 && (
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                  What We Found
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {result.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl bg-secondary/60 p-3"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warning/20">
                      <AlertTriangle className="h-3.5 w-3.5 text-warning-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <code className="break-all rounded-lg bg-destructive/10 px-2 py-1 text-sm font-bold text-destructive">
                        {h.text}
                      </code>
                      <p className="mt-1 text-xs font-semibold text-muted-foreground">
                        {h.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Safer version */}
          {result.riskLevel !== "safe" && (
            <Card className="border-2 border-accent/30 bg-accent/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-bold text-accent">
                  <Sparkles className="h-4 w-4" />
                  Here{"'"}s a Safer Version
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="rounded-xl bg-card p-4 text-sm font-semibold text-foreground leading-relaxed border-2 border-border">
                  {result.saferRewrite}
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleCopySafe(result.saferRewrite)}
                  className="h-12 w-full rounded-xl font-bold gap-2 sm:h-10 sm:w-auto"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy Safe Version"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Action buttons at bottom of results */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="h-12 flex-1 rounded-xl font-bold gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Check Another Message
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
