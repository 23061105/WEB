"use client"

import React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { PostsProvider } from "@/lib/posts-context"
import { NotificationsProvider } from "@/lib/notifications-context"
import { MessagesProvider } from "@/lib/messages-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PostsProvider>
        <NotificationsProvider>
          <MessagesProvider>
            {children}
          </MessagesProvider>
        </NotificationsProvider>
      </PostsProvider>
    </AuthProvider>
  )
} 