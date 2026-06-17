import axiosInstance from "../axiosInstance.ts";
import type { User } from "../../types/user.type.ts";
import type { Post } from "../../types/post.type.ts";
import type { Inquiry } from "../../types/inquiry.type.ts";

const fetchDashboardSummary = async (): Promise<{
    users: User[];
    posts: Post[];
    inquiries: Inquiry[];
}> => {
    const response = await axiosInstance.get("/admin/summary");
    return response.data.data;
};

export default { fetchDashboardSummary };