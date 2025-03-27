"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor } from "lucide-react"

export function ThemeContent() {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark")

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Theme</h2>
      <div className="bg-[#1e1a24] rounded-lg p-6">
        <p className="text-gray-400 mb-4">Choose your preferred appearance</p>

        <div className="grid grid-cols-3 gap-4">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            className={`flex flex-col items-center justify-center h-24 ${theme === "light" ? "bg-purple-600" : "bg-[#121016]"}`}
            onClick={() => setTheme("light")}
          >
            <Sun className="h-8 w-8 mb-2" />
            <span>Light</span>
          </Button>

          <Button
            variant={theme === "dark" ? "default" : "outline"}
            className={`flex flex-col items-center justify-center h-24 ${theme === "dark" ? "bg-purple-600" : "bg-[#121016]"}`}
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-8 w-8 mb-2" />
            <span>Dark</span>
          </Button>

          <Button
            variant={theme === "system" ? "default" : "outline"}
            className={`flex flex-col items-center justify-center h-24 ${theme === "system" ? "bg-purple-600" : "bg-[#121016]"}`}
            onClick={() => setTheme("system")}
          >
            <Monitor className="h-8 w-8 mb-2" />
            <span>System</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

