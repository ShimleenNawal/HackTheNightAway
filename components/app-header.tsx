"use client"

import { Lock, LogOut, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNickname } from "@/components/nickname-provider"
import Link from "next/link"

export function AppHeader() {
  const { nickname, clearNickname } = useNickname()

  return (
    <header className="sticky top-0 z-50 border-b-2 border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3 sm:h-16 sm:px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20 sm:h-10 sm:w-10">
            <svg
              className="h-5 w-5 text-primary-foreground sm:h-6 sm:w-6"
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
          <span className="text-base font-extrabold tracking-tight text-foreground sm:text-lg">
            Guardian Classroom
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link href="/privacy">
            <Button variant="ghost" size="sm" className="h-9 w-9 rounded-xl p-0 font-bold text-muted-foreground sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3">
              <Lock className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Privacy</span>
            </Button>
          </Link>
          {nickname && (
            <div className="flex items-center gap-1.5">
              <div className="flex h-9 items-center gap-1.5 rounded-full bg-secondary px-3 shadow-sm sm:px-4">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="max-w-[80px] truncate text-xs font-bold text-secondary-foreground sm:max-w-none sm:text-sm">
                  {nickname}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearNickname}
                className="h-9 w-9 rounded-full p-0 text-muted-foreground"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
