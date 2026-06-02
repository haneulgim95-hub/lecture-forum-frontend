import axiosInstance from "../axiosInstance.ts";
import type { Reply } from "../../types/reply.type.ts";

const createReply = async (postId: number, content: string): Promise<Reply> => {
    const response = await axiosInstance.post("/reply/create", { postId, content });
    return response.data.data;
};

export default { createReply };
