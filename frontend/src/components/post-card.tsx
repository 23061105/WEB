"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/lib/auth-context"
import { usePosts } from "@/lib/posts-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Heart, MessageCircle, Share2, Bookmark, Send } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Post } from "@/lib/types"

type PostCardProps = {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { likePost, commentOnPost, deletePost, savePost } = usePosts()
  const [comment, setComment] = useState("")
  const [showComments, setShowComments] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const isLiked = post.likes.some((like) => like.userId === user?.id)
  const isSaved = post.savedBy?.some((save) => save.userId === user?.id)

  const handleLike = () => {
    likePost(post.id)
  }

  const handleSave = () => {
    savePost(post.id)
  }

  const handleComment = async () => {
    if (!comment.trim()) return

    setIsSubmittingComment(true)
    try {
      await commentOnPost(post.id, comment)
      setComment("")
      setShowComments(true)
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(post.id)
    }
  }

  const navigateToProfile = () => {
    router.push(`/profile/${post.author.username}`)
  }

  return (
    <div className="bg-[#1e1a24] rounded-lg mb-4 overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={navigateToProfile}>
          <Avatar>
            <AvatarImage
              src={post.author.profileImage || "/images/avatar.jpg"}
              alt={post.author.name}
            />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{post.author.name}</h3>
            <p className="text-xs text-neutral-400">
              {post.location && `${post.location}, `}
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }).toUpperCase()}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1e1a24] border-[#2a2433] text-white">
            <DropdownMenuItem
              className="focus:bg-purple-600/20 focus:text-white cursor-pointer"
              onClick={navigateToProfile}
            >
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-purple-600/20 focus:text-white cursor-pointer">
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-purple-600/20 focus:text-white cursor-pointer">
              Report post
            </DropdownMenuItem>
            {post.author.id === user?.id && (
              <>
                <DropdownMenuSeparator className="bg-[#2a2433]" />
                <DropdownMenuItem
                  className="text-red-400 focus:bg-red-600/20 focus:text-red-400 cursor-pointer"
                  onClick={handleDeletePost}
                >
                  Delete post
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="relative aspect-[4/3] w-full">
          <Image src={post.image || "/images/post-placeholder.jpg"} alt="Post image" fill className="object-cover" />
        </div>
      )}

      {/* Post Content */}
      {post.content && (
        <div className="px-4 py-2">
          <p>{post.content}</p>
          {post.tags && post.tags.length > 0 && (
            <p className="text-purple-400 mt-1">{post.tags.map((tag) => `#${tag}`).join(" ")}</p>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 rounded-full ${isLiked ? "text-red-500" : ""}`}
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Share2 className="h-5 w-5" />
        </Button>
        <div className="flex-1"></div>
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 rounded-full ${isSaved ? "text-yellow-500" : ""}`}
          onClick={handleSave}
        >
          <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
        </Button>
      </div>

      {/* Post Likes */}
      {post.likes.length > 0 && (
        <div className="px-4 flex items-center gap-2">
          <div className="flex -space-x-2">
            {post.likes.slice(0, 3).map((like, i) => (
              <Avatar key={i} className="h-6 w-6 border-2 border-[#1e1a24]">
                <AvatarImage src={like.user.profileImage || `/images/avatar-small.jpg`} />
                <AvatarFallback>{like.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-sm">
            Liked by <span className="font-semibold">{post.likes[0].user.name}</span>
            {post.likes.length > 1 && (
              <span>
                {" "}
                and <span className="font-semibold">{post.likes.length - 1} others</span>
              </span>
            )}
          </p>
        </div>
      )}

      {/* Post Caption */}
      <div className="px-4 pt-2 pb-3">
        {post.comments.length > 0 && (
          <p className="text-xs text-neutral-400 mt-1 cursor-pointer" onClick={() => setShowComments(!showComments)}>
            View all {post.comments.length} comments
          </p>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-3 border-t border-[#2a2433] pt-3">
          {post.comments.map((comment, index) => (
            <div key={index} className="flex items-start gap-2 mb-2">
              <Avatar
                className="h-6 w-6 cursor-pointer"
                onClick={() => router.push(`/profile/${comment.user.username}`)}
              >
                <AvatarImage
                  src={comment.user.profileImage || "/images/avatar-small.jpg"}
                  alt={comment.user.name}
                />
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="bg-[#121016] rounded-lg p-2 flex-1">
                <p className="text-sm">
                  <span
                    className="font-semibold cursor-pointer hover:underline"
                    onClick={() => router.push(`/profile/${comment.user.username}`)}
                  >
                    {comment.user.name}
                  </span>{" "}
                  {comment.content}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2 mt-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user?.profileImage || "/images/avatar.jpg"} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
              <Input
                className="bg-[#121016] border-[#2a2433] rounded-full pr-10 text-sm"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleComment()
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 absolute right-1 top-1/2 -translate-y-1/2"
                onClick={handleComment}
                disabled={!comment.trim() || isSubmittingComment}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

