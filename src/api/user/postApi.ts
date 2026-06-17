import axiosInstance from "../axiosInstance.ts";
import type { PaginationResponseType } from "../../types/common.type.ts";
import type { Post } from "../../types/post.type.ts";
import type { CreatePostInputType } from "../../schemas/post/createPostSchema.ts";

const fetchPostListByCategory = async (categoryId: number, page: number, size: number): Promise<PaginationResponseType<Post>> => {
    const response = await axiosInstance.get(`/post/list/${categoryId}?page=${page}&size=${size}`);
    return response.data.data;
};

const fetchPostById = async (id: number): Promise<Post> => {
    const response = await axiosInstance.get(`/post/${id}`);
    return response.data.data;
}

const createPost = async  (data: CreatePostInputType): Promise<Post> => {
    const result = await axiosInstance.post("/post/create", data);
    return result.data.data;
};

const createVote = async (postId: number, option: number): Promise<void> => {
    await axiosInstance.post(`/post/${postId}/vote`, {
        option,
    })
};

const cancelVotePost = async (postId: number): Promise<void> => {
    await axiosInstance.delete(`/post/${postId}/vote`);
};

export default { fetchPostListByCategory, createPost, fetchPostById, createVote, cancelVotePost };