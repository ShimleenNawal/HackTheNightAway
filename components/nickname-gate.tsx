"use client"

import { useState } from "react"
import { ArrowRight, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNickname } from "@/components/nickname-provider"

const SUGGESTED_NAMES = [
  "CosmicPanda",
  "BrainyStar",
  "CuriousFox",
  "SparkleOwl",
  "MightyLearner",
  "RocketKid",
]

function FloatingShape({ className }: { className?: string }) {
  return (
    <div className={`absolute rounded-full opacity-30 ${className}`} />
  )
}

export function NicknameGate({ children }: { children: React.ReactNode }) {
  const { nickname, setNickname } = useNickname()
  const [input, setInput] = useState("")

  if (nickname) {
    return <>{children}</>
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Decorative background shapes */}
      <FloatingShape className="left-[10%] top-[15%] h-32 w-32 animate-bounce bg-primary/20" />
      <FloatingShape className="right-[15%] top-[20%] h-24 w-24 animate-pulse bg-accent/20" />
      <FloatingShape className="bottom-[20%] left-[20%] h-20 w-20 animate-bounce bg-chart-3/25" />
      <FloatingShape className="bottom-[15%] right-[10%] h-28 w-28 animate-pulse bg-chart-4/20" />

      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-5 text-center">
          {/* Animated mascot logo area */}
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary shadow-lg shadow-primary/25">
              <svg
                className="h-14 w-14 text-primary-foreground"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L13.09 8.26L20 9L14.81 13.14L16.18 20L12 16.27L7.82 20L9.19 13.14L4 9L10.91 8.26L12 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="absolute -right-2 -top-2 flex h-8 w-8 animate-bounce items-center justify-center rounded-full bg-accent">
              <Sparkles className="h-4 w-4 text-accent-foreground" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground text-balance">
              Guardian Classroom
            </h1>
            <p className="text-lg font-semibold text-primary">
              Your Safe Learning Adventure Starts Here!
            </p>
            <p className="text-sm text-muted-foreground text-pretty">
              Pick a cool nickname to get started. No real names needed
              &mdash; your identity stays secret!
            </p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-xl shadow-foreground/5">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (input.trim().length >= 2) {
                setNickname(input.trim())
              }
            }}
            className="flex flex-col gap-4"
          >
            <label className="text-sm font-bold text-foreground" htmlFor="nickname-input">
              Choose Your Secret Identity
            </label>
            <Input
              id="nickname-input"
              placeholder="Type your nickname..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={20}
              className="h-14 rounded-xl border-2 text-lg font-semibold placeholder:font-normal placeholder:text-muted-foreground/50"
              autoFocus
            />

            {/* Suggested names */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Or try one of these:
              </span>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_NAMES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setInput(name)}
                    className="flex items-center gap-1 rounded-full border-2 border-border bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md active:translate-y-0"
                  >
                    <Star className="h-3 w-3 text-primary" />
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={input.trim().length < 2}
              className="h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 gap-2"
            >
              Let{"'"}s Go!
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs font-semibold text-muted-foreground">
          100% private &mdash; no emails, no passwords, no tracking. Just fun learning!
        </p>
      </div>
    </div>
  )
}
