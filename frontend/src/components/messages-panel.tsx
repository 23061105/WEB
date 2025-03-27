"use client"

import { useState, useEffect } from "react"
import { useMessages } from "@/lib/messages-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageSquare } from "lucide-react"
import { ChatModal } from "@/components/chat-modal"
import { useNotifications } from "@/lib/notifications-context"

export function MessagesPanel() {
  const { messages, friendRequests, acceptFriendRequest, declineFriendRequest } = useMessages()
  const { addNotification } = useNotifications()
  const [activeTab, setActiveTab] = useState("primary")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [typingIndicators, setTypingIndicators] = useState<Record<string, boolean>>({})

  // Simulate typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const randomChatId = messages[Math.floor(Math.random() * messages.length)]?.id

      if (randomChatId && Math.random() > 0.7) {
        setTypingIndicators((prev) => ({
          ...prev,
          [randomChatId]: true,
        }))

        // Stop typing after a few seconds
        setTimeout(
          () => {
            setTypingIndicators((prev) => ({
              ...prev,
              [randomChatId]: false,
            }))
          },
          Math.random() * 5000 + 2000,
        )
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [messages])

  // Simulate new messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length)
      if (randomIndex >= 0 && messages[randomIndex] && Math.random() > 0.8) {
        const chat = messages[randomIndex]

        // Don't send notification if chat is open
        if (selectedChat !== chat.id) {
          addNotification({
            type: "message",
            user: chat.user,
            content: `sent you a message: "${["Hey!", "How are you?", "Check this out", "Are you free tomorrow?"][Math.floor(Math.random() * 4)]}"`,
          })
        }
      }
    }, 45000)

    return () => clearInterval(interval)
  }, [messages, selectedChat, addNotification])

  return (
    <aside className="w-80 border-l border-[#2a2433] h-[calc(100svh-60px)] flex flex-col sticky top-[60px]">
      <div className="p-4 border-b border-[#2a2433] flex items-center justify-between">
        <h2 className="font-semibold">Messages</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <Input className="pl-10 bg-[#1e1a24] border-0 rounded-full text-sm" placeholder="Search messages" />
        </div>

        <Tabs defaultValue="primary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-transparent">
            <TabsTrigger
              value="primary"
              className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none rounded-none"
            >
              Primary
            </TabsTrigger>
            <TabsTrigger
              value="general"
              className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none rounded-none"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none rounded-none"
            >
              Requests({friendRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="primary" className="mt-4 space-y-3">
            {messages.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-[#1e1a24] p-2 rounded-lg transition-colors"
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage
                      src={chat.user.profileImage || `/placeholder.svg?height=40&width=40`}
                      alt={chat.user.name}
                    />
                    <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {chat.user.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#1e1a24]"></span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{chat.user.name}</h4>
                  {typingIndicators[chat.id] ? (
                    <p className="text-xs text-purple-500 font-medium">
                      typing<span className="animate-pulse">...</span>
                    </p>
                  ) : (
                    <p className={`text-xs ${chat.unreadCount ? "text-purple-500 font-medium" : "text-neutral-400"}`}>
                      {chat.lastMessage}
                      {chat.unreadCount > 0 && ` (${chat.unreadCount} new)`}
                    </p>
                  )}
                </div>
                {chat.unreadCount > 0 && (
                  <span className="bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="requests" className="mt-4">
            <h3 className="text-sm font-medium mb-3">Requests</h3>

            {friendRequests.map((request) => (
              <div key={request.id} className="bg-[#1e1a24] rounded-lg p-3 mb-3">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar>
                    <AvatarImage
                      src={request.user.profileImage || `/placeholder.svg?height=40&width=40`}
                      alt={request.user.name}
                    />
                    <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-sm">{request.user.name}</h4>
                    <p className="text-xs text-neutral-400">{request.mutualFriends} mutual friends</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-full text-sm py-1"
                    onClick={() => acceptFriendRequest(request.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    className="flex-1 bg-white text-black hover:bg-neutral-200 rounded-full text-sm py-1"
                    onClick={() => declineFriendRequest(request.id)}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {selectedChat && <ChatModal chatId={selectedChat} onClose={() => setSelectedChat(null)} />}
    </aside>
  )
}

