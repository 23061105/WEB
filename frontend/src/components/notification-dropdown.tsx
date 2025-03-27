"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { useNotifications } from "@/lib/notifications-context"
import { Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function NotificationDropdown() {
  const router = useRouter()
  const { notifications, markAllAsRead, markAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [hasNewNotifications, setHasNewNotifications] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    setHasNewNotifications(unreadCount > 0)
  }, [unreadCount])

  const handleOpen = (open: boolean) => {
    setIsOpen(open)
    if (open && unreadCount > 0) {
      markAllAsRead()
    }
  }

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)

    // Navigate based on notification type
    if (notification.type === "like" || notification.type === "comment") {
      // Make sure we're using the correct postId property
      if (notification.postId) {
        router.push(`/post/${notification.postId}`)
      }
    } else if (notification.type === "follow") {
      router.push(`/profile/${notification.user.username}`)
    } else if (notification.type === "message") {
      router.push("/messages")
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-5 w-5" />
          {hasNewNotifications && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500">
              <span className="animate-ping absolute inset-0 rounded-full bg-red-400/75"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-[#1e1a24] border-[#2a2433] text-white">
        <div className="flex items-center justify-between p-4 border-b border-[#2a2433]">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-purple-400 hover:text-purple-300"
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-3 focus:bg-purple-600/20 focus:text-white cursor-pointer"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3 w-full">
                  <Avatar>
                    <AvatarImage src={notification.user.profileImage} alt={notification.user.name} />
                    <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{notification.user.name}</span> {notification.content}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && <div className="h-2 w-2 rounded-full bg-purple-600 mt-2"></div>}
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-neutral-400">
              <p>No notifications yet</p>
            </div>
          )}
        </div>

        <DropdownMenuSeparator className="bg-[#2a2433]" />
        <DropdownMenuItem
          className="p-2 text-center text-purple-400 focus:bg-purple-600/20 focus:text-purple-300 cursor-pointer"
          onClick={() => router.push("/notifications")}
        >
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

