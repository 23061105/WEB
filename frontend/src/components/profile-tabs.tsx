"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid, Bookmark, Heart } from "lucide-react"
import { PostCard } from "@/components/post-card"
import type { User, Post } from "@/lib/types"
import { usePosts } from "@/lib/posts-context"

type ProfileTabsProps = {
  user: User
  posts: Post[]
  isOwnProfile: boolean
}

export function ProfileTabs({ user, posts, isOwnProfile }: ProfileTabsProps) {
  const { getSavedPosts, getLikedPosts } = usePosts()
  const savedPosts = getSavedPosts(user.id)
  const likedPosts = getLikedPosts(user.id)

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full grid grid-cols-3 bg-transparent border-b border-[#2a2433] rounded-none h-auto">
        <TabsTrigger
          value="posts"
          className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none rounded-none py-3"
        >
          <Grid className="h-5 w-5 mr-2" />
          Posts
        </TabsTrigger>

        {isOwnProfile && (
          <TabsTrigger
            value="saved"
            className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none rounded-none py-3"
          >
            <Bookmark className="h-5 w-5 mr-2" />
            Saved
          </TabsTrigger>
        )}

        <TabsTrigger
          value="liked"
          className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none rounded-none py-3"
        >
          <Heart className="h-5 w-5 mr-2" />
          Liked
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-0">
        {posts.length > 0 ? (
          <div className="p-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-neutral-400">No posts yet</p>
            {isOwnProfile && <p className="text-sm text-neutral-500 mt-2">Share your first post with your followers</p>}
          </div>
        )}
      </TabsContent>

      {isOwnProfile && (
        <TabsContent value="saved" className="mt-0">
          {savedPosts.length > 0 ? (
            <div className="p-4">
              {savedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-neutral-400">No saved posts</p>
              <p className="text-sm text-neutral-500 mt-2">Save posts to view them later</p>
            </div>
          )}
        </TabsContent>
      )}

      <TabsContent value="liked" className="mt-0">
        {likedPosts.length > 0 ? (
          <div className="p-4">
            {likedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-neutral-400">No liked posts</p>
            <p className="text-sm text-neutral-500 mt-2">Posts you like will appear here</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

