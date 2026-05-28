import axiosInstance from "../axiosInstance.ts";
import type { PaginationResponseType } from "../../types/common.type.ts";
import type { Post } from "../../types/post.type.ts";
import type { CreatePostInputType } from "../../schemas/post/createPostSchema.ts";

const fetchPostListByCategory = async (id: number, size: number, page: number ): Promise<PaginationResponseType<Post>> => {
    const response = await axiosInstance.get(`/post/list/${id}?size=${size}&page=${page}`);
    return response.data.data;
};

const createPost = async (input: CreatePostInputType,): Promise<Post> => {
    const response = await axiosInstance.post("/post/create/", input);
    return response.data.data;
};

export default {fetchPostListByCategory, createPost};