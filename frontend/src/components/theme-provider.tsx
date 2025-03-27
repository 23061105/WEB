"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "dark",
  enableSystem = false,
  disableTransitionOnChange = false,
  ...props
}: {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    
    if (disableTransitionOnChange) {
      root.classList.add("no-transition")
      window.setTimeout(() => {
        root.classList.remove("no-transition")
      }, 0)
    }
  }, [theme, disableTransitionOnChange])

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  )
} 