import type { User } from "./user.type.ts";

export interface Post {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    content: string;
    views: number;
    userId: number;
    categoryId: number;
    option1Text: string | null;
    option2Text: string | null;
    // Generic Type 중 Pick이라는 타입이 존재
    // Pick<해당 타입,가져올 항목들>
    user: Pick<User, "id" | "nickname" | "email">
    vote: {
        option1Count: number;
        option2Count: number;
        totalCount: number;
        hasVoted: boolean;
    } | null;
}