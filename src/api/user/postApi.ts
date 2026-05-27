import axiosInstance from "../axiosInstance.ts";
import type { PaginationResponseType } from "../../types/common.type.ts";
import type { Post } from "../../types/post.type.ts";

const fetchPostListByCategory = async (id: number): Promise<PaginationResponseType<Post>> => {
    const response = await axiosInstance.get(`/post/list/${id}`);
    return response.data.data;
};

export default {fetchPostListByCategory};