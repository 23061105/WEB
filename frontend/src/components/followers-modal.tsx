"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Search } from "lucide-react"
import type { User } from "@/lib/types"

type FollowersModalProps = {
  user: User
  type: "followers" | "following"
  onClose: () => void
}

export function FollowersModal({ user, type, onClose }: FollowersModalProps) {
  const router = useRouter()
  const { followUser, unfollowUser, isFollowing } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock followers/following data
  const mockUsers = [
    {
      id: "2",
      name: "Lana Rose",
      username: "lanarose",
      profileImage: "/images/avatars/lana_rose.jpg",
      bio: "Photographer | Traveler",
    },
    {
      id: "3",
      name: "Ernest Achiever",
      username: "ernest",
      profileImage: "/placeholder.svg?height=40&width=40",
      bio: "Web Developer",
    },
    {
      id: "4",
      name: "Jane Doe",
      username: "jane",
      profileImage: "/placeholder.svg?height=40&width=40",
      bio: "Digital Artist",
    },
    {
      id: "5",
      name: "Edem Quist",
      username: "edem",
      profileImage: "/placeholder.svg?height=40&width=40",
      bio: "Content Creator",
    },
    {
      id: "6",
      name: "Hajia Bintu",
      username: "hajia",
      profileImage: "/placeholder.svg?height=40&width=40",
      bio: "Influencer",
    },
  ]

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const navigateToProfile = (username: string) => {
    router.push(`/profile/${username}`)
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md p-0 border-[#2a2433] bg-[#121016]">
        <DialogHeader className="p-4 border-b border-[#2a2433] flex flex-row items-center justify-between">
          <DialogTitle>{type === "followers" ? "Followers" : "Following"}</DialogTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-4">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <Input
              className="pl-10 bg-[#1e1a24] border-[#2a2433] rounded-full"
              placeholder={`Search ${type}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-3">
            {filteredUsers.map((user) => {
              const isFollowingUser = isFollowing(user.id)

              return (
                <div key={user.id} className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigateToProfile(user.username)}
                  >
                    <Avatar>
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-neutral-400">@{user.username}</p>
                    </div>
                  </div>

                  <Button
                    variant={isFollowingUser ? "outline" : "default"}
                    size="sm"
                    className={`rounded-full ${
                      isFollowingUser
                        ? "border-[#2a2433] hover:bg-transparent hover:text-white"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                    onClick={() => (isFollowingUser ? unfollowUser(user.id) : followUser(user.id))}
                  >
                    {isFollowingUser ? "Following" : "Follow"}
                  </Button>
                </div>
              )
            })}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-neutral-400">
                <p>No {type} found</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

