"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Chat, FriendRequest, Message } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"

type MessagesContextType = {
  messages: Chat[]
  friendRequests: FriendRequest[]
  getChatById: (chatId: string) => Chat | undefined
  sendMessage: (chatId: string, content: string, fromMe?: boolean) => void
  markChatAsRead: (chatId: string) => void
  acceptFriendRequest: (requestId: string) => void
  declineFriendRequest: (requestId: string) => void
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined)

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Chat[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])

  useEffect(() => {
    // Load initial messages and friend requests
    const mockMessages: Chat[] = [
      {
        id: "1",
        user: {
          id: "2",
          name: "Edem Quist",
          username: "edem",
          profileImage: "/placeholder.svg?height=40&width=40",
          isOnline: false,
        },
        lastMessage: "Just woke up bruh",
        unreadCount: 0,
        messages: [
          {
            id: "1",
            content: "Hey, how are you?",
            fromMe: false,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: true,
          },
          {
            id: "2",
            content: "I'm good, thanks! How about you?",
            fromMe: true,
            timestamp: new Date(Date.now() - 3500000).toISOString(),
            read: true,
          },
          {
            id: "3",
            content: "Just woke up bruh",
            fromMe: false,
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            read: true,
          },
        ],
      },
      {
        id: "2",
        user: {
          id: "3",
          name: "Franco Della",
          username: "franco",
          profileImage: "/placeholder.svg?height=40&width=40",
          isOnline: true,
        },
        lastMessage: "Received bruh. Thanks!",
        unreadCount: 0,
        messages: [
          {
            id: "1",
            content: "Did you get the files I sent?",
            fromMe: true,
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: true,
          },
          {
            id: "2",
            content: "Received bruh. Thanks!",
            fromMe: false,
            timestamp: new Date(Date.now() - 7000000).toISOString(),
            read: true,
          },
        ],
      },
      {
        id: "3",
        user: {
          id: "4",
          name: "Jane Doe",
          username: "jane",
          profileImage: "/placeholder.svg?height=40&width=40",
          isOnline: false,
        },
        lastMessage: "ok",
        unreadCount: 0,
        messages: [
          {
            id: "1",
            content: "Are we still meeting tomorrow?",
            fromMe: true,
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            read: true,
          },
          {
            id: "2",
            content: "ok",
            fromMe: false,
            timestamp: new Date(Date.now() - 85000000).toISOString(),
            read: true,
          },
        ],
      },
      {
        id: "4",
        user: {
          id: "5",
          name: "Daniella Jackson",
          username: "daniella",
          profileImage: "/placeholder.svg?height=40&width=40",
          isOnline: false,
        },
        lastMessage: "Check out this new design I made!",
        unreadCount: 2,
        messages: [
          {
            id: "1",
            content: "Hey, I wanted to show you something",
            fromMe: false,
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            read: false,
          },
          {
            id: "2",
            content: "Check out this new design I made!",
            fromMe: false,
            timestamp: new Date(Date.now() - 10700000).toISOString(),
            read: false,
          },
        ],
      },
    ]

    const mockFriendRequests: FriendRequest[] = [
      {
        id: "1",
        user: {
          id: "6",
          name: "Hajia Bintu",
          username: "hajia",
          profileImage: "/placeholder.svg?height=40&width=40",
        },
        mutualFriends: 8,
      },
      {
        id: "2",
        user: {
          id: "7",
          name: "Jackline Mensah",
          username: "jackline",
          profileImage: "/placeholder.svg?height=40&width=40",
        },
        mutualFriends: 2,
      },
    ]

    setMessages(mockMessages)
    setFriendRequests(mockFriendRequests)
  }, [])

  const getChatById = (chatId: string) => {
    return messages.find((chat) => chat.id === chatId)
  }

  const sendMessage = (chatId: string, content: string, fromMe = true) => {
    if (!user && fromMe) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      fromMe,
      timestamp: new Date().toISOString(),
      read: !fromMe, // Messages from others are automatically read in the current chat
    }

    setMessages((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            lastMessage: content,
            messages: [...chat.messages, newMessage],
            unreadCount: fromMe ? chat.unreadCount : chat.unreadCount + 1,
          }
        }
        return chat
      }),
    )
  }

  const markChatAsRead = (chatId: string) => {
    setMessages((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            unreadCount: 0,
            messages: chat.messages.map((msg) => ({
              ...msg,
              read: true,
            })),
          }
        }
        return chat
      }),
    )
  }

  const acceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find((req) => req.id === requestId)
    if (!request) return

    // Remove from requests
    setFriendRequests((prev) => prev.filter((req) => req.id !== requestId))

    // Create a new chat
    const newChat: Chat = {
      id: Date.now().toString(),
      user: {
        ...request.user,
        isOnline: Math.random() > 0.5,
      },
      lastMessage: "You are now connected",
      unreadCount: 0,
      messages: [
        {
          id: "1",
          content: "You are now connected",
          fromMe: false,
          timestamp: new Date().toISOString(),
          read: true,
        },
      ],
    }

    setMessages((prev) => [...prev, newChat])
  }

  const declineFriendRequest = (requestId: string) => {
    setFriendRequests((prev) => prev.filter((req) => req.id !== requestId))
  }

  return (
    <MessagesContext.Provider
      value={{
        messages,
        friendRequests,
        getChatById,
        sendMessage,
        markChatAsRead,
        acceptFriendRequest,
        declineFriendRequest,
      }}
    >
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessagesContext)
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider")
  }
  return context
}

