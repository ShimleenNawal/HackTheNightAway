"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface NicknameContextType {
  nickname: string | null
  setNickname: (name: string) => void
  clearNickname: () => void
}

const NicknameContext = createContext<NicknameContextType>({
  nickname: null,
  setNickname: () => {},
  clearNickname: () => {},
})

export function useNickname() {
  return useContext(NicknameContext)
}

export function NicknameProvider({ children }: { children: ReactNode }) {
  const [nickname, setNicknameState] = useState<string | null>(null)

  const setNickname = useCallback((name: string) => {
    setNicknameState(name)
  }, [])

  const clearNickname = useCallback(() => {
    setNicknameState(null)
  }, [])

  return (
    <NicknameContext.Provider value={{ nickname, setNickname, clearNickname }}>
      {children}
    </NicknameContext.Provider>
  )
}
