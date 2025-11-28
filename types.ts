export interface User {
  id: string;
  name: string;
  avatar: string;
  wxid?: string;
  region?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string; // 'me' or contactId
  timestamp: number;
  type: 'text' | 'image' | 'system';
}

export interface ChatSession {
  id: string;
  contactId: string;
  unreadCount: number;
  lastMessage: Message | null;
  draft?: string;
}

export interface Contact extends User {
  isAi?: boolean; // If true, connects to Gemini
  initial?: string; // For grouping (A, B, C...)
}

export interface Moment {
  id: string;
  userId: string; // 'me' or contactId
  content: string;
  images?: string[];
  isLink?: boolean; // New: is this a shared link?
  linkTitle?: string; // New: title of the shared link
  linkIcon?: string; // New: icon for the link
  timestamp: number;
  likes: string[]; // names of likers
  comments: { user: string; text: string }[];
}