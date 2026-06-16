import type { User } from "./user.type.ts";

interface DashboardUser {
    id: number;
    createdAt: string;
    username: string;
    nickname: string;
    email: string;
    deletedAt: string | null;
}

interface DashboardPost {
    id: number;
    createdAt: string;
    title: string;
    views: number;
    categoryId: number;
    user: Pick<User, "id"| "nickname" | "email">;
}

interface DashboardInquiry {
    id: number;
    createdAt: string;
    title: string;
    answer: string | null;
    user: Pick<User, "id" | "nickname" | "email">;
}

export interface DashboardSummary {
    users: DashboardUser[];
    posts: DashboardPost[];
    inquiries: DashboardInquiry[];
}