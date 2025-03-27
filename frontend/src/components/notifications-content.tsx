"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"

export function NotificationsContent() {
  const notifications = [
    {
      id: 1,
      type: "like",
      user: { name: "Ernest Achiever", username: "ernest", profileImage: "/placeholder.svg?height=40&width=40" },
      content: "liked your post",
      time: new Date(Date.now() - 1800000).toISOString(),
      read: false,
    },
    {
      id: 2,
      type: "comment",
      user: { name: "Lana Rose", username: "lanarose", profileImage: "/images/avatars/lana_rose.jpg" },
      content: 'commented on your post: "This is amazing!"',
      time: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: 3,
      type: "follow",
      user: { name: "Jane Doe", username: "jane", profileImage: "/placeholder.svg?height=40&width=40" },
      content: "started following you",
      time: new Date(Date.now() - 86400000).toISOString(),
      read: true,
    },
    {
      id: 4,
      type: "mention",
      user: { name: "Edem Quist", username: "edem", profileImage: "/placeholder.svg?height=40&width=40" },
      content: 'mentioned you in a comment: "@dayi check this out!"',
      time: new Date(Date.now() - 172800000).toISOString(),
      read: true,
    },
  ]

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>

      <Tabs defaultValue="all">
        <TabsList className="bg-[#1e1a24] p-1 rounded-full mb-6">
          <TabsTrigger value="all" className="rounded-full">
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="rounded-full">
            Unread
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0 space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-3 rounded-lg ${notification.read ? "bg-transparent" : "bg-[#1e1a24]"}`}
            >
              <Avatar>
                <AvatarImage src={notification.user.profileImage} alt={notification.user.name} />
                <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{notification.user.name}</span> {notification.content}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
                </p>
              </div>
              {!notification.read && <div className="h-2 w-2 rounded-full bg-purple-600 mt-2"></div>}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="unread" className="mt-0 space-y-3">
          {notifications
            .filter((n) => !n.read)
            .map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#1e1a24]">
                <Avatar>
                  <AvatarImage src={notification.user.profileImage} alt={notification.user.name} />
                  <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{notification.user.name}</span> {notification.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-purple-600 mt-2"></div>
              </div>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

