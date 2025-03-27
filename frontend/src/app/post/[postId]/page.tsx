"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { usePosts } from "@/lib/posts-context"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { Post } from "@/lib/types"

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const { posts } = usePosts()
  const [post, setPost] = useState<Post | null>(null)
  const [isPostLoading, setIsPostLoading] = useState(true)

  const postId = params.postId as string

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (postId) {
      const foundPost = posts.find((p) => p.id === postId)
      if (foundPost) {
        setPost(foundPost)
      } else if (!isLoading) {
        // Post not found
        router.push("/")
      }
      setIsPostLoading(false)
    }
  }, [postId, isLoading, isAuthenticated, router, posts])

  if (isLoading || isPostLoading) {
    return (
      <div className="min-h-svh bg-[#121016] flex items-center justify-center">
        <div className="animate-pulse text-purple-600 text-xl">Loading post...</div>
      </div>
    )
  }

  if (!post) {
    return null // This should not render as we redirect in the useEffect
  }

  return (
    <div className="min-h-svh bg-[#121016] text-white">
      {/* Header */}
      <header className="border-b border-[#2a2433] px-4 py-3 flex items-center sticky top-0 z-10 bg-[#121016]">
        <Button variant="ghost" size="icon" className="mr-2 rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold">Post</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        <PostCard post={post} />
      </div>
    </div>
  )
}

