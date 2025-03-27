"use client"

import { useAuth } from "@/lib/auth-context"
import { usePosts } from "@/lib/posts-context"
import { PostCard } from "@/components/post-card"

export function BookmarksContent() {
  const { user } = useAuth()
  const { getSavedPosts } = usePosts()

  // Get saved posts for the current user
  const savedPosts = user ? getSavedPosts(user.id) : []

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bookmarks</h2>

      {savedPosts.length > 0 ? (
        <div className="space-y-4">
          {savedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-[#1e1a24] rounded-lg p-8 text-center">
          <p className="text-neutral-400 mb-2">You haven't saved any posts yet</p>
          <p className="text-sm text-neutral-500">When you save posts, they'll appear here</p>
        </div>
      )}
    </div>
  )
}

