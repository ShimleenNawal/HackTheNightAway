"use client"

import { useState } from "react"
import {
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Globe,
  Coins,
  Brain,
  Trophy,
  Zap,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TopicQuiz {
  question: string
  options: string[]
  correctIndex: number
}

interface HotTopic {
  id: string
  title: string
  category: string
  icon: React.ReactNode
  iconColor: string
  summary: string
  keyFacts: string[]
  whyItMatters: string
  quiz: TopicQuiz[]
  lastUpdated: string
  readTime: string
}

const HOT_TOPICS: HotTopic[] = [
  {
    id: "ai-agents",
    title: "AI Agents: The Next Wave",
    category: "AI & Tech",
    icon: <Cpu className="h-6 w-6" />,
    iconColor: "bg-primary",
    summary:
      "AI agents are programs that can think, plan, and do tasks on their own! Unlike chatbots that just answer one question at a time, agents can break down big goals into steps and work through them independently.",
    keyFacts: [
      "AI agents can browse the web, write code, and manage files all by themselves",
      "Big tech companies like OpenAI and Google are racing to build agent platforms",
      "The biggest challenge is making sure they're safe and don't do things we don't want",
      "They're already being used in customer service, coding help, and research",
    ],
    whyItMatters:
      "AI agents could change how we work and learn. Imagine having a smart assistant that can research a topic, write notes, and create a quiz for you \u2014 all while you take a break!",
    quiz: [
      {
        question: "What makes an AI agent different from a regular chatbot?",
        options: [
          "Agents can only answer questions",
          "Agents can plan, reason, and take actions on their own",
          "Agents are always connected to the internet",
          "Agents use more electricity",
        ],
        correctIndex: 1,
      },
      {
        question: "What's one of the biggest challenges with AI agents?",
        options: [
          "They're too expensive to run",
          "They can only work in English",
          "Making sure they're safe and don't do unexpected things",
          "They need quantum computers",
        ],
        correctIndex: 2,
      },
    ],
    lastUpdated: "2 hours ago",
    readTime: "3 min",
  },
  {
    id: "climate-tipping",
    title: "Climate Tipping Points",
    category: "Our Planet",
    icon: <Globe className="h-6 w-6" />,
    iconColor: "bg-accent",
    summary:
      "Tipping points are like dominoes in our climate. Once one falls, it can knock over others and cause huge changes that we can't undo \u2014 like massive ice sheets melting or the Amazon rainforest drying out.",
    keyFacts: [
      "Scientists have found at least 9 major climate tipping points",
      "Some might happen with just 1.5\u00B0C of warming (we're already close!)",
      "Tipping points can trigger each other like falling dominoes",
      "The Atlantic ocean current could slow down, totally changing Europe's weather",
    ],
    whyItMatters:
      "Every fraction of a degree matters! Understanding tipping points helps explain why scientists are so worried and why the choices we make today have permanent consequences.",
    quiz: [
      {
        question: "What is a climate tipping point?",
        options: [
          "When summer gets really hot",
          "A point where small changes trigger huge, permanent shifts",
          "When renewable energy gets cheaper",
          "A government deadline for climate action",
        ],
        correctIndex: 1,
      },
      {
        question: "What does 'cascading tipping points' mean?",
        options: [
          "Heavy rainfall everywhere",
          "One tipping point triggers others like falling dominoes",
          "Countries reducing emissions together",
          "Fast economic changes",
        ],
        correctIndex: 1,
      },
    ],
    lastUpdated: "5 hours ago",
    readTime: "4 min",
  },
  {
    id: "defi-basics",
    title: "Digital Money Explained",
    category: "Finance & Tech",
    icon: <Coins className="h-6 w-6" />,
    iconColor: "bg-chart-3",
    summary:
      "DeFi (Decentralised Finance) uses blockchain tech to do banking stuff without actual banks! Smart contracts are like robot bankers that follow rules automatically. Even governments are making their own digital currencies now.",
    keyFacts: [
      "DeFi systems hold over $100 billion in digital money worldwide",
      "Smart contracts are code that automatically follows rules \u2014 no humans needed",
      "Over 100 countries are thinking about making their own digital money",
      "Risks include bugs in code, scams, and rules that keep changing",
    ],
    whyItMatters:
      "Money is going digital fast! Whether it's cryptocurrency or government digital currencies, understanding this helps you make smarter choices about your financial future.",
    quiz: [
      {
        question: "What does DeFi stand for?",
        options: [
          "Digital Finance",
          "Decentralised Finance",
          "Defined Financial",
          "Deferred Finance",
        ],
        correctIndex: 1,
      },
      {
        question: "What do smart contracts do?",
        options: [
          "Store crypto safely",
          "Automatically follow coded rules to handle transactions",
          "Connect to bank accounts",
          "Mine new crypto",
        ],
        correctIndex: 1,
      },
    ],
    lastUpdated: "1 day ago",
    readTime: "4 min",
  },
  {
    id: "neuroscience-learning",
    title: "How Your Brain Learns",
    category: "Brain Science",
    icon: <Brain className="h-6 w-6" />,
    iconColor: "bg-chart-4",
    summary:
      "Your brain physically changes when you learn! Every time you study something, connections between brain cells get stronger. And there are science-backed tricks to make your studying WAY more effective.",
    keyFacts: [
      "Studying a little bit every day beats cramming everything at once",
      "Your brain sorts and strengthens memories while you sleep (so sleep matters!)",
      "Testing yourself is way more effective than just re-reading notes",
      "Your brain's learning centre is still developing through your teen years",
    ],
    whyItMatters:
      "Knowing how your brain works lets you study SMARTER, not harder. These science-backed tips can seriously boost your grades without more study time!",
    quiz: [
      {
        question: "Why does studying a little every day work better than cramming?",
        options: [
          "It takes less total time",
          "Your brain needs time between sessions to strengthen memories",
          "It uses more brain energy",
          "It only works for languages",
        ],
        correctIndex: 1,
      },
      {
        question: "What happens in your brain while you sleep?",
        options: [
          "Nothing related to learning",
          "Your brain only rests",
          "Your brain replays and strengthens what you learned",
          "Sleep only helps before tests",
        ],
        correctIndex: 2,
      },
    ],
    lastUpdated: "3 hours ago",
    readTime: "3 min",
  },
]

function TopicCard({ topic }: { topic: HotTopic }) {
  const [expanded, setExpanded] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})

  const handleAnswer = (qIndex: number, optionIndex: number) => {
    if (quizAnswers[qIndex] !== undefined) return
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }))
  }

  const answeredAll = Object.keys(quizAnswers).length === topic.quiz.length
  const correctCount = Object.entries(quizAnswers).filter(
    ([idx, ans]) => topic.quiz[Number(idx)]?.correctIndex === ans
  ).length

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: topic.title,
        text: topic.summary,
        url: window.location.href,
      })
    }
  }

  return (
    <Card className="border-2 overflow-hidden transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${topic.iconColor} text-primary-foreground shadow-md`}>
            {topic.icon}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <CardTitle className="text-base font-extrabold leading-tight">{topic.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-lg text-[10px] font-bold">
                {topic.category}
              </Badge>
              <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                <Clock className="h-3 w-3" />
                {topic.readTime}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-muted-foreground leading-relaxed">{topic.summary}</p>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-11 flex-1 gap-1.5 rounded-xl font-bold text-primary sm:h-9 sm:flex-none"
          >
            {expanded ? "Show less" : "Dig deeper & take quiz"}
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-11 w-11 rounded-xl p-0 text-muted-foreground sm:h-9 sm:w-9"
            aria-label="Share this topic"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {expanded && (
          <div className="flex flex-col gap-4">
            {/* Key facts */}
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-1.5 text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                <Zap className="h-3 w-3 text-chart-3" />
                Key Facts
              </p>
              <div className="flex flex-col gap-1.5">
                {topic.keyFacts.map((fact, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-secondary/60 p-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-extrabold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold text-foreground">{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why it matters */}
            <div className="rounded-xl border-2 border-accent/20 bg-accent/5 p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-extrabold text-accent uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                Why You Should Care
              </p>
              <p className="mt-1.5 text-xs font-semibold text-foreground leading-relaxed">
                {topic.whyItMatters}
              </p>
            </div>

            {/* Quiz */}
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-1.5 text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                <Trophy className="h-3 w-3 text-chart-3" />
                Quick Quiz
              </p>
              {topic.quiz.map((q, qIndex) => {
                const userAnswer = quizAnswers[qIndex]
                const isAnswered = userAnswer !== undefined
                const isCorrect = userAnswer === q.correctIndex

                return (
                  <div key={qIndex} className="flex flex-col gap-2 rounded-xl border-2 border-border p-3">
                    <p className="text-xs font-bold text-foreground">{q.question}</p>
                    <div className="flex flex-col gap-1.5">
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
                            className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left text-xs font-semibold transition-all ${optionClass}`}
                          >
                            {isAnswered && oIndex === q.correctIndex && (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                            )}
                            {isAnswered && oIndex === userAnswer && !isCorrect && (
                              <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                            )}
                            {(!isAnswered || (oIndex !== q.correctIndex && oIndex !== userAnswer)) && (
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-border text-[9px] font-extrabold text-muted-foreground">
                                {String.fromCharCode(65 + oIndex)}
                              </span>
                            )}
                            <span className="text-foreground">{option}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {answeredAll && (
                <div className="flex items-center gap-2 rounded-xl bg-chart-3/10 border-2 border-chart-3/20 p-3 text-center">
                  <Trophy className="h-5 w-5 text-chart-3" />
                  <span className="text-xs font-extrabold text-foreground">
                    {correctCount === topic.quiz.length
                      ? "Perfect score!"
                      : `${correctCount}/${topic.quiz.length} correct \u2014 nice effort!`}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="text-[10px] font-bold text-muted-foreground">Updated {topic.lastUpdated}</p>
      </CardContent>
    </Card>
  )
}

export function LearningFeed() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-chart-3 shadow-md shadow-chart-3/20">
          <Sparkles className="h-6 w-6 text-foreground" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">Learning Feed</h2>
          <p className="text-xs font-semibold text-muted-foreground sm:text-sm">
            Hot topics explained simply, with quick quizzes to test what you know!
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {HOT_TOPICS.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  )
}
