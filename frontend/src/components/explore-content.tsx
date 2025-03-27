"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function ExploreContent() {
  const [searchQuery, setSearchQuery] = useState("")

  const explorePosts = [
    { id: 1, image: "/images/explore/post1.jpg", likes: 423 },
    { id: 2, image: "/images/explore/post2.jpg", likes: 512 },
    { id: 3, image: "/images/explore/post3.jpg", likes: 189 },
    { id: 4, image: "/images/explore/post4.jpg", likes: 876 },
    { id: 5, image: "/images/explore/post5.jpg", likes: 345 },
    { id: 6, image: "/images/explore/post6.jpg", likes: 654 },
    { id: 7, image: "/images/explore/post7.jpg", likes: 234 },
    { id: 8, image: "/images/explore/post8.jpg", likes: 765 },
    { id: 9, image: "/images/explore/post9.jpg", likes: 321 },
  ]

  return (
    <div className="p-4">
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          className="pl-10 bg-[#1e1a24] border-none rounded-full text-sm"
          placeholder="Search for posts, people, or tags"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="foryou">
        <TabsList className="bg-[#1e1a24] p-1 rounded-full mb-6">
          <TabsTrigger value="foryou" className="rounded-full">
            For You
          </TabsTrigger>
          <TabsTrigger value="trending" className="rounded-full">
            Trending
          </TabsTrigger>
          <TabsTrigger value="latest" className="rounded-full">
            Latest
          </TabsTrigger>
        </TabsList>

        <TabsContent value="foryou" className="mt-0">
          <div className="grid grid-cols-3 gap-1">
            {explorePosts.map((post) => (
              <div key={post.id} className="relative aspect-square overflow-hidden">
                <Image
                  src={post.image || "/images/post-placeholder.jpg"}
                  alt="Explore post"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-0">
          <div className="grid grid-cols-3 gap-1">
            {explorePosts
              .sort((a, b) => b.likes - a.likes)
              .map((post) => (
                <div key={post.id} className="relative aspect-square overflow-hidden">
                  <Image
                    src={post.image || "/images/post-placeholder.jpg"}
                    alt="Explore post"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="latest" className="mt-0">
          <div className="grid grid-cols-3 gap-1">
            {explorePosts.reverse().map((post) => (
              <div key={post.id} className="relative aspect-square overflow-hidden">
                <Image
                  src={post.image || "/images/post-placeholder.jpg"}
                  alt="Explore post"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

