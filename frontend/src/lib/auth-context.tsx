"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/lib/types"

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, username: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  getUserByUsername: (username: string) => User | null
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
  isFollowing: (userId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [following, setFollowing] = useState<string[]>([])

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("nokoUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Load following list
    const storedFollowing = localStorage.getItem("nokoFollowing")
    if (storedFollowing) {
      setFollowing(JSON.parse(storedFollowing))
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (email === "user@example.com" && password === "password") {
          const user: User = {
            id: "1",
            name: "Diana Ayi",
            username: "dayi",
            email: "user@example.com",
            profileImage: "/placeholder-user.jpg",
            bio: "Digital creator",
            followers: 1250,
            following: 350,
            createdAt: new Date().toISOString(),
          }

          setUser(user)
          localStorage.setItem("nokoUser", JSON.stringify(user))
          resolve()
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 1000)
    })
  }

  const register = async (name: string, username: string, email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const user: User = {
          id: "1",
          name,
          username,
          email,
          profileImage: "/placeholder-user.jpg",
          bio: "",
          followers: 0,
          following: 0,
          createdAt: new Date().toISOString(),
        }

        setUser(user)
        localStorage.setItem("nokoUser", JSON.stringify(user))
        resolve()
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("nokoUser")
  }

  const updateProfile = async (data: Partial<User>) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!user) return

        const updatedUser = {
          ...user,
          ...data,
        }

        setUser(updatedUser)
        localStorage.setItem("nokoUser", JSON.stringify(updatedUser))
        resolve()
      }, 1000)
    })
  }

  const getUserByUsername = (username: string): User | null => {
    // In a real app, this would be an API call
    // For now, we'll just return mock data

    if (user?.username === username) {
      return user
    }

    // Mock users
    const mockUsers: User[] = [
      {
        id: "2",
        name: "Lana Rose",
        username: "lanarose",
        email: "lana@example.com",
        profileImage: "/images/avatars/lana_rose.jpg",
        bio: "Photographer | Traveler",
        followers: 5432,
        following: 235,
        createdAt: new Date(Date.now() - 7776000000).toISOString(), // 90 days ago
      },
      {
        id: "3",
        name: "Ernest Achiever",
        username: "ernest",
        email: "ernest@example.com",
        profileImage: "/placeholder.svg?height=40&width=40",
        bio: "Web Developer",
        followers: 1024,
        following: 512,
        createdAt: new Date(Date.now() - 15552000000).toISOString(), // 180 days ago
      },
    ]

    return mockUsers.find((u) => u.username === username) || null
  }

  const followUser = (userId: string) => {
    if (!user) return

    // Update following list
    const newFollowing = [...following, userId]
    setFollowing(newFollowing)
    localStorage.setItem("nokoFollowing", JSON.stringify(newFollowing))

    // Update user following count
    const updatedUser = {
      ...user,
      following: user.following + 1,
    }
    setUser(updatedUser)
    localStorage.setItem("nokoUser", JSON.stringify(updatedUser))
  }

  const unfollowUser = (userId: string) => {
    if (!user) return

    // Update following list
    const newFollowing = following.filter((id) => id !== userId)
    setFollowing(newFollowing)
    localStorage.setItem("nokoFollowing", JSON.stringify(newFollowing))

    // Update user following count
    const updatedUser = {
      ...user,
      following: Math.max(0, user.following - 1),
    }
    setUser(updatedUser)
    localStorage.setItem("nokoUser", JSON.stringify(updatedUser))
  }

  const isFollowing = (userId: string): boolean => {
    return following.includes(userId)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        getUserByUsername,
        followUser,
        unfollowUser,
        isFollowing,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

