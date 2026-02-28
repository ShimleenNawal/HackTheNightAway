"use client"

import { useState, useCallback } from "react"
import {
  BookOpen,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  GraduationCap,
  Sparkles,
  Trophy,
  Zap,
  Mic,
  MicOff,
  WifiOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useVoiceInput } from "@/hooks/use-voice-input"

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface StudyResult {
  topic: string
  subject: string
  explanation: {
    beginner: string
    intermediate: string
    advanced: string
  }
  keyPoints: string[]
  practiceQuestions: QuizQuestion[]
}

const SUBJECT_CARDS = [
  { id: "mathematics", label: "Maths", icon: "÷", color: "bg-primary", shadowColor: "shadow-primary/20" },
  { id: "science", label: "Science", icon: "⚗", color: "bg-accent", shadowColor: "shadow-accent/20" },
  { id: "english", label: "English", icon: "Aa", color: "bg-chart-4", shadowColor: "shadow-chart-4/20" },
  { id: "history", label: "History", icon: "⏳", color: "bg-chart-3", shadowColor: "shadow-chart-3/20" },
]

async function fetchStudyResult(
  subject: string,
  question: string,
  difficulty: string
): Promise<StudyResult> {
  const response = await fetch("/api/minimax", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      feature: "study-helper",
      payload: { subject, question, difficulty },
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(err.error ?? `Request failed (${response.status})`)
  }

  return response.json() as Promise<StudyResult>
}

type DifficultyLevel = "beginner" | "intermediate" | "advanced"

const DIFFICULTY_LABELS: Record<DifficultyLevel, { label: string; icon: React.ReactNode }> = {
  beginner: { label: "Easy", icon: <Sparkles className="h-4 w-4" /> },
  intermediate: { label: "Medium", icon: <Zap className="h-4 w-4" /> },
  advanced: { label: "Hard", icon: <GraduationCap className="h-4 w-4" /> },
}

export function StudyHelper() {
  const [question, setQuestion] = useState("")
  const [subject, setSubject] = useState("")
  const [result, setResult] = useState<StudyResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("beginner")
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const { isListening, isSupported, toggleListening } = useVoiceInput({
    onResult: (transcript) => {
      setQuestion((prev) => (prev ? prev + " " + transcript : transcript))
    },
  })

  const handleExplain = useCallback(async () => {
    if (!subject) return
    setIsLoading(true)
    setApiError(null)
    try {
      const studyResult = await fetchStudyResult(subject, question, difficulty)
      setResult(studyResult)
      setAnswers({})
      setShowExplanations({})
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [subject, question, difficulty])

  const handleAnswer = useCallback(
    (qIndex: number, optionIndex: number) => {
      if (answers[qIndex] !== undefined) return
      setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }))
      setTimeout(() => {
        setShowExplanations((prev) => ({ ...prev, [qIndex]: true }))
      }, 500)
    },
    [answers]
  )

  const handleReset = useCallback(() => {
    setQuestion("")
    setSubject("")
    setResult(null)
    setAnswers({})
    setShowExplanations({})
    setApiError(null)
  }, [])

  const answeredCount = Object.keys(answers).length
  const correctCount = result
    ? Object.entries(answers).filter(
        ([qIdx, ans]) => result.practiceQuestions[Number(qIdx)]?.correctIndex === ans
      ).length
    : 0
  const totalQuestions = result?.practiceQuestions.length ?? 0
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent shadow-md shadow-accent/20">
          <BookOpen className="h-6 w-6 text-accent-foreground" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">Study Helper</h2>
          <p className="text-xs font-semibold text-muted-foreground sm:text-sm">
            Pick a subject, ask anything, get an AI explanation at your level, then test yourself!
          </p>
        </div>
      </div>

      {/* Subject picker */}
      {!result && (
        <div className="flex flex-col gap-4">
          <span className="text-sm font-bold text-foreground">Pick a subject:</span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SUBJECT_CARDS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSubject(s.id)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all active:scale-95 ${
                  subject === s.id
                    ? `border-foreground ${s.color} text-primary-foreground shadow-lg ${s.shadowColor}`
                    : "border-border bg-card text-foreground hover:border-muted-foreground"
                }`}
              >
                <span className="text-4xl">{s.icon}</span>
                <span className="text-sm font-extrabold">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Question textarea with voice */}
          <div className="relative">
            <Textarea
              placeholder="What exactly are you struggling with? (optional — AI will pick a great topic if left blank)"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-24 resize-none rounded-xl border-2 pr-14 text-sm font-semibold"
              disabled={isLoading}
            />
            {isSupported && (
              <button
                onClick={toggleListening}
                className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-90 ${
                  isListening
                    ? "bg-destructive text-primary-foreground shadow-md animate-pulse"
                    : "bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            )}
          </div>
          {isListening && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/5 px-4 py-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
              </span>
              <span className="text-xs font-bold text-destructive">Listening... speak now!</span>
            </div>
          )}

          {/* Voice prompt for mobile */}
          {isSupported && !isListening && (
            <button
              onClick={toggleListening}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-accent/30 bg-accent/5 py-4 text-sm font-bold text-accent transition-all active:scale-[0.98] sm:hidden"
            >
              <Mic className="h-5 w-5" />
              Tap to ask your question with your voice
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
                  <p className="text-sm font-extrabold text-destructive">Couldn{"'"}t load study content</p>
                  <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{apiError}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleExplain}
            disabled={!subject || isLoading}
            className="h-14 rounded-xl text-base font-bold shadow-md shadow-primary/20 gap-2 sm:h-12"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Lightbulb className="h-5 w-5" />
            )}
            {isLoading ? "Thinking..." : "Explain It & Quiz Me!"}
          </Button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-5">
          {/* Topic card */}
          <Card className="border-2 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-3 border-b-2 border-border bg-secondary/30 pb-4">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base font-extrabold sm:text-lg">{result.topic}</CardTitle>
                  <Badge variant="secondary" className="mt-1 rounded-lg font-bold text-xs">
                    {result.subject}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={handleReset} size="sm" className="shrink-0 rounded-xl font-bold gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New Topic</span>
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 p-4 pt-5 sm:p-6 sm:pt-5">
              {/* Difficulty toggle */}
              <div className="flex gap-1 rounded-xl bg-secondary p-1">
                {(["beginner", "intermediate", "advanced"] as DifficultyLevel[]).map((level) => {
                  const { label, icon } = DIFFICULTY_LABELS[level]
                  return (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-3 text-sm font-bold transition-all active:scale-95 ${
                        difficulty === level
                          ? "bg-card text-foreground shadow-md -translate-y-0.5"
                          : "text-muted-foreground"
                      }`}
                    >
                      {icon}
                      <span>{label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Explanation */}
              <div className="rounded-xl bg-secondary/50 p-4">
                <p className="text-sm font-semibold text-foreground leading-relaxed">
                  {result.explanation[difficulty]}
                </p>
              </div>

              {/* Key points */}
              <div className="flex flex-col gap-3">
                <p className="flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
                  <Lightbulb className="h-3.5 w-3.5 text-chart-3" />
                  Key Things to Remember
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {result.keyPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-xl border-2 border-border bg-card p-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-extrabold text-primary">
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-foreground">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz card */}
          <Card className="border-2">
            <CardHeader className="border-b-2 border-border bg-secondary/30 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-extrabold sm:text-lg">Quiz Time!</CardTitle>
                </div>
                {answeredCount > 0 && (
                  <Badge variant="secondary" className="gap-1 rounded-xl px-3 py-1.5 font-bold">
                    <Trophy className="h-3.5 w-3.5 text-chart-3" />
                    {correctCount}/{answeredCount}
                  </Badge>
                )}
              </div>
              {answeredCount > 0 && (
                <Progress
                  value={(correctCount / totalQuestions) * 100}
                  className="mt-3 h-3 rounded-full"
                />
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-4 pt-5 sm:p-6 sm:pt-5">
              {result.practiceQuestions.map((q, qIndex) => {
                const userAnswer = answers[qIndex]
                const isAnswered = userAnswer !== undefined
                const isCorrect = userAnswer === q.correctIndex

                return (
                  <div key={qIndex} className="flex flex-col gap-3 rounded-xl border-2 border-border p-3 sm:p-4">
                    <p className="text-sm font-bold text-foreground">
                      <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-xs font-extrabold text-primary">
                        {qIndex + 1}
                      </span>
                      {q.question}
                    </p>
                    <div className="flex flex-col gap-2">
                      {q.options.map((option, oIndex) => {
                        let optionClass = "border-border bg-card active:scale-[0.98] cursor-pointer"
                        if (isAnswered) {
                          if (oIndex === q.correctIndex) {
                            optionClass = "border-success/40 bg-success/10"
                          } else if (oIndex === userAnswer && !isCorrect) {
                            optionClass = "border-destructive/40 bg-destructive/10"
                          } else {
                            optionClass = "border-border bg-card opacity-40"
                          }
                        }

                        return (
                          <button
                            key={oIndex}
                            onClick={() => handleAnswer(qIndex, oIndex)}
                            disabled={isAnswered}
                            className={`flex items-center gap-3 rounded-xl border-2 p-3.5 text-left text-sm font-semibold transition-all ${optionClass}`}
                          >
                            {isAnswered && oIndex === q.correctIndex && (
                              <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                            )}
                            {isAnswered && oIndex === userAnswer && !isCorrect && (
                              <XCircle className="h-5 w-5 shrink-0 text-destructive" />
                            )}
                            {(!isAnswered || (oIndex !== q.correctIndex && oIndex !== userAnswer)) && (
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 border-border text-[10px] font-extrabold text-muted-foreground">
                                {String.fromCharCode(65 + oIndex)}
                              </span>
                            )}
                            <span className="text-foreground">{option}</span>
                          </button>
                        )
                      })}
                    </div>
                    {showExplanations[qIndex] && (
                      <div className={`mt-1 rounded-xl p-3 ${isCorrect ? "bg-success/10 border-2 border-success/20" : "bg-primary/5 border-2 border-primary/20"}`}>
                        <p className={`text-xs font-extrabold ${isCorrect ? "text-success-foreground" : "text-primary"}`}>
                          {isCorrect ? "Brilliant!" : "Not quite — here's why:"}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-muted-foreground">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Score celebration */}
              {allAnswered && (
                <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-chart-3/30 bg-chart-3/10 p-6 text-center">
                  <Trophy className="h-10 w-10 text-chart-3" />
                  <div>
                    <p className="text-2xl font-extrabold text-foreground">
                      {correctCount === totalQuestions
                        ? "Perfect Score!"
                        : correctCount >= totalQuestions / 2
                          ? "Great Job!"
                          : "Keep Practising!"}
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground">
                      You got {correctCount} out of {totalQuestions} right
                    </p>
                  </div>
                  <Button onClick={handleReset} className="h-12 w-full rounded-xl font-bold gap-2 sm:h-10 sm:w-auto" variant="outline">
                    <RotateCcw className="h-4 w-4" />
                    Try Another Topic
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
