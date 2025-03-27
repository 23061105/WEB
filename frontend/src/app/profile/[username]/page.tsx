"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { usePosts } from "@/lib/posts-context"
import { UserProfile } from "@/components/user-profile"
import { ProfileTabs } from "@/components/profile-tabs"

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading, getUserByUsername } = useAuth()
  const { getPostsByUser } = usePosts()
  const [profileUser, setProfileUser] = useState<any>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(true)

  const username = params.username as string

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (username) {
      const fetchedUser = getUserByUsername(username)
      if (fetchedUser) {
        setProfileUser(fetchedUser)
      } else if (!isLoading) {
        // User not found
        router.push("/")
      }
      setIsProfileLoading(false)
    }
  }, [username, isLoading, isAuthenticated, router, getUserByUsername])

  if (isLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-[#121016] flex items-center justify-center">
        <div className="animate-pulse text-purple-600 text-xl">Loading profile...</div>
      </div>
    )
  }

  if (!profileUser) {
    return null // This should not render as we redirect in the useEffect
  }

  const isOwnProfile = user?.id === profileUser.id
  const userPosts = getPostsByUser(profileUser.id)

  return (
    <div className="min-h-screen bg-[#121016] text-white">
      <UserProfile user={profileUser} isOwnProfile={isOwnProfile} />
      <ProfileTabs user={profileUser} posts={userPosts} isOwnProfile={isOwnProfile} />
    </div>
  )
}

