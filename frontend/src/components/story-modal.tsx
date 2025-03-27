"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

type StoryModalProps = {
  storyId: number
  onClose: () => void
}

export function StoryModal({ storyId, onClose }: StoryModalProps) {
  const [progress, setProgress] = useState(0)

  // Mock story data
  const story = {
    id: storyId,
    user: {
      name: ["James", "Winnie", "Daniel", "Jane", "Tina"][storyId - 1],
      username: ["james", "winnie", "daniel", "jane", "tina"][storyId - 1],
      profileImage: `/images/avatars/${["james", "winnie", "daniel", "jane", "tina"][storyId - 1]}.jpg`,
    },
    image: `/images/stories/story${storyId}.jpg`,
    createdAt: new Date().toISOString(),
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            onClose()
          }, 500)
          return 100
        }
        return prev + 1
      })
    }, 50)

    return () => clearInterval(timer)
  }, [onClose])

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md p-0 border-none bg-transparent">
        <div className="relative h-[80vh] w-full max-w-md mx-auto overflow-hidden rounded-xl bg-black">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700 z-10">
            <div className="h-full bg-white" style={{ width: `${progress}%` }} />
          </div>

          {/* Story header */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-purple-600">
                <AvatarImage src={story.user.profileImage} alt={story.user.name} />
                <AvatarFallback>{story.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-white">{story.user.name}</p>
                <p className="text-xs text-gray-300">Just now</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-black/20 rounded-full"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Story content */}
          <div className="h-full w-full">
            <Image src={story.image || "/placeholder.svg"} alt="Story" fill className="object-cover" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

