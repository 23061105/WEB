"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Post, Comment, Like } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"

type PostsContextType = {
  posts: Post[]
  createPost: (content: string, location?: string, tags?: string[], image?: string | null) => Promise<void>
  likePost: (postId: string) => void
  commentOnPost: (postId: string, content: string) => Promise<void>
  deletePost: (postId: string) => void
  savePost: (postId: string) => void
  getPostsByUser: (userId: string) => Post[]
  getSavedPosts: (userId: string) => Post[]
  getLikedPosts: (userId: string) => Post[]
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    // Load initial posts
    const mockPosts: Post[] = [
      {
        id: "1",
        content: "Lorem ipsum dolor sit quisquam eius. #lifestyle",
        image: "/images/post/post1.jpg",
        author: {
          id: "2",
          name: "Lana Rose",
          username: "lanarose",
          profileImage: "/images/avatars/lana_rose.jpg",
        },
        likes: [
          {
            id: "1",
            userId: "3",
            user: {
              id: "3",
              name: "Ernest Achiever",
              username: "ernest",
              profileImage: "/placeholder.svg?height=24&width=24",
            },
          },
        ],
        comments: [
          {
            id: "1",
            content: "Amazing post!",
            user: {
              id: "3",
              name: "Ernest Achiever",
              username: "ernest",
              profileImage: "/placeholder.svg?height=24&width=24",
            },
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
        savedBy: [],
        location: "Dubai",
        tags: ["lifestyle"],
        createdAt: new Date(Date.now() - 900000).toISOString(),
      },
      {
        id: "2",
        content: "Wassup folks, i just bought mah new bike!!",
        image: "/images/post/post2.jpg",
        author: {
          id: "3",
          name: "Ernest Achiever",
          username: "ernest",
          profileImage: "/placeholder.svg?height=40&width=40",
        },
        likes: [
          {
            id: "2",
            userId: "1",
            user: {
              id: "1",
              name: "Diana Ayi",
              username: "dayi",
              profileImage: "/placeholder-user.jpg",
            },
          },
        ],
        comments: [],
        savedBy: [{ userId: "1" }],
        tags: ["webdesign", "ui"],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]

    setPosts(mockPosts)
  }, [])

  const createPost = async (content: string, location?: string, tags?: string[], image?: string | null) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!user) return

        const newPost: Post = {
          id: Date.now().toString(),
          content,
          image: image || undefined,
          author: {
            id: user.id,
            name: user.name,
            username: user.username,
            profileImage: user.profileImage,
          },
          likes: [],
          comments: [],
          savedBy: [],
          location,
          tags,
          createdAt: new Date().toISOString(),
        }

        setPosts((prev) => [newPost, ...prev])
        resolve()
      }, 1000)
    })
  }

  const likePost = (postId: string) => {
    if (!user) return

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likes.some((like) => like.userId === user.id)

          if (isLiked) {
            // Unlike
            return {
              ...post,
              likes: post.likes.filter((like) => like.userId !== user.id),
            }
          } else {
            // Like
            const newLike: Like = {
              id: Date.now().toString(),
              userId: user.id,
              user: {
                id: user.id,
                name: user.name,
                username: user.username,
                profileImage: user.profileImage,
              },
            }

            return {
              ...post,
              likes: [...post.likes, newLike],
            }
          }
        }
        return post
      }),
    )
  }

  const commentOnPost = async (postId: string, content: string) => {
    if (!user) return Promise.reject("User not authenticated")

    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newComment: Comment = {
          id: Date.now().toString(),
          content,
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            profileImage: user.profileImage,
          },
          createdAt: new Date().toISOString(),
        }

        setPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [...post.comments, newComment],
              }
            }
            return post
          }),
        )

        resolve()
      }, 500)
    })
  }

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId))
  }

  const savePost = (postId: string) => {
    if (!user) return

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isSaved = post.savedBy?.some((save) => save.userId === user.id)

          if (isSaved) {
            // Unsave
            return {
              ...post,
              savedBy: post.savedBy?.filter((save) => save.userId !== user.id) || [],
            }
          } else {
            // Save
            return {
              ...post,
              savedBy: [...(post.savedBy || []), { userId: user.id }],
            }
          }
        }
        return post
      }),
    )
  }

  const getPostsByUser = (userId: string): Post[] => {
    return posts.filter((post) => post.author.id === userId)
  }

  const getSavedPosts = (userId: string): Post[] => {
    // Make sure we're correctly filtering posts that have been saved by the user
    return posts.filter((post) => post.savedBy?.some((save) => save.userId === userId))
  }

  const getLikedPosts = (userId: string): Post[] => {
    return posts.filter((post) => post.likes.some((like) => like.userId === userId))
  }

  return (
    <PostsContext.Provider
      value={{
        posts,
        createPost,
        likePost,
        commentOnPost,
        deletePost,
        savePost,
        getPostsByUser,
        getSavedPosts,
        getLikedPosts,
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider")
  }
  return context
}

