"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

type Notification = {
  id: string
  type: "like" | "comment" | "follow" | "message" | "mention"
  user: {
    id: string
    name: string
    username: string
    profileImage?: string
  }
  content: string
  time: string
  read: boolean
  postId?: string
}

type NotificationsContextType = {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "time" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Load initial notifications
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "like",
        user: {
          id: "2",
          name: "Lana Rose",
          username: "lanarose",
          profileImage: "/images/avatars/lana_rose.jpg",
        },
        content: "liked your post",
        time: new Date(Date.now() - 1800000).toISOString(),
        read: false,
        postId: "1",
      },
      {
        id: "2",
        type: "comment",
        user: {
          id: "3",
          name: "Ernest Achiever",
          username: "ernest",
          profileImage: "/placeholder.svg?height=40&width=40",
        },
        content: 'commented on your post: "This is amazing!"',
        time: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        postId: "2",
      },
      {
        id: "3",
        type: "follow",
        user: {
          id: "4",
          name: "Jane Doe",
          username: "jane",
          profileImage: "/placeholder.svg?height=40&width=40",
        },
        content: "started following you",
        time: new Date(Date.now() - 86400000).toISOString(),
        read: true,
      },
      {
        id: "4",
        type: "message",
        user: {
          id: "5",
          name: "Edem Quist",
          username: "edem",
          profileImage: "/placeholder.svg?height=40&width=40",
        },
        content: 'sent you a message: "Hey, how are you?"',
        time: new Date(Date.now() - 172800000).toISOString(),
        read: true,
      },
    ]

    setNotifications(mockNotifications)

    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of new notification
        const types: ("like" | "comment" | "follow" | "message")[] = ["like", "comment", "follow", "message"]
        const randomType = types[Math.floor(Math.random() * types.length)]
        const randomUser = {
          id: Math.floor(Math.random() * 10 + 2).toString(),
          name: ["Lana Rose", "Ernest Achiever", "Jane Doe", "Edem Quist", "Franco Della"][
            Math.floor(Math.random() * 5)
          ],
          username: ["lanarose", "ernest", "jane", "edem", "franco"][Math.floor(Math.random() * 5)],
          profileImage: "/images/avatars/lana_rose.jpg",
        }

        let content = ""
        let postId = undefined

        switch (randomType) {
          case "like":
            content = "liked your post"
            postId = Math.floor(Math.random() * 3 + 1).toString()
            break
          case "comment":
            content =
              'commented on your post: "' +
              ["Great!", "Love this!", "Amazing work!", "Interesting..."][Math.floor(Math.random() * 4)] +
              '"'
            postId = Math.floor(Math.random() * 3 + 1).toString()
            break
          case "follow":
            content = "started following you"
            break
          case "message":
            content =
              'sent you a message: "' +
              ["Hey!", "How are you?", "Check this out", "Are you free tomorrow?"][Math.floor(Math.random() * 4)] +
              '"'
            break
        }

        addNotification({
          type: randomType,
          user: randomUser,
          content,
          postId,
        })
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const addNotification = (notification: Omit<Notification, "id" | "time" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: new Date().toISOString(),
      read: false,
    }

    // For simulated real-time notifications, ensure like and comment notifications have a postId
    if ((newNotification.type === "like" || newNotification.type === "comment") && !newNotification.postId) {
      // Assign a random post ID if one wasn't provided
      newNotification.postId = Math.floor(Math.random() * 3 + 1).toString()
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Play notification sound
    const audio = new Audio("/notification.mp3")
    audio.volume = 0.5
    audio.play().catch((e) => console.log("Audio play failed:", e))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}

