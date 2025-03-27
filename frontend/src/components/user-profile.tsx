"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit3 } from "lucide-react"
import { EditProfileModal } from "@/components/edit-profile-modal"
import { FollowersModal } from "@/components/followers-modal"
import type { User } from "@/lib/types"

type UserProfileProps = {
  user: User
  isOwnProfile: boolean
}

export function UserProfile({ user, isOwnProfile }: UserProfileProps) {
  const router = useRouter()
  const { followUser, unfollowUser, isFollowing } = useAuth()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const [isFollowingState, setIsFollowingState] = useState(isFollowing(user.id))

  const handleFollowToggle = () => {
    if (isFollowingState) {
      unfollowUser(user.id)
    } else {
      followUser(user.id)
    }
    setIsFollowingState(!isFollowingState)
  }

  return (
    <>
      {/* Header */}
      <header className="border-b border-[#2a2433] px-4 py-3 flex items-center sticky top-0 z-10 bg-[#121016]">
        <Button variant="ghost" size="icon" className="mr-2 rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold">{user.name}</h1>
          <p className="text-xs text-neutral-400">{user.posts?.length || 0} posts</p>
        </div>
      </header>

      {/* Profile Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <Avatar className="h-20 w-20 border-4 border-purple-600">
            <AvatarImage src={user.profileImage || "/placeholder-user.jpg"} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          {isOwnProfile ? (
            <Button
              variant="outline"
              className="rounded-full border-[#2a2433]"
              onClick={() => setShowEditProfile(true)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <Button
              className={`rounded-full ${isFollowingState ? "bg-white text-black hover:bg-neutral-200" : "bg-purple-600 hover:bg-purple-700"}`}
              onClick={handleFollowToggle}
            >
              {isFollowingState ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        <div className="mb-4">
          <h2 className="font-bold text-lg">{user.name}</h2>
          <p className="text-neutral-400">@{user.username}</p>
          {user.bio && <p className="mt-2">{user.bio}</p>}
        </div>

        <div className="flex gap-4 mb-4">
          <div>
            <span className="font-bold">{user.posts?.length || 0}</span> <span className="text-neutral-400">Posts</span>
          </div>
          <div className="cursor-pointer hover:underline" onClick={() => setShowFollowersModal(true)}>
            <span className="font-bold">{user.followers}</span> <span className="text-neutral-400">Followers</span>
          </div>
          <div className="cursor-pointer hover:underline" onClick={() => setShowFollowingModal(true)}>
            <span className="font-bold">{user.following}</span> <span className="text-neutral-400">Following</span>
          </div>
        </div>
      </div>

      {showEditProfile && <EditProfileModal user={user} onClose={() => setShowEditProfile(false)} />}

      {showFollowersModal && (
        <FollowersModal user={user} type="followers" onClose={() => setShowFollowersModal(false)} />
      )}

      {showFollowingModal && (
        <FollowersModal user={user} type="following" onClose={() => setShowFollowingModal(false)} />
      )}
    </>
  )
}

