export type User = {
  id: string
  name: string
  username: string
  email: string
  profileImage?: string
  bio?: string
  followers: number
  following: number
  createdAt: string
  posts?: Post[]
}

export type Post = {
  id: string
  content: string
  image?: string
  author: {
    id: string
    name: string
    username: string
    profileImage?: string
  }
  likes: Like[]
  comments: Comment[]
  savedBy?: { userId: string }[]
  location?: string
  tags?: string[]
  createdAt: string
}

export type Like = {
  id: string
  userId: string
  user: {
    id: string
    name: string
    username: string
    profileImage?: string
  }
}

export type Comment = {
  id: string
  content: string
  user: {
    id: string
    name: string
    username: string
    profileImage?: string
  }
  createdAt: string
}

export type Message = {
  id: string
  content: string
  fromMe: boolean
  timestamp: string
  read: boolean
}

export type Chat = {
  id: string
  user: {
    id: string
    name: string
    username: string
    profileImage?: string
    isOnline?: boolean
  }
  lastMessage: string
  unreadCount: number
  messages: Message[]
}

export type FriendRequest = {
  id: string
  user: {
    id: string
    name: string
    username: string
    profileImage?: string
  }
  mutualFriends: number
}

