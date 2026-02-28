"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface UseVoiceInputOptions {
  onResult?: (transcript: string) => void
  onEnd?: () => void
  continuous?: boolean
  lang?: string
}

interface UseVoiceInputReturn {
  isListening: boolean
  isSupported: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  toggleListening: () => void
}

export function useVoiceInput(options: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const { onResult, onEnd, continuous = false, lang = "en-US" } = options
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null
    setIsSupported(!!SpeechRecognition)
  }, [])

  const startListening = useCallback(() => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null

    if (!SpeechRecognition) return

    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = continuous
    recognition.interimResults = true
    recognition.lang = lang

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ""
      let interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      const combined = finalTranscript || interimTranscript
      setTranscript(combined)

      if (finalTranscript) {
        onResult?.(finalTranscript)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      onEnd?.()
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [continuous, lang, onResult, onEnd])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    toggleListening,
  }
}
