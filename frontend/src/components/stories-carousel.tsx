"use client"

import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Plus } from "lucide-react"
import { StoryModal } from "@/components/story-modal"

export function StoriesCarousel() {
  const { user } = useAuth()
  const [selectedStory, setSelectedStory] = useState<number | null>(null)

  const stories = [
    { id: 1, user: { name: "James", username: "james", profileImage: "/images/avatars/james.jpg" } },
    { id: 2, user: { name: "Winnie", username: "winnie", profileImage: "/images/avatars/winnie.jpg" } },
    { id: 3, user: { name: "Daniel", username: "daniel", profileImage: "/images/avatars/daniel.jpg" } },
    { id: 4, user: { name: "Jane", username: "jane", profileImage: "/images/avatars/jane.jpg" } },
    { id: 5, user: { name: "Tina", username: "tina", profileImage: "/images/avatars/tina.jpg" } },
  ]

  return (
    <div className="p-4">
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex flex-col items-center min-w-[100px]">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-600 p-0.5 cursor-pointer">
            <div className="bg-purple-600 absolute inset-0 rounded-full flex items-center justify-center">
              <Plus className="h-6 w-6 text-white" />
            </div>
          </div>
          <span className="text-xs mt-1">Your Story</span>
        </div>

        {stories.map((story, index) => (
          <div key={story.id} className="flex flex-col items-center min-w-[100px]">
            <div
              className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-600 p-0.5 cursor-pointer"
              onClick={() => setSelectedStory(story.id)}
            >
              <Image
                src={story.user.profileImage || "/images/avatar-default.jpg"}
                alt={story.user.name}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            </div>
            <span className="text-xs mt-1">{story.user.name}</span>
          </div>
        ))}
      </div>

      {selectedStory && <StoryModal storyId={selectedStory} onClose={() => setSelectedStory(null)} />}
    </div>
  )
}

