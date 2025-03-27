"use client"

import type React from "react"

import { useState } from "react"
import { usePosts } from "@/lib/posts-context"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, ImageIcon, MapPin, Tag } from "lucide-react"

type CreatePostModalProps = {
  onClose: () => void
}

export function CreatePostModal({ onClose }: CreatePostModalProps) {
  const { user } = useAuth()
  const { createPost } = usePosts()
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedImage(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      await createPost(
        content,
        location,
        tags
          .split(" ")
          .filter((tag) => tag.startsWith("#"))
          .map((tag) => tag.substring(1)),
        previewUrl,
      )
      onClose()
    } catch (error) {
      console.error("Failed to create post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md p-0 border-gray-800 bg-[#121016]">
        <DialogHeader className="p-4 border-b border-gray-800 flex flex-row items-center justify-between">
          <DialogTitle>Create Post</DialogTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src={user?.profileImage || "/placeholder-user.jpg"} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user?.name}</p>
              {location && <p className="text-xs text-gray-400">{location}</p>}
            </div>
          </div>

          <Textarea
            placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`}
            className="bg-transparent border-none text-base resize-none focus-visible:ring-0 p-0 min-h-[100px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {previewUrl && (
            <div className="relative mt-3 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-auto max-h-[300px] object-contain bg-black"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 bg-black/50 rounded-full"
                onClick={() => {
                  setSelectedImage(null)
                  setPreviewUrl(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2 mt-4 border-t border-gray-800 pt-4">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <Button variant="ghost" size="sm" className="text-gray-400" type="button">
                <ImageIcon className="h-5 w-5 mr-2" />
                Photo
              </Button>
            </label>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400"
              onClick={() => {
                const loc = prompt("Enter your location:")
                if (loc) setLocation(loc)
              }}
            >
              <MapPin className="h-5 w-5 mr-2" />
              Location
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400"
              onClick={() => {
                const tagInput = prompt("Enter tags (with # symbol):")
                if (tagInput) setTags(tagInput)
              }}
            >
              <Tag className="h-5 w-5 mr-2" />
              Tags
            </Button>
          </div>

          {tags && (
            <div className="mt-3">
              <p className="text-purple-400 text-sm">{tags}</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

