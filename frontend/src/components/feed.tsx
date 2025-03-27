"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { usePosts } from "@/lib/posts-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon } from "lucide-react"
import { StoriesCarousel } from "@/components/stories-carousel"
import { PostCard } from "@/components/post-card"
import { ExploreContent } from "@/components/explore-content"
import { NotificationsContent } from "@/components/notifications-content"
import { BookmarksContent } from "@/components/bookmarks-content"
import { AnalyticsContent } from "@/components/analytics-content"
import { ThemeContent } from "@/components/theme-content"
import { SettingsContent } from "@/components/settings-content"

type FeedProps = {
  activeSection: string
}

export function Feed({ activeSection }: FeedProps) {
  const { user } = useAuth()
  const { posts, createPost, likePost, commentOnPost } = usePosts()
  const [postContent, setPostContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreatePost = async () => {
    if (!postContent.trim()) return

    setIsSubmitting(true)
    try {
      await createPost(postContent)
      setPostContent("")
    } catch (error) {
      console.error("Failed to create post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <>
            <StoriesCarousel />

            {/* Post Creation */}
            <div className="px-4 mb-4">
              <div className="bg-[#1e1a24] rounded-lg p-3">
                <div className="flex items-center mb-3">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={user?.profileImage || "/placeholder-user.jpg"} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Textarea
                    className="bg-transparent border-none text-sm flex-1 min-h-[40px] resize-none focus-visible:ring-0 p-0"
                    placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Photo
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 rounded-full px-6"
                    disabled={!postContent.trim() || isSubmitting}
                    onClick={handleCreatePost}
                  >
                    {isSubmitting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Feed */}
            <div className="px-4 pb-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )
      case "explore":
        return <ExploreContent />
      case "notifications":
        return <NotificationsContent />
      case "bookmarks":
        return <BookmarksContent />
      case "analytics":
        return <AnalyticsContent />
      case "theme":
        return <ThemeContent />
      case "settings":
        return <SettingsContent />
      default:
        return null
    }
  }

  return (
    <main key={activeSection} className="flex-1 overflow-auto h-[calc(100vh-60px)]">
      {renderContent()}
    </main>
  )
}

