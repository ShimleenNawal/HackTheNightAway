"use client"

import { Shield, BookOpen, Newspaper, Sparkles } from "lucide-react"
import { NicknameProvider } from "@/components/nickname-provider"
import { NicknameGate } from "@/components/nickname-gate"
import { AppHeader } from "@/components/app-header"
import { SafeChatChecker } from "@/components/safe-chat-checker"
import { StudyHelper } from "@/components/study-helper"
import { LearningFeed } from "@/components/learning-feed"
import { useState } from "react"

const TABS = [
  { id: "safe-chat", label: "Safe Chat", icon: Shield },
  { id: "study-help", label: "Study", icon: BookOpen },
  { id: "feed", label: "Feed", icon: Newspaper },
] as const

type TabId = (typeof TABS)[number]["id"]

const TAB_COLORS: Record<TabId, string> = {
  "safe-chat": "bg-primary text-primary-foreground",
  "study-help": "bg-accent text-accent-foreground",
  feed: "bg-chart-3 text-foreground",
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId>("safe-chat")

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <AppHeader />

      {/* Welcome banner */}
      <div className="mx-auto w-full max-w-5xl px-3 pt-4 sm:px-4 sm:pt-6">
        <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-3 shadow-sm sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">
              Welcome back, superstar!
            </p>
            <p className="text-xs text-muted-foreground">
              Pick a tab below to explore. Everything here is safe and private.
            </p>
          </div>
        </div>
      </div>

      {/* Content area - extra bottom padding for the mobile tab bar */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-3 py-4 pb-24 sm:px-4 sm:py-6 sm:pb-6">
        {activeTab === "safe-chat" && <SafeChatChecker />}
        {activeTab === "study-help" && <StudyHelper />}
        {activeTab === "feed" && <LearningFeed />}
      </main>

      {/* Desktop footer - hidden on mobile */}
      <footer className="hidden border-t-2 border-border bg-card py-4 sm:block">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4 text-center text-xs font-semibold text-muted-foreground">
          <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L13.09 8.26L20 9L14.81 13.14L16.18 20L12 16.27L7.82 20L9.19 13.14L4 9L10.91 8.26L12 2Z"
              fill="currentColor"
            />
          </svg>
          Guardian Classroom &mdash; Built for student safety, learning, and privacy.
        </div>
      </footer>

      {/* Mobile bottom tab bar - fixed at bottom, visible only on small screens */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-border bg-card/95 backdrop-blur-md safe-bottom sm:hidden" aria-label="Main navigation">
        <div className="flex items-stretch">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 flex-col items-center gap-1 py-3 transition-all active:scale-95 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all ${
                    isActive
                      ? TAB_COLORS[tab.id] + " shadow-md -translate-y-1"
                      : "bg-transparent"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-extrabold">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default function Home() {
  return (
    <NicknameProvider>
      <NicknameGate>
        <AppContent />
      </NicknameGate>
    </NicknameProvider>
  )
}
