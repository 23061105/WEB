"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Sidebar } from "@/components/sidebar"
import { Feed } from "@/components/feed"
import { MessagesPanel } from "@/components/messages-panel"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreatePostModal } from "@/components/create-post-modal"
import { NotificationDropdown } from "@/components/notification-dropdown"

export function MainLayout() {
  const router = useRouter()
  const { user } = useAuth()
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [activeSection, setActiveSection] = useState<
    "home" | "explore" | "notifications" | "messages" | "bookmarks" | "analytics" | "theme" | "settings"
  >("home")

  const navigateToProfile = () => {
    if (user) {
      router.push(`/profile/${user.username}`)
    }
  }

  // Add this useEffect to reset activeSection when the route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.location.pathname === "/") {
        setActiveSection("home")
      }
    }

    // Set initial state
    handleRouteChange()

    // Listen for route changes
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  return (
    <div className="min-h-svh bg-[#121016] text-white">
      {/* Top Navigation */}
      <header className="border-b border-[#2a2433] px-4 py-3 flex items-center justify-between sticky top-0 z-10 bg-[#121016]">
        <h1 className="text-2xl font-bold">nokoSocial</h1>

        <div className="relative flex-1 max-w-xl mx-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <Input
            className="pl-10 bg-[#1e1a24] border-0 rounded-full text-sm h-10"
            placeholder="Search for creators, inspirations, and projects"
          />
        </div>

        <div className="flex items-center gap-3">
          <NotificationDropdown />

          <Button
            className="rounded-full bg-purple-600 hover:bg-purple-700"
            onClick={() => setShowCreatePostModal(true)}
          >
            Create
          </Button>
          <Avatar className="cursor-pointer" onClick={navigateToProfile}>
            <AvatarImage src={user?.profileImage || "/placeholder-user.jpg"} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onCreatePost={() => setShowCreatePostModal(true)}
        />

        {/* Main Content */}
        <Feed activeSection={activeSection} />

        {/* Right Sidebar - Messages */}
        <MessagesPanel />
      </div>

      {/* Create Post Modal */}
      {showCreatePostModal && <CreatePostModal onClose={() => setShowCreatePostModal(false)} />}
    </div>
  )
}

