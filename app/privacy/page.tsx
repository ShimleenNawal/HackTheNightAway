"use client"

import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Server,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const WHAT_WE_STORE = [
  {
    item: "Your nickname",
    where: "This browser tab only",
    why: "So we can greet you during this session",
  },
  {
    item: "Quiz scores & progress",
    where: "This browser tab only",
    why: "So you can see how you're doing right now",
  },
]

const WHAT_WE_DONT = [
  "Your real name or who you are",
  "Your email address",
  "Your phone number or home address",
  "The messages you check (they never leave your device!)",
  "Your location or what device you use",
  "ANYTHING after you close this tab",
]

const PRIVACY_PRINCIPLES = [
  {
    icon: <EyeOff className="h-6 w-6" />,
    color: "bg-primary",
    title: "Secret Identity Mode",
    description:
      "You only need a fun nickname. We never ask for real names, emails, or anything that could identify you. You're completely anonymous!",
  },
  {
    icon: <Server className="h-6 w-6" />,
    color: "bg-accent",
    title: "Everything Stays On Your Device",
    description:
      "When you check a message, it's analysed right here in your browser. Nothing gets sent to any server, ever!",
  },
  {
    icon: <Trash2 className="h-6 w-6" />,
    color: "bg-chart-3",
    title: "Close Tab = Everything Gone",
    description:
      "All your data lives only in your current session. Close the tab and poof \u2014 it's all gone! No cookies, no tracking.",
  },
  {
    icon: <Lock className="h-6 w-6" />,
    color: "bg-chart-4",
    title: "Zero Snooping",
    description:
      "We don't use tracking pixels, analytics cookies, or any sneaky third-party tools. Your activity here is nobody's business!",
  },
]

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b-2 border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl font-bold">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-extrabold text-foreground">Privacy & Transparency</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Hero */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary shadow-lg shadow-primary/20">
              <ShieldCheck className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground text-balance">
              Your Privacy is Super Important to Us
            </h1>
            <p className="max-w-lg text-base font-semibold text-muted-foreground text-pretty leading-relaxed">
              Guardian Classroom is built with your privacy at its core. You deserve amazing AI tools
              without giving away who you are. Here{"'"}s exactly how we protect you.
            </p>
          </div>

          {/* Principles grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {PRIVACY_PRINCIPLES.map((principle, i) => (
              <Card key={i} className="border-2 transition-all hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${principle.color} text-primary-foreground shadow-md`}>
                    {principle.icon}
                  </div>
                  <h3 className="text-base font-extrabold text-foreground">{principle.title}</h3>
                  <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* What we store */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-lg font-extrabold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                  <Eye className="h-4 w-4 text-accent" />
                </div>
                What We Remember (Only This Session!)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {WHAT_WE_STORE.map((item, i) => (
                  <div key={i} className="flex flex-col gap-1 rounded-xl border-2 border-border p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                      <span className="font-bold text-foreground">{item.item}</span>
                    </div>
                    <div className="ml-7 flex flex-col gap-0.5 text-sm font-semibold text-muted-foreground">
                      <span>Where: {item.where}</span>
                      <span>Why: {item.why}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What we never collect */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-lg font-extrabold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                  <EyeOff className="h-4 w-4 text-destructive" />
                </div>
                What We NEVER Collect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {WHAT_WE_DONT.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-semibold text-foreground">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Future section */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col gap-3 p-6">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-6 w-6 text-primary" />
                <h3 className="font-extrabold text-primary text-lg">Coming Soon: Next-Level Security</h3>
              </div>
              <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
                We{"'"}re planning quantum-resistant security for the future. This means
                even the most powerful computers of tomorrow won{"'"}t be able to crack
                your privacy. Student identities will be protected by cutting-edge
                zero-knowledge proofs \u2014 you can prove who you are without revealing
                anything about yourself!
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-center pb-8">
            <Link href="/">
              <Button className="rounded-xl font-bold shadow-md shadow-primary/20 gap-2" size="lg">
                <ArrowLeft className="h-4 w-4" />
                Back to Learning!
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
