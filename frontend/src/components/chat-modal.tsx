"use client"

import { useState, useRef, useEffect } from "react"
import { useMessages } from "@/lib/messages-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, Send, ImageIcon, Smile, Paperclip, Check, CheckCheck } from "lucide-react"

type ChatModalProps = {
  chatId: string
  onClose: () => void
}

export function ChatModal({ chatId, onClose }: ChatModalProps) {
  const { getChatById, sendMessage, markChatAsRead } = useMessages()
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chat = getChatById(chatId)

  // Mark messages as read when opening chat
  useEffect(() => {
    if (chat?.unreadCount) {
      markChatAsRead(chatId)
    }
  }, [chatId, chat?.unreadCount, markChatAsRead])

  const handleSendMessage = () => {
    if (!message.trim()) return
    sendMessage(chatId, message)
    setMessage("")

    // Simulate typing response
    setTimeout(() => {
      setIsTyping(true)

      setTimeout(
        () => {
          setIsTyping(false)
          sendMessage(chatId, "Thanks for your message!", false)
        },
        Math.random() * 3000 + 1000,
      )
    }, 1000)
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat?.messages, isTyping])

  if (!chat) return null

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md p-0 border-[#2a2433] bg-[#121016]">
        <DialogHeader className="p-4 border-b border-[#2a2433] flex flex-row items-center">
          <div className="flex items-center gap-3 flex-1">
            <Avatar>
              <AvatarImage src={chat.user.profileImage || "/placeholder.svg?height=40&width=40"} alt={chat.user.name} />
              <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-base">{chat.user.name}</DialogTitle>
              <p className="text-xs text-neutral-400">{chat.user.isOnline ? "Online" : "Offline"}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-4 h-[50svh] overflow-y-auto flex flex-col gap-3">
          {chat.messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
              {!msg.fromMe && (
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarImage
                    src={chat.user.profileImage || "/placeholder.svg?height=32&width=32"}
                    alt={chat.user.name}
                  />
                  <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.fromMe ? "bg-purple-600 text-white rounded-tr-none" : "bg-[#1e1a24] rounded-tl-none"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <p className="text-xs opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {msg.fromMe &&
                    (msg.read ? (
                      <CheckCheck className="h-3 w-3 opacity-70" />
                    ) : (
                      <Check className="h-3 w-3 opacity-70" />
                    ))}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <Avatar className="h-8 w-8 mr-2 mt-1">
                <AvatarImage
                  src={chat.user.profileImage || "/placeholder.svg?height=32&width=32"}
                  alt={chat.user.name}
                />
                <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="bg-[#1e1a24] rounded-lg rounded-tl-none p-3">
                <div className="flex space-x-1">
                  <div
                    className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-[#2a2433] flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-neutral-400">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-neutral-400">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-neutral-400">
            <Smile className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              className="bg-[#1e1a24] border-[#2a2433] rounded-full pr-10"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 absolute right-1 top-1/2 -translate-y-1/2 text-purple-600"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

