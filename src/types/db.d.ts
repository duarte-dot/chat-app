interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface Chat {
  id: string;
  messages: Message[];
}

interface GroupChat {
  id: string;
  name: string;
  members: string[];
}

interface Message {
  id: string;
  chatId: string;
  chatName: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

interface GroupMessage {
  id: string;
  senderId: string;
  id: string;
  text: string;
  timestamp: number;
}

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
}
