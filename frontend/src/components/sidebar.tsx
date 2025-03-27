"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Home, Compass, Bell, MessageSquare, Bookmark, BarChart2, Palette, Settings, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type SidebarProps = {
  activeSection: string
  setActiveSection: (section: any) => void
  onCreatePost: () => void
}

export function Sidebar({ activeSection, setActiveSection, onCreatePost }: SidebarProps) {
  const router = useRouter()
  const { user, logout } = useAuth()

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "theme", label: "Theme", icon: Palette },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const navigateToProfile = () => {
    router.push(`/profile/${user?.username}`)
  }

  return (
    <aside className="w-64 border-r border-[#2a2433] h-[calc(100svh-60px)] flex flex-col sticky top-[60px]">
      <div className="p-4 flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-10 w-10 cursor-pointer">
              <AvatarImage src={user?.profileImage || "/placeholder-user.jpg"} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-[#1e1a24] border-[#2a2433] text-white">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImage || "/placeholder-user.jpg"} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user?.name}</span>
                <span className="text-xs text-neutral-400">@{user?.username}</span>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-[#2a2433]" />
            <DropdownMenuItem
              className="text-sm focus:bg-purple-600/20 focus:text-white cursor-pointer"
              onClick={navigateToProfile}
            >
              <User className="h-4 w-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm focus:bg-purple-600/20 focus:text-white cursor-pointer">
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2a2433]" />
            <DropdownMenuItem
              className="text-sm focus:bg-purple-600/20 focus:text-white cursor-pointer text-red-400"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="cursor-pointer" onClick={navigateToProfile}>
          <h3 className="font-semibold">{user?.name}</h3>
          <p className="text-sm text-neutral-400">@{user?.username}</p>
        </div>
      </div>

      <nav className="flex-1">
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <li
                key={item.id}
                className={`${isActive ? "border-l-4 border-purple-600 bg-[#1e1a24]" : "border-l-4 border-transparent"}`}
              >
                <button
                  onClick={() => {
                    setActiveSection(item.id)
                    if (item.id === "home") {
                      router.push("/")
                    }
                  }}
                  className="flex items-center gap-3 py-3 px-4 w-full text-left"
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-purple-600" : "text-neutral-400"}`} />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 rounded-full" onClick={onCreatePost}>
          Create Post
        </Button>
      </div>
    </aside>
  )
}

