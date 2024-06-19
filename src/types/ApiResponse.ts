import { Message } from "@/model/User";

export interface ApiResponse{ // standard interface for api response
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean; // signup me nahi bhejna hence optional kyuki sirf kuch hi responses me ayega
    messages?: Array<Message>; // kuch api responses aise honge jaha user ne sirf message bheje honge
}
