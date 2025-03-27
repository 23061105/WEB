"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Camera } from "lucide-react"
import type { User } from "@/lib/types"

type EditProfileModalProps = {
  user: User
  onClose: () => void
}

export function EditProfileModal({ user, onClose }: EditProfileModalProps) {
  const { updateProfile } = useAuth()
  const [name, setName] = useState(user.name)
  const [username, setUsername] = useState(user.username)
  const [bio, setBio] = useState(user.bio || "")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload this to a server
    // For now, we'll just create a local URL
    setProfileImage(URL.createObjectURL(file))
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!name.trim() || !username.trim()) return

    setIsSubmitting(true)
    try {
      await updateProfile({
        name,
        username,
        bio,
        profileImage: previewUrl || user.profileImage,
      })
      onClose()
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md p-0 border-[#2a2433] bg-[#121016]">
        <DialogHeader className="p-4 border-b border-[#2a2433] flex flex-row items-center justify-between">
          <DialogTitle>Edit Profile</DialogTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-purple-600">
                <AvatarImage src={previewUrl || user.profileImage || "/placeholder-user.jpg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer">
                <Camera className="h-4 w-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#1e1a24] border-[#2a2433]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#1e1a24] border-[#2a2433]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-[#1e1a24] border-[#2a2433] resize-none min-h-[100px]"
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#2a2433] flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="border-[#2a2433]">
            Cancel
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleSubmit}
            disabled={!name.trim() || !username.trim() || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

