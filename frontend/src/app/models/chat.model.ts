import { MiniUser } from './user.model';

export interface Chat {
    id: number
    name: string | null;
    admins: MiniUser[];
    members: MiniUser[];
    messages: Message[];
    isGroup: boolean;
    isBlocked: boolean;
    isMuted: boolean;
}

export interface Message {
    id: number
    chatId: number;
    sender: MiniUser;
    type: string;
    createdAt: Date;
    text?: string;
    postId?: number;
    storyId?: number;
    imgUrl?: string;
}