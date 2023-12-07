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
  groupId: string;
  groupName: string;
  members: string[];
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

interface GroupMessage {
  id: string;
  senderId: string;
  groupId: string;
  text: string;
  timestamp: number;
}

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
}
